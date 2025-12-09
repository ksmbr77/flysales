import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Target, 
  TrendingUp,
  HelpCircle,
  Users,
  Kanban,
  X,
  Rocket,
  Instagram,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink, useLocation } from "react-router-dom";
import logoFly from "@/assets/logo-fly.png";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Comercial", path: "/comercial" },
  { icon: Kanban, label: "CRM", path: "/crm" },
  { icon: Target, label: "Metas", path: "/metas" },
  { icon: TrendingUp, label: "Relatórios", path: "/relatorios" },
  { icon: HelpCircle, label: "Suporte", path: "/suporte" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar text-sidebar-foreground flex-col transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0 flex" : "-translate-x-full lg:flex"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-1 flex items-center justify-center shadow-lg">
              <img src={logoFly} alt="Fly Agency" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight">Fly Agency</h2>
              <p className="text-xs text-sidebar-foreground/60 flex items-center gap-1">
                <Rocket className="w-3 h-3" />
                Digital
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li 
                  key={item.label}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="animate-slide-up opacity-0"
                >
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow animate-glow" 
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover-scale"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Links Externos */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <a 
            href="https://www.instagram.com/fly.agencyy/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sidebar-accent/50 hover:bg-sidebar-accent transition-all duration-200 group"
          >
            <Instagram className="w-5 h-5 text-pink-400" />
            <span className="text-sm font-medium">@fly.agencyy</span>
          </a>
          <a 
            href="https://flyagency.pro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sidebar-accent/50 hover:bg-sidebar-accent transition-all duration-200 group"
          >
            <Globe className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">flyagency.pro</span>
          </a>
        </div>
      </aside>
    </>
  );
}