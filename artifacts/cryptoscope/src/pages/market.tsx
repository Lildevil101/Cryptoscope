import { useState, useMemo } from "react";
import { Search, AlertCircle, Menu, Bell, Radio, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { TopBar } from "@/components/layout";
import { CoinCard } from "@/components/coin-card";
import { useMarketData } from "@/hooks/use-coingecko";
import { formatPrice, formatCompactNumber, cn } from "@/lib/utils";

const TABS = ["All", "Trending", "Top Gainers", "Top Losers"];

export function Market() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const { data: coins, isLoading, isError, error } = useMarketData();

  const { biggestWinner, biggestLoser, highestVolume } = useMemo(() => {
    if (!coins || coins.length === 0) return { biggestWinner: null, biggestLoser: null, highestVolume: null };
    const sortedByGain = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    const sortedByVolume = [...coins].sort((a, b) => b.total_volume - a.total_volume);
    
    return {
      biggestWinner: sortedByGain[0],
      biggestLoser: sortedByGain[sortedByGain.length - 1],
      highestVolume: sortedByVolume[0]
    };
  }, [coins]);

  const filteredCoins = useMemo(() => {
    let displayCoins = [...(coins || [])];
    
    if (activeTab === "Trending") {
      displayCoins = displayCoins.sort((a, b) => a.market_cap_rank - b.market_cap_rank).slice(0, 10);
    } else if (activeTab === "Top Gainers") {
      displayCoins = displayCoins.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 10);
    } else if (activeTab === "Top Losers") {
      displayCoins = displayCoins.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 10);
    }

    return displayCoins.filter(coin => 
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [coins, activeTab, searchQuery]);

  return (
    <>
      <TopBar 
        leftAction={<Menu className="w-6 h-6 text-foreground" />}
        title={<span className="text-gradient">CryptoScope</span>} 
        rightAction={
          <div className="relative">
            <Bell className="w-6 h-6 text-foreground" />
            <div className="absolute top-0 right-1 w-2 h-2 rounded-full bg-destructive animate-pulse" />
          </div>
        }
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

        {/* Crypto Radar */}
        {!isLoading && !isError && coins && coins.length > 0 && (
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <Radio size={16} className="text-secondary" />
              Crypto Radar
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
              {biggestWinner && (
                <div className="min-w-[150px] glass-panel rounded-2xl p-3 flex flex-col justify-between shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">🔥</span>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Hot</span>
                  </div>
                  <div className="mb-2">
                    <p className="font-bold text-foreground text-sm leading-tight">{biggestWinner.name}</p>
                    <p className="text-xs text-muted-foreground">{biggestWinner.symbol.toUpperCase()}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-bold self-start mt-auto">
                    <ArrowUpRight size={14} />
                    {biggestWinner.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </div>
              )}
              {biggestLoser && (
                <div className="min-w-[150px] glass-panel rounded-2xl p-3 flex flex-col justify-between shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">🧊</span>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Crashed</span>
                  </div>
                  <div className="mb-2">
                    <p className="font-bold text-foreground text-sm leading-tight">{biggestLoser.name}</p>
                    <p className="text-xs text-muted-foreground">{biggestLoser.symbol.toUpperCase()}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-destructive/10 text-destructive px-2 py-1 rounded-md text-xs font-bold self-start mt-auto">
                    <ArrowDownRight size={14} />
                    {Math.abs(biggestLoser.price_change_percentage_24h).toFixed(2)}%
                  </div>
                </div>
              )}
              {highestVolume && (
                <div className="min-w-[150px] glass-panel rounded-2xl p-3 flex flex-col justify-between shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">📊</span>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Most Traded</span>
                  </div>
                  <div className="mb-2">
                    <p className="font-bold text-foreground text-sm leading-tight">{highestVolume.name}</p>
                    <p className="text-xs text-muted-foreground">{highestVolume.symbol.toUpperCase()}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-1 rounded-md text-xs font-bold self-start mt-auto">
                    <Activity size={14} />
                    ${formatCompactNumber(highestVolume.total_volume)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 -mx-6 px-6 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
                activeTab === tab 
                  ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_10px_rgba(0,255,136,0.15)]" 
                  : "bg-card/50 text-muted-foreground border border-white/10 hover:bg-white/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            {activeTab === "All" && "Market Overview"}
            {activeTab === "Trending" && "Trending Coins"}
            {activeTab === "Top Gainers" && (
              <>Top Gainers <TrendingUp className="text-primary" size={18} /></>
            )}
            {activeTab === "Top Losers" && (
              <>Top Losers <TrendingDown className="text-destructive" size={18} /></>
            )}
          </h2>
          <span className="text-xs font-medium text-muted-foreground">
            {filteredCoins.length} {filteredCoins.length === 1 ? 'coin' : 'coins'}
          </span>
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
