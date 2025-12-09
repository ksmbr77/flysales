import { User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { NotificationsPopover } from "./NotificationsPopover";
import { SearchCommand } from "./SearchCommand";

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <header className="bg-card border-b border-border px-4 md:px-6 py-3 md:py-4 animate-fade-in">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">
                Olá, Fortlar! 👋
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground capitalize truncate">{currentDate}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 md:gap-3 shrink-0">
            <SearchCommand />
            <NotificationsPopover />
            <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
              <User className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
