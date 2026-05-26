import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import { useListWithdrawals, useCreateWithdrawal, getListWithdrawalsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function Withdrawals() {
  const { data: withdrawals, isLoading } = useListWithdrawals();
  const createWithdrawal = useCreateWithdrawal();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWithdrawal.mutate({ data: { amount: Number(amount), method, address } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListWithdrawalsQueryKey() });
        setOpen(false);
        setAmount("");
        setAddress("");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-mono font-bold tracking-tight">Withdrawals</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>New Withdrawal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Withdrawal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  required 
                  min="1"
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
                />
              </div>
              <Button type="submit" className="w-full" disabled={createWithdrawal.isPending}>
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
            ) : withdrawals?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No withdrawals found
                </TableCell>
              </TableRow>
            ) : (
              withdrawals?.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell className="font-mono text-sm">
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-mono font-medium">{formatCurrency(withdrawal.amount)}</TableCell>
                  <TableCell className="capitalize">{withdrawal.method.replace('_', ' ')}</TableCell>
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