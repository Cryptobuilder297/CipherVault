import { Router } from "express";
import { db, holdingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateHoldingBody, UpdateHoldingBody } from "@workspace/api-zod";

const router = Router();

const COIN_PRICES: Record<string, { price: number; change: number; logoUrl: string }> = {
  BTC: { price: 67842.15, change: 2.76, logoUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
  ETH: { price: 3521.88, change: -1.27, logoUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  BNB: { price: 598.44, change: 2.10, logoUrl: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png" },
  SOL: { price: 178.92, change: 5.09, logoUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
  XRP: { price: 0.5823, change: -2.38, logoUrl: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png" },
  ADA: { price: 0.4512, change: 5.40, logoUrl: "https://assets.coingecko.com/coins/images/975/small/cardano.png" },
  AVAX: { price: 38.21, change: -3.90, logoUrl: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png" },
  DOT: { price: 7.34, change: 6.22, logoUrl: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png" },
  MATIC: { price: 0.7821, change: -3.95, logoUrl: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png" },
  LINK: { price: 14.87, change: 6.59, logoUrl: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png" },
  UNI: { price: 9.12, change: 3.87, logoUrl: "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png" },
  ATOM: { price: 8.44, change: -3.54, logoUrl: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png" },
};

function enrichHolding(h: typeof holdingsTable.$inferSelect) {
  const qty = parseFloat(h.quantity);
  const avgBuy = parseFloat(h.avgBuyPrice);
  const market = COIN_PRICES[h.symbol.toUpperCase()] ?? { price: avgBuy, change: 0, logoUrl: "" };
  const currentValue = qty * market.price;
  const cost = qty * avgBuy;
  const gainLoss = currentValue - cost;
  const gainLossPercent = cost > 0 ? (gainLoss / cost) * 100 : 0;

  return {
    id: h.id,
    symbol: h.symbol,
    name: h.name,
    quantity: qty,
    avgBuyPrice: avgBuy,
    currentPrice: market.price,
    currentValue,
    gainLoss,
    gainLossPercent,
    logoUrl: market.logoUrl,
  };
}

router.get("/portfolio/holdings", async (req, res) => {
  const rows = await db.select().from(holdingsTable);
  res.json(rows.map(enrichHolding));
});

router.post("/portfolio/holdings", async (req, res) => {
  const parsed = CreateHoldingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { symbol, name, quantity, avgBuyPrice } = parsed.data;
  const [row] = await db.insert(holdingsTable).values({
    symbol,
    name,
    quantity: String(quantity),
    avgBuyPrice: String(avgBuyPrice),
  }).returning();
  res.status(201).json(enrichHolding(row));
});

router.get("/portfolio/holdings/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [row] = await db.select().from(holdingsTable).where(eq(holdingsTable.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(enrichHolding(row));
});

router.patch("/portfolio/holdings/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateHoldingBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updates: Partial<typeof holdingsTable.$inferInsert> = {};
  if (parsed.data.quantity !== undefined) updates.quantity = String(parsed.data.quantity);
  if (parsed.data.avgBuyPrice !== undefined) updates.avgBuyPrice = String(parsed.data.avgBuyPrice);
  const [row] = await db.update(holdingsTable).set(updates).where(eq(holdingsTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(enrichHolding(row));
});

router.delete("/portfolio/holdings/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(holdingsTable).where(eq(holdingsTable.id, id));
  res.status(204).send();
});

export default router;
