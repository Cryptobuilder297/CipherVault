import { Shield, TrendingUp, Users, Globe, Award, Target } from "lucide-react";

const team = [
  { name: "Alex Chen", role: "CEO & Co-Founder", avatar: "AC", bio: "Former Goldman Sachs VP with 15 years in institutional crypto trading." },
  { name: "Priya Patel", role: "CTO & Co-Founder", avatar: "PP", bio: "Ex-Coinbase lead engineer. Architect of CipherVault's security infrastructure." },
  { name: "Daniel Osei", role: "Chief Investment Officer", avatar: "DO", bio: "PhD in Financial Mathematics. Designed our yield algorithm with 99.7% prediction accuracy." },
  { name: "Leila Moradi", role: "Head of Compliance", avatar: "LM", bio: "Former SEC regulator ensuring every transaction meets global compliance standards." },
];

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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
            About CipherVault
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
            Built by investors,{" "}
            <span className="gradient-text">for investors</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            CipherVault was born from a simple frustration: why should institutional-grade crypto investment tools only be available to the ultra-wealthy? We built the platform we wished existed.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
                Our Mission
              </div>
              <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
                Democratizing crypto wealth creation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We believe every investor deserves access to institutional-grade crypto yield strategies, regardless of portfolio size. CipherVault bridges the gap between complex DeFi protocols and accessible, transparent investing.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our platform combines sophisticated algorithmic yield farming, human oversight, and enterprise security — wrapped in an interface that's intuitive for both crypto natives and traditional investors.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, label: "Regulated", value: "Compliant" },
                { icon: Shield, label: "Security", value: "256-bit" },
                { icon: Users, label: "Investors", value: "10,000+" },
                { icon: Target, label: "Return Rate", value: "Up to 40%" },
              ].map((item) => (
                <div key={item.label} className="p-6 rounded-2xl border border-border bg-card/50 text-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold font-mono gradient-text">{item.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Our Core Values</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">The principles that guide every decision at CipherVault.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/30 transition-colors text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Meet the Team</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A world-class team of finance veterans, engineers, and compliance experts.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xl font-mono mb-4">
                  {member.avatar}
                </div>
                <h3 className="font-bold mb-0.5">{member.name}</h3>
                <p className="text-sm text-primary mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-card/20 border-y border-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Our Journey</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {milestones.map((m) => (
                <div key={m.year} className="relative pl-20">
                  <div className="absolute left-4 top-1.5 w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div className="text-xs text-primary font-mono font-bold mb-0.5">{m.year}</div>
                  <h3 className="font-bold mb-1">{m.event}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
