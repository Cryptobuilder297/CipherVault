import { Router } from "express";
import { db, depositsTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

function fmt(d: typeof depositsTable.$inferSelect) {
  return {
    ...d,
    amount: parseFloat(d.amount),
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
    notes: d.notes ?? null,
  };
}

router.get("/deposits", requireAuth, async (req, res) => {
  const user = req.localUser;
  if (!user) { res.status(404).json({ error: "User not provisioned" }); return; }
  const rows = await db.select().from(depositsTable)
    .where(eq(depositsTable.userId, user.id))
    .orderBy(desc(depositsTable.createdAt));
  res.json(rows.map(fmt));
});

router.post("/deposits", requireAuth, async (req, res) => {
  const user = req.localUser;
  if (!user) { res.status(404).json({ error: "User not provisioned" }); return; }
  const { amount, method } = req.body as { amount: number; method: string };
  if (!amount || amount <= 0) { res.status(400).json({ error: "Invalid amount" }); return; }
  if (!method) { res.status(400).json({ error: "Method required" }); return; }

  const [row] = await db.insert(depositsTable).values({
    userId: user.id,
    amount: String(amount),
    method,
    status: "pending",
  }).returning();
  res.status(201).json(fmt(row));
});

export default router;
