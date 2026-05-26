import { Router } from "express";
import { db, transactionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateTransactionBody } from "@workspace/api-zod";

const router = Router();

router.get("/transactions", async (req, res) => {
  const rows = await db.select().from(transactionsTable).orderBy(desc(transactionsTable.timestamp));
  res.json(rows.map(r => ({
    ...r,
    quantity: parseFloat(r.quantity),
    price: parseFloat(r.price),
    total: parseFloat(r.total),
    timestamp: r.timestamp.toISOString(),
    notes: r.notes ?? null,
  })));
});

router.post("/transactions", async (req, res) => {
  const parsed = CreateTransactionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { symbol, name, type, quantity, price, notes } = parsed.data;
  const total = quantity * price;
  const [row] = await db.insert(transactionsTable).values({
    symbol,
    name,
    type,
    quantity: String(quantity),
    price: String(price),
    total: String(total),
    notes: notes ?? null,
  }).returning();
  res.status(201).json({
    ...row,
    quantity: parseFloat(row.quantity),
    price: parseFloat(row.price),
    total: parseFloat(row.total),
    timestamp: row.timestamp.toISOString(),
    notes: row.notes ?? null,
  });
});

router.delete("/transactions/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(transactionsTable).where(eq(transactionsTable.id, id));
  res.status(204).send();
});

export default router;
