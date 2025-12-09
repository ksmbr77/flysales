import { Card } from "@/components/ui/card";
import { Trophy, TrendingUp, ExternalLink } from "lucide-react";

interface Product {
  position: number;
  name: string;
  sales: number;
  revenue: number;
}

const products: Product[] = [
  { position: 1, name: "Jogo de Lençol Infantil do Homem Aranha", sales: 597, revenue: 24232.15 },
  { position: 2, name: "Jogo de Lençol Infantil com Fronha", sales: 416, revenue: 18168.28 },
  { position: 3, name: "Jogo de Lençol Infantil Do Stitch", sales: 120, revenue: 5237.28 },
  { position: 4, name: "Jogo De Lençol Com Elástico 3Pçs", sales: 71, revenue: 2556.33 },
  { position: 5, name: "Jogo de Lençol Infantil da Barbie", sales: 27, revenue: 1010.85 },
];

const positionColors: Record<number, string> = {
  1: "bg-yellow-500 shadow-yellow-500/30",
  2: "bg-gray-400 shadow-gray-400/30",
  3: "bg-amber-600 shadow-amber-600/30",
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
            <h3 className="font-semibold text-base md:text-lg">Ranking de Produtos</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Últimos 30 dias</p>
          </div>
        </div>
        <a 
          href="https://shopee.com.br/fortlartextil"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs md:text-sm text-primary hover:underline flex items-center gap-1"
        >
          Ver loja <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      
      <div className="space-y-2 md:space-y-3">
        {products.map((product, index) => (
          <a
            key={product.position}
            href="https://shopee.com.br/fortlartextil"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-300 cursor-pointer group animate-slide-up opacity-0"
            style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: 'forwards' }}
          >
            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-white shadow-lg shrink-0 ${positionColors[product.position] || "bg-muted-foreground"}`}>
              {product.position}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm md:text-base text-foreground truncate group-hover:text-primary transition-colors">
                {product.name}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {product.sales} vendas
              </p>
            </div>
            
            <div className="text-right shrink-0">
              <p className="font-bold text-sm md:text-base text-foreground">
                R$ {product.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center justify-end gap-1 text-success">
                <TrendingUp className="w-3 h-3" />
                <span className="text-[10px] md:text-xs font-medium">Ativo</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
}
