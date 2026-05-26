import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListHoldings, getListHoldingsQueryKey, useCreateHolding, useUpdateHolding, useDeleteHolding } from "@workspace/api-client-react";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const holdingSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").toUpperCase(),
  name: z.string().min(1, "Name is required"),
  quantity: z.coerce.number().min(0, "Quantity must be positive"),
  avgBuyPrice: z.coerce.number().min(0, "Average price must be positive"),
});

type HoldingFormValues = z.infer<typeof holdingSchema>;

export default function Portfolio() {
  const { data: holdings, isLoading } = useListHoldings();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createHolding = useCreateHolding();
  const updateHolding = useUpdateHolding();
  const deleteHolding = useDeleteHolding();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingHoldingId, setEditingHoldingId] = useState<number | null>(null);

  const form = useForm<HoldingFormValues>({
    resolver: zodResolver(holdingSchema),
    defaultValues: { symbol: "", name: "", quantity: 0, avgBuyPrice: 0 },
  });

  const onSubmit = (data: HoldingFormValues) => {
    if (editingHoldingId !== null) {
      updateHolding.mutate(
        { id: editingHoldingId, data: { quantity: data.quantity, avgBuyPrice: data.avgBuyPrice } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListHoldingsQueryKey() });
            toast({ title: "Holding updated" });
            setIsAddOpen(false);
            setEditingHoldingId(null);
            form.reset();
          },
        }
      );
    } else {
      createHolding.mutate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListHoldingsQueryKey() });
            toast({ title: "Holding added" });
            setIsAddOpen(false);
            form.reset();
          },
        }
      );
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this holding?")) {
      deleteHolding.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListHoldingsQueryKey() });
          toast({ title: "Holding deleted" });
        }
      });
    }
  };

  const openEdit = (holding: any) => {
    setEditingHoldingId(holding.id);
    form.reset({
      symbol: holding.symbol,
      name: holding.name,
      quantity: holding.quantity,
      avgBuyPrice: holding.avgBuyPrice,
    });
    setIsAddOpen(true);
  };

  const openAdd = () => {
    setEditingHoldingId(null);
    form.reset({ symbol: "", name: "", quantity: 0, avgBuyPrice: 0 });
    setIsAddOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="w-4 h-4 mr-2" /> Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingHoldingId ? "Edit Asset" : "Add Asset"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symbol</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={editingHoldingId !== null} placeholder="BTC" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={editingHoldingId !== null} placeholder="Bitcoin" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="avgBuyPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avg Buy Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createHolding.isPending || updateHolding.isPending}>
                  {editingHoldingId ? "Save Changes" : "Add Asset"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/50 border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : holdings?.length ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Gain/Loss</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.map((holding) => (
                  <TableRow key={holding.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8 rounded-sm bg-background border border-border">
                          <AvatarImage src={holding.logoUrl} alt={holding.name} />
                          <AvatarFallback className="rounded-sm bg-muted text-xs font-mono">{holding.symbol.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold">{holding.name}</div>
                          <div className="text-xs text-muted-foreground">{holding.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <div>{formatNumber(holding.quantity)}</div>
                      <div className="text-xs text-muted-foreground">Avg: {formatCurrency(holding.avgBuyPrice)}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(holding.currentPrice)}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{formatCurrency(holding.currentValue)}</TableCell>
                    <TableCell className={`text-right font-mono ${holding.gainLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                      <div>{holding.gainLoss >= 0 ? '+' : ''}{formatCurrency(holding.gainLoss)}</div>
                      <div className="text-xs opacity-80">{holding.gainLossPercent >= 0 ? '+' : ''}{formatPercent(holding.gainLossPercent)}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(holding)}>
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(holding.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Your portfolio is empty. Add an asset to start tracking.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
