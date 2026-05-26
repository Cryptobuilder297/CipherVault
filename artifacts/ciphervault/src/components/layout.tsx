import { Link, useLocation } from "wouter";
import { LayoutDashboard, Wallet, LineChart, History, Star, ArrowDownCircle, ArrowUpCircle, TrendingUp, PiggyBank, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClerk, useUser, Show } from "@clerk/react";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Portfolio", href: "/portfolio", icon: Wallet },
  { name: "Market", href: "/market", icon: LineChart },
  { name: "Transactions", href: "/transactions", icon: History },
  { name: "Watchlist", href: "/watchlist", icon: Star },
  { name: "Deposit", href: "/deposits", icon: ArrowDownCircle },
  { name: "Withdraw", href: "/withdrawals", icon: ArrowUpCircle },
  { name: "Invest", href: "/plans", icon: TrendingUp },
  { name: "My Investments", href: "/investments", icon: PiggyBank },
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
      <div className="w-64 border-r border-border bg-card/50 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="font-bold text-xl tracking-tight text-primary font-mono uppercase flex items-center gap-2">
            <img src={`${basePath}/logo.svg`} alt="Logo" className="w-6 h-6" />
            CipherVault
          </div>
        </div>
        <div className="flex-1 py-6 flex flex-col gap-1 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer group",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Balance widget at bottom of sidebar */}
        {isSignedIn && dbUser && (
          <div className="p-4 border-t border-border">
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-1">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Vault Balance</p>
              <p className="text-xl font-bold font-mono text-primary">{formatCurrency(dbUser.balance)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 md:px-8 bg-background/95 backdrop-blur z-10 sticky top-0">
          <div className="font-mono text-sm text-muted-foreground hidden md:block">
            {new Date().toISOString().split('T')[0]} // SYS_ONLINE
          </div>
          <div className="flex items-center gap-4">
            <Show when="signed-in">
              {/* Mobile balance display */}
              {dbUser && (
                <span className="text-sm font-mono text-primary font-medium md:hidden">
                  {formatCurrency(dbUser.balance)}
                </span>
              )}
              <span className="text-sm text-muted-foreground hidden md:block">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
              <Button variant="outline" size="sm" onClick={() => signOut({ redirectUrl: basePath || "/" })}>
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
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
