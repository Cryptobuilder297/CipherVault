import { Link } from "wouter";
import { Shield, Zap, Globe, Mail } from "lucide-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={`${basePath}/logo.svg`} alt="CipherVault" className="w-6 h-6" />
              <span className="font-bold text-[15px] text-foreground tracking-tight">CipherVault</span>
            </div>
            <p className="text-muted-foreground text-[13px] leading-relaxed mb-5">
              Institutional-grade crypto investment infrastructure for every investor.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-[12px] uppercase tracking-widest text-muted-foreground">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Investment Plans", href: "/plans" },
                { label: "Deposit Funds", href: "/deposits" },
                { label: "Withdrawals", href: "/withdrawals" },
                { label: "Market Data", href: "/market" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="text-muted-foreground hover:text-foreground text-[13px] transition-colors cursor-pointer">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[12px] uppercase tracking-widest text-muted-foreground">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "How It Works", href: "/how-it-works" },
                { label: "Security & KYC", href: "/security" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="text-muted-foreground hover:text-foreground text-[13px] transition-colors cursor-pointer">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[12px] uppercase tracking-widest text-muted-foreground">Security</h4>
            <div className="space-y-2.5">
              {[
                { icon: Shield, text: "256-bit SSL Encryption" },
                { icon: Zap, text: "99.9% Uptime SLA" },
                { icon: Globe, text: "Globally Distributed" },
                { icon: Mail, text: "support@ciphervault.io" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-[12px]">
            © {new Date().getFullYear()} CipherVault. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-[12px] text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Risk Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
