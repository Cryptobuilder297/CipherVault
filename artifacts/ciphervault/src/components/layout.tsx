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
import { Footer } from "./footer";

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
      <div className="w-64 border-r border-border bg-sidebar flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/">
            <div className="font-bold text-xl tracking-tight text-primary flex items-center gap-2 cursor-pointer" style={{ fontFamily: "'Syne', sans-serif" }}>
              <img src={`${basePath}/logo.svg`} alt="Logo" className="w-6 h-6" />
              CipherVault
            </div>
          </Link>
        </div>

        <div className="flex-1 py-4 flex flex-col gap-0.5 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer group text-sm",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold border border-primary/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 flex-shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {item.name}
                  {item.name === "Referral" && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">$50</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Balance widget */}
        {isSignedIn && dbUser && (
          <div className="p-4 border-t border-border">
            <div className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Vault Balance</p>
              <p className="text-2xl font-bold font-mono text-primary">{formatCurrency(dbUser.balance)}</p>
              <p className="text-xs text-muted-foreground mt-1">Available to invest</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 md:px-8 bg-background/95 backdrop-blur-xl z-10 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Mobile logo */}
            <Link href="/">
              <div className="font-bold text-base text-primary flex items-center gap-2 md:hidden cursor-pointer" style={{ fontFamily: "'Syne', sans-serif" }}>
                <img src={`${basePath}/logo.svg`} alt="Logo" className="w-5 h-5" />
                CipherVault
              </div>
            </Link>
            <div className="font-mono text-xs text-muted-foreground hidden md:block">
              {new Date().toISOString().split('T')[0]} · SECURE
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Show when="signed-in">
              {dbUser && (
                <span className="text-sm font-mono text-primary font-semibold md:hidden">
                  {formatCurrency(dbUser.balance)}
                </span>
              )}
              <span className="text-sm text-muted-foreground hidden md:block">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ redirectUrl: basePath || "/" })}
                className="text-xs"
              >
                Sign Out
              </Button>
            </Show>
            <Show when="signed-out">
              <Link href="/sign-in">
                <Button size="sm">Sign In</Button>
              </Link>
            </Show>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
