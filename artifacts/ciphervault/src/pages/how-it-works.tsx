import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { UserPlus, CreditCard, TrendingUp, DollarSign, ArrowRight, CheckCircle, Clock, Shield } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create & Verify Your Account",
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
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <p className="text-[12px] uppercase tracking-widest text-muted-foreground mb-5">Simple & Transparent</p>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
            How CipherVault works
          </h1>
          <p className="text-[16px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
            From sign-up to returns in four clear steps. No confusing jargon, no hidden processes — just transparent, reliable investing.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-20">
            {steps.map((step, i) => (
              <div key={step.number} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="text-8xl font-black text-white/5 mb-4 tabular-nums leading-none">{step.number}</div>
                  <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">{step.title}</h2>
                  <ul className="space-y-3 mb-6">
                    {step.details.map((d) => (
                      <li key={d} className="flex items-start gap-3 text-muted-foreground text-[14px]">
                        <CheckCircle className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-border text-[12px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {step.time}
                  </div>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="rounded-xl border border-border bg-card/50 flex items-center justify-center p-12">
                    <step.icon className="w-24 h-24 text-foreground/15" strokeWidth={1} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Table */}
      <section className="py-20 bg-card/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-3">Investment Plan Details</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-[15px]">All returns are fixed-rate and credited automatically at plan maturity.</p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Plan", "Return Rate", "Duration", "Min Investment", "Max Investment", "Notes"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.name} className={`border-b last:border-0 border-border hover:bg-white/3 transition-colors ${plan.popular ? "bg-white/3" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-[14px]">{plan.name}</span>
                        {plan.popular && <span className="px-2 py-0.5 rounded-full bg-white text-background text-[10px] font-bold">Popular</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-white text-[15px] tabular-nums">{plan.return}</td>
                    <td className="px-5 py-4 text-muted-foreground text-[13px]">{plan.duration}</td>
                    <td className="px-5 py-4 text-[13px] text-foreground tabular-nums">{plan.min}</td>
                    <td className="px-5 py-4 text-[13px] text-foreground tabular-nums">{plan.max}</td>
                    <td className="px-5 py-4 text-[13px] text-muted-foreground">{plan.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Quick FAQ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white tracking-tight">Common Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { q: "Can I withdraw early?", a: "Invested funds are locked for the plan duration. Your vault balance is always withdrawable." },
              { q: "Are returns guaranteed?", a: "Our fixed-rate plans deliver the stated returns at maturity, backed by our diversified yield strategies." },
              { q: "How are deposits verified?", a: "Our team manually reviews every deposit to ensure security and compliance, typically within 1–4 hours." },
              { q: "What's the referral bonus?", a: "Refer a friend and earn $50 when they make their first deposit. No limit on referrals." },
            ].map((item) => (
              <div key={item.q} className="p-5 rounded-xl border border-border bg-card">
                <h4 className="font-semibold text-white mb-2 text-[14px] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-foreground/40" /> {item.q}
                </h4>
                <p className="text-[13px] text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/faq">
              <Button variant="outline" className="gap-2 text-[13px]">Full FAQ <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border bg-card/20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Ready to start?</h2>
          <p className="text-muted-foreground text-[15px] mb-8">Create your free account in under 2 minutes and start earning today.</p>
          <Link href="/sign-up">
            <Button size="lg" className="gap-2 px-10 h-11">
              Open Your Vault <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
