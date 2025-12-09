import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp } from "lucide-react";

interface Servico {
  position: number;
  name: string;
  contratos: number;
  revenue: number;
  trend: number;
}

const servicos: Servico[] = [
  { position: 1, name: "Marketing 360°", contratos: 8, revenue: 32000, trend: 18 },
  { position: 2, name: "Gestão de Tráfego Pago", contratos: 15, revenue: 22500, trend: 25 },
  { position: 3, name: "Funis de Vendas", contratos: 6, revenue: 18000, trend: 12 },
  { position: 4, name: "Branding e Posicionamento", contratos: 4, revenue: 16000, trend: 8 },
];

const positionColors: Record<number, string> = {
  1: "gradient-primary shadow-purple",
  2: "bg-accent/80 shadow-purple",
  3: "bg-warning shadow-warning/30",
};

export function ProductRanking() {
  return (
    <Card className="p-4 md:p-6 shadow-card border-0 animate-scale-in" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
            <Trophy className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-base md:text-lg">Ranking de Serviços</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Por faturamento</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 md:space-y-3">
        {servicos.map((servico, index) => (
          <div
            key={servico.position}
            className="flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-300 animate-slide-up opacity-0"
            style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: 'forwards' }}
          >
            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-primary-foreground shrink-0 ${positionColors[servico.position] || "bg-muted-foreground"}`}>
              {servico.position}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm md:text-base text-foreground truncate">
                {servico.name}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {servico.contratos} contratos
              </p>
            </div>
            
            <div className="text-right shrink-0">
              <p className="font-bold text-sm md:text-base text-foreground">
                R$ {servico.revenue.toLocaleString('pt-BR')}
              </p>
              <div className="flex items-center justify-end gap-1 text-primary">
                <TrendingUp className="w-3 h-3" />
                <span className="text-[10px] md:text-xs font-medium">+{servico.trend}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}