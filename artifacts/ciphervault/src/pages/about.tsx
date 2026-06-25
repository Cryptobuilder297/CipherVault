import { Shield, TrendingUp, Users, Globe, Award, Target } from "lucide-react";

const values = [
  { icon: Shield, title: "Security First", desc: "We never compromise on the safety of our clients' assets. Every decision starts with security." },
  { icon: TrendingUp, title: "Consistent Returns", desc: "Sustainable, predictable yields backed by diversified crypto strategies." },
  { icon: Users, title: "Client Centric", desc: "Your success is our success. We build every feature based on client feedback." },
  { icon: Globe, title: "Global Reach", desc: "Serving investors in 40+ countries with local expertise and global infrastructure." },
];

const milestones = [
  { year: "2020", event: "CipherVault founded", desc: "Launched with 50 beta investors and $100K in AUM." },
  { year: "2021", event: "Series A Funding", desc: "Raised $5M to build enterprise-grade infrastructure." },
  { year: "2022", event: "1,000 Active Users", desc: "Reached $5M AUM milestone and launched Premium plans." },
  { year: "2023", event: "10,000 Investors", desc: "Crossed $50M AUM with 99.9% SLA and global compliance." },
  { year: "2024", event: "Elite Tier Launch", desc: "Introduced 40% yield Elite plans for high-net-worth clients." },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-24 border-b border-border grid-bg">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <p className="text-[12px] uppercase tracking-widest text-muted-foreground mb-5">About CipherVault</p>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
            Built by investors,{" "}
            <br className="hidden md:block" />for investors
          </h1>
          <p className="text-[16px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            CipherVault was born from a simple frustration: why should institutional-grade crypto investment tools only be available to the ultra-wealthy? We built the platform we wished existed.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[12px] uppercase tracking-widest text-muted-foreground mb-5">Our Mission</p>
              <h2 className="text-4xl font-bold mb-6 text-white tracking-tight">
                Democratizing crypto wealth creation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5 text-[15px]">
                We believe every investor deserves access to institutional-grade crypto yield strategies, regardless of portfolio size. CipherVault bridges the gap between complex DeFi protocols and accessible, transparent investing.
              </p>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                Our platform combines sophisticated algorithmic yield farming, human oversight, and enterprise security — wrapped in an interface that's intuitive for both crypto natives and traditional investors.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, label: "Regulated", value: "Compliant" },
                { icon: Shield, label: "Security", value: "256-bit" },
                { icon: Users, label: "Investors", value: "10,000+" },
                { icon: Target, label: "Max Return", value: "40%" },
              ].map((item) => (
                <div key={item.label} className="p-6 rounded-xl border border-border bg-card text-center">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-border flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-4.5 h-4.5 text-foreground/60" />
                  </div>
                  <div className="text-2xl font-bold text-white tabular-nums">{item.value}</div>
                  <div className="text-[12px] text-muted-foreground mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founding Team */}
      <section className="py-20 bg-card/20 border-y border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[12px] uppercase tracking-widest text-muted-foreground mb-5">Our Founding Team</p>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-6">Who built CipherVault</h2>
          <p className="text-[16px] text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            CipherVault was founded by a team of financial technology experts and crypto veterans committed to making institutional-grade investing accessible to everyone.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-3">Our Core Values</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-[15px]">The principles that guide every decision at CipherVault.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v) => (
              <div key={v.title} className="p-6 rounded-xl border border-border bg-card hover:border-white/15 transition-colors text-center">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-border flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-5 h-5 text-foreground/60" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-[15px]">{v.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-card/20 border-y border-border">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white tracking-tight">Our Journey</h2>
          </div>
          <div className="relative">
            <div className="absolute left-7 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {milestones.map((m) => (
                <div key={m.year} className="relative pl-16">
                  <div className="absolute left-4 top-1.5 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                  </div>
                  <div className="text-[11px] text-muted-foreground font-medium mb-0.5 tabular-nums">{m.year}</div>
                  <h3 className="font-semibold text-white mb-1 text-[15px]">{m.event}</h3>
                  <p className="text-[13px] text-muted-foreground">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
