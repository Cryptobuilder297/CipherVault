import { Router } from "express";
import { db, userInvestmentsTable, investmentPlansTable, usersTable, notificationsTable } from "@workspace/db";
import { eq, desc, and, lte } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { sendInvestmentMaturedEmail } from "../services/email";

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

async function processMaturities(userId: number) {
  const now = new Date();
  const matured = await db
    .select()
    .from(userInvestmentsTable)
    .where(and(
      eq(userInvestmentsTable.userId, userId),
      eq(userInvestmentsTable.status, "active"),
      lte(userInvestmentsTable.maturityDate, now),
    ));

  for (const inv of matured) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) continue;

    const newBalance = parseFloat(user.balance) + parseFloat(inv.expectedReturn);
    await db.update(usersTable).set({ balance: String(newBalance) }).where(eq(usersTable.id, userId));
    await db.update(userInvestmentsTable)
      .set({ status: "completed", completedAt: now })
      .where(eq(userInvestmentsTable.id, inv.id));

    // Fetch plan name for email
    const [plan] = await db.select().from(investmentPlansTable).where(eq(investmentPlansTable.id, inv.planId));
    const amount = parseFloat(inv.amount);
    const expectedReturn = parseFloat(inv.expectedReturn);

    // In-app notification
    await db.insert(notificationsTable).values({
      userId,
      type: "investment_matured",
      title: "Investment Matured — Return Credited 🎉",
      message: `Your ${plan?.name ?? "investment"} of $${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} has matured. $${expectedReturn.toLocaleString("en-US", { minimumFractionDigits: 2 })} has been credited to your vault.`,
    });

    // Send maturity email notification
    await sendInvestmentMaturedEmail({
      to: user.email,
      planName: plan?.name ?? "Investment Plan",
      amount,
      expectedReturn,
      profit: expectedReturn - amount,
      newBalance,
    });
  }
}

router.get("/investments/growth", requireAuth, async (req, res) => {
  const user = req.localUser;
  if (!user) { res.status(404).json({ error: "User not provisioned" }); return; }

  await processMaturities(user.id);

  const [freshUser] = await db.select().from(usersTable).where(eq(usersTable.id, user.id));
  if (!freshUser) { res.status(404).json({ error: "User not found" }); return; }

  const rows = await db
    .select({ inv: userInvestmentsTable })
    .from(userInvestmentsTable)
    .where(eq(userInvestmentsTable.userId, user.id));

  const investments = rows.map(r => ({
    amount: parseFloat(r.inv.amount),
    expectedReturn: parseFloat(r.inv.expectedReturn),
    status: r.inv.status,
    startDate: r.inv.startDate,
    maturityDate: r.inv.maturityDate,
    completedAt: r.inv.completedAt ?? null,
  }));

  const currentBalance = parseFloat(freshUser.balance);
  const now = new Date();

  // Generate points: 90 days back to furthest active maturity or +90 days
  const furthestMaturity = investments
    .filter(i => i.status === "active")
    .reduce((max, i) => i.maturityDate > max ? i.maturityDate : max, now);
  const futureEnd = new Date(Math.max(furthestMaturity.getTime(), now.getTime() + 30 * 86400000));
  const start = new Date(now.getTime() - 90 * 86400000);

  // Earliest investment start (cap at 90 days back)
  const earliestStart = investments.reduce(
    (min, i) => i.startDate < min ? i.startDate : min,
    start
  );
  const rangeStart = earliestStart < start ? start : earliestStart;

  const totalMs = futureEnd.getTime() - rangeStart.getTime();
  const NUM_POINTS = 60;
  const stepMs = Math.max(totalMs / (NUM_POINTS - 1), 86400000);

  const points = [];
  for (let i = 0; i < NUM_POINTS; i++) {
    const T = new Date(rangeStart.getTime() + i * stepMs);
    const isFuture = T > now;

    let cash: number;
    let invested = 0;

    if (!isFuture) {
      // Reconstruct past cash balance from current balance
      cash = currentBalance;
      for (const inv of investments) {
        if (inv.startDate > T) {
          // This investment hadn't started yet — reverse the deduction (active) or net effect (completed)
          if (inv.status === "active") {
            cash += inv.amount;
          } else {
            // completed: net effect on current balance was +expectedReturn - amount; at T it was 0, so reverse
            cash += inv.amount - inv.expectedReturn;
          }
        } else {
          // Investment had started before T
          const effectiveComplete = inv.status === "completed" ? inv.completedAt : null;
          if (effectiveComplete && effectiveComplete > T) {
            // Active at T but completed after T — reverse the maturity credit
            cash -= inv.expectedReturn;
            invested += inv.amount;
          } else if (inv.status === "active") {
            // Still active at T and now
            invested += inv.amount;
          }
          // else: completed before T — already reflected in currentBalance, no adjustment
        }
      }
    } else {
      // Future projection: current balance + returns from maturing active investments
      cash = currentBalance;
      for (const inv of investments) {
        if (inv.status === "active") {
          if (inv.maturityDate <= T) {
            cash += inv.expectedReturn;
          } else {
            invested += inv.amount;
          }
        }
      }
    }

    const totalValue = cash + invested;
    points.push({
      date: T.toISOString().split("T")[0],
      totalValue: Math.round(totalValue * 100) / 100,
      cashBalance: Math.round(Math.max(cash, 0) * 100) / 100,
      investedValue: Math.round(invested * 100) / 100,
      isFuture,
    });
  }

  res.json(points);
});

router.get("/investments", requireAuth, async (req, res) => {
  const user = req.localUser;
  if (!user) { res.status(404).json({ error: "User not provisioned" }); return; }

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

  await db.update(usersTable).set({ balance: String(balance - amount) }).where(eq(usersTable.id, user.id));

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
