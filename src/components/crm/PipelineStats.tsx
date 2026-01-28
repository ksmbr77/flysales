import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Target, TrendingUp } from "lucide-react";
import { memo } from "react";

interface PipelineStatsProps {
  totalPipeline: number;
  receitaProvavel: number;
  leadsAtivos: number;
  negociosFechados: number;
  valorFechado: number;
}

const StatItem = memo(({ 
  icon: Icon, 
  label, 
  value, 
  subValue,
  isPrimary = false,
  iconColor = "text-primary"
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number;
  subValue?: string;
  isPrimary?: boolean;
  iconColor?: string;
}) => (
  <Card className={`hover-lift transition-all ${isPrimary ? 'ring-1 ring-primary/20 bg-primary/5' : ''}`}>
    <CardContent className="p-3 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{label}</p>
          <p className={`text-sm sm:text-xl font-bold truncate ${isPrimary ? 'text-primary' : 'text-foreground'}`}>
            {value}
          </p>
          {subValue && (
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{subValue}</p>
          )}
        </div>
        <div className={`p-1.5 sm:p-2 rounded-lg bg-secondary ${iconColor}`}>
          <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      </div>
    </CardContent>
  </Card>
));

StatItem.displayName = "StatItem";

export function PipelineStats({
  totalPipeline,
  receitaProvavel,
  leadsAtivos,
  negociosFechados,
  valorFechado
}: PipelineStatsProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const probabilidadeMedia = totalPipeline > 0 
    ? Math.round((receitaProvavel / totalPipeline) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
      <StatItem
        icon={DollarSign}
        label="Total no Pipeline"
        value={formatCurrency(totalPipeline)}
        iconColor="text-blue-500"
      />
      <StatItem
        icon={TrendingUp}
        label="Receita Provável"
        value={formatCurrency(receitaProvavel)}
        subValue={`${probabilidadeMedia}% do total`}
        iconColor="text-primary"
        isPrimary
      />
      <StatItem
        icon={Users}
        label="Leads Ativos"
        value={leadsAtivos}
        iconColor="text-yellow-500"
      />
      <StatItem
        icon={Target}
        label="Negócios Fechados"
        value={negociosFechados}
        isPrimary
        iconColor="text-green-500"
      />
      <StatItem
        icon={DollarSign}
        label="Valor Fechado"
        value={formatCurrency(valorFechado)}
        isPrimary
        iconColor="text-green-500"
      />
    </div>
  );
}
