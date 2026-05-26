import { formatCurrency, formatPercent } from "@/lib/format";
import { useListMyInvestments, getListMyInvestmentsQueryKey, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, PiggyBank } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";

export default function MyInvestments() {
  const queryClient = useQueryClient();
  const { data: investments, isLoading, refetch } = useListMyInvestments();

  // When this page loads, refresh balance in case investments matured
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  }, [queryClient]);

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!investments?.length) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-mono font-bold tracking-tight">My Investments</h1>
        <Card className="bg-card">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center gap-4">
            <PiggyBank className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">You have no active investments.</p>
            <Link href="/plans">
              <Button>
                <TrendingUp className="mr-2 h-4 w-4" />
                Browse Investment Plans
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const active = investments.filter(i => i.status === 'active');
  const completed = investments.filter(i => i.status === 'completed');
  const totalInvested = active.reduce((s, i) => s + i.amount, 0);
  const totalExpected = active.reduce((s, i) => s + i.expectedReturn, 0);
  const totalEarned = completed.reduce((s, i) => s + i.expectedReturn, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-mono font-bold tracking-tight">My Investments</h1>
        <Link href="/plans">
          <Button variant="outline" size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Invest More
          </Button>
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{formatCurrency(totalInvested)}</div>
            <p className="text-xs text-muted-foreground mt-1">{active.length} position{active.length !== 1 ? 's' : ''}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expected at Maturity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-primary">{formatCurrency(totalExpected)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalInvested > 0 ? `+${formatCurrency(totalExpected - totalInvested)} profit` : '—'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-400">{formatCurrency(totalEarned)}</div>
            <p className="text-xs text-muted-foreground mt-1">{completed.length} completed plan{completed.length !== 1 ? 's' : ''}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {investments.map((inv) => {
          const start = new Date(inv.startDate).getTime();
          const end = new Date(inv.maturityDate).getTime();
          const now = Date.now();

          let progress = 0;
          if (inv.status === 'completed') {
            progress = 100;
          } else if (now > start) {
            progress = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
          }

          const daysLeft = inv.status === 'active'
            ? Math.max(0, Math.ceil((end - now) / 86400000))
            : 0;

          return (
            <Card key={inv.id} className={`bg-card border-border ${inv.status === 'completed' ? 'border-emerald-400/30' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-mono">{inv.planName}</CardTitle>
                <Badge variant="outline" className={
                  inv.status === 'active' ? 'text-primary border-primary/20 bg-primary/10' :
                  inv.status === 'completed' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' :
                  'text-muted-foreground'
                }>
                  {inv.status === 'completed' ? '✓ Completed' : inv.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                {inv.status === 'completed' && (
                  <div className="rounded-md bg-emerald-400/10 border border-emerald-400/20 px-3 py-2 text-sm text-emerald-400 font-medium">
                    Return of {formatCurrency(inv.expectedReturn)} credited to your balance
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Invested Amount</p>
                    <p className="text-xl font-mono font-medium">{formatCurrency(inv.amount)}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm text-muted-foreground">
                      {inv.status === 'completed' ? 'Return Received' : 'Expected Return'}
                    </p>
                    <p className="text-xl font-mono font-medium text-emerald-400">
                      {formatCurrency(inv.expectedReturn)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span>{new Date(inv.startDate).toLocaleDateString()}</span>
                    <span>
                      {inv.status === 'active' ? `${daysLeft}d remaining` : `${progress.toFixed(0)}%`}
                    </span>
                    <span>{new Date(inv.maturityDate).toLocaleDateString()}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
