import { Link, useLocation } from "wouter";
import { LayoutDashboard, Wallet, LineChart, History, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Portfolio", href: "/portfolio", icon: Wallet },
  { name: "Market", href: "/market", icon: LineChart },
  { name: "Transactions", href: "/transactions", icon: History },
  { name: "Watchlist", href: "/watchlist", icon: Star },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen bg-background dark text-foreground">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card/50 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="font-bold text-xl tracking-tight text-primary font-mono uppercase">
            CipherVault
          </div>
        </div>
        <div className="flex-1 py-6 flex flex-col gap-1 px-3">
          {navigation.map((item) => {
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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-6 md:px-8 bg-background/95 backdrop-blur z-10 sticky top-0">
          <div className="font-mono text-sm text-muted-foreground">
            {new Date().toISOString().split('T')[0]} // SYS_ONLINE
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
