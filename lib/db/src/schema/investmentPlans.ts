import { pgTable, serial, text, numeric, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const investmentPlansTable = pgTable("investment_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  minAmount: numeric("min_amount", { precision: 20, scale: 2 }).notNull(),
  maxAmount: numeric("max_amount", { precision: 20, scale: 2 }),
  returnPercent: numeric("return_percent", { precision: 8, scale: 2 }).notNull(),
  durationDays: integer("duration_days").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InvestmentPlan = typeof investmentPlansTable.$inferSelect;
export type InsertInvestmentPlan = typeof investmentPlansTable.$inferInsert;
