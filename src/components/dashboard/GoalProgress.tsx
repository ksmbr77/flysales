import { Card } from "@/components/ui/card";
import { Target, Sparkles } from "lucide-react";

interface GoalProgressProps {
  current: number;
  goal: number;
  label: string;
}

export function GoalProgress({ current, goal, label }: GoalProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = goal - current;
  
  return (
    <Card className="p-6 shadow-card border-0 animate-scale-in overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10 animate-pulse-soft">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">{label}</h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-4xl font-bold text-foreground tracking-tight">
                R$ {current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                de R$ {goal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                {percentage.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">atingido</p>
            </div>
          </div>
          
          {/* Progress bar with animation */}
          <div className="relative h-6 rounded-full bg-secondary overflow-hidden">
            {/* Background glow effect */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{ 
                background: `linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3) ${percentage}%, transparent)`,
              }}
            />
            
            {/* Progress bar */}
            <div 
              className="absolute top-0 left-0 h-full rounded-full gradient-progress transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{
                    animation: 'shimmer 2s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
            
            {/* Percentage marker */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-1000"
              style={{ left: `calc(${Math.max(percentage - 2, 2)}%)` }}
            >
              {percentage > 10 && (
                <span className="text-xs font-bold text-white drop-shadow-md">
                  {percentage.toFixed(0)}%
                </span>
              )}
            </div>
          </div>
          
          {remaining > 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-warning animate-pulse-soft" />
              <p>
                Faltam <span className="font-semibold text-foreground">R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> para atingir a meta
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-success font-semibold animate-float">
              <Sparkles className="w-4 h-4" />
              <p>🎉 Meta atingida! Parabéns!</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}