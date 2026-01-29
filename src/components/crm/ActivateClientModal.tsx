import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Calendar, DollarSign, Briefcase } from "lucide-react";
import { format } from "date-fns";

interface ActivateClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteNome: string;
  clienteEmpresa: string;
  ticketSugerido: number;
  onConfirm: (data: {
    valor_mensal: number;
    data_inicio_contrato: string;
    data_renovacao: string;
    escopo_contratado: string;
    observacoes: string;
  }) => void;
  onCancel: () => void;
}

const servicosDisponiveis = [
  "Gestão de Tráfego Pago",
  "Funis de Vendas",
  "Marketing 360",
  "Branding e Posicionamento"
];

export function ActivateClientModal({
  open,
  onOpenChange,
  clienteNome,
  clienteEmpresa,
  ticketSugerido,
  onConfirm,
  onCancel
}: ActivateClientModalProps) {
  const [form, setForm] = useState({
    valor_mensal: ticketSugerido,
    data_inicio_contrato: format(new Date(), 'yyyy-MM-dd'),
    data_renovacao: "",
    escopo_contratado: "",
    observacoes: ""
  });

  const handleConfirm = () => {
    if (!form.escopo_contratado) {
      return;
    }
    onConfirm(form);
    // Reset form
    setForm({
      valor_mensal: 0,
      data_inicio_contrato: format(new Date(), 'yyyy-MM-dd'),
      data_renovacao: "",
      escopo_contratado: "",
      observacoes: ""
    });
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
            <div className="p-2 rounded-full bg-green-500/10">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <DialogTitle>Ativar Cliente 🎉</DialogTitle>
              <DialogDescription className="text-xs">
                Parabéns! <strong>{clienteNome}</strong> da <strong>{clienteEmpresa}</strong> fechou negócio!
              </DialogDescription>
            </div>
          </motion.div>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 py-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Valor Mensal
                </Label>
                <Input
                  type="number"
                  value={form.valor_mensal}
                  onChange={(e) => setForm(prev => ({ ...prev, valor_mensal: Number(e.target.value) }))}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  Serviço *
                </Label>
                <Select 
                  value={form.escopo_contratado} 
                  onValueChange={(value) => setForm(prev => ({ ...prev, escopo_contratado: value }))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {servicosDisponiveis.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Início do Contrato
                </Label>
                <Input
                  type="date"
                  value={form.data_inicio_contrato}
                  onChange={(e) => setForm(prev => ({ ...prev, data_inicio_contrato: e.target.value }))}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Data Renovação
                </Label>
                <Input
                  type="date"
                  value={form.data_renovacao}
                  onChange={(e) => setForm(prev => ({ ...prev, data_renovacao: e.target.value }))}
                  className="h-9"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Observações</Label>
              <Textarea
                value={form.observacoes}
                onChange={(e) => setForm(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Detalhes do contrato..."
                rows={2}
                className="text-sm"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!form.escopo_contratado}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Ativar Cliente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
