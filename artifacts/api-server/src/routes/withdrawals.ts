import { Router } from "express";
import { db, withdrawalsTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

function fmt(w: typeof withdrawalsTable.$inferSelect) {
  return {
    ...w,
    amount: parseFloat(w.amount),
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
    notes: w.notes ?? null,
  };
}

router.get("/withdrawals", requireAuth, async (req, res) => {
  const user = req.localUser;
  if (!user) { res.status(404).json({ error: "User not provisioned" }); return; }
  const rows = await db.select().from(withdrawalsTable)
    .where(eq(withdrawalsTable.userId, user.id))
    .orderBy(desc(withdrawalsTable.createdAt));
  res.json(rows.map(fmt));
});

router.post("/withdrawals", requireAuth, async (req, res) => {
  const user = req.localUser;
  if (!user) { res.status(404).json({ error: "User not provisioned" }); return; }
  const { amount, method, address } = req.body as { amount: number; method: string; address: string };
  if (!amount || amount <= 0) { res.status(400).json({ error: "Invalid amount" }); return; }
  if (!method || !address) { res.status(400).json({ error: "Method and destination are required" }); return; }

  const balance = parseFloat(user.balance);
  if (amount > balance) {
    res.status(400).json({ error: `Insufficient balance. Available: $${balance.toFixed(2)}` });
    return;
  }

  // Deduct balance immediately on request (refunded if rejected by admin)
  const newBalance = balance - amount;
  await db.update(usersTable).set({ balance: String(newBalance) }).where(eq(usersTable.id, user.id));

  const [row] = await db.insert(withdrawalsTable).values({
    userId: user.id,
    amount: String(amount),
    method,
    address,
    status: "pending",
  }).returning();
  res.status(201).json(fmt(row));
});

export default router;
