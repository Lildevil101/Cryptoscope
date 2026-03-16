import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout";
import { useMarketData } from "@/hooks/use-coingecko";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { formatPrice, cn } from "@/lib/utils";
import { Bell, BellRing, Plus, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Alert {
  id: string;
  coinId: string;
  targetPrice: number;
  type: 'above' | 'below';
  isTriggered: boolean;
}

export function Alerts() {
  const [alerts, setAlerts] = useLocalStorage<Alert[]>("cryptoscope_alerts", []);
  const { data: coins } = useMarketData();
  const [isAdding, setIsAdding] = useState(false);
  
  // Form state
  const [coinId, setCoinId] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');

  // Check alerts against current prices
  useEffect(() => {
    if (!coins || !alerts.length) return;
    
    let updated = false;
    const newAlerts = alerts.map(alert => {
      if (alert.isTriggered) return alert;
      
      const coin = coins.find(c => c.id === alert.coinId);
      if (!coin) return alert;

      const triggered = 
        (alert.type === 'above' && coin.current_price >= alert.targetPrice) ||
        (alert.type === 'below' && coin.current_price <= alert.targetPrice);

      if (triggered) updated = true;
      return { ...alert, isTriggered: triggered };
    });

    if (updated) setAlerts(newAlerts);
  }, [coins, alerts, setAlerts]);

  const addAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coinId || !targetPrice) return;
    
    const newAlert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      coinId,
      targetPrice: parseFloat(targetPrice),
      type: alertType,
      isTriggered: false
    };
    
    setAlerts([...alerts, newAlert]);
    setIsAdding(false);
    setCoinId("");
    setTargetPrice("");
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <>
      <TopBar 
        title="Price Alerts" 
        rightAction={
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <button className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors flex items-center gap-1 font-medium text-sm">
                <Plus size={20} /> Add
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-white/10 text-foreground">
              <DialogHeader>
                <DialogTitle className="font-display">Set Price Alert</DialogTitle>
              </DialogHeader>
              <form onSubmit={addAlert} className="space-y-4 pt-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Select Coin</label>
                  <select 
                    className="w-full bg-background border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-secondary/50 outline-none"
                    value={coinId}
                    onChange={(e) => setCoinId(e.target.value)}
                    required
                  >
                    <option value="">Select a coin...</option>
                    {coins?.slice(0, 100).map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({formatPrice(c.current_price)})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setAlertType('above')} className={cn("p-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all", alertType === 'above' ? "bg-primary/20 border-primary text-primary" : "border-white/10 text-muted-foreground hover:bg-white/5")}>
                    <ArrowUpCircle size={18}/> Above
                  </button>
                  <button type="button" onClick={() => setAlertType('below')} className={cn("p-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all", alertType === 'below' ? "bg-destructive/20 border-destructive text-destructive" : "border-white/10 text-muted-foreground hover:bg-white/5")}>
                    <ArrowDownCircle size={18}/> Below
                  </button>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Target Price (USD)</label>
                  <input 
                    type="number" step="any" required
                    className="w-full bg-background border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-secondary/50 outline-none"
                    placeholder="e.g. 50000"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full py-4 mt-4 rounded-xl font-bold bg-secondary text-secondary-foreground shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:scale-[1.02] transition-transform">
                  Create Alert
                </button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      
      <div className="px-6 py-6 flex-1">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center px-4 opacity-60">
            <Bell size={64} strokeWidth={1} className="text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No active alerts</h3>
            <p className="text-muted-foreground">Get notified when a coin hits your target price.</p>
          </div>
        ) : (
          <div className="space-y-4 pb-8">
            {alerts.map((alert) => {
              const coin = coins?.find(c => c.id === alert.coinId);
              return (
                <div key={alert.id} className={cn(
                  "rounded-2xl p-5 border relative overflow-hidden flex items-center justify-between",
                  alert.isTriggered 
                    ? "bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(0,255,136,0.1)]" 
                    : "glass-panel border-white/5"
                )}>
                  {alert.isTriggered && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                      TRIGGERED
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-full", alert.isTriggered ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
                      {alert.isTriggered ? <BellRing size={20} /> : <Bell size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground capitalize flex items-center gap-2">
                        {coin?.symbol || alert.coinId}
                        {alert.type === 'above' ? <ArrowUpCircle size={14} className="text-primary" /> : <ArrowDownCircle size={14} className="text-destructive" />}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Target: <span className="text-foreground font-medium">{formatPrice(alert.targetPrice)}</span>
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => removeAlert(alert.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
