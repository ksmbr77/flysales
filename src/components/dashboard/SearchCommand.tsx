import { useState, useRef, useEffect } from "react";
import { Search, LayoutDashboard, Target, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const searchItems = [
  { label: "Dashboard", path: "/", keywords: ["dashboard", "inicio", "home", "principal"], icon: LayoutDashboard },
  { label: "Metas", path: "/metas", keywords: ["metas", "objetivos", "goals", "meta"], icon: Target },
  { label: "Relatórios", path: "/relatorios", keywords: ["relatorios", "reports", "vendas", "grafico"], icon: FileText },
];

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = searchItems.filter((item) => {
    if (!query.trim()) return true;
    const searchTerm = query.toLowerCase();
    return (
      item.label.toLowerCase().includes(searchTerm) ||
      item.keywords.some((k) => k.includes(searchTerm))
    );
  });

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Buscar página..."
          className="pl-10 w-48 lg:w-64 bg-secondary border-0 focus:ring-2 focus:ring-primary/20"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>
      
      {open && (
        <div className="absolute top-full left-0 mt-2 w-full bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
          <div className="p-2">
            <p className="text-xs text-muted-foreground px-2 py-1 font-medium">Páginas</p>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleSelect(item.path)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-md transition-colors text-left"
                  >
                    <IconComponent className="w-4 h-4 text-muted-foreground" />
                    {item.label}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-2 text-sm text-muted-foreground">Nenhuma página encontrada.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
