import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Target, 
  TrendingUp,
  HelpCircle,
  ExternalLink,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink, useLocation } from "react-router-dom";
import logoFortlar from "@/assets/logo-fortlar.png";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
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
            <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
              <img src={logoFortlar} alt="Fortlar Têxtil" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight">Fortlar</h2>
              <p className="text-xs text-sidebar-foreground/60">Têxtil</p>
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
        
        {/* Shopee Badge */}
        <div className="p-4 border-t border-sidebar-border">
          <a 
            href="https://shopee.com.br/fortlartextil?entryPoint=ShopBySearch&searchKeyword=fortlar%20textil"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-xl bg-sidebar-accent hover:bg-sidebar-primary/50 transition-all duration-300 hover-lift group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span className="text-sm font-medium">Loja Shopee</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-sidebar-foreground/60">fortlartextil</p>
          </a>
        </div>
      </aside>
    </>
  );
}