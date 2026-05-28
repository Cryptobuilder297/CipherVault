import { Link, useLocation } from "wouter";
import { useUser, Show } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Footer } from "./footer";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Plans", href: "/plans" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isSignedIn } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground dark flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <img src={`${basePath}/logo.svg`} alt="CipherVault" className="w-7 h-7" />
              <span className="font-bold text-lg text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>
                CipherVault
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                  location === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Show when="signed-in">
              <Link href="/dashboard">
                <Button size="sm" variant="outline">Dashboard</Button>
              </Link>
            </Show>
            <Show when="signed-out">
              <Link href="/sign-in">
                <Button size="sm" variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </Show>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  className={cn(
                    "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    location === link.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </div>
              </Link>
            ))}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {isSignedIn ? (
                <Link href="/dashboard"><Button className="w-full" size="sm">Dashboard</Button></Link>
              ) : (
                <>
                  <Link href="/sign-in"><Button variant="outline" className="w-full" size="sm">Sign In</Button></Link>
                  <Link href="/sign-up"><Button className="w-full" size="sm">Get Started</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
