import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Zap, Users, DollarSign, CheckCircle, Star, ChevronRight, Lock, BarChart3, Headphones } from "lucide-react";

const stats = [
  { label: "Assets Under Management", value: "$50M+", icon: DollarSign },
  { label: "Active Investors", value: "10,000+", icon: Users },
  { label: "Maximum Return", value: "40%", icon: TrendingUp },
  { label: "Platform Uptime", value: "99.9%", icon: Zap },
];

const features = [
  {
    icon: Shield,
    title: "Institutional Security",
    description: "Military-grade 256-bit encryption with multi-factor authentication and cold storage for all digital assets.",
  },
  {
    icon: BarChart3,
    title: "High-Yield Plans",
    description: "Earn up to 40% returns with our tiered investment plans designed for every risk profile and budget.",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Lightning-fast deposit crediting and withdrawal processing. Your money moves when you need it to.",
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    description: "Round-the-clock dedicated support from our team of crypto investment specialists.",
  },
];

const plans = [
  { name: "Starter", return: "8%", duration: "30 days", min: "$100" },
  { name: "Growth", return: "15%", duration: "60 days", min: "$500" },
  { name: "Premium", return: "25%", duration: "90 days", min: "$2,000", popular: true },
  { name: "Elite", return: "40%", duration: "120 days", min: "$10,000" },
];

const steps = [
  { step: "01", title: "Create Your Account", desc: "Sign up in under 2 minutes with just your email. Full KYC verification takes less than 24 hours." },
  { step: "02", title: "Deposit Funds", desc: "Fund your vault via bank transfer, crypto, or card. Deposits are credited after admin verification." },
  { step: "03", title: "Choose a Plan", desc: "Select from our tiered investment plans and watch your returns grow over your chosen period." },
  { step: "04", title: "Earn & Withdraw", desc: "Returns are automatically credited at maturity. Withdraw anytime with no hidden fees." },
];

const testimonials = [
  {
    name: "Marcus T.",
    role: "Portfolio Investor",
    avatar: "MT",
    text: "CipherVault delivered exactly what they promised — 25% returns on my Premium plan. The transparency is exceptional.",
    stars: 5,
  },
  {
    name: "Sarah K.",
    role: "Crypto Enthusiast",
    avatar: "SK",
    text: "I've tried three other platforms. None come close to CipherVault's security standards and customer support.",
    stars: 5,
  },
  {
    name: "James R.",
    role: "Retired Trader",
    avatar: "JR",
    text: "The Elite plan's 40% return over 120 days transformed my retirement savings. The auto-crediting is seamless.",
    stars: 5,
  },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center grid-bg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/[0.02] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-foreground/60 text-[12px] font-medium mb-8 tracking-wide">
            <Zap className="w-3 h-3" />
            Trusted by 10,000+ investors worldwide
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05] text-white">
            Your Vault.{" "}
            <span className="text-white">Your Returns.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            The most trusted crypto investment platform. Earn up to 40% returns with institutional-grade security, complete transparency, and expert-managed yield plans.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 px-8 h-11 text-[14px] font-semibold">
                Start Investing
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="gap-2 px-8 h-11 text-[14px]">
                How It Works
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] text-muted-foreground">
            {["256-bit Encryption", "KYC Verified", "Instant Withdrawals", "No Hidden Fees"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-foreground/40" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-white mb-1 tabular-nums">{stat.value}</div>
                <div className="text-[13px] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[12px] uppercase tracking-widest text-muted-foreground mb-4">Why CipherVault</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Built for serious investors
            </h2>
            <p className="text-muted-foreground text-[16px] max-w-xl mx-auto leading-relaxed">
              We combine the security of traditional finance with the returns of cryptocurrency.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="p-7 rounded-xl border border-border bg-card hover:border-white/15 transition-colors duration-300">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-border flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-foreground/70" />
                </div>
                <h3 className="text-[17px] font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-card/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[12px] uppercase tracking-widest text-muted-foreground mb-4">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Start earning in 4 steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.step}>
                <div className="text-4xl font-black text-white/10 mb-4 tabular-nums">{step.step}</div>
                <h3 className="text-[16px] font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/how-it-works">
              <Button variant="outline" className="gap-2 text-[13px]">
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[12px] uppercase tracking-widest text-muted-foreground mb-4">Investment Plans</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Choose your return tier
            </h2>
            <p className="text-muted-foreground text-[16px] max-w-xl mx-auto mt-4">
              From $100 entry-level plans to elite-tier investments.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-xl border p-6 hover:border-white/20 transition-colors ${plan.popular ? "border-white/20 bg-white/5" : "border-border bg-card"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-background text-[11px] font-bold tracking-wide">
                    POPULAR
                  </div>
                )}
                <div className="text-[15px] font-semibold text-white mb-1">{plan.name}</div>
                <div className="text-4xl font-extrabold text-white mb-1 tabular-nums">{plan.return}</div>
                <div className="text-[12px] text-muted-foreground mb-4">return over {plan.duration}</div>
                <div className="text-[12px] text-muted-foreground mb-6">From {plan.min}</div>
                <Link href="/sign-up">
                  <Button variant="outline" size="sm" className="w-full text-[12px] gap-1">
                    Get Started <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/plans">
              <Button className="gap-2 text-[13px]">
                View All Plans <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-card/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[12px] uppercase tracking-widest text-muted-foreground mb-4">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Trusted by investors
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-xl border border-border bg-card hover:border-white/15 transition-colors">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-[13px] leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/8 border border-border flex items-center justify-center text-white font-semibold text-[11px] tabular-nums">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-[13px] text-white">{t.name}</div>
                    <div className="text-[12px] text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden grid-bg">
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Ready to grow your wealth?
          </h2>
          <p className="text-muted-foreground text-[16px] mb-10 max-w-md mx-auto leading-relaxed">
            Join 10,000+ investors already earning consistent returns with CipherVault.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 px-10 h-11 text-[14px] font-semibold">
                Open Your Vault <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-10 h-11 text-[14px]">
                Talk to Us
              </Button>
            </Link>
          </div>
          <p className="text-[12px] text-muted-foreground mt-6 flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            No credit card required · Cancel anytime · Full transparency
          </p>
        </div>
      </section>
    </div>
  );
}
