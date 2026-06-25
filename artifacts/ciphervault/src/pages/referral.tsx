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
      if (res.ok) setData(await res.json());
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
  if (!stats && !loading) fetchStats();

  const referralCode = stats?.referralCode ?? "Loading...";
  const referralLink = `${window.location.origin}${import.meta.env.BASE_URL}sign-up?ref=${referralCode}`;

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Referral Program</h1>
        <p className="text-muted-foreground mt-1 text-[14px]">
          Earn <span className="text-foreground font-semibold">${REFERRAL_BONUS}</span> for every friend who joins and makes their first deposit.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-border flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-foreground/60" />
            </div>
            <span className="text-[13px] text-muted-foreground">Total Referred</span>
          </div>
          <div className="text-4xl font-bold text-white tabular-nums">{loading ? "—" : stats?.totalReferred ?? 0}</div>
          <p className="text-[12px] text-muted-foreground mt-1">Friends who used your code</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-border flex items-center justify-center">
              <CheckCircle className="w-4.5 h-4.5 text-foreground/60" />
            </div>
            <span className="text-[13px] text-muted-foreground">Qualified Referrals</span>
          </div>
          <div className="text-4xl font-bold text-white tabular-nums">{loading ? "—" : stats?.qualifiedReferrals ?? 0}</div>
          <p className="text-[12px] text-muted-foreground mt-1">Friends with approved deposits</p>
        </div>

        <div className="rounded-xl border border-white/15 bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-border flex items-center justify-center">
              <DollarSign className="w-4.5 h-4.5 text-foreground/60" />
            </div>
            <span className="text-[13px] text-muted-foreground">Bonus Earned</span>
          </div>
          <div className="text-4xl font-bold text-white tabular-nums">
            ${loading ? "—" : stats?.bonusEarned ?? 0}
          </div>
          <p className="text-[12px] text-muted-foreground mt-1">${REFERRAL_BONUS} per qualified referral</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-[16px] font-semibold text-white mb-5 flex items-center gap-2">
          <Gift className="w-4.5 h-4.5 text-foreground/60" />
          Your Referral Code
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[12px] text-muted-foreground mb-2">Share this code during sign-up:</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg bg-background border border-border px-4 py-2.5 font-bold text-white tracking-widest text-lg tabular-nums">
                {loading ? "Loading..." : referralCode}
              </div>
              <Button variant="outline" onClick={() => copy(referralCode)} className="shrink-0 text-[13px]" size="sm">
                {copied ? <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <div>
            <p className="text-[12px] text-muted-foreground mb-2">Or share your referral link:</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg bg-background border border-border px-4 py-2.5 text-[11px] text-muted-foreground truncate">
                {loading ? "Loading..." : referralLink}
              </div>
              <Button variant="outline" onClick={() => copy(referralLink)} className="shrink-0 text-[13px]" size="sm">
                <Share2 className="w-3.5 h-3.5 mr-1.5" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-[16px] font-semibold text-white mb-5">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Share Your Code", desc: "Give your unique referral code or link to friends interested in crypto investing." },
            { step: "2", title: "Friend Signs Up", desc: "Your friend creates their CipherVault account using your referral code during registration." },
            { step: "3", title: "Earn $50", desc: "When their first deposit is approved by our team, you receive a $50 bonus automatically." },
          ].map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white/8 border border-border flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0 tabular-nums">
                {s.step}
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1 text-[14px]">{s.title}</h4>
                <p className="text-[13px] text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className="rounded-xl border border-border bg-muted/10 p-5">
        <h3 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Program Terms</h3>
        <ul className="space-y-2 text-[13px] text-muted-foreground">
          {[
            `Bonus of $${REFERRAL_BONUS} is credited when your referred friend's first deposit is approved.`,
            "There is no limit on the number of referrals — each qualified friend earns you $50.",
            "Referred friends must complete KYC verification and make a qualifying deposit.",
            "Self-referrals and abuse of the program will result in account suspension.",
          ].map((term, i) => (
            <li key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
              {term}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white text-[15px]">Maximize your earnings</h3>
          <p className="text-muted-foreground text-[13px]">Invest your referral bonuses in a yield plan.</p>
        </div>
        <Link href="/plans">
          <Button className="gap-2 text-[13px] whitespace-nowrap" size="sm">
            View Investment Plans <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
