import { useGetPortfolioSummary, useListTransactions, useGetMe } from "@workspace/api-client-react";
import PortfolioGrowthChart from "@/components/portfolio-growth-chart";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Activity, Wallet, TrendingUp, ArrowDownCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useUser } from "@clerk/react";

export default function Dashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useGetPortfolioSummary();
  const { data: transactions, isLoading: isTransactionsLoading } = useListTransactions();
  const { data: me } = useGetMe();
  const { isSignedIn } = useUser();

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

      {/* Account Balance — top prominence for signed-in users */}
      {isSignedIn && me && (
        <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-1">Vault Balance</p>
              <p className="text-4xl font-bold font-mono text-primary">{formatCurrency(me.balance)}</p>
              <p className="text-sm text-muted-foreground mt-1">Available for investment or withdrawal</p>
            </div>
            <div className="flex gap-3">
              <Link href="/deposits">
                <Button size="sm" className="gap-2">
                  <ArrowDownCircle className="h-4 w-4" />
                  Deposit
                </Button>
              </Link>
              <Link href="/plans">
                <Button size="sm" variant="outline" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Invest
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CTA for signed-out users */}
      {!isSignedIn && (
        <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 p-6 text-center">
          <p className="text-lg font-medium mb-2">Start growing your crypto portfolio</p>
          <p className="text-muted-foreground text-sm mb-4">Sign in to manage your vault balance, deposits, and investments.</p>
          <Link href="/sign-in">
            <Button>Get Started</Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
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

      {isSignedIn && <PortfolioGrowthChart />}

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
                {!summary.topGainer && !summary.topLoser && (
                  <div className="text-center py-4 text-muted-foreground text-sm">No market data available</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Link href="/deposits">
                <Button variant="outline" className="w-full gap-2 h-auto py-3 flex-col text-xs">
                  <ArrowDownCircle className="h-5 w-5 text-emerald-400" />
                  Deposit
                </Button>
              </Link>
              <Link href="/plans">
                <Button variant="outline" className="w-full gap-2 h-auto py-3 flex-col text-xs">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Invest
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" className="w-full gap-2 h-auto py-3 flex-col text-xs">
                  <Wallet className="h-5 w-5 text-blue-400" />
                  Portfolio
                </Button>
              </Link>
              <Link href="/investments">
                <Button variant="outline" className="w-full gap-2 h-auto py-3 flex-col text-xs">
                  <Activity className="h-5 w-5 text-amber-400" />
                  My Returns
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
