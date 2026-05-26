import { useGetPortfolioSummary, useListTransactions } from "@workspace/api-client-react";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useGetPortfolioSummary();
  const { data: transactions, isLoading: isTransactionsLoading } = useListTransactions();

  if (isSummaryLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono">{formatCurrency(summary.totalValue)}</div>
            <div className="flex items-center mt-2 space-x-2">
              <span className={`flex items-center text-sm ${summary.dayChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {summary.dayChange >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {formatPercent(summary.dayChangePercent)}
              </span>
              <span className="text-xs text-muted-foreground">24h change</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-mono ${summary.totalGainLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
              {summary.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(summary.totalGainLoss)}
            </div>
            <div className="flex items-center mt-2 space-x-2">
              <span className={`flex items-center text-sm ${summary.totalGainLossPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatPercent(summary.totalGainLossPercent)}
              </span>
              <span className="text-xs text-muted-foreground">all time</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assets Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono">{summary.holdingsCount}</div>
            <div className="flex items-center mt-2 space-x-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4 mr-1" />
              Active positions
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {isTransactionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : transactions?.length ? (
              <div className="space-y-4">
                {transactions.slice(0, 5).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${tx.type === 'buy' ? 'bg-success' : 'bg-destructive'}`} />
                      <div>
                        <div className="font-bold">{tx.symbol}</div>
                        <div className="text-xs text-muted-foreground capitalize">{tx.type}</div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div>{formatCurrency(tx.total)}</div>
                      <div className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No recent transactions</div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle>Top Movers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.topGainer && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                    <div className="flex flex-col">
                      <span className="text-xs text-success uppercase font-bold tracking-wider mb-1">Top Gainer</span>
                      <span className="font-bold">{summary.topGainer.name}</span>
                    </div>
                    <div className="text-success font-mono text-xl">
                      +{formatPercent(summary.topGainer.changePercent)}
                    </div>
                  </div>
                )}
                {summary.topLoser && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="flex flex-col">
                      <span className="text-xs text-destructive uppercase font-bold tracking-wider mb-1">Top Loser</span>
                      <span className="font-bold">{summary.topLoser.name}</span>
                    </div>
                    <div className="text-destructive font-mono text-xl">
                      {formatPercent(summary.topLoser.changePercent)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
