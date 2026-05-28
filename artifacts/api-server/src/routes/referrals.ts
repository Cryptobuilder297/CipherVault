import { Router } from "express";
import { db, usersTable, depositsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/referrals/me", requireAuth, async (req, res) => {
  const user = req.localUser;
  if (!user) { res.status(404).json({ error: "User not provisioned" }); return; }

  const referredUsers = await db
    .select({ count: count() })
    .from(usersTable)
    .where(eq(usersTable.referredBy, user.id));

  const referredWithDeposit = await db
    .select({ userId: depositsTable.userId })
    .from(depositsTable)
    .innerJoin(usersTable, eq(depositsTable.userId, usersTable.id))
    .where(eq(usersTable.referredBy, user.id))
    .groupBy(depositsTable.userId);

  const bonusEarned = referredWithDeposit.length * 50;

  res.json({
    referralCode: user.referralCode ?? null,
    totalReferred: referredUsers[0]?.count ?? 0,
    qualifiedReferrals: referredWithDeposit.length,
    bonusEarned,
    bonusPerReferral: 50,
  });
});

export default router;
