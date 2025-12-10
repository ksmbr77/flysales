import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FaturamentoData {
  day: string;
  vendas: number;
}

const defaultData: FaturamentoData[] = [
  { day: "Jul", vendas: 0 },
  { day: "Ago", vendas: 0 },
  { day: "Set", vendas: 0 },
  { day: "Out", vendas: 0 },
  { day: "Nov", vendas: 2900 },
  { day: "Dez", vendas: 6100 },
];

export function SalesChart() {
  const [data, setData] = useState<FaturamentoData[]>(defaultData);

  useEffect(() => {
    const fetchFaturamento = async () => {
      const { data: faturamento } = await supabase
        .from('faturamento_mensal')
        .select('*')
        .eq('ano', 2025)
        .order('mes');

      if (faturamento && faturamento.length > 0) {
        const mesesOrdem = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const newData = mesesOrdem.map(mes => {
          const found = faturamento.find(f => f.mes === mes);
          return {
            day: mes,
            vendas: found ? Number(found.valor) : 0
          };
        });
        setData(newData);
      }
    };

    fetchFaturamento();
  }, []);

  return (
    <Card className="p-4 md:p-6 shadow-card border-0 animate-scale-in" style={{ animationDelay: '100ms' }}>
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
          <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-base md:text-lg">Faturamento Mensal 2025</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Últimos 6 meses</p>
        </div>
      </div>
      
      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickFormatter={(value) => `R$${(value/1000).toFixed(0)}k`}
              width={50}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Faturamento']}
              cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
            />
            <Bar 
              dataKey="vendas" 
              fill="hsl(var(--primary))"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
