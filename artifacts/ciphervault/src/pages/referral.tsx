import { useState } from "react";
import { Copy, Users, DollarSign, Gift, CheckCircle, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/react";
import { Link } from "wouter";

const REFERRAL_BONUS = 50;

type ReferralStats = {
  referralCode: string | null;
  totalReferred: number;
  qualifiedReferrals: number;
  bonusEarned: number;
  bonusPerReferral: number;
};

function useReferralStats() {
  const [data, setData] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetch_ = async () => {
    if (fetched) return;
    setLoading(true);
    try {
      const res = await fetch("/api/referrals/me", { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {}
    setLoading(false);
    setFetched(true);
  };

  return { data, loading, fetch: fetch_ };
}

export default function ReferralPage() {
  const { user } = useUser();
  const { data: stats, loading, fetch: fetchStats } = useReferralStats();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  if (!stats && !loading) {
    fetchStats();
  }

  const referralCode = stats?.referralCode ?? "Loading...";
  const referralLink = `${window.location.origin}${import.meta.env.BASE_URL}sign-up?ref=${referralCode}`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { step: "1", title: "Share Your Code", desc: "Give your unique referral code or link to friends interested in crypto investing." },
    { step: "2", title: "Friend Signs Up", desc: "Your friend creates their CipherVault account using your referral code during registration." },
    { step: "3", title: "First Deposit", desc: "When their first deposit is approved by our team, you receive a $50 bonus automatically." },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
          Referral Program
        </h1>
        <p className="text-muted-foreground mt-1">
          Earn <span className="text-primary font-semibold">${REFERRAL_BONUS}</span> for every friend who joins and makes their first deposit.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-card/50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-sm text-muted-foreground">Total Referred</span>
          </div>
          <div className="text-4xl font-bold font-mono">{loading ? "—" : stats?.totalReferred ?? 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Friends who used your code</p>
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-sm text-muted-foreground">Qualified Referrals</span>
          </div>
          <div className="text-4xl font-bold font-mono">{loading ? "—" : stats?.qualifiedReferrals ?? 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Friends who completed first deposit</p>
        </div>

        <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Bonus Earned</span>
          </div>
          <div className="text-4xl font-bold font-mono text-primary">
            ${loading ? "—" : stats?.bonusEarned ?? 0}
          </div>
          <p className="text-xs text-muted-foreground mt-1">${REFERRAL_BONUS} per qualified referral</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="rounded-xl border border-border bg-card/50 p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Your Referral Code
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Share this code with friends during sign-up:</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-lg bg-background border border-border px-4 py-3 font-mono text-xl font-bold text-primary tracking-widest">
                {loading ? "Loading..." : referralCode}
              </div>
              <Button variant="outline" onClick={copyCode} className="shrink-0 gap-2">
                {copied ? <CheckCircle className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">Or share your referral link:</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-lg bg-background border border-border px-4 py-3 text-xs text-muted-foreground truncate font-mono">
                {loading ? "Loading..." : referralLink}
              </div>
              <Button variant="outline" onClick={copyLink} className="shrink-0 gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="rounded-xl border border-border bg-card/50 p-6">
        <h2 className="text-lg font-bold mb-6">How the Referral Program Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black font-mono flex-shrink-0">
                {s.step}
              </div>
              <div>
                <h4 className="font-semibold mb-1">{s.title}</h4>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className="rounded-xl border border-border bg-muted/20 p-5">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Program Terms</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
            Bonus of ${REFERRAL_BONUS} is credited when your referred friend's first deposit is approved.
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
            There is no limit on the number of referrals — earn ${REFERRAL_BONUS} for every qualified friend.
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
            Referred friends must complete KYC verification and make a qualifying deposit.
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
            Self-referrals and abuse of the program will result in account suspension.
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
            Bonus funds are credited to your vault balance and can be invested or withdrawn.
          </li>
        </ul>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg">Want to maximize your earnings?</h3>
          <p className="text-muted-foreground text-sm">Invest your referral bonuses in one of our yield plans.</p>
        </div>
        <Link href="/plans">
          <Button className="gap-2 whitespace-nowrap">
            View Investment Plans <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
