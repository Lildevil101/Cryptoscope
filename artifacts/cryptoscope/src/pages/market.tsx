import { useState } from "react";
import { Search, AlertCircle } from "lucide-react";
import { TopBar } from "@/components/layout";
import { CoinCard } from "@/components/coin-card";
import { useMarketData } from "@/hooks/use-coingecko";

export function Market() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: coins, isLoading, isError, error } = useMarketData();

  const filteredCoins = coins?.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <>
      <TopBar 
        title={<span className="text-gradient">CryptoScope</span>} 
        rightAction={<div className="w-2 h-2 rounded-full bg-primary animate-pulse" title="Live data active" />}
      />
      
      <div className="px-6 py-4 flex-1">
        {/* Search Bar */}
        <div className="relative mb-6 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 bg-card/50 border border-white/10 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all backdrop-blur-sm"
            placeholder="Search coins, symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Content State */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 w-full bg-card/40 animate-pulse rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4 glass-panel rounded-3xl mt-10">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-lg font-bold text-foreground">Data Fetch Failed</h3>
            <p className="text-muted-foreground mt-2 text-sm">{(error as Error)?.message || "Could not load market data. Check your connection."}</p>
          </div>
        ) : filteredCoins.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No coins found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-3 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredCoins.map((coin, i) => (
              <CoinCard key={coin.id} coin={coin} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
