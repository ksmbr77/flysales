import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown, Eye } from "lucide-react";

interface ClienteRisco {
  id: string;
  nome: string;
  empresa: string;
  valor_mensal: number;
  sinais_risco: string[];
}

interface ChurnAlertsCardProps {
  clientesEmRisco: ClienteRisco[];
  onVerDetalhes: () => void;
}

export function ChurnAlertsCard({ clientesEmRisco, onVerDetalhes }: ChurnAlertsCardProps) {
  const totalEmRisco = clientesEmRisco.reduce((acc, c) => acc + c.valor_mensal, 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (clientesEmRisco.length === 0) {
    return (
      <Card className="bg-green-500/5 border-green-500/20">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-green-600">
            <div className="p-2 rounded-full bg-green-500/10">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Nenhum cliente em risco de churn</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-red-500/5 border-red-500/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <CardTitle className="text-sm sm:text-base text-red-600">Alertas de Churn</CardTitle>
          </div>
          <Badge variant="destructive" className="text-xs">
            {clientesEmRisco.length} {clientesEmRisco.length === 1 ? 'cliente' : 'clientes'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center py-2 px-3 rounded-lg bg-red-500/10">
          <p className="text-xs text-muted-foreground">Receita em risco</p>
          <p className="text-lg font-bold text-red-500">{formatCurrency(totalEmRisco)}</p>
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto">
          {clientesEmRisco.slice(0, 3).map((cliente) => (
            <div 
              key={cliente.id}
              className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{cliente.nome}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(cliente.valor_mensal)}/mês</p>
              </div>
              <Badge variant="outline" className="text-[10px] text-red-500 border-red-500/30">
                {cliente.sinais_risco.length} {cliente.sinais_risco.length === 1 ? 'sinal' : 'sinais'}
              </Badge>
            </div>
          ))}
        </div>

        {clientesEmRisco.length > 3 && (
          <p className="text-xs text-center text-muted-foreground">
            +{clientesEmRisco.length - 3} outros clientes
          </p>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-red-500 border-red-500/30 hover:bg-red-500/10"
          onClick={onVerDetalhes}
        >
          <Eye className="w-3 h-3 mr-2" />
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  );
}
