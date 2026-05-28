import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Shield, TrendingUp, Zap, Users, DollarSign, Clock,
  CheckCircle, Star, ChevronRight, Lock, BarChart3, Globe, Headphones
} from "lucide-react";

const stats = [
  { label: "Assets Under Management", value: "$50M+", icon: DollarSign },
  { label: "Active Investors", value: "10,000+", icon: Users },
  { label: "Maximum Annual Return", value: "40%", icon: TrendingUp },
  { label: "Platform Uptime", value: "99.9%", icon: Zap },
];

const features = [
  {
    icon: Shield,
    title: "Institutional Security",
    description: "Military-grade 256-bit encryption with multi-factor authentication and cold storage for all digital assets.",
    color: "from-cyan-500/20 to-cyan-500/5",
    iconColor: "text-cyan-400",
  },
  {
    icon: BarChart3,
    title: "High-Yield Plans",
    description: "Earn up to 40% returns with our tiered investment plans designed for every risk profile and budget.",
    color: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Lightning-fast deposit crediting and withdrawal processing. Your money moves when you need it to.",
    color: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    description: "Round-the-clock dedicated support from our team of crypto investment specialists.",
    color: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
  },
];

const plans = [
  { name: "Starter", return: "8%", duration: "30 days", min: "$100", color: "border-cyan-500/30 bg-cyan-500/5" },
  { name: "Growth", return: "15%", duration: "60 days", min: "$500", color: "border-violet-500/30 bg-violet-500/5" },
  { name: "Premium", return: "25%", duration: "90 days", min: "$2,000", color: "border-amber-500/30 bg-amber-500/5", popular: true },
  { name: "Elite", return: "40%", duration: "120 days", min: "$10,000", color: "border-emerald-500/30 bg-emerald-500/5" },
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
    text: "CipherVault delivered exactly what they promised — 25% returns on my Premium plan. The transparency and daily dashboard updates are exceptional.",
    stars: 5,
  },
  {
    name: "Sarah K.",
    role: "Crypto Enthusiast",
    avatar: "SK",
    text: "I've tried three other platforms. None come close to CipherVault's security standards and customer support. My money has never felt safer.",
    stars: 5,
  },
  {
    name: "James R.",
    role: "Retired Trader",
    avatar: "JR",
    text: "The Elite plan's 40% return over 120 days transformed my retirement savings. The auto-crediting feature is seamless and reliable.",
    stars: 5,
  },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center grid-bg">
        {/* Background glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            Trusted by 10,000+ investors worldwide
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Your Vault.{" "}
            <span className="gradient-text">Your Returns.</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The most trusted crypto investment platform. Earn up to 40% returns with institutional-grade security, complete transparency, and expert-managed yield plans.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 px-8 h-12 text-base font-semibold shadow-lg glow-cyan">
                Start Investing Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="gap-2 px-8 h-12 text-base">
                How It Works
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {["256-bit Encryption", "KYC Verified", "Instant Withdrawals", "No Hidden Fees"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="text-4xl font-bold font-mono text-foreground mb-1 gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-4">
              Why CipherVault
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              Built for serious investors
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We combine the security of traditional finance with the returns of cryptocurrency — giving you the best of both worlds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className={`p-8 rounded-2xl border border-border bg-gradient-to-br ${feature.color} group hover:border-primary/30 transition-all duration-300`}>
                <div className={`w-12 h-12 rounded-xl bg-background/50 border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-card/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-4">
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              Start earning in 4 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-primary/30 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="text-5xl font-black font-mono text-primary/15 mb-4">{step.step}</div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/how-it-works">
              <Button variant="outline" className="gap-2">
                Learn More <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-4">
              Investment Plans
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              Choose your return tier
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From $100 entry-level plans to elite-tier investments — find your perfect match.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl border p-6 ${plan.color} hover:scale-105 transition-transform duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-lg font-bold mb-1">{plan.name}</div>
                <div className="text-4xl font-black font-mono gradient-text mb-1">{plan.return}</div>
                <div className="text-sm text-muted-foreground mb-4">return over {plan.duration}</div>
                <div className="text-sm text-muted-foreground mb-6">From {plan.min}</div>
                <Link href="/sign-up">
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    Get Started <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/plans">
              <Button className="gap-2">
                View All Plans <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-card/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-4">
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              Trusted by investors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm font-mono">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
            Ready to grow your <span className="gradient-text">wealth?</span>
          </h2>
          <p className="text-muted-foreground text-xl mb-10 max-w-xl mx-auto">
            Join 10,000+ investors already earning consistent returns with CipherVault.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 px-10 h-12 text-base font-semibold glow-cyan">
                Open Your Vault <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-10 h-12 text-base">
                Talk to Us
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-6 flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            No credit card required · Cancel anytime · Full transparency
          </p>
        </div>
      </section>
    </div>
  );
}
