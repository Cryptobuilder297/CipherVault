import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

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
  const { email, username } = req.body as { email?: string; username?: string };
  const clerkId = req.userId!;

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (existing) {
    res.json(formatUser(existing));
    return;
  }

  const [created] = await db.insert(usersTable).values({
    clerkId,
    email: email ?? "",
    username: username ?? null,
    role: "user",
    balance: "0",
  }).returning();

  res.json(formatUser(created));
});

export default router;
