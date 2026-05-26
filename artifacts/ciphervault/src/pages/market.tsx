import { useState } from "react";
import { useListMarketCoins } from "@workspace/api-client-react";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Market() {
  const { data: coins, isLoading } = useListMarketCoins();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
      </div>

      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle>All Coins</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : coins?.length ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead className="text-right">Market Cap</TableHead>
                  <TableHead className="text-right">Volume (24h)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coins.map((coin) => (
                  <TableRow key={coin.symbol} className="border-border/50">
                    <TableCell className="text-muted-foreground">{coin.rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8 rounded-sm bg-background border border-border">
                          <AvatarImage src={coin.logoUrl} alt={coin.name} />
                          <AvatarFallback className="rounded-sm bg-muted text-xs font-mono">{coin.symbol.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold">{coin.name}</div>
                          <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(coin.currentPrice)}</TableCell>
                    <TableCell className={`text-right font-mono ${coin.priceChangePercent24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {coin.priceChangePercent24h >= 0 ? '+' : ''}{formatPercent(coin.priceChangePercent24h)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(coin.marketCap)}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(coin.volume24h)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No market data available.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
