import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Wallet, LineChart, History, Star,
  ArrowDownCircle, ArrowUpCircle, TrendingUp, PiggyBank, ShieldCheck, Gift
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useClerk, useUser, Show } from "@clerk/react";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Portfolio", href: "/portfolio", icon: Wallet },
  { name: "Market", href: "/market", icon: LineChart },
  { name: "Transactions", href: "/transactions", icon: History },
  { name: "Watchlist", href: "/watchlist", icon: Star },
  { name: "Deposit", href: "/deposits", icon: ArrowDownCircle },
  { name: "Withdraw", href: "/withdrawals", icon: ArrowUpCircle },
  { name: "Invest", href: "/plans", icon: TrendingUp },
  { name: "My Investments", href: "/investments", icon: PiggyBank },
  { name: "Referral", href: "/referral", icon: Gift },
];

const adminNavItem = { name: "Admin", href: "/admin", icon: ShieldCheck };

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();
  const { data: dbUser } = useGetMe();

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const navItems = dbUser?.role === "admin" ? [...navigation, adminNavItem] : navigation;

  return (
    <div className="flex h-screen bg-background dark text-foreground">
      {/* Sidebar */}
      <div className="w-60 border-r border-border bg-sidebar flex-col hidden md:flex">
        <div className="h-14 flex items-center px-5 border-b border-border">
          <Link href="/">
            <div className="font-bold text-[15px] text-white tracking-tight flex items-center gap-2 cursor-pointer">
              <img src={`${basePath}/logo.svg`} alt="Logo" className="w-5 h-5" />
              CipherVault
            </div>
          </Link>
        </div>

        <div className="flex-1 py-3 flex flex-col gap-0.5 px-2.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer group text-[13px]",
                  isActive
                    ? "bg-white/8 text-white font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/4"
                )}>
                  <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
                  {item.name}
                  {item.name === "Referral" && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-foreground/60 font-medium">$50</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Balance widget */}
        {isSignedIn && dbUser && (
          <div className="p-3 border-t border-border">
            <div className="rounded-lg border border-border bg-white/4 p-4">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Vault Balance</p>
              <p className="text-2xl font-bold text-white tabular-nums">{formatCurrency(dbUser.balance)}</p>
              <p className="text-[11px] text-muted-foreground mt-1">Available to invest</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-5 md:px-7 bg-background/95 backdrop-blur-xl z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="font-bold text-[14px] text-white flex items-center gap-1.5 md:hidden cursor-pointer">
                <img src={`${basePath}/logo.svg`} alt="Logo" className="w-4.5 h-4.5" />
                CipherVault
              </div>
            </Link>
            <div className="text-[11px] text-muted-foreground hidden md:block tabular-nums">
              {new Date().toISOString().split('T')[0]}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Show when="signed-in">
              {dbUser && (
                <span className="text-[13px] font-bold text-white tabular-nums md:hidden">
                  {formatCurrency(dbUser.balance)}
                </span>
              )}
              <span className="text-[12px] text-muted-foreground hidden md:block">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ redirectUrl: basePath || "/" })}
                className="text-[12px] h-8"
              >
                Sign Out
              </Button>
            </Show>
            <Show when="signed-out">
              <Link href="/sign-in">
                <Button size="sm" className="text-[12px] h-8">Sign In</Button>
              </Link>
            </Show>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-5 md:p-7">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
