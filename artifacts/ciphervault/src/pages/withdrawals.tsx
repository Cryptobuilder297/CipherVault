import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import { useListWithdrawals, useCreateWithdrawal, getListWithdrawalsQueryKey, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowUpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Withdrawals() {
  const { data: withdrawals, isLoading } = useListWithdrawals();
  const { data: me } = useGetMe();
  const createWithdrawal = useCreateWithdrawal();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");
  const [address, setAddress] = useState("");

  const balance = me?.balance ?? 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    if (amt > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${formatCurrency(balance)} available.`,
        variant: "destructive",
      });
      return;
    }
    createWithdrawal.mutate({ data: { amount: amt, method, address } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListWithdrawalsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        setOpen(false);
        setAmount("");
        setAddress("");
        toast({
          title: "Withdrawal Requested",
          description: `Your withdrawal of ${formatCurrency(amt)} is pending admin approval.`,
        });
      },
      onError: (err: any) => {
        toast({
          title: "Withdrawal Failed",
          description: err?.message ?? "Something went wrong. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold tracking-tight">Withdrawals</h1>
          {me && (
            <p className="text-muted-foreground mt-1 text-sm">
              Available balance: <span className="text-primary font-mono font-medium">{formatCurrency(balance)}</span>
            </p>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              New Withdrawal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Withdrawal</DialogTitle>
            </DialogHeader>
            {me && (
              <div className="rounded-md bg-muted px-3 py-2 text-sm">
                Available: <span className="text-primary font-mono font-medium">{formatCurrency(balance)}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="1"
                  max={balance}
                  placeholder="e.g. 500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Destination (Account / Wallet Address)</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Your bank account or wallet address"
                />
              </div>
              <p className="text-xs text-muted-foreground rounded-md bg-muted px-3 py-2">
                Funds are held pending admin approval. If rejected, your balance will be refunded.
              </p>
              <Button type="submit" className="w-full" disabled={createWithdrawal.isPending || !balance}>
                {createWithdrawal.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Request
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-border rounded-xl bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : !withdrawals?.length ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No withdrawals yet.
                </TableCell>
              </TableRow>
            ) : (
              withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell className="font-mono text-sm">
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-mono font-medium">{formatCurrency(withdrawal.amount)}</TableCell>
                  <TableCell className="capitalize">{withdrawal.method.replace(/_/g, ' ')}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground max-w-[150px] truncate" title={withdrawal.address}>
                    {withdrawal.address}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      withdrawal.status === 'approved' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' :
                      withdrawal.status === 'rejected' ? 'text-red-400 border-red-400/20 bg-red-400/10' :
                      'text-amber-400 border-amber-400/20 bg-amber-400/10'
                    }>
                      {withdrawal.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
