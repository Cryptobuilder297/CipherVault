import { Router } from "express";

const router = Router();

const MARKET_COINS = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    currentPrice: 67842.15,
    priceChange24h: 1823.45,
    priceChangePercent24h: 2.76,
    marketCap: 1334567890123,
    volume24h: 28934567890,
    logoUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    rank: 1,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    currentPrice: 3521.88,
    priceChange24h: -45.23,
    priceChangePercent24h: -1.27,
    marketCap: 423456789012,
    volume24h: 14567890123,
    logoUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    rank: 2,
  },
  {
    symbol: "BNB",
    name: "BNB",
    currentPrice: 598.44,
    priceChange24h: 12.33,
    priceChangePercent24h: 2.10,
    marketCap: 89012345678,
    volume24h: 1890234567,
    logoUrl: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
    rank: 3,
  },
  {
    symbol: "SOL",
    name: "Solana",
    currentPrice: 178.92,
    priceChange24h: 8.67,
    priceChangePercent24h: 5.09,
    marketCap: 78901234567,
    volume24h: 3456789012,
    logoUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    rank: 4,
  },
  {
    symbol: "XRP",
    name: "XRP",
    currentPrice: 0.5823,
    priceChange24h: -0.0142,
    priceChangePercent24h: -2.38,
    marketCap: 32456789012,
    volume24h: 1234567890,
    logoUrl: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
    rank: 5,
  },
  {
    symbol: "ADA",
    name: "Cardano",
    currentPrice: 0.4512,
    priceChange24h: 0.0231,
    priceChangePercent24h: 5.40,
    marketCap: 15678901234,
    volume24h: 567890123,
    logoUrl: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
    rank: 6,
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    currentPrice: 38.21,
    priceChange24h: -1.55,
    priceChangePercent24h: -3.90,
    marketCap: 15678901234,
    volume24h: 456789012,
    logoUrl: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
    rank: 7,
  },
  {
    symbol: "DOT",
    name: "Polkadot",
    currentPrice: 7.34,
    priceChange24h: 0.43,
    priceChangePercent24h: 6.22,
    marketCap: 9876543210,
    volume24h: 345678901,
    logoUrl: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
    rank: 8,
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    currentPrice: 0.7821,
    priceChange24h: -0.0322,
    priceChangePercent24h: -3.95,
    marketCap: 7654321098,
    volume24h: 234567890,
    logoUrl: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
    rank: 9,
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    currentPrice: 14.87,
    priceChange24h: 0.92,
    priceChangePercent24h: 6.59,
    marketCap: 8765432109,
    volume24h: 567890123,
    logoUrl: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
    rank: 10,
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    currentPrice: 9.12,
    priceChange24h: 0.34,
    priceChangePercent24h: 3.87,
    marketCap: 5432109876,
    volume24h: 234567890,
    logoUrl: "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png",
    rank: 11,
  },
  {
    symbol: "ATOM",
    name: "Cosmos",
    currentPrice: 8.44,
    priceChange24h: -0.31,
    priceChangePercent24h: -3.54,
    marketCap: 3210987654,
    volume24h: 145678901,
    logoUrl: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png",
    rank: 12,
  },
];

router.get("/market/coins", (req, res) => {
  res.json(MARKET_COINS);
});

router.get("/market/coins/:symbol", (req, res) => {
  const coin = MARKET_COINS.find(
    (c) => c.symbol.toUpperCase() === req.params.symbol.toUpperCase()
  );
  if (!coin) {
    res.status(404).json({ error: "Coin not found" });
    return;
  }
  res.json(coin);
});

export default router;
