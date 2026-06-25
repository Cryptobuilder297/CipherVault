import { useEffect, useRef, useState } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { dark } from '@clerk/themes';
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/layout";
import { PublicLayout } from "@/components/public-layout";
import ReCAPTCHA from "react-google-recaptcha";
import HomePage from "@/pages/home";
import AboutPage from "@/pages/about";
import HowItWorksPage from "@/pages/how-it-works";
import FaqPage from "@/pages/faq";
import ContactPage from "@/pages/contact";
import SecurityPage from "@/pages/security";
import Dashboard from "@/pages/dashboard";
import Market from "@/pages/market";
import Portfolio from "@/pages/portfolio";
import Transactions from "@/pages/transactions";
import Watchlist from "@/pages/watchlist";
import Deposits from "@/pages/deposits";
import Withdrawals from "@/pages/withdrawals";
import Plans from "@/pages/plans";
import MyInvestments from "@/pages/my-investments";
import AdminDashboard from "@/pages/admin";
import ReferralPage from "@/pages/referral";
import NotFound from "@/pages/not-found";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

// Google reCAPTCHA v2 site key — use VITE_RECAPTCHA_SITE_KEY in production
// Default: Google's official test key (always passes, for development only)
const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');

const clerkAppearance = {
  baseTheme: dark,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#ffffff",
    colorForeground: "#f3f4f6",
    colorMutedForeground: "#6b7280",
    colorDanger: "#ef4444",
    colorBackground: "#0b0c0e",
    colorInput: "#111315",
    colorInputForeground: "#f3f4f6",
    colorNeutral: "#1f2127",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#111315] border border-[#1f2127] rounded-xl w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: { color: "#f3f4f6" },
    headerSubtitle: { color: "#6b7280" },
    socialButtonsBlockButtonText: { color: "#f3f4f6" },
    formFieldLabel: { color: "#9ca3af" },
    footerActionLink: { color: "#ffffff" },
    footerActionText: { color: "#6b7280" },
    dividerText: { color: "#6b7280" },
    identityPreviewEditButton: { color: "#ffffff" },
    formFieldSuccessText: { color: "#22c55e" },
    alertText: { color: "#ef4444" },
    logoBox: "p-2",
    logoImage: { height: "36px" },
    socialButtonsBlockButton: { borderColor: "#1f2127", backgroundColor: "#0b0c0e" },
    formButtonPrimary: { backgroundColor: "#ffffff", color: "#0b0c0e", fontWeight: "600" },
    formFieldInput: { backgroundColor: "#0b0c0e", borderColor: "#1f2127", color: "#f3f4f6" },
    footerAction: "bg-transparent",
    dividerLine: { backgroundColor: "#1f2127" },
    alert: { backgroundColor: "#1a0a0a", borderColor: "#ef4444" },
    otpCodeFieldInput: { backgroundColor: "#0b0c0e", borderColor: "#ffffff", color: "#f3f4f6" },
    formFieldRow: "gap-3",
    main: "gap-4",
  },
};

const queryClient = new QueryClient();

function RecaptchaGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false);
  if (verified) return <>{children}</>;
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 dark gap-6">
      <div className="text-center mb-2">
        <div className="text-[15px] font-semibold text-white mb-1">Security Check</div>
        <div className="text-[13px] text-muted-foreground">Please verify you're human to continue</div>
      </div>
      <ReCAPTCHA
        sitekey={RECAPTCHA_SITE_KEY}
        theme="dark"
        onChange={(token) => { if (token) setVerified(true); }}
      />
    </div>
  );
}

function SignInPage() {
  return (
    <RecaptchaGate>
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 dark">
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    </RecaptchaGate>
  );
}

function SignUpPage() {
  const search = new URLSearchParams(window.location.search);
  const ref = search.get("ref");
  if (ref) sessionStorage.setItem("pendingReferralCode", ref);
  return (
    <RecaptchaGate>
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 dark">
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
    </RecaptchaGate>
  );
}

function UserSyncer() {
  const { user, isLoaded } = useUser();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user || synced) return;
    const referralCode = sessionStorage.getItem("pendingReferralCode") ?? undefined;
    if (referralCode) sessionStorage.removeItem("pendingReferralCode");
    fetch('/api/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? '',
        username: user.username ?? undefined,
        referralCode,
      }),
    }).then(() => setSynced(true)).catch(console.error);
  }, [isLoaded, user, synced]);

  return null;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <>
      <Show when="signed-in"><Component /></Show>
      <Show when="signed-out"><Redirect to="/sign-in" /></Show>
    </>
  );
}

function AppRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/market" component={Market} />
        <Route path="/portfolio">{() => <ProtectedRoute component={Portfolio} />}</Route>
        <Route path="/transactions">{() => <ProtectedRoute component={Transactions} />}</Route>
        <Route path="/watchlist" component={Watchlist} />
        <Route path="/deposits">{() => <ProtectedRoute component={Deposits} />}</Route>
        <Route path="/withdrawals">{() => <ProtectedRoute component={Withdrawals} />}</Route>
        <Route path="/plans" component={Plans} />
        <Route path="/investments">{() => <ProtectedRoute component={MyInvestments} />}</Route>
        <Route path="/referral">{() => <ProtectedRoute component={ReferralPage} />}</Route>
        <Route path="/admin">{() => <ProtectedRoute component={AdminDashboard} />}</Route>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function PublicRoutes() {
  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/how-it-works" component={HowItWorksPage} />
        <Route path="/faq" component={FaqPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/security" component={SecurityPage} />
      </Switch>
    </PublicLayout>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: "Access Your Vault", subtitle: "Enter your credentials to continue" } },
        signUp: { start: { title: "Open Your Vault", subtitle: "Create your CipherVault account" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <UserSyncer />
        <TooltipProvider>
          <div className="dark">
            <Switch>
              <Route path="/sign-in/*?" component={SignInPage} />
              <Route path="/sign-up/*?" component={SignUpPage} />
              <Route path="/">{() => <PublicRoutes />}</Route>
              <Route path="/about">{() => <PublicRoutes />}</Route>
              <Route path="/how-it-works">{() => <PublicRoutes />}</Route>
              <Route path="/faq">{() => <PublicRoutes />}</Route>
              <Route path="/contact">{() => <PublicRoutes />}</Route>
              <Route path="/security">{() => <PublicRoutes />}</Route>
              <Route>{() => <AppRoutes />}</Route>
            </Switch>
            <Toaster />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
