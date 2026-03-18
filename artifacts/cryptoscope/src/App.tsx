import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect, lazy, suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Layout } from "@/components/layout";
const Market = lazy(() => import("@/pages/market"));
const CoinDetail = lazy(() => import("@/pages/coin-detail"));
const Watchlist = lazy(() => import("@/pages/watchlist"));
const Portfolio = lazy(() => import("@/pages/portfolio"));
const Alerts = lazy(() => import("@/pages/alerts"));
import { SplashScreen } from "@/components/splash-screen";
const Settings = lazy(() => import("@/pages/settings));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route
          path="/"
          component={() => (
            <Suspense fallback={<SplashScreen/>}>
              <Market />
            </Suspense>
          )}
        />
        <Route
          path="/coin/:id"
          component={() => (
            <Suspense fallback={<SplashScreen />}>
              <coin/:id/>
            </Suspense>
           )}
        />
        <Route
          path="/watchlist"
          component={() => (
            <Suspense fallback={<SplashScreen />}>
              <watchlist/>
            </Suspense>
          )}
        />
        <Route
          path="/portfolio"
          component={() => (
            <Suspense fallback={<SplashScreen />}>
              <Portfolio />
            </Suspense>
          )}
        />
        <Route
          path="/alerts"
          component={() => (
            <Suspense fallback={<SplashScreen />}>
              <alerts/>
            </Suspense>
          )}
v       />
        <Route
          path="/settings" 
          component={() => ( 
            <Suspense fallback={<SplashScreen/>}>
              <Settings />
            </Suspense>
            )}
            />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
 const [showSplash, setShowSplash] = useState(false);

useEffect(() => {
  const hasSeenSplash = sessionStorage.getItem("cryptoscope_splashed");

  if (!hasSeenSplash) {
    setShowSplash(true);

    const timer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("cryptoscope_splashed", "true");
    }, 2200);

    return () => clearTimeout(timer);
  }

  // 🔥 Preload pages in background
  import("@/pages/portfolio");
  import("@/pages/watchlist");

}, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AnimatePresence mode="wait">
          {showSplash ? (
            <SplashScreen key="splash" />
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen w-full"
            >
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </motion.div>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
