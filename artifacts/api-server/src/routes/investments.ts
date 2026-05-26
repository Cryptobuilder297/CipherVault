import { Router } from "express";
import { db, userInvestmentsTable, investmentPlansTable, usersTable } from "@workspace/db";
import { eq, desc, and, lte } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

function fmt(inv: typeof userInvestmentsTable.$inferSelect, planName?: string) {
  return {
    ...inv,
    planName: planName ?? "",
    amount: parseFloat(inv.amount),
    expectedReturn: parseFloat(inv.expectedReturn),
    startDate: inv.startDate.toISOString(),
    maturityDate: inv.maturityDate.toISOString(),
    completedAt: inv.completedAt?.toISOString() ?? null,
  };
}

// Auto-mature investments that have passed their maturity date
async function processMaturities(userId: number) {
  const now = new Date();
  const matured = await db
    .select()
    .from(userInvestmentsTable)
    .where(
      and(
        eq(userInvestmentsTable.userId, userId),
        eq(userInvestmentsTable.status, "active"),
        lte(userInvestmentsTable.maturityDate, now),
      ),
    );

  for (const inv of matured) {
    // Credit expected return to user's balance
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (user) {
      const newBalance = parseFloat(user.balance) + parseFloat(inv.expectedReturn);
      await db.update(usersTable).set({ balance: String(newBalance) }).where(eq(usersTable.id, userId));
    }
    // Mark as completed
    await db.update(userInvestmentsTable)
      .set({ status: "completed", completedAt: now })
      .where(eq(userInvestmentsTable.id, inv.id));
  }
}

router.get("/investments", requireAuth, async (req, res) => {
  const user = req.localUser;
  if (!user) { res.status(404).json({ error: "User not provisioned" }); return; }

  // Auto-process any matured investments first
  await processMaturities(user.id);

  const rows = await db
    .select({ inv: userInvestmentsTable, plan: investmentPlansTable })
    .from(userInvestmentsTable)
    .leftJoin(investmentPlansTable, eq(userInvestmentsTable.planId, investmentPlansTable.id))
    .where(eq(userInvestmentsTable.userId, user.id))
    .orderBy(desc(userInvestmentsTable.startDate));

  res.json(rows.map(r => fmt(r.inv, r.plan?.name)));
});

router.post("/investments", requireAuth, async (req, res) => {
  const user = req.localUser;
  if (!user) { res.status(404).json({ error: "User not provisioned" }); return; }

  const { planId, amount } = req.body as { planId: number; amount: number };
  if (!planId || !amount || amount <= 0) { res.status(400).json({ error: "Invalid plan or amount" }); return; }

  const [plan] = await db.select().from(investmentPlansTable).where(eq(investmentPlansTable.id, planId));
  if (!plan || !plan.isActive) { res.status(404).json({ error: "Plan not found or inactive" }); return; }

  const minAmount = parseFloat(plan.minAmount);
  const maxAmount = plan.maxAmount ? parseFloat(plan.maxAmount) : Infinity;
  if (amount < minAmount) { res.status(400).json({ error: `Minimum investment is $${minAmount.toLocaleString()}` }); return; }
  if (amount > maxAmount) { res.status(400).json({ error: `Maximum investment is $${maxAmount.toLocaleString()}` }); return; }

  const balance = parseFloat(user.balance);
  if (amount > balance) {
    res.status(400).json({ error: `Insufficient balance. Available: $${balance.toFixed(2)}` });
    return;
  }

  const returnPercent = parseFloat(plan.returnPercent);
  const expectedReturn = amount * (returnPercent / 100) + amount;
  const maturityDate = new Date();
  maturityDate.setDate(maturityDate.getDate() + plan.durationDays);

  // Deduct investment amount from balance
  await db.update(usersTable)
    .set({ balance: String(balance - amount) })
    .where(eq(usersTable.id, user.id));

  const [inv] = await db.insert(userInvestmentsTable).values({
    userId: user.id,
    planId,
    amount: String(amount),
    expectedReturn: String(expectedReturn),
    status: "active",
    maturityDate,
  }).returning();

  res.status(201).json(fmt(inv, plan.name));
});

export default router;
