import { Router } from "express";
import { db, holdingsTable } from "@workspace/db";

const router = Router();

const COIN_PRICES: Record<string, { price: number; change24hPct: number }> = {
  BTC: { price: 67842.15, change24hPct: 2.76 },
  ETH: { price: 3521.88, change24hPct: -1.27 },
  BNB: { price: 598.44, change24hPct: 2.10 },
  SOL: { price: 178.92, change24hPct: 5.09 },
  XRP: { price: 0.5823, change24hPct: -2.38 },
  ADA: { price: 0.4512, change24hPct: 5.40 },
  AVAX: { price: 38.21, change24hPct: -3.90 },
  DOT: { price: 7.34, change24hPct: 6.22 },
  MATIC: { price: 0.7821, change24hPct: -3.95 },
  LINK: { price: 14.87, change24hPct: 6.59 },
  UNI: { price: 9.12, change24hPct: 3.87 },
  ATOM: { price: 8.44, change24hPct: -3.54 },
};

router.get("/portfolio/summary", async (req, res) => {
  const rows = await db.select().from(holdingsTable);

  if (rows.length === 0) {
    res.json({
      totalValue: 0,
      totalCost: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      dayChange: 0,
      dayChangePercent: 0,
      holdingsCount: 0,
      topGainer: null,
      topLoser: null,
    });
    return;
  }

  let totalValue = 0;
  let totalCost = 0;
  let dayChange = 0;

  const perfs: { symbol: string; name: string; changePercent: number }[] = [];

  for (const row of rows) {
    const qty = parseFloat(row.quantity);
    const avgBuy = parseFloat(row.avgBuyPrice);
    const market = COIN_PRICES[row.symbol.toUpperCase()] ?? { price: avgBuy, change24hPct: 0 };
    const value = qty * market.price;
    const cost = qty * avgBuy;
    totalValue += value;
    totalCost += cost;
    dayChange += value * (market.change24hPct / 100);
    perfs.push({ symbol: row.symbol, name: row.name, changePercent: market.change24hPct });
  }

  perfs.sort((a, b) => b.changePercent - a.changePercent);
  const topGainer = perfs[0] ?? null;
  const topLoser = perfs[perfs.length - 1] ?? null;

  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  const dayChangePercent = totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0;

  res.json({
    totalValue,
    totalCost,
    totalGainLoss,
    totalGainLossPercent,
    dayChange,
    dayChangePercent,
    holdingsCount: rows.length,
    topGainer,
    topLoser,
  });
});

export default router;
