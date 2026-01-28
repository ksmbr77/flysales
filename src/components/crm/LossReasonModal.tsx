import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertTriangle } from "lucide-react";

const motivosPerda = [
  { id: "preco", label: "💰 Preço alto", icon: "💰" },
  { id: "timing", label: "⏰ Timing ruim (cliente não está pronto)", icon: "⏰" },
  { id: "orcamento", label: "💸 Falta de caixa/orçamento", icon: "💸" },
  { id: "valor", label: "❌ Não viu valor no serviço", icon: "❌" },
  { id: "decisao", label: "🤔 Decidiu não investir", icon: "🤔" },
  { id: "concorrente", label: "🔄 Foi para concorrente", icon: "🔄" },
  { id: "sumiu", label: "👻 Sumiu / Não respondeu mais", icon: "👻" },
  { id: "outro", label: "✏️ Outro", icon: "✏️" },
];

interface LossReasonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteNome: string;
  onConfirm: (motivo: string, detalhes: string) => void;
  onCancel: () => void;
}

export function LossReasonModal({
  open,
  onOpenChange,
  clienteNome,
  onConfirm,
  onCancel
}: LossReasonModalProps) {
  const [selectedMotivo, setSelectedMotivo] = useState("");
  const [detalhes, setDetalhes] = useState("");

  const handleConfirm = () => {
    if (!selectedMotivo) return;
    const motivoLabel = motivosPerda.find(m => m.id === selectedMotivo)?.label || selectedMotivo;
    onConfirm(motivoLabel, detalhes);
    setSelectedMotivo("");
    setDetalhes("");
  };

  const handleCancel = () => {
    setSelectedMotivo("");
    setDetalhes("");
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-red-500/10">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <DialogTitle>Motivo da Perda</DialogTitle>
              <DialogDescription className="text-xs">
                Por que o negócio com <strong>{clienteNome}</strong> não fechou?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-4 max-h-[50vh] overflow-y-auto">
          <RadioGroup value={selectedMotivo} onValueChange={setSelectedMotivo}>
            <div className="space-y-2">
              {motivosPerda.map((motivo) => (
                <div
                  key={motivo.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedMotivo === motivo.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  }`}
                  onClick={() => setSelectedMotivo(motivo.id)}
                >
                  <RadioGroupItem value={motivo.id} id={motivo.id} />
                  <Label htmlFor={motivo.id} className="cursor-pointer flex-1 text-sm">
                    {motivo.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          {selectedMotivo === "outro" && (
            <div>
              <Label className="text-xs">Especifique o motivo</Label>
              <Textarea
                value={detalhes}
                onChange={(e) => setDetalhes(e.target.value)}
                placeholder="Descreva o motivo..."
                rows={2}
              />
            </div>
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
            Confirmar Perda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
