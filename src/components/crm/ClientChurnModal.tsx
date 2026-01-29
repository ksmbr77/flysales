import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserMinus, AlertTriangle } from "lucide-react";

const motivosChurn = [
  { id: "preco", label: "💰 Achou muito caro" },
  { id: "caixa", label: "💸 Problemas financeiros" },
  { id: "resultados", label: "📉 Insatisfeito com resultados" },
  { id: "atendimento", label: "😤 Problemas no atendimento" },
  { id: "mudanca_estrategia", label: "🔄 Mudou estratégia de marketing" },
  { id: "internalizou", label: "🏢 Internalizou o serviço" },
  { id: "fechou_empresa", label: "🚫 Fechou a empresa" },
  { id: "concorrente", label: "🎯 Foi para concorrente" },
  { id: "outro", label: "✏️ Outro" },
];

interface ClientChurnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteNome: string;
  valorMensal: number;
  onConfirm: (motivo: string, detalhes: string) => void;
  onCancel: () => void;
}

export function ClientChurnModal({
  open,
  onOpenChange,
  clienteNome,
  valorMensal,
  onConfirm,
  onCancel
}: ClientChurnModalProps) {
  const [selectedMotivo, setSelectedMotivo] = useState("");
  const [detalhes, setDetalhes] = useState("");

  const handleConfirm = () => {
    if (!selectedMotivo) return;
    const motivoLabel = motivosChurn.find(m => m.id === selectedMotivo)?.label || selectedMotivo;
    onConfirm(motivoLabel, detalhes);
    setSelectedMotivo("");
    setDetalhes("");
  };

  const handleCancel = () => {
    setSelectedMotivo("");
    setDetalhes("");
    onCancel();
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2"
          >
            <div className="p-2 rounded-full bg-red-500/10">
              <UserMinus className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <DialogTitle>Cliente Inativo / Saiu</DialogTitle>
              <DialogDescription className="text-xs">
                Por que <strong>{clienteNome}</strong> está saindo?
              </DialogDescription>
            </div>
          </motion.div>
        </DialogHeader>

        <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <p className="text-sm text-red-600">
            Receita perdida: <strong>{formatCurrency(valorMensal)}/mês</strong>
          </p>
        </div>
        
        <div className="space-y-4 py-2 max-h-[40vh] overflow-y-auto">
          <RadioGroup value={selectedMotivo} onValueChange={setSelectedMotivo}>
            <div className="space-y-2">
              {motivosChurn.map((motivo) => (
                <motion.div
                  key={motivo.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedMotivo === motivo.id 
                      ? 'border-red-500 bg-red-500/5' 
                      : 'border-border hover:border-red-500/50 hover:bg-secondary/50'
                  }`}
                  onClick={() => setSelectedMotivo(motivo.id)}
                >
                  <RadioGroupItem value={motivo.id} id={`churn-${motivo.id}`} />
                  <Label htmlFor={`churn-${motivo.id}`} className="cursor-pointer flex-1 text-sm">
                    {motivo.label}
                  </Label>
                </motion.div>
              ))}
            </div>
          </RadioGroup>

          {selectedMotivo === "outro" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <Label className="text-xs">Especifique o motivo</Label>
              <Textarea
                value={detalhes}
                onChange={(e) => setDetalhes(e.target.value)}
                placeholder="Descreva o motivo..."
                rows={2}
              />
            </motion.div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedMotivo || (selectedMotivo === "outro" && !detalhes)}
            variant="destructive"
          >
            <UserMinus className="w-4 h-4 mr-2" />
            Confirmar Saída
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
