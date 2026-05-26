import { Router } from "express";
import { db, userInvestmentsTable, investmentPlansTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
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

router.get("/investments", requireAuth, async (req, res) => {
  const user = req.localUser;
  if (!user) { res.status(404).json({ error: "User not provisioned" }); return; }

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
  if (!planId || !amount || amount <= 0) { res.status(400).json({ error: "Invalid planId or amount" }); return; }

  const [plan] = await db.select().from(investmentPlansTable).where(eq(investmentPlansTable.id, planId));
  if (!plan || !plan.isActive) { res.status(404).json({ error: "Plan not found" }); return; }

  const minAmount = parseFloat(plan.minAmount);
  const maxAmount = plan.maxAmount ? parseFloat(plan.maxAmount) : Infinity;
  if (amount < minAmount) { res.status(400).json({ error: `Minimum investment is $${minAmount}` }); return; }
  if (amount > maxAmount) { res.status(400).json({ error: `Maximum investment is $${maxAmount}` }); return; }

  const balance = parseFloat(user.balance);
  if (amount > balance) { res.status(400).json({ error: "Insufficient balance" }); return; }

  const returnPercent = parseFloat(plan.returnPercent);
  const expectedReturn = amount * (returnPercent / 100) + amount;
  const maturityDate = new Date();
  maturityDate.setDate(maturityDate.getDate() + plan.durationDays);

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
