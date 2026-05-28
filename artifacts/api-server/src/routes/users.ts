import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { randomBytes } from "crypto";

const router = Router();

function generateReferralCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

function formatUser(u: typeof usersTable.$inferSelect) {
  return {
    ...u,
    balance: parseFloat(u.balance),
    createdAt: u.createdAt.toISOString(),
  };
}

router.get("/users/me", requireAuth, async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, req.userId!));
  if (!user) {
    res.status(404).json({ error: "User not found — call /users/sync first" });
    return;
  }
  res.json(formatUser(user));
});

router.post("/users/sync", requireAuth, async (req, res) => {
  const { email, username, referralCode: incomingCode } = req.body as {
    email?: string;
    username?: string;
    referralCode?: string;
  };
  const clerkId = req.userId!;

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (existing) {
    res.json(formatUser(existing));
    return;
  }

  let referredBy: number | null = null;
  if (incomingCode) {
    const [referrer] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.referralCode, incomingCode.toUpperCase()));
    if (referrer) referredBy = referrer.id;
  }

  let code = generateReferralCode();
  let tries = 0;
  while (tries < 5) {
    const [conflict] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.referralCode, code));
    if (!conflict) break;
    code = generateReferralCode();
    tries++;
  }

  const [created] = await db.insert(usersTable).values({
    clerkId,
    email: email ?? "",
    username: username ?? null,
    role: "user",
    balance: "0",
    referralCode: code,
    referredBy,
  }).returning();

  res.json(formatUser(created));
});

export default router;
