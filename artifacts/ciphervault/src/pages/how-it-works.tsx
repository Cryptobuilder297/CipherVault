import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { UserPlus, CreditCard, TrendingUp, DollarSign, ArrowRight, CheckCircle, Clock, Shield } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create & Verify Your Account",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10 border-cyan-500/20",
    details: [
      "Sign up with just your email and password",
      "Complete our streamlined KYC verification (under 24 hours)",
      "Enable two-factor authentication for maximum security",
      "Your account is protected by 256-bit SSL encryption from day one",
    ],
    time: "2 min to sign up",
  },
  {
    number: "02",
    icon: CreditCard,
    title: "Fund Your Vault",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10 border-violet-500/20",
    details: [
      "Choose from bank transfer, cryptocurrency, or card payment",
      "Submit your deposit request with the desired amount",
      "Our team verifies and credits funds typically within 1–4 hours",
      "Track your deposit status in real-time on your dashboard",
    ],
    time: "Credited in 1-4 hours",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Choose an Investment Plan",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20",
    details: [
      "Browse our 4 tiered plans from Starter (8%) to Elite (40%)",
      "Select the plan that matches your budget and time horizon",
      "Your investment amount is locked for the plan duration",
      "Track live progress with our investment countdown dashboard",
    ],
    time: "Plans from 30–120 days",
  },
  {
    number: "04",
    icon: DollarSign,
    title: "Earn & Withdraw",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
    details: [
      "Returns are automatically credited at plan maturity",
      "Full principal plus earnings land in your vault balance",
      "Request withdrawals anytime — processed within 24 hours",
      "Reinvest or withdraw — the choice is always yours",
    ],
    time: "Withdraw in 24 hours",
  },
];

const plans = [
  { name: "Starter", return: "8%", duration: "30 days", min: "$100", max: "$999", desc: "Perfect for first-time crypto investors." },
  { name: "Growth", return: "15%", duration: "60 days", min: "$500", max: "$4,999", desc: "Ideal for building consistent returns." },
  { name: "Premium", return: "25%", duration: "90 days", min: "$2,000", max: "$49,999", desc: "Our most popular high-yield plan.", popular: true },
  { name: "Elite", return: "40%", duration: "120 days", min: "$10,000", max: "No limit", desc: "For serious investors seeking maximum returns." },
];

export default function HowItWorksPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-24 border-b border-border grid-bg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-violet-600/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
            Simple & Transparent
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
            How <span className="gradient-text">CipherVault</span> works
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From sign-up to returns in four clear steps. No confusing jargon, no hidden processes — just transparent, reliable investing.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-20">
            {steps.map((step, i) => (
              <div key={step.number} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="text-8xl font-black font-mono text-primary/10 mb-4">{step.number}</div>
                  <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>{step.title}</h2>
                  <ul className="space-y-3 mb-6">
                    {step.details.map((d) => (
                      <li key={d} className="flex items-start gap-3 text-muted-foreground">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    {step.time}
                  </div>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div className={`rounded-2xl border p-10 ${step.bgColor} flex items-center justify-center`}>
                    <step.icon className={`w-24 h-24 ${step.color} opacity-60`} strokeWidth={1} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section className="py-20 bg-card/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Investment Plan Details</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">All returns are fixed-rate and credited automatically at plan maturity.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {["Plan", "Return Rate", "Duration", "Min Investment", "Max Investment", "Notes"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-sm font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, i) => (
                  <tr key={plan.name} className={`border-b last:border-0 border-border hover:bg-muted/20 transition-colors ${plan.popular ? "bg-primary/5" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{plan.name}</span>
                        {plan.popular && <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">Popular</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-primary">{plan.return}</td>
                    <td className="px-5 py-4 text-muted-foreground">{plan.duration}</td>
                    <td className="px-5 py-4 font-mono">{plan.min}</td>
                    <td className="px-5 py-4 font-mono">{plan.max}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{plan.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Quick */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Common Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: "Can I withdraw early?", a: "Invested funds are locked for the plan duration. Your vault balance is always withdrawable." },
              { q: "Are returns guaranteed?", a: "Our fixed-rate plans deliver the stated returns at maturity, backed by our diversified yield strategies." },
              { q: "How are deposits verified?", a: "Our team manually reviews every deposit to ensure security and compliance, typically within 1–4 hours." },
              { q: "What's the referral bonus?", a: "Refer a friend and earn $50 when they make their first deposit. No limit on referrals." },
            ].map((item) => (
              <div key={item.q} className="p-6 rounded-xl border border-border bg-card/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> {item.q}
                </h4>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/faq">
              <Button variant="outline" className="gap-2">Full FAQ <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border bg-card/20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            Ready to start?
          </h2>
          <p className="text-muted-foreground mb-8">Create your free account in under 2 minutes and start earning today.</p>
          <Link href="/sign-up">
            <Button size="lg" className="gap-2 px-10 glow-cyan">
              Open Your Vault <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
