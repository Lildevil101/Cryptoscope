import { TopBar } from "@/components/layout";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Switch } from "@/components/ui/switch";
import { Moon, Bell, DollarSign, Shield, Info, ChevronRight, Github } from "lucide-react";

export function Settings() {
  const [notifications, setNotifications] = useLocalStorage("cryptoscope_notifs", true);

  const settingGroups = [
    {
      title: "Preferences",
      items: [
        { icon: DollarSign, label: "Currency", value: "USD ($)", type: "value" },
        { icon: Moon, label: "Dark Mode", value: "Always On", type: "value" },
        { 
          icon: Bell, 
          label: "Push Notifications", 
          type: "toggle", 
          checked: notifications, 
          onChange: setNotifications 
        },
      ]
    },
    {
      title: "About",
      items: [
        { icon: Shield, label: "Privacy Policy", type: "link" },
        { icon: Info, label: "Terms of Service", type: "link" },
        { icon: Github, label: "Open Source Data (CoinGecko)", type: "link" },
        { icon: Info, label: "Version", value: "1.0.0", type: "value" },
      ]
    }
  ];

  return (
    <>
      <TopBar title="Settings" />
      
      <div className="px-6 py-6 flex-1 space-y-8 pb-24">
        
        {/* Profile Card Mock */}
        <div className="glass-panel p-5 rounded-[2rem] flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5">
            <div className="w-full h-full bg-background rounded-full flex items-center justify-center border-2 border-transparent">
              <span className="font-display font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">CS</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Pro User</h2>
            <p className="text-sm text-primary">Connected to Matrix</p>
          </div>
        </div>

        {settingGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">
              {group.title}
            </h3>
            <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5">
              {group.items.map((item, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-card rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
                      <item.icon size={18} />
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                  
                  {item.type === "value" && (
                    <span className="text-muted-foreground text-sm font-medium">{item.value}</span>
                  )}
                  
                  {item.type === "toggle" && (
                    <Switch 
                      checked={item.checked ?? false} 
                      onCheckedChange={item.onChange ?? (() => {})}
                      className="data-[state=checked]:bg-primary"
                    />
                  )}
                  
                  {item.type === "link" && (
                    <ChevronRight size={18} className="text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="text-center pt-8 opacity-50">
          <p className="text-xs text-muted-foreground">CryptoScope is a concept app.<br/>Data provided by CoinGecko API.</p>
        </div>
      </div>
    </>
  );
}
