import { useState } from "react";
import { formatCurrency, formatPercent } from "@/lib/format";
import { useListPlans, useCreateInvestment, getListMyInvestmentsQueryKey, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, TrendingUp, Clock, Shield, Infinity } from "lucide-react";
import { useUser } from "@clerk/react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Plans() {
  const { data: plans, isLoading } = useListPlans();
  const { data: me } = useGetMe();
  const createInvestment = useCreateInvestment();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isSignedIn } = useUser();
  const [, setLocation] = useLocation();

  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [amount, setAmount] = useState("");

  const activePlans = plans?.filter(p => p.isActive) || [];
  const currentPlan = activePlans.find(p => p.id === selectedPlan);

  const handleInvestClick = (planId: number) => {
    if (!isSignedIn) {
      setLocation("/sign-in");
      return;
    }
    setSelectedPlan(planId);
    setAmount("");
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const amt = Number(amount);
    const balance = me?.balance ?? 0;
    if (amt > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${formatCurrency(balance)} available. Please deposit more funds first.`,
        variant: "destructive",
      });
      return;
    }

    createInvestment.mutate({ data: { planId: selectedPlan, amount: amt } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMyInvestmentsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        setOpen(false);
        setAmount("");
        toast({
          title: "Investment Activated",
          description: `${formatCurrency(amt)} invested in ${currentPlan?.name ?? "plan"}. Returns credited at maturity.`,
        });
        setLocation("/investments");
      },
      onError: (err: any) => {
        toast({
          title: "Investment Failed",
          description: err?.message ?? "Something went wrong. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto py-8">
        <h1 className="text-4xl font-mono font-bold tracking-tight">Investment Plans</h1>
        <p className="text-muted-foreground text-lg">
          Secure, automated crypto trading strategies tailored to your risk profile.
        </p>
        {me && (
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm">
            <span className="text-muted-foreground">Available balance:</span>
            <span className="font-mono font-bold text-primary">{formatCurrency(me.balance)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {activePlans.map((plan) => (
          <Card key={plan.id} className="relative overflow-hidden border-border bg-card group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary"></div>
            <CardHeader>
              <CardTitle className="text-xl font-mono">{plan.name}</CardTitle>
              <CardDescription className="h-10">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center p-6 bg-background/50 rounded-lg border border-border">
                <span className="text-3xl font-bold text-primary font-mono">
                  {formatPercent(plan.returnPercent)}
                </span>
                <span className="text-sm text-muted-foreground mt-1">Expected Return</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Duration</span>
                  <span className="text-foreground font-mono">{plan.durationDays} Days</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Min Invest</span>
                  <span className="text-foreground font-mono">{formatCurrency(plan.minAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Max Invest</span>
                  <span className="text-foreground font-mono flex items-center gap-1">
                    {plan.maxAmount ? formatCurrency(plan.maxAmount) : <><Infinity className="w-4 h-4" /> Unlimited</>}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full font-mono font-bold"
                onClick={() => handleInvestClick(plan.id)}
              >
                Invest Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invest in {currentPlan?.name}</DialogTitle>
          </DialogHeader>
          {me && (
            <div className="rounded-md bg-muted px-3 py-2 text-sm">
              Available: <span className="text-primary font-mono font-medium">{formatCurrency(me.balance)}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Investment Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min={currentPlan?.minAmount}
                max={currentPlan?.maxAmount ?? undefined}
                placeholder={currentPlan ? `Min: ${formatCurrency(currentPlan.minAmount)}` : ""}
              />
              {currentPlan && (
                <p className="text-xs text-muted-foreground">
                  Min: {formatCurrency(currentPlan.minAmount)}
                  {currentPlan.maxAmount ? ` | Max: ${formatCurrency(currentPlan.maxAmount)}` : " | No maximum"}
                </p>
              )}
              {amount && currentPlan && (
                <div className="rounded-md bg-emerald-400/5 border border-emerald-400/20 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Expected return at maturity: </span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {formatCurrency(Number(amount) * (1 + currentPlan.returnPercent / 100))}
                  </span>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={createInvestment.isPending}>
              {createInvestment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Investment
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
