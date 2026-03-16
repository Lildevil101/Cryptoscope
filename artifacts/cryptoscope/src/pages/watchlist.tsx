import { TopBar } from "@/components/layout";
import { CoinCard } from "@/components/coin-card";
import { useMarketData } from "@/hooks/use-coingecko";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function Watchlist() {
  const [watchlist] = useLocalStorage<string[]>("cryptoscope_watchlist", []);
  const { data: coins, isLoading } = useMarketData();

  const watchlistedCoins = coins?.filter(coin => watchlist.includes(coin.id)) || [];

  return (
    <>
      <TopBar title="Watchlist" />
      
      <div className="px-6 py-6 flex-1">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 w-full bg-card/40 animate-pulse rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : watchlistedCoins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center px-4">
            <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/5">
              <Star className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">Nothing to see here</h2>
            <p className="text-muted-foreground mb-8">You haven't added any coins to your watchlist yet.</p>
            <Link href="/" className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:scale-105 transition-transform flex items-center gap-2">
              Explore Market <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {watchlistedCoins.map((coin, i) => (
              <CoinCard key={coin.id} coin={coin} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
