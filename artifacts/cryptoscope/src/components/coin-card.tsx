import { Link } from "wouter";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CoinMarketData } from "@/hooks/use-coingecko";

interface CoinCardProps {
  coin: CoinMarketData;
  index: number;
}

export function CoinCard({ coin, index }: CoinCardProps) {
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <Link 
      href={`/coin/${coin.id}`}
      className="block w-full"
    >
      <div 
        className="glass-panel rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-[0.98] group cursor-pointer"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full bg-card" loading="lazy" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-card rounded-full flex items-center justify-center text-[10px] font-bold border border-white/10 text-muted-foreground">
              {coin.market_cap_rank}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{coin.name}</h3>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{coin.symbol}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-display font-bold text-foreground text-lg">
            {formatPrice(coin.current_price)}
          </p>
          <div className={cn(
            "flex items-center justify-end gap-1 text-sm font-medium mt-0.5",
            isPositive ? "text-primary" : "text-destructive"
          )}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
          </div>
        </div>
      </div>
    </Link>
  );
}
