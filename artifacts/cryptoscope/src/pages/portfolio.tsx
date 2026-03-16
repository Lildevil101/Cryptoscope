import { useState } from "react";
import { TopBar } from "@/components/layout";
import { useMarketData } from "@/hooks/use-coingecko";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { formatPrice, cn } from "@/lib/utils";
import { Plus, Wallet, Trash2, TrendingUp, TrendingDown, ChevronRight, PieChart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Holding {
  id: string;
  coinId: string; // coingecko id
  amount: number;
  buyPrice: number;
}

export function Portfolio() {
  const [holdings, setHoldings] = useLocalStorage<Holding[]>("cryptoscope_portfolio", []);
  const { data: coins } = useMarketData();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newCoinId, setNewCoinId] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const addHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoinId || !newAmount || !newPrice) return;
    
    const holding: Holding = {
      id: Math.random().toString(36).substr(2, 9),
      coinId: newCoinId,
      amount: parseFloat(newAmount),
      buyPrice: parseFloat(newPrice)
    };
    
    setHoldings([...holdings, holding]);
    setIsAdding(false);
    setNewCoinId("");
    setNewAmount("");
    setNewPrice("");
  };

  const removeHolding = (id: string) => {
    setHoldings(holdings.filter(h => h.id !== id));
  };

  // Calculate totals
  let totalValue = 0;
  let totalCost = 0;

  const holdingsWithData = holdings.map(holding => {
    const coinData = coins?.find(c => c.id === holding.coinId);
    const currentPrice = coinData?.current_price || holding.buyPrice; // fallback to buy price if data loading
    const value = holding.amount * currentPrice;
    const cost = holding.amount * holding.buyPrice;
    const pnl = value - cost;
    const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;
    
    totalValue += value;
    totalCost += cost;

    return { ...holding, coinData, value, pnl, pnlPercent };
  });

  const totalPnl = totalValue - totalCost;
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
  const isTotalPositive = totalPnl >= 0;

  return (
    <>
      <TopBar title="Portfolio" />
      
      <div className="px-6 py-6 flex-1 flex flex-col">
        
        {/* Balance Card */}
        <div className="glass-panel rounded-[2rem] p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Wallet size={120} />
          </div>
          
          <p className="text-muted-foreground font-medium mb-2">Total Balance</p>
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">{formatPrice(totalValue)}</h2>
          
          <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Profit/Loss</p>
              <div className={cn(
                "flex items-center gap-1 font-bold",
                isTotalPositive ? "text-primary" : "text-destructive"
              )}>
                {isTotalPositive ? "+" : ""}{formatPrice(totalPnl)}
                <span className="text-xs ml-1 bg-background/50 px-2 py-0.5 rounded-md">
                  {isTotalPositive ? "+" : ""}{totalPnlPercent.toFixed(2)}%
                </span>
              </div>
            </div>
            
            <Dialog open={isAdding} onOpenChange={setIsAdding}>
              <DialogTrigger asChild>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
                  <Plus size={24} />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card border-white/10 text-foreground">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">Add Transaction</DialogTitle>
                </DialogHeader>
                <form onSubmit={addHolding} className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Select Asset</label>
                    <select 
                      className="w-full bg-background border border-white/10 rounded-xl p-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                      value={newCoinId}
                      onChange={(e) => setNewCoinId(e.target.value)}
                      required
                    >
                      <option value="">Select a coin...</option>
                      {coins?.slice(0, 50).map(coin => (
                        <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol.toUpperCase()})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Amount</label>
                    <input 
                      type="number" step="any" required
                      className="w-full bg-background border border-white/10 rounded-xl p-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                      placeholder="e.g. 0.5"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Buy Price (USD)</label>
                    <input 
                      type="number" step="any" required
                      className="w-full bg-background border border-white/10 rounded-xl p-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                      placeholder="e.g. 45000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="w-full py-4 mt-2 rounded-xl font-bold bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:scale-[1.02] transition-transform">
                    Add Asset
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-4 text-foreground">Your Assets</h3>

        {holdings.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center pb-20 opacity-60">
            <PieChart size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your portfolio is empty.<br/>Tap the + button to add assets.</p>
          </div>
        ) : (
          <div className="space-y-3 pb-8">
            {holdingsWithData.map((holding) => {
              const isPnlPositive = holding.pnl >= 0;
              return (
                <div key={holding.id} className="glass-panel rounded-2xl p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    {holding.coinData ? (
                      <img src={holding.coinData.image} alt="coin" className="w-10 h-10 rounded-full bg-background" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-background animate-pulse" />
                    )}
                    <div>
                      <h4 className="font-bold text-foreground">{holding.coinData?.name || 'Loading...'}</h4>
                      <p className="text-xs text-muted-foreground">{holding.amount} {holding.coinData?.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-foreground">{formatPrice(holding.value)}</p>
                      <p className={cn("text-xs font-medium flex items-center justify-end gap-1", isPnlPositive ? "text-primary" : "text-destructive")}>
                        {isPnlPositive ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                        {Math.abs(holding.pnlPercent).toFixed(2)}%
                      </p>
                    </div>
                    <button 
                      onClick={() => removeHolding(holding.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
