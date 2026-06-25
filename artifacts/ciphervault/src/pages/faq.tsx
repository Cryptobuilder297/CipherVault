import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Getting Started",
    faqs: [
      { q: "How do I create an account?", a: "Click 'Get Started' and complete the sign-up with your email. KYC verification (required for withdrawals) takes less than 24 hours. Once verified, you can deposit and invest immediately." },
      { q: "What countries does CipherVault support?", a: "We currently operate in 40+ countries worldwide. A few jurisdictions with strict crypto regulations are excluded. Contact support to check your specific country." },
      { q: "Is there a minimum age requirement?", a: "Yes, you must be at least 18 years old to create an account and use our platform." },
      { q: "How long does KYC verification take?", a: "Standard KYC verification is completed within 24 hours during business days." },
    ],
  },
  {
    name: "Deposits & Withdrawals",
    faqs: [
      { q: "What deposit methods are available?", a: "We accept bank transfers (SWIFT/SEPA), major cryptocurrencies (BTC, ETH, USDT), and debit/credit cards. Crypto deposits are fastest (1–2 hours), while bank transfers may take 1–3 business days." },
      { q: "Is there a minimum deposit amount?", a: "The minimum deposit is $100 USD or equivalent. This aligns with our Starter investment plan minimum." },
      { q: "How long do withdrawals take?", a: "Withdrawals are processed within 24 hours on business days. Funds are deducted from your vault balance immediately when you submit the request." },
      { q: "Are there withdrawal fees?", a: "CipherVault charges no platform withdrawal fees. However, network fees for crypto withdrawals and bank wire fees may apply." },
      { q: "What happens if my deposit is rejected?", a: "If a deposit is rejected for compliance reasons, your funds are not credited and you will be notified via email with the reason." },
    ],
  },
  {
    name: "Investment Plans",
    faqs: [
      { q: "How are the investment returns calculated?", a: "Returns are fixed-rate on the invested principal. For example, investing $1,000 in the Premium plan (25%/90 days) returns $1,250 at maturity." },
      { q: "Can I withdraw my investment early?", a: "Invested funds are locked for the plan duration to maintain yield integrity. Your vault balance (uninvested funds) is always available for withdrawal." },
      { q: "What happens at plan maturity?", a: "When you visit the Investments page, our system automatically detects matured plans and credits the full principal + returns to your vault balance instantly." },
      { q: "Can I invest in multiple plans simultaneously?", a: "Yes. You can have multiple active investments across different plan tiers simultaneously, as long as you have sufficient vault balance." },
      { q: "Is the return rate fixed or variable?", a: "All our current plans offer fixed return rates. The rate stated when you invest is guaranteed at maturity, regardless of market conditions." },
    ],
  },
  {
    name: "Security & Compliance",
    faqs: [
      { q: "How are my funds protected?", a: "We use a combination of hot and cold wallet storage. 95% of digital assets are held in air-gapped cold storage. All transactions require multi-signature approval from our security team." },
      { q: "Is CipherVault regulated?", a: "We operate under financial regulations in our jurisdiction of incorporation and comply with AML/KYC requirements." },
      { q: "What encryption does CipherVault use?", a: "We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. All passwords are hashed with bcrypt and never stored in plain text." },
    ],
  },
  {
    name: "Referral Program",
    faqs: [
      { q: "How does the referral program work?", a: "Share your unique referral code with friends. When they sign up using your code and complete their first deposit (approved by our team), you receive a $50 bonus credited to your vault balance." },
      { q: "Is there a limit on referrals?", a: "No limit. You can refer as many friends as you like. Each qualified referral earns you $50." },
      { q: "When is the referral bonus credited?", a: "The $50 bonus is credited automatically when your referred friend's first deposit is approved by our admin team." },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/3 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-white pr-4 text-[14px]">{q}</span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-muted-foreground text-[13px] leading-relaxed border-t border-border pt-4 bg-white/2">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("Getting Started");

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-24 border-b border-border grid-bg">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <p className="text-[12px] uppercase tracking-widest text-muted-foreground mb-5">Frequently Asked Questions</p>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 text-white tracking-tight">
            We've got answers
          </h1>
          <p className="text-[16px] text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about CipherVault, our investment plans, and how your money works.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-0.5">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Categories</p>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={cn(
                      "w-full text-left px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-colors",
                      activeCategory === cat.name
                        ? "bg-white/8 text-white"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/4"
                    )}
                  >
                    {cat.name}
                    <span className="ml-2 text-[11px] text-muted-foreground">({cat.faqs.length})</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-3 space-y-2">
              {categories.find((c) => c.name === activeCategory)?.faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-20 border-t border-border bg-card/20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Still have questions?</h2>
          <p className="text-muted-foreground text-[15px] mb-8">Our support team is available 24/7 to help you with anything you need.</p>
          <Link href="/contact">
            <Button size="lg">Contact Support</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
