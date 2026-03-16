import { useRoute, Link } from "wouter";
import { ChevronLeft, Star, ArrowUpRight, ArrowDownRight, Activity, ShieldAlert, BarChart3, TrendingUp } from "lucide-react";
import { useCoinDetail, useCoinChart } from "@/hooks/use-coingecko";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { formatPrice, formatCompactNumber, cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { format } from "date-fns";

export function CoinDetail() {
  const [, params] = useRoute("/coin/:id");
  const coinId = params?.id || "";
  
  const { data: coin, isLoading: isCoinLoading } = useCoinDetail(coinId);
  const { data: chartData, isLoading: isChartLoading } = useCoinChart(coinId, 7);
  
  const [watchlist, setWatchlist] = useLocalStorage<string[]>("cryptoscope_watchlist", []);
  const isWatchlisted = watchlist.includes(coinId);

  const toggleWatchlist = () => {
    if (isWatchlisted) {
      setWatchlist(watchlist.filter(id => id !== coinId));
    } else {
      setWatchlist([...watchlist, coinId]);
    }
  };

  if (isCoinLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col p-6 space-y-6">
        <div className="h-8 w-8 bg-card rounded-full animate-pulse" />
        <div className="h-16 w-3/4 bg-card rounded-2xl animate-pulse" />
        <div className="h-64 w-full bg-card rounded-3xl animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-card rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!coin) return <div className="p-6 text-center text-muted-foreground mt-20">Coin not found</div>;

  const isPositive = coin.price_change_percentage_24h >= 0;
  
  // Format chart data
  const formattedChartData = chartData?.prices.map(([timestamp, price]) => ({
    time: timestamp,
    price,
    formattedTime: format(new Date(timestamp), "MMM dd, HH:mm"),
    formattedPrice: formatPrice(price)
  })) || [];

  // Mock X-Ray data based on real stats
  const momentumScore = Math.min(100, Math.max(1, 50 + (coin.price_change_percentage_24h * 2)));
  const marketStrength = coin.market_cap > 10000000000 ? "High" : coin.market_cap > 1000000000 ? "Medium" : "Low";
  const volatility = Math.abs((coin.high_24h - coin.low_24h) / coin.low_24h);
  const riskLevel = volatility > 0.1 ? "Very High" : volatility > 0.05 ? "High" : volatility > 0.02 ? "Medium" : "Low";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl px-4 py-4 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="p-2 rounded-full hover:bg-white/10 text-foreground transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div className="flex items-center gap-2">
          <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
          <span className="font-bold text-lg">{coin.name}</span>
          <span className="text-muted-foreground text-sm uppercase bg-card px-2 py-0.5 rounded-md border border-white/10">{coin.symbol}</span>
        </div>
        <button 
          onClick={toggleWatchlist}
          className={cn(
            "p-2 rounded-full transition-all duration-300",
            isWatchlisted ? "text-[#FFD700] bg-[#FFD700]/10 glow-primary shadow-none" : "text-muted-foreground hover:bg-white/10"
          )}
        >
          <Star size={22} fill={isWatchlisted ? "currentColor" : "none"} />
        </button>
      </header>

      <div className="px-6 pt-8 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Price Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <span className="text-sm font-medium text-muted-foreground mb-2">Current Price</span>
          <h1 className="text-5xl font-display font-bold text-foreground mb-3 tracking-tighter">
            {formatPrice(coin.current_price)}
          </h1>
          <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold",
            isPositive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
          )}>
            {isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
            {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}% (24h)
          </div>
        </div>

        {/* Chart */}
        <div className="h-[250px] w-full -mx-2 mb-8 relative">
          {isChartLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedChartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? "hsl(152, 100%, 50%)" : "hsl(0, 100%, 65%)"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isPositive ? "hsl(152, 100%, 50%)" : "hsl(0, 100%, 65%)"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass-panel px-3 py-2 rounded-xl text-center shadow-2xl">
                          <p className="text-muted-foreground text-xs mb-1">{data.formattedTime}</p>
                          <p className="text-foreground font-bold font-display text-lg">{data.formattedPrice}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPositive ? "hsl(152, 100%, 50%)" : "hsl(0, 100%, 65%)"} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="glass-panel p-4 rounded-2xl">
            <span className="text-muted-foreground text-xs font-medium block mb-1">Market Cap</span>
            <span className="text-foreground font-bold text-lg">${formatCompactNumber(coin.market_cap)}</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <span className="text-muted-foreground text-xs font-medium block mb-1">Volume (24h)</span>
            <span className="text-foreground font-bold text-lg">${formatCompactNumber(coin.total_volume)}</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <span className="text-muted-foreground text-xs font-medium block mb-1">24h High</span>
            <span className="text-foreground font-bold text-lg">{formatPrice(coin.high_24h)}</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <span className="text-muted-foreground text-xs font-medium block mb-1">24h Low</span>
            <span className="text-foreground font-bold text-lg">{formatPrice(coin.low_24h)}</span>
          </div>
        </div>

        {/* Crypto X-Ray */}
        <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
          <Activity className="text-secondary" /> Crypto X-Ray
        </h3>
        <div className="glass-panel rounded-3xl p-5 space-y-5">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-card rounded-lg border border-white/5"><TrendingUp size={18} className="text-primary" /></div>
              <div>
                <p className="text-sm font-medium text-foreground">Trend</p>
                <p className="text-xs text-muted-foreground">7 day direction</p>
              </div>
            </div>
            <span className={cn("font-bold", isPositive ? "text-primary" : "text-destructive")}>
              {isPositive ? "Bullish" : "Bearish"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-card rounded-lg border border-white/5"><BarChart3 size={18} className="text-secondary" /></div>
              <div>
                <p className="text-sm font-medium text-foreground">Market Strength</p>
                <p className="text-xs text-muted-foreground">Cap-weighted score</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-card rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary rounded-full" 
                  style={{ 
                    width: coin.market_cap > 100000000000 ? '90%' : 
                           coin.market_cap > 10000000000 ? '75%' : 
                           coin.market_cap > 1000000000 ? '50%' : '30%' 
                  }} 
                />
              </div>
              <span className="font-bold text-foreground text-sm">
                {coin.market_cap > 100000000000 ? "High 90%" : 
                 coin.market_cap > 10000000000 ? "High 75%" : 
                 coin.market_cap > 1000000000 ? "Med 50%" : "Low 30%"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-card rounded-lg border border-white/5"><BarChart3 size={18} className="text-primary" /></div>
              <div>
                <p className="text-sm font-medium text-foreground">Momentum</p>
                <p className="text-xs text-muted-foreground">Score 1-100</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-card rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${momentumScore}%` }} />
              </div>
              <span className="font-bold text-foreground text-sm">{Math.round(momentumScore)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-card rounded-lg border border-white/5"><ShieldAlert size={18} className="text-orange-400" /></div>
              <div>
                <p className="text-sm font-medium text-foreground">Risk Level</p>
                <p className="text-xs text-muted-foreground">Volatility index</p>
              </div>
            </div>
            <span className="font-bold text-foreground text-sm">{riskLevel}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
