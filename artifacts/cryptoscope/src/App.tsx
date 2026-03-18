import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Layout } from "@/components/layout";
import { Market } from "@/pages/market";
import { CoinDetail } from "@/pages/coin-detail";
import { Watchlist } from "@/pages/watchlist";
import { Portfolio } from "@/pages/portfolio";
import { Alerts } from "@/pages/alerts";
import { Settings } from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { SplashScreen } from "@/components/splash-screen";

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
        <Route path="/" component={Market} />
        <Route path="/coin/:id" component={CoinDetail} />
        <Route path="/watchlist" component={Watchlist} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("cryptoscope_splashed");
  });

  useEffect(() => {
    if (!showSplash) return; 
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("cryptoscope_splashed", "true");
      }, 2200);
      return () => clearTimeout(timer);
  }, [showSplash]);

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
