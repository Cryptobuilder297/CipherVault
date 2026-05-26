import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListWatchlist, getListWatchlistQueryKey, useAddToWatchlist, useRemoveFromWatchlist, useGetMarketCoin } from "@workspace/api-client-react";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const watchlistSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").toUpperCase(),
  name: z.string().min(1, "Name is required"),
});

type WatchlistFormValues = z.infer<typeof watchlistSchema>;

// Component for fetching and displaying market data for a watchlist item
function WatchlistRow({ item, onRemove }: { item: any; onRemove: (id: number) => void }) {
  const { data: marketData, isLoading } = useGetMarketCoin(item.symbol, {
    query: { enabled: !!item.symbol, queryKey: ['market-coin', item.symbol], retry: false }
  });

  return (
    <TableRow className="border-border/50">
      <TableCell>
        <div className="font-bold">{item.name}</div>
        <div className="text-xs text-muted-foreground">{item.symbol}</div>
      </TableCell>
      <TableCell className="text-right font-mono">
        {isLoading ? <Skeleton className="h-5 w-16 ml-auto" /> : marketData ? formatCurrency(marketData.currentPrice) : '-'}
      </TableCell>
      <TableCell className={`text-right font-mono ${marketData?.priceChangePercent24h ? (marketData.priceChangePercent24h >= 0 ? 'text-success' : 'text-destructive') : ''}`}>
        {isLoading ? <Skeleton className="h-5 w-16 ml-auto" /> : marketData ? `${marketData.priceChangePercent24h >= 0 ? '+' : ''}${formatPercent(marketData.priceChangePercent24h)}` : '-'}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function Watchlist() {
  const { data: watchlist, isLoading } = useListWatchlist();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const addWatchlist = useAddToWatchlist();
  const removeWatchlist = useRemoveFromWatchlist();

  const [isAddOpen, setIsAddOpen] = useState(false);

  const form = useForm<WatchlistFormValues>({
    resolver: zodResolver(watchlistSchema),
    defaultValues: { symbol: "", name: "" },
  });

  const onSubmit = (data: WatchlistFormValues) => {
    addWatchlist.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListWatchlistQueryKey() });
          toast({ title: "Added to watchlist" });
          setIsAddOpen(false);
          form.reset();
        },
      }
    );
  };

  const handleRemove = (id: number) => {
    removeWatchlist.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListWatchlistQueryKey() });
        toast({ title: "Removed from watchlist" });
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Watchlist</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add to Watchlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Watchlist</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symbol</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ETH" />
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
                        <Input {...field} placeholder="Ethereum" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={addWatchlist.isPending}>
                  Add Asset
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
          ) : watchlist?.length ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchlist.map((item) => (
                  <WatchlistRow key={item.id} item={item} onRemove={handleRemove} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Your watchlist is empty.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
