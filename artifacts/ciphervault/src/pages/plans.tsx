import { useState } from "react";
import { formatCurrency, formatPercent } from "@/lib/format";
import { useListPlans, useCreateInvestment, getListMyInvestmentsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, TrendingUp, Clock, Shield } from "lucide-react";
import { useUser } from "@clerk/react";
import { useLocation } from "wouter";

export default function Plans() {
  const { data: plans, isLoading } = useListPlans();
  const createInvestment = useCreateInvestment();
  const queryClient = useQueryClient();
  const { isSignedIn } = useUser();
  const [, setLocation] = useLocation();
  
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [amount, setAmount] = useState("");

  const handleInvestClick = (planId: number) => {
    if (!isSignedIn) {
      setLocation("/sign-in");
      return;
    }
    setSelectedPlan(planId);
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    
    createInvestment.mutate({ data: { planId: selectedPlan, amount: Number(amount) } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMyInvestmentsQueryKey() });
        setOpen(false);
        setAmount("");
        setLocation("/investments");
      }
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const activePlans = plans?.filter(p => p.isActive) || [];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto py-8">
        <h1 className="text-4xl font-mono font-bold tracking-tight">Investment Plans</h1>
        <p className="text-muted-foreground text-lg">
          Secure, automated crypto trading strategies tailored to your risk profile.
        </p>
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
                  <span className="text-foreground font-mono">{formatCurrency(plan.maxAmount)}</span>
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
            <DialogTitle>Complete Investment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Investment Amount (USD)</Label>
              <Input 
                id="amount" 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
                min={activePlans.find(p => p.id === selectedPlan)?.minAmount}
                max={activePlans.find(p => p.id === selectedPlan)?.maxAmount}
              />
              <p className="text-xs text-muted-foreground">
                Min: {formatCurrency(activePlans.find(p => p.id === selectedPlan)?.minAmount || 0)} 
                &nbsp;|&nbsp; 
                Max: {formatCurrency(activePlans.find(p => p.id === selectedPlan)?.maxAmount || 0)}
              </p>
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