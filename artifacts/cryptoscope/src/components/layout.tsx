import { Link, useLocation } from "wouter";
import { Activity, Star, PieChart, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Activity, label: "Market" },
    { href: "/watchlist", icon: Star, label: "Watchlist" },
    { href: "/portfolio", icon: PieChart, label: "Portfolio" },
    { href: "/alerts", icon: Bell, label: "Alerts" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="max-w-[430px] mx-auto min-h-screen relative bg-card/10 shadow-2xl border-x border-white/5 pb-24 overflow-x-hidden">
        {/* Main Content Area */}
        <main className="w-full min-h-full flex flex-col">
          {children}
        </main>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 w-full max-w-[430px] z-50 px-4 pb-6 pt-2 pointer-events-none">
          <nav className="glass-panel rounded-3xl flex justify-between items-center px-2 py-3 pointer-events-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/");
              
              return (
                <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center justify-center gap-1 group relative">
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    isActive ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,255,136,0.2)]" : "text-muted-foreground group-hover:text-foreground group-hover:bg-white/5"
                  )}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

export function TopBar({ title, rightAction }: { title: React.ReactNode, rightAction?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-8 h-8 rounded-lg shadow-[0_0_10px_rgba(0,255,136,0.3)]" />
        <h1 className="text-xl font-display font-bold text-foreground tracking-wide">
          {title}
        </h1>
      </div>
      {rightAction && (
        <div>{rightAction}</div>
      )}
    </header>
  );
}
