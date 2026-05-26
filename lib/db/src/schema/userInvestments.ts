import { pgTable, serial, integer, numeric, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { investmentPlansTable } from "./investmentPlans";

export const userInvestmentsTable = pgTable("user_investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  planId: integer("plan_id").notNull().references(() => investmentPlansTable.id),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  expectedReturn: numeric("expected_return", { precision: 20, scale: 2 }).notNull(),
  status: text("status").notNull().default("active"),
  startDate: timestamp("start_date").defaultNow().notNull(),
  maturityDate: timestamp("maturity_date").notNull(),
  completedAt: timestamp("completed_at"),
});

export type UserInvestment = typeof userInvestmentsTable.$inferSelect;
export type InsertUserInvestment = typeof userInvestmentsTable.$inferInsert;
