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

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}

const clerkAppearance = {
  baseTheme: dark,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#00e5ff",
    colorForeground: "#e2e8f0",
    colorMutedForeground: "#64748b",
    colorDanger: "#ef4444",
    colorBackground: "#070d1a",
    colorInput: "#0a1628",
    colorInputForeground: "#e2e8f0",
    colorNeutral: "#1e3a5f",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#0d1628] border border-[#1e3a5f] rounded-xl w-[440px] max-w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: { color: "#e2e8f0" },
    headerSubtitle: { color: "#64748b" },
    socialButtonsBlockButtonText: { color: "#e2e8f0" },
    formFieldLabel: { color: "#94a3b8" },
    footerActionLink: { color: "#00e5ff" },
    footerActionText: { color: "#64748b" },
    dividerText: { color: "#64748b" },
    identityPreviewEditButton: { color: "#00e5ff" },
    formFieldSuccessText: { color: "#22c55e" },
    alertText: { color: "#ef4444" },
    logoBox: "p-2",
    logoImage: { height: "40px" },
    socialButtonsBlockButton: { borderColor: "#1e3a5f", backgroundColor: "#0a1628" },
    formButtonPrimary: { backgroundColor: "#00e5ff", color: "#000" },
    formFieldInput: { backgroundColor: "#0a1628", borderColor: "#1e3a5f", color: "#e2e8f0" },
    footerAction: "bg-transparent",
    dividerLine: { backgroundColor: "#1e3a5f" },
    alert: { backgroundColor: "#1a0a0a", borderColor: "#ef4444" },
    otpCodeFieldInput: { backgroundColor: "#0a1628", borderColor: "#00e5ff", color: "#e2e8f0" },
    formFieldRow: "gap-3",
    main: "gap-4",
  },
};

const queryClient = new QueryClient();

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 dark">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  // Capture ?ref= query param for referral code passing
  const search = new URLSearchParams(window.location.search);
  const ref = search.get("ref");
  if (ref) {
    sessionStorage.setItem("pendingReferralCode", ref);
  }
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 dark">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
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
      <Show when="signed-in">
        <Component />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
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
