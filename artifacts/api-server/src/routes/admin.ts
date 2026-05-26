import { Router } from "express";
import { db, usersTable, depositsTable, withdrawalsTable, investmentPlansTable, userInvestmentsTable } from "@workspace/db";
import { eq, sum, count, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAuth";

const router = Router();

router.get("/admin/stats", requireAdmin, async (req, res) => {
  const [totalUsers] = await db.select({ count: count() }).from(usersTable);
  const [totalDeposited] = await db.select({ total: sum(depositsTable.amount) }).from(depositsTable).where(eq(depositsTable.status, "approved"));
  const [totalWithdrawn] = await db.select({ total: sum(withdrawalsTable.amount) }).from(withdrawalsTable).where(eq(withdrawalsTable.status, "approved"));
  const [totalInvested] = await db.select({ total: sum(userInvestmentsTable.amount) }).from(userInvestmentsTable);
  const [pendingDep] = await db.select({ count: count() }).from(depositsTable).where(eq(depositsTable.status, "pending"));
  const [pendingWit] = await db.select({ count: count() }).from(withdrawalsTable).where(eq(withdrawalsTable.status, "pending"));
  const [activeInv] = await db.select({ count: count() }).from(userInvestmentsTable).where(eq(userInvestmentsTable.status, "active"));

  res.json({
    totalUsers: totalUsers.count,
    totalDeposited: parseFloat(String(totalDeposited.total ?? "0")),
    totalWithdrawn: parseFloat(String(totalWithdrawn.total ?? "0")),
    totalInvested: parseFloat(String(totalInvested.total ?? "0")),
    pendingDeposits: pendingDep.count,
    pendingWithdrawals: pendingWit.count,
    activeInvestments: activeInv.count,
  });
});

router.get("/admin/users", requireAdmin, async (req, res) => {
  const rows = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
  res.json(rows.map(u => ({ ...u, balance: parseFloat(u.balance), createdAt: u.createdAt.toISOString() })));
});

router.patch("/admin/users/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { role, isActive } = req.body as { role?: string; isActive?: boolean };
  const updates: Partial<typeof usersTable.$inferInsert> = {};
  if (role !== undefined) updates.role = role;
  if (isActive !== undefined) updates.isActive = isActive;
  const [row] = await db.update(usersTable).set(updates).where(eq(usersTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, balance: parseFloat(row.balance), createdAt: row.createdAt.toISOString() });
});

router.get("/admin/deposits", requireAdmin, async (req, res) => {
  const rows = await db
    .select({ dep: depositsTable, user: usersTable })
    .from(depositsTable)
    .leftJoin(usersTable, eq(depositsTable.userId, usersTable.id))
    .orderBy(desc(depositsTable.createdAt));
  res.json(rows.map(r => ({
    ...r.dep,
    amount: parseFloat(r.dep.amount),
    createdAt: r.dep.createdAt.toISOString(),
    updatedAt: r.dep.updatedAt.toISOString(),
    notes: r.dep.notes ?? null,
    userEmail: r.user?.email ?? "",
  })));
});

router.patch("/admin/deposits/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { status, notes } = req.body as { status: string; notes?: string };

  const [dep] = await db.select().from(depositsTable).where(eq(depositsTable.id, id));
  if (!dep) { res.status(404).json({ error: "Not found" }); return; }

  // Credit balance on approval (only once, if transitioning to approved)
  if (status === "approved" && dep.status !== "approved") {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, dep.userId));
    if (user) {
      const newBalance = parseFloat(user.balance) + parseFloat(dep.amount);
      await db.update(usersTable).set({ balance: String(newBalance) }).where(eq(usersTable.id, user.id));
    }
  }

  const updates: Partial<typeof depositsTable.$inferInsert> = { status, updatedAt: new Date() };
  if (notes !== undefined) updates.notes = notes;

  const [row] = await db.update(depositsTable).set(updates).where(eq(depositsTable.id, id)).returning();
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, row.userId));
  res.json({
    ...row,
    amount: parseFloat(row.amount),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    notes: row.notes ?? null,
    userEmail: user?.email ?? "",
  });
});

