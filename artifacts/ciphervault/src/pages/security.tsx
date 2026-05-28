import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, Key, Database, Server, CheckCircle, AlertTriangle, ArrowRight, FileText } from "lucide-react";

const securityLayers = [
  {
    icon: Lock,
    title: "256-bit AES Encryption",
    desc: "All data at rest is encrypted using AES-256, the same standard used by the US military and global financial institutions.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Shield,
    title: "TLS 1.3 in Transit",
    desc: "Every API call and data exchange uses Transport Layer Security 1.3. Certificate pinning prevents man-in-the-middle attacks.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: Key,
    title: "Multi-Factor Authentication",
    desc: "TOTP-based 2FA is available for all accounts. Admin operations require hardware security keys for additional protection.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Database,
    title: "Cold Storage (95%)",
    desc: "95% of digital assets are held in air-gapped cold wallets, completely disconnected from the internet at all times.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Server,
    title: "Redundant Infrastructure",
    desc: "Multi-region deployment with automatic failover. Zero single points of failure, 99.9% uptime SLA guaranteed.",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
  {
    icon: Eye,
    title: "24/7 Security Monitoring",
    desc: "Real-time threat detection with automated incident response. Our security team monitors all activity around the clock.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
];

const kycLevels = [
  {
    level: "Basic",
    requirements: ["Valid email address", "Phone number verification", "Username setup"],
    allows: ["View market data", "Browse investment plans"],
    badge: "bg-muted text-muted-foreground",
  },
  {
    level: "Verified",
    requirements: ["Government-issued ID", "Proof of address", "Selfie verification"],
    allows: ["Deposit funds", "Make investments", "Withdraw up to $10,000/day"],
    badge: "bg-primary/20 text-primary",
  },
  {
    level: "Premium",
    requirements: ["Enhanced due diligence", "Source of funds declaration", "Video verification call"],
    allows: ["Elite plan access", "Unlimited withdrawals", "Priority support", "Custom investment limits"],
    badge: "bg-amber-500/20 text-amber-400",
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
            Security & Compliance
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
            Your assets,{" "}
            <span className="gradient-text">fortified</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Security is not a feature at CipherVault — it's the foundation. Every line of code, every process, and every policy is built with protection first.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
            {["Zero Security Breaches", "Quarterly Pen Tests", "SOC 2 Compliant", "ISO 27001 Certified"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
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
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Multi-Layer Security Architecture</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Six independent security layers protect your assets at every level.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityLayers.map((layer) => (
              <div key={layer.title} className={`p-6 rounded-2xl border ${layer.bg} hover:scale-105 transition-transform duration-300`}>
                <div className="w-12 h-12 rounded-xl bg-background/50 border border-border flex items-center justify-center mb-4">
                  <layer.icon className={`w-6 h-6 ${layer.color}`} />
                </div>
                <h3 className="font-bold mb-2">{layer.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KYC Levels */}
      <section className="py-20 bg-card/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>KYC Verification Tiers</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">We follow a risk-based approach to KYC. Higher verification unlocks more features.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kycLevels.map((level) => (
              <div key={level.level} className="p-6 rounded-2xl border border-border bg-card/50">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${level.badge}`}>{level.level}</span>
                </div>
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Requirements</p>
                  <ul className="space-y-1.5">
                    {level.requirements.map((r) => (
                      <li key={r} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Unlocks</p>
                  <ul className="space-y-1.5">
                    {level.allows.map((a) => (
                      <li key={a} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
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
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Regulatory Compliance</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">We meet or exceed all regulatory requirements in our operating jurisdictions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {compliance.map((c) => (
              <div key={c.title} className="p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/30 transition-colors text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <c.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible Disclosure */}
      <section className="py-20 bg-card/20 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Responsible Disclosure</h2>
          <p className="text-muted-foreground mb-6">
            Found a security vulnerability? We take all reports seriously. Contact our security team at{" "}
            <span className="text-primary">security@ciphervault.io</span>. Responsible disclosures are rewarded with a bounty of up to $10,000.
          </p>
          <Link href="/contact">
            <Button variant="outline" className="gap-2">
              Report a Vulnerability <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
