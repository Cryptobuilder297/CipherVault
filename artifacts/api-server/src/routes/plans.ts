import { Router } from "express";
import { db, investmentPlansTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function fmt(p: typeof investmentPlansTable.$inferSelect) {
  return {
    ...p,
    minAmount: parseFloat(p.minAmount),
    maxAmount: p.maxAmount ? parseFloat(p.maxAmount) : null,
    returnPercent: parseFloat(p.returnPercent),
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/plans", async (req, res) => {
  const rows = await db.select().from(investmentPlansTable).where(eq(investmentPlansTable.isActive, true));
  res.json(rows.map(fmt));
});

export default router;