router.get("/admin/withdrawals", requireAdmin, async (req, res) => {
  const rows = await db
    .select({ wit: withdrawalsTable, user: usersTable })
    .from(withdrawalsTable)
    .leftJoin(usersTable, eq(withdrawalsTable.userId, usersTable.id))
    .orderBy(desc(withdrawalsTable.createdAt));
  res.json(rows.map(r => ({
    ...r.wit,
    amount: parseFloat(r.wit.amount),
    createdAt: r.wit.createdAt.toISOString(),
    updatedAt: r.wit.updatedAt.toISOString(),
    notes: r.wit.notes ?? null,
    userEmail: r.user?.email ?? "",
  })));
});

router.patch("/admin/withdrawals/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { status, notes } = req.body as { status: string; notes?: string };

  const [wit] = await db.select().from(withdrawalsTable).where(eq(withdrawalsTable.id, id));
  if (!wit) { res.status(404).json({ error: "Not found" }); return; }

  // Refund balance if rejection (balance was already deducted at request time)
  if (status === "rejected" && wit.status === "pending") {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, wit.userId));
    if (user) {
      const newBalance = parseFloat(user.balance) + parseFloat(wit.amount);
      await db.update(usersTable).set({ balance: String(newBalance) }).where(eq(usersTable.id, user.id));
    }
  }

  const updates: Partial<typeof withdrawalsTable.$inferInsert> = { status, updatedAt: new Date() };
  if (notes !== undefined) updates.notes = notes;

  const [row] = await db.update(withdrawalsTable).set(updates).where(eq(withdrawalsTable.id, id)).returning();
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, row.userId));
  res.json({
    ...row,
    amount: parseFloat(row.amount),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    notes: row.notes ?? null,
    userEmail: user?.email ?? "",
  });
});

router.get("/admin/investments", requireAdmin, async (req, res) => {
  const rows = await db
    .select({ inv: userInvestmentsTable, user: usersTable, plan: investmentPlansTable })
    .from(userInvestmentsTable)
    .leftJoin(usersTable, eq(userInvestmentsTable.userId, usersTable.id))
    .leftJoin(investmentPlansTable, eq(userInvestmentsTable.planId, investmentPlansTable.id))
    .orderBy(desc(userInvestmentsTable.startDate));
  res.json(rows.map(r => ({
    ...r.inv,
    amount: parseFloat(r.inv.amount),
    expectedReturn: parseFloat(r.inv.expectedReturn),
    startDate: r.inv.startDate.toISOString(),
    maturityDate: r.inv.maturityDate.toISOString(),
    completedAt: r.inv.completedAt?.toISOString() ?? null,
    userEmail: r.user?.email ?? "",
    planName: r.plan?.name ?? "",
  })));
});

router.post("/admin/plans", requireAdmin, async (req, res) => {
  const { name, description, minAmount, maxAmount, returnPercent, durationDays } = req.body;
  const [plan] = await db.insert(investmentPlansTable).values({
    name,
    description,
    minAmount: String(minAmount),
    maxAmount: maxAmount ? String(maxAmount) : null,
    returnPercent: String(returnPercent),
    durationDays,
    isActive: true,
  }).returning();
  res.status(201).json({
    ...plan,
    minAmount: parseFloat(plan.minAmount),
    maxAmount: plan.maxAmount ? parseFloat(plan.maxAmount) : null,
    returnPercent: parseFloat(plan.returnPercent),
    createdAt: plan.createdAt.toISOString(),
  });
});

router.patch("/admin/plans/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = req.body as { name?: string; description?: string; minAmount?: number; maxAmount?: number; returnPercent?: number; durationDays?: number; isActive?: boolean };
  const updates: Partial<typeof investmentPlansTable.$inferInsert> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.description !== undefined) updates.description = body.description;
  if (body.minAmount !== undefined) updates.minAmount = String(body.minAmount);
  if (body.maxAmount !== undefined) updates.maxAmount = String(body.maxAmount);
  if (body.returnPercent !== undefined) updates.returnPercent = String(body.returnPercent);
  if (body.durationDays !== undefined) updates.durationDays = body.durationDays;
  if (body.isActive !== undefined) updates.isActive = body.isActive;
  const [plan] = await db.update(investmentPlansTable).set(updates).where(eq(investmentPlansTable.id, id)).returning();
  if (!plan) { res.status(404).json({ error: "Not found" }); return; }
  res.json({
    ...plan,
    minAmount: parseFloat(plan.minAmount),
    maxAmount: plan.maxAmount ? parseFloat(plan.maxAmount) : null,
    returnPercent: parseFloat(plan.returnPercent),
    createdAt: plan.createdAt.toISOString(),
  });
});

export default router;
