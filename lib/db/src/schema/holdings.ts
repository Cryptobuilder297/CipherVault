import { pgTable, serial, text, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const holdingsTable = pgTable("holdings", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  quantity: numeric("quantity", { precision: 20, scale: 8 }).notNull(),
  avgBuyPrice: numeric("avg_buy_price", { precision: 20, scale: 8 }).notNull(),
});

export const insertHoldingSchema = createInsertSchema(holdingsTable).omit({ id: true });
export type InsertHolding = z.infer<typeof insertHoldingSchema>;
export type Holding = typeof holdingsTable.$inferSelect;
