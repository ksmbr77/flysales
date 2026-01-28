import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, DollarSign, AlertTriangle, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface BusinessHealthCardProps {
  mrr: number;
  receitaNovaPrevista: number;
  churnMes: number;
  metaMensal: number;
  receitaFechada: number;
  onUpdateMeta: (newMeta: number) => void;
}

export function BusinessHealthCard({
  mrr,
  receitaNovaPrevista,
  churnMes,
  metaMensal,
  receitaFechada,
  onUpdateMeta
}: BusinessHealthCardProps) {
  const [configOpen, setConfigOpen] = useState(false);
  const [newMeta, setNewMeta] = useState(metaMensal);

  const metaPercent = metaMensal > 0 ? Math.min((receitaFechada / metaMensal) * 100, 100) : 0;
  const receitaProjetada = mrr + receitaNovaPrevista - churnMes;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const capitalizedMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

  const handleSaveMeta = () => {
    onUpdateMeta(newMeta);
    setConfigOpen(false);
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Saúde do Negócio</CardTitle>
                <p className="text-xs text-muted-foreground">{capitalizedMonth}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setConfigOpen(true)}>
              <Settings2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Métricas principais */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="text-center p-2 sm:p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <DollarSign className="w-4 h-4 mx-auto text-blue-500 mb-1" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">MRR Atual</p>
              <p className="text-sm sm:text-lg font-bold text-blue-500">{formatCurrency(mrr)}</p>
            </div>
            <div className="text-center p-2 sm:p-3 rounded-lg bg-primary/10 border border-primary/20">
              <TrendingUp className="w-4 h-4 mx-auto text-primary mb-1" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">Nova Prevista</p>
              <p className="text-sm sm:text-lg font-bold text-primary">{formatCurrency(receitaNovaPrevista)}</p>
            </div>
            <div className="text-center p-2 sm:p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <TrendingDown className="w-4 h-4 mx-auto text-red-500 mb-1" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">Churn</p>
              <p className="text-sm sm:text-lg font-bold text-red-500">-{formatCurrency(churnMes)}</p>
            </div>
          </div>

          {/* Meta do Mês */}
          <div className="space-y-2 p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium">Meta do Mês</span>
              </div>
              <Badge 
                variant={metaPercent >= 100 ? "default" : metaPercent >= 70 ? "secondary" : "destructive"}
                className="text-xs"
              >
                {metaPercent.toFixed(0)}%
              </Badge>
            </div>
            <Progress value={metaPercent} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {formatCurrency(receitaFechada)} de {formatCurrency(metaMensal)}
            </p>
          </div>

          {/* Projeção Total */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-xs sm:text-sm font-medium">Projeção Total</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-primary">{formatCurrency(receitaProjetada)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Configuração */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Configurar Meta Mensal</DialogTitle>
            <DialogDescription>Defina sua meta de faturamento para este mês</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Meta Mensal (R$)</Label>
            <Input
              type="number"
              value={newMeta}
              onChange={(e) => setNewMeta(Number(e.target.value))}
              placeholder="30000"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveMeta}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
