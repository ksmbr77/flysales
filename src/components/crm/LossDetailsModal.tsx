import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, Calendar, DollarSign, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Perda {
  id: string;
  nome: string;
  empresa: string;
  valor: number;
  motivo: string;
  estagio_quando_perdeu: string;
  data_perda: string;
}

interface LossDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LossDetailsModal({ open, onOpenChange }: LossDetailsModalProps) {
  const [perdas, setPerdas] = useState<Perda[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchPerdas();
    }
  }, [open]);

  const fetchPerdas = async () => {
    setLoading(true);
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);

    const { data, error } = await supabase
      .from('crm_perdas')
      .select('*')
      .gte('data_perda', dataLimite.toISOString())
      .order('data_perda', { ascending: false });

    if (!error && data) {
      setPerdas(data);
    }
    setLoading(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const totalPerdido = perdas.reduce((acc, p) => acc + p.valor, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-red-500/10">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <DialogTitle>Análise de Perdas - Últimos 30 dias</DialogTitle>
              <DialogDescription className="text-xs">
                {perdas.length} negócios perdidos • Total: {formatCurrency(totalPerdido)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-3 py-2">
          {loading ? (
            <>
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </>
          ) : perdas.length === 0 ? (
            <div className="text-center py-8">
              <TrendingDown className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Nenhuma perda registrada nos últimos 30 dias</p>
              <p className="text-xs text-muted-foreground mt-1">Isso é ótimo! 🎉</p>
            </div>
          ) : (
            <AnimatePresence>
              {perdas.map((perda, index) => (
                <motion.div
                  key={perda.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 sm:p-4 border rounded-lg bg-card hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm truncate">{perda.nome}</h4>
                        <Badge variant="outline" className="text-[10px]">
                          <Building2 className="w-2.5 h-2.5 mr-1" />
                          {perda.empresa}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(perda.valor)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(perda.data_perda), "dd 'de' MMMM", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1">
                      <Badge variant="destructive" className="text-[10px]">
                        {perda.motivo}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        Estágio: {perda.estagio_quando_perdeu}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="pt-4 border-t flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
