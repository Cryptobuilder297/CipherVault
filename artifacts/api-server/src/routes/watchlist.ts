import { Router } from "express";
import { db, watchlistTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AddToWatchlistBody } from "@workspace/api-zod";

const router = Router();

router.get("/watchlist", async (req, res) => {
  const rows = await db.select().from(watchlistTable);
  res.json(rows.map(r => ({ ...r, addedAt: r.addedAt.toISOString() })));
});

router.post("/watchlist", async (req, res) => {
  const parsed = AddToWatchlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(watchlistTable).values(parsed.data).returning();
  res.status(201).json({ ...row, addedAt: row.addedAt.toISOString() });
});

router.delete("/watchlist/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(watchlistTable).where(eq(watchlistTable.id, id));
  res.status(204).send();
});

export default router;
