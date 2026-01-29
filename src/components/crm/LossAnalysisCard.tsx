import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingDown, Lightbulb, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface PerdaAnalise {
  motivo: string;
  quantidade: number;
  percentual: number;
}

interface LossAnalysisCardProps {
  perdas: PerdaAnalise[];
  totalPerdas: number;
  onVerDetalhes?: () => void;
}

const getInsight = (topMotivo: string): string => {
  if (topMotivo.includes("Preço")) {
    return "A maioria das perdas são por preço. Considere criar uma proposta de entrada mais acessível ou destacar melhor o ROI.";
  }
  if (topMotivo.includes("Sumiu")) {
    return "Muitos leads estão sumindo. Revise seu processo de follow-up e implemente lembretes automáticos.";
  }
  if (topMotivo.includes("Timing")) {
    return "Timing é um fator importante. Crie uma cadência de nutrição para manter contato com leads que não estão prontos.";
  }
  if (topMotivo.includes("orçamento") || topMotivo.includes("caixa")) {
    return "Falta de orçamento é comum. Ofereça opções de parcelamento ou pacotes menores.";
  }
  if (topMotivo.includes("valor")) {
    return "Os leads não estão vendo valor. Revise sua apresentação de benefícios e cases de sucesso.";
  }
  if (topMotivo.includes("concorrente")) {
    return "Você está perdendo para concorrentes. Analise o que eles oferecem e reforce seus diferenciais.";
  }
  return "Analise os motivos de perda para identificar padrões e oportunidades de melhoria.";
};

export function LossAnalysisCard({ perdas, totalPerdas, onVerDetalhes }: LossAnalysisCardProps) {
  if (perdas.length === 0) {
    return (
      <Card className="bg-secondary/30">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma perda registrada nos últimos 30 dias
          </p>
        </CardContent>
      </Card>
    );
  }

  const topMotivo = perdas[0]?.motivo || "";
  const insight = getInsight(topMotivo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onVerDetalhes}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div 
                className="p-2 rounded-lg bg-red-500/10"
                whileHover={{ scale: 1.1 }}
              >
                <TrendingDown className="w-4 h-4 text-red-500" />
              </motion.div>
              <div>
                <CardTitle className="text-sm sm:text-base">Análise de Perdas</CardTitle>
                <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{totalPerdas} perdas</Badge>
              {onVerDetalhes && (
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {perdas.slice(0, 4).map((perda, index) => (
              <motion.div 
                key={index} 
                className="space-y-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate flex-1">{perda.motivo}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-xs">{perda.quantidade}</Badge>
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {perda.percentual}%
                    </span>
                  </div>
                </div>
                <Progress value={perda.percentual} className="h-1.5" />
              </motion.div>
            ))}
          </div>

          {/* Insight */}
          <motion.div 
            className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-yellow-600">Insight: </span>
                {insight}
              </p>
            </div>
          </motion.div>

          {onVerDetalhes && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onVerDetalhes();
              }}
            >
              Ver todos os detalhes
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
