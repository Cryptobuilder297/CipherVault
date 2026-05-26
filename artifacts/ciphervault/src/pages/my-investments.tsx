import { formatCurrency, formatPercent } from "@/lib/format";
import { useListMyInvestments } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export default function MyInvestments() {
  const { data: investments, isLoading } = useListMyInvestments();

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!investments?.length) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-mono font-bold tracking-tight">My Investments</h1>
        <Card className="bg-card">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">You have no active investments.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-mono font-bold tracking-tight">My Investments</h1>
      
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

          return (
            <Card key={inv.id} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-mono">{inv.planName}</CardTitle>
                <Badge variant="outline" className={
                  inv.status === 'active' ? 'text-primary border-primary/20 bg-primary/10' :
                  inv.status === 'completed' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' :
                  'text-muted-foreground'
                }>
                  {inv.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Invested Amount</p>
                    <p className="text-xl font-mono font-medium">{formatCurrency(inv.amount)}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm text-muted-foreground">Expected Return</p>
                    <p className="text-xl font-mono font-medium text-emerald-400">
                      {formatCurrency(inv.expectedReturn)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span>{new Date(inv.startDate).toLocaleDateString()}</span>
                    <span>{progress.toFixed(0)}%</span>
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