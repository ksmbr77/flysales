import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, Lightbulb } from "lucide-react";

interface PerdaAnalise {
  motivo: string;
  quantidade: number;
  percentual: number;
}

interface LossAnalysisCardProps {
  perdas: PerdaAnalise[];
  totalPerdas: number;
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

export function LossAnalysisCard({ perdas, totalPerdas }: LossAnalysisCardProps) {
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-500/10">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base">Análise de Perdas</CardTitle>
              <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
            </div>
          </div>
          <Badge variant="secondary">{totalPerdas} perdas</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {perdas.slice(0, 4).map((perda, index) => (
            <div key={index} className="space-y-1">
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
            </div>
          ))}
        </div>

        {/* Insight */}
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-yellow-600">Insight: </span>
              {insight}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
