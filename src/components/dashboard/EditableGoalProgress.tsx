import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Target, Sparkles, Pencil, Check, X } from "lucide-react";

interface EditableGoalProgressProps {
  current: number;
  goal: number;
  label: string;
  onCurrentChange?: (value: number) => void;
  onGoalChange?: (value: number) => void;
}

export function EditableGoalProgress({ 
  current, 
  goal, 
  label,
  onCurrentChange,
  onGoalChange
}: EditableGoalProgressProps) {
  const [isEditingCurrent, setIsEditingCurrent] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editCurrent, setEditCurrent] = useState(current.toString());
  const [editGoal, setEditGoal] = useState(goal.toString());

  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = Math.max(0, goal - current);

  const parseMoneyValue = (value: string): number => {
    // Remove R$, espaços e pontos de milhar, depois troca vírgula por ponto
    let cleaned = value
      .replace(/R\$\s?/g, '')
      .replace(/\s/g, '')
      .replace(/\./g, '') // Remove pontos de milhar
      .replace(',', '.'); // Troca vírgula decimal por ponto
    
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleSaveCurrent = () => {
    const value = parseMoneyValue(editCurrent);
    if (value > 0) {
      onCurrentChange?.(value);
    }
    setIsEditingCurrent(false);
  };

  const handleSaveGoal = () => {
    const value = parseMoneyValue(editGoal);
    if (value > 0) {
      onGoalChange?.(value);
    }
    setIsEditingGoal(false);
  };

  return (
    <Card className="p-4 md:p-6 shadow-card border-0 animate-scale-in overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-16 md:w-24 h-16 md:h-24 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 animate-pulse-soft">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-base md:text-lg">{label}</h3>
        </div>
        
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-4">
            <div className="group">
              {isEditingCurrent ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <Input
                    value={editCurrent}
                    onChange={(e) => setEditCurrent(e.target.value)}
                    className="text-xl md:text-2xl font-bold h-10 md:h-12 w-full max-w-[180px]"
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveCurrent}>
                    <Check className="w-4 h-4 text-success" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditingCurrent(false)}>
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
                    R$ {current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setEditCurrent(current.toString());
                      setIsEditingCurrent(true);
                    }}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                </div>
              )}
              
              <div className="flex items-center gap-2 mt-1 group/goal">
                {isEditingGoal ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">de R$</span>
                    <Input
                      value={editGoal}
                      onChange={(e) => setEditGoal(e.target.value)}
                      className="text-sm h-8 w-28 md:w-32"
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleSaveGoal}>
                      <Check className="w-3 h-3 text-success" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsEditingGoal(false)}>
                      <X className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      de R$ {goal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 opacity-100 md:opacity-0 group-hover/goal:opacity-100 transition-opacity"
                      onClick={() => {
                        setEditGoal(goal.toString());
                        setIsEditingGoal(true);
                      }}
                    >
                      <Pencil className="w-2.5 h-2.5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-2xl md:text-3xl font-bold text-primary">
                {percentage.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">atingido</p>
            </div>
          </div>
          
          {/* Progress bar with animation */}
          <div className="relative h-5 md:h-6 rounded-full bg-secondary overflow-hidden">
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
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-warning animate-pulse-soft shrink-0" />
              <p>
                Faltam <span className="font-semibold text-foreground">R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> para atingir a meta
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-success font-semibold animate-float text-sm">
              <Sparkles className="w-4 h-4" />
              <p>🎉 Meta atingida! Parabéns!</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
