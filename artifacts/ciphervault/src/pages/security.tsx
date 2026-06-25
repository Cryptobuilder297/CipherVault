import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, Key, Database, Server, CheckCircle, AlertTriangle, ArrowRight, FileText } from "lucide-react";

const securityLayers = [
  { icon: Lock, title: "256-bit AES Encryption", desc: "All data at rest is encrypted using AES-256, the same standard used by the US military and global financial institutions." },
  { icon: Shield, title: "TLS 1.3 in Transit", desc: "Every API call and data exchange uses Transport Layer Security 1.3. Certificate pinning prevents man-in-the-middle attacks." },
  { icon: Key, title: "Multi-Factor Authentication", desc: "TOTP-based 2FA is available for all accounts. Admin operations require hardware security keys for additional protection." },
  { icon: Database, title: "Cold Storage (95%)", desc: "95% of digital assets are held in air-gapped cold wallets, completely disconnected from the internet at all times." },
  { icon: Server, title: "Redundant Infrastructure", desc: "Multi-region deployment with automatic failover. Zero single points of failure, 99.9% uptime SLA guaranteed." },
  { icon: Eye, title: "24/7 Security Monitoring", desc: "Real-time threat detection with automated incident response. Our security team monitors all activity around the clock." },
];

const kycLevels = [
  {
    level: "Basic",
    requirements: ["Valid email address", "Phone number verification", "Username setup"],
    allows: ["View market data", "Browse investment plans"],
  },
  {
    level: "Verified",
    requirements: ["Government-issued ID", "Proof of address", "Selfie verification"],
    allows: ["Deposit funds", "Make investments", "Withdraw up to $10,000/day"],
  },
  {
    level: "Premium",
    requirements: ["Enhanced due diligence", "Source of funds declaration", "Video verification call"],
    allows: ["Elite plan access", "Unlimited withdrawals", "Priority support"],
  },
];

const compliance = [
  { icon: FileText, title: "AML Compliance", desc: "Full Anti-Money Laundering screening on all deposits and withdrawals." },
  { icon: Eye, title: "KYC/CDD", desc: "Customer Due Diligence following FATF guidelines for all verified accounts." },
  { icon: Shield, title: "GDPR Compliant", desc: "Full compliance with EU General Data Protection Regulation for all EU users." },
  { icon: AlertTriangle, title: "Sanctions Screening", desc: "All users are screened against OFAC, UN, and EU sanctions lists." },
];

export default function SecurityPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-24 border-b border-border grid-bg">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <p className="text-[12px] uppercase tracking-widest text-muted-foreground mb-5">Security & Compliance</p>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 text-white tracking-tight">
            Your assets, fortified
          </h1>
          <p className="text-[16px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Security is not a feature at CipherVault — it's the foundation. Every line of code, every process, and every policy is built with protection first.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-[13px] text-muted-foreground">
            {["Zero Security Breaches", "Quarterly Pen Tests", "SOC 2 Compliant", "ISO 27001 Certified"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-foreground/40" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Layers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-3">Multi-Layer Security</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-[15px]">Six independent security layers protect your assets at every level.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityLayers.map((layer) => (
              <div key={layer.title} className="p-6 rounded-xl border border-border bg-card hover:border-white/15 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-border flex items-center justify-center mb-4">
                  <layer.icon className="w-5 h-5 text-foreground/60" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-[15px]">{layer.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KYC */}
      <section className="py-20 bg-card/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-3">KYC Verification Tiers</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-[15px]">A risk-based approach to KYC. Higher verification unlocks more features.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kycLevels.map((level) => (
              <div key={level.level} className="p-6 rounded-xl border border-border bg-card">
                <div className="mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-white/8 text-white text-[12px] font-semibold">{level.level}</span>
                </div>
                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Requirements</p>
                  <ul className="space-y-1.5">
                    {level.requirements.map((r) => (
                      <li key={r} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Unlocks</p>
                  <ul className="space-y-1.5">
                    {level.allows.map((a) => (
                      <li key={a} className="flex items-center gap-2 text-[13px] text-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-foreground/40 flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-3">Regulatory Compliance</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-[15px]">We meet or exceed all regulatory requirements in our operating jurisdictions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {compliance.map((c) => (
              <div key={c.title} className="p-6 rounded-xl border border-border bg-card hover:border-white/15 transition-colors text-center">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-border flex items-center justify-center mx-auto mb-4">
                  <c.icon className="w-5 h-5 text-foreground/60" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-[15px]">{c.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclosure */}
      <section className="py-20 bg-card/20 border-t border-border">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <AlertTriangle className="w-10 h-10 text-foreground/30 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Responsible Disclosure</h2>
          <p className="text-muted-foreground text-[15px] mb-6">
            Found a security vulnerability? Contact our security team at{" "}
            <span className="text-foreground font-medium">security@ciphervault.io</span>. Responsible disclosures are rewarded with a bounty of up to $10,000.
          </p>
          <Link href="/contact">
            <Button variant="outline" className="gap-2 text-[13px]">
              Report a Vulnerability <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
