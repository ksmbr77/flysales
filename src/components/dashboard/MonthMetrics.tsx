import { Card } from "@/components/ui/card";
import { Target, TrendingUp, Calendar } from "lucide-react";
import { usePersistentState } from "@/hooks/usePersistentState";

export function MonthMetrics() {
  const [goalValue] = usePersistentState("fly-goal-value", 30000);
  const [currentSales] = usePersistentState("fly-current-sales", 18500);
  
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const remainingDays = Math.max(1, lastDayOfMonth.getDate() - today.getDate() + 1);
  
  const remainingToGoal = Math.max(0, goalValue - currentSales);
  const dailyAverage = remainingToGoal / remainingDays;

  const metrics = [
    {
      icon: Target,
      label: "Meta do Mês",
      value: `R$ ${goalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      color: "bg-primary/10 text-primary"
    },
    {
      icon: TrendingUp,
      label: "Média Diária Necessária",
      value: `R$ ${dailyAverage.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      color: "bg-accent/10 text-accent"
    },
    {
      icon: Calendar,
      label: "Dias Restantes",
      value: `${remainingDays} dias`,
      color: "bg-warning/10 text-warning"
    }
  ];

  return (
    <Card className="p-4 md:p-6 shadow-card border-0 animate-scale-in" style={{ animationDelay: '200ms' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 animate-slide-up opacity-0"
            style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: 'forwards' }}
          >
            <div className={`p-3 rounded-xl ${metric.color}`}>
              <metric.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">{metric.label}</p>
              <p className="font-bold text-lg md:text-xl text-foreground">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
