import { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { EditableGoalProgress } from "@/components/dashboard/EditableGoalProgress";
import { WhatsAppButton } from "@/components/dashboard/WhatsAppButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Target, Calendar, TrendingUp, Award, Pencil, Check, X } from "lucide-react";
import { getMesAtual, getMesAnterior, getDiasRestantesMes } from "@/lib/dateUtils";
import { usePersistentState } from "@/hooks/usePersistentState";

const Metas = () => {
  const [currentSales, setCurrentSales] = usePersistentState("fly-metas-currentSales", 18500);
  const [goalValue, setGoalValue] = usePersistentState("fly-metas-goalValue", 30000);
  
  const [historico, setHistorico] = usePersistentState("fly-metas-historico", [
    { mes: getMesAtual(), meta: 30000, atingido: 18500, percentual: 61.7 },
    { mes: getMesAnterior(1), meta: 25000, atingido: 28500, percentual: 114 },
    { mes: getMesAnterior(2), meta: 20000, atingido: 18200, percentual: 91 },
    { mes: getMesAnterior(3), meta: 15000, atingido: 12800, percentual: 85.3 },
    { mes: getMesAnterior(4), meta: 10000, atingido: 8500, percentual: 85 },
  ]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ meta: "", atingido: "" });

  const daysRemaining = useMemo(() => getDiasRestantesMes(), []);
  
  const remaining = Math.max(0, goalValue - currentSales);
  const dailyAverage = daysRemaining > 0 ? remaining / daysRemaining : 0;

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValues({
      meta: historico[index].meta.toString(),
      atingido: historico[index].atingido.toString()
    });
  };

  const handleSaveEdit = (index: number) => {
    const newMeta = parseFloat(editValues.meta) || historico[index].meta;
    const newAtingido = parseFloat(editValues.atingido) || historico[index].atingido;
    const newPercentual = newMeta > 0 ? (newAtingido / newMeta) * 100 : 0;

    setHistorico(prev => prev.map((item, i) => 
      i === index 
        ? { ...item, meta: newMeta, atingido: newAtingido, percentual: newPercentual }
        : item
    ));
    setEditingIndex(null);
  };

  const mesAtual = getMesAtual();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:ml-64">
        <Header />
        
        <main className="p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1 md:mb-2">Gestão de Metas</h2>
            <p className="text-sm md:text-base text-muted-foreground">Acompanhe e gerencie suas metas mensais</p>
          </div>

          {/* Meta Atual */}
          <div className="mb-6 md:mb-8">
            <EditableGoalProgress 
              current={currentSales} 
              goal={goalValue} 
              label={`Meta de ${mesAtual}`}
              onCurrentChange={setCurrentSales}
              onGoalChange={setGoalValue}
            />
          </div>

          {/* Cards de resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            <Card className="p-4 md:p-6 shadow-card border-0 animate-scale-in hover-lift">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 rounded-xl bg-primary/10">
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Meta do Mês</p>
                  <p className="text-lg md:text-2xl font-bold">R$ {goalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 md:p-6 shadow-card border-0 animate-scale-in hover-lift" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 rounded-xl bg-primary/10">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Média Diária Necessária</p>
                  <p className="text-lg md:text-2xl font-bold">R$ {dailyAverage.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 md:p-6 shadow-card border-0 animate-scale-in hover-lift" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 rounded-xl bg-warning/10">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 text-warning" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Dias Restantes</p>
                  <p className="text-lg md:text-2xl font-bold">{daysRemaining} dias</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Histórico */}
          <Card className="p-4 md:p-6 shadow-card border-0 animate-slide-up">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base md:text-lg">Histórico de Metas</h3>
            </div>

            <div className="space-y-3 md:space-y-4">
              {historico.map((item, index) => (
                <div 
                  key={item.mes}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-300 animate-slide-up opacity-0 group gap-3"
                  style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  {editingIndex === index ? (
                    <>
                      <div className="flex-1">
                        <p className="font-medium text-foreground mb-2">{item.mes}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm text-muted-foreground">Meta: R$</span>
                          <Input
                            value={editValues.meta}
                            onChange={(e) => setEditValues(prev => ({ ...prev, meta: e.target.value }))}
                            className="h-8 w-24 md:w-28"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">Atingido: R$</span>
                        <Input
                          value={editValues.atingido}
                          onChange={(e) => setEditValues(prev => ({ ...prev, atingido: e.target.value }))}
                          className="h-8 w-24 md:w-28"
                        />
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleSaveEdit(index)}>
                          <Check className="w-4 h-4 text-primary" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingIndex(null)}>
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="font-medium text-foreground">{item.mes}</p>
                        <p className="text-sm text-muted-foreground">
                          Meta: R$ {item.meta.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-foreground">
                            R$ {item.atingido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className={`text-sm font-medium ${item.percentual >= 100 ? 'text-primary' : item.percentual >= 50 ? 'text-warning' : 'text-muted-foreground'}`}>
                            {item.percentual >= 100 ? '✓ ' : ''}{item.percentual.toFixed(1)}% atingido
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          onClick={() => handleStartEdit(index)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
      
      <WhatsAppButton />
    </div>
  );
};

export default Metas;