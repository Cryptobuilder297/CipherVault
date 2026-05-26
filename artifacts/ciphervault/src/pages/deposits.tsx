import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import { useListDeposits, useCreateDeposit, getListDepositsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function Deposits() {
  const { data: deposits, isLoading } = useListDeposits();
  const createDeposit = useCreateDeposit();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDeposit.mutate({ data: { amount: Number(amount), method } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDepositsQueryKey() });
        setOpen(false);
        setAmount("");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-mono font-bold tracking-tight">Deposits</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>New Deposit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Deposit</DialogTitle>
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
                    <SelectItem value="card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={createDeposit.isPending}>
                {createDeposit.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : deposits?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No deposits found
                </TableCell>
              </TableRow>
            ) : (
              deposits?.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell className="font-mono text-sm">
                    {new Date(deposit.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-mono font-medium">{formatCurrency(deposit.amount)}</TableCell>
                  <TableCell className="capitalize">{deposit.method.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      deposit.status === 'approved' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' :
                      deposit.status === 'rejected' ? 'text-red-400 border-red-400/20 bg-red-400/10' :
                      'text-amber-400 border-amber-400/20 bg-amber-400/10'
                    }>
                      {deposit.status}
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