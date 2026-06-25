import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { useGetInvestmentGrowth } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

interface TooltipPayload {
  value: number;
  name: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const total = payload.find(p => p.name === "totalValue" || p.name === "projectedTotal");
  const cash = payload.find(p => p.name === "cashBalance");
  const invested = payload.find(p => p.name === "investedValue");

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg text-sm space-y-1.5">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {total && (
        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">Total</span>
          <span className="font-mono font-bold text-foreground">{formatCurrency(total.value)}</span>
        </div>
      )}
      {invested && invested.value > 0 && (
        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">Invested</span>
          <span className="font-mono text-amber-400">{formatCurrency(invested.value)}</span>
        </div>
      )}
      {cash && (
        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">Cash</span>
          <span className="font-mono text-emerald-400">{formatCurrency(cash.value)}</span>
        </div>
      )}
    </div>
  );
}

function formatXAxis(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatYAxis(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value.toFixed(0)}`;
}

interface ChartPoint {
  date: string;
  totalValue?: number;
  projectedTotal?: number;
  cashBalance: number;
  investedValue: number;
}

export default function PortfolioGrowthChart() {
  const { data: rawData, isLoading } = useGetInvestmentGrowth();

  if (isLoading) {
    return (
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Portfolio Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!rawData || rawData.length === 0) {
    return (
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Portfolio Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-sm gap-2">
            <TrendingUp className="h-10 w-10 opacity-20" />
            <p>Make your first investment to see portfolio growth</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const firstFutureIndex = rawData.findIndex(p => p.isFuture);
  const hasFuture = firstFutureIndex !== -1;

  const currentTotal = hasFuture
    ? rawData[firstFutureIndex - 1]?.totalValue ?? rawData[rawData.length - 1]?.totalValue ?? 0
    : rawData[rawData.length - 1]?.totalValue ?? 0;
  const lastTotal = rawData[rawData.length - 1]?.totalValue ?? 0;
  const growthPct = currentTotal > 0 ? ((lastTotal - currentTotal) / currentTotal) * 100 : 0;

  const todayRefDate = hasFuture ? rawData[firstFutureIndex - 1]?.date : undefined;
  const bridgeDate = hasFuture && firstFutureIndex > 0 ? rawData[firstFutureIndex - 1]?.date : undefined;

  const chartData: ChartPoint[] = rawData.map((p, i) => {
    const isBridge = hasFuture && i === firstFutureIndex - 1;
    return {
      date: p.date,
      totalValue: !p.isFuture || isBridge ? p.totalValue : undefined,
      projectedTotal: p.isFuture || isBridge ? p.totalValue : undefined,
      cashBalance: p.cashBalance,
      investedValue: p.investedValue,
    };
  });

  const tickInterval = Math.max(1, Math.floor(chartData.length / 6));

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Portfolio Growth
          </CardTitle>
          {hasFuture && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Projected gain</p>
              <p className={`text-sm font-mono font-bold ${growthPct >= 0 ? "text-emerald-400" : "text-destructive"}`}>
                {growthPct >= 0 ? "+" : ""}{growthPct.toFixed(1)}%
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 bg-white/85 rounded" />
            Total Value
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 bg-amber-400/70 rounded" />
            Invested
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 bg-emerald-400/70 rounded" />
            Cash
          </span>
          {hasFuture && (
            <span className="flex items-center gap-1.5 text-white/40">
              <span className="inline-block" style={{ borderTop: "2px dashed rgba(255,255,255,0.4)", width: 16 }} />
              Projected
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(255,255,255,0.15)" stopOpacity={1} />
                <stop offset="95%" stopColor="rgba(255,255,255,0)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(255,255,255,0.06)" stopOpacity={1} />
                <stop offset="95%" stopColor="rgba(255,255,255,0)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradInvested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(251,191,36,0.12)" stopOpacity={1} />
                <stop offset="95%" stopColor="rgba(251,191,36,0)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(52,211,153,0.10)" stopOpacity={1} />
                <stop offset="95%" stopColor="rgba(52,211,153,0)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={tickInterval}
            />

            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={54}
            />

            <Tooltip content={<CustomTooltip />} />

            {todayRefDate && bridgeDate && (
              <ReferenceLine
                x={bridgeDate}
                stroke="rgba(255,255,255,0.2)"
                strokeDasharray="4 3"
                label={{ value: "Today", fill: "rgba(255,255,255,0.35)", fontSize: 10, position: "insideTopRight" }}
              />
            )}

            <Area
              type="monotone"
              dataKey="cashBalance"
              name="cashBalance"
              stroke="rgba(52,211,153,0.7)"
              strokeWidth={1.5}
              fill="url(#gradCash)"
              dot={false}
              connectNulls={false}
            />

            <Area
              type="monotone"
              dataKey="investedValue"
              name="investedValue"
              stroke="rgba(251,191,36,0.7)"
              strokeWidth={1.5}
              fill="url(#gradInvested)"
              dot={false}
              connectNulls={false}
            />

            <Area
              type="monotone"
              dataKey="projectedTotal"
              name="projectedTotal"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={2}
              strokeDasharray="6 4"
              fill="url(#gradProjected)"
              dot={false}
              connectNulls={false}
            />

            <Area
              type="monotone"
              dataKey="totalValue"
              name="totalValue"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth={2}
              fill="url(#gradTotal)"
              dot={false}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
