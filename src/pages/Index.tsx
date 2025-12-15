import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { EditableStatCard } from "@/components/dashboard/EditableStatCard";
import { EditableGoalProgress } from "@/components/dashboard/EditableGoalProgress";
import { MonthMetrics } from "@/components/dashboard/MonthMetrics";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { WhatsAppButton } from "@/components/dashboard/WhatsAppButton";
import { 
  DollarSign, 
  Target, 
  TrendingUp, 
  Users 
} from "lucide-react";
import { getMesAtual } from "@/lib/dateUtils";
import { usePersistentState } from "@/hooks/usePersistentState";

const Index = () => {
  const [salesData, setSalesData] = usePersistentState("fly-sales-data", {
    faturamento30dias: "R$ 45.000,00",
    vendasMes: "R$ 18.500,00",
    metaMensal: "R$ 30.000,00",
    clientesAtivos: "12"
  });

  const [currentSales, setCurrentSales] = usePersistentState("fly-current-sales", 18500);
  const [goalValue, setGoalValue] = usePersistentState("fly-goal-value", 30000);

  const percentage = ((currentSales / goalValue) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:ml-64">
        <Header />
        
        <main className="p-4 md:p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <EditableStatCard
              title="Faturamento 30 dias"
              value={salesData.faturamento30dias}
              subtitle="Últimos 30 dias"
              icon={DollarSign}
              trend={{ value: 18.5, isPositive: true }}
              delay={0}
              editable
              onValueChange={(value) => setSalesData(prev => ({ ...prev, faturamento30dias: value }))}
            />
            <EditableStatCard
              title={`Vendas de ${getMesAtual().split(' ')[0].toLowerCase()}`}
              value={salesData.vendasMes}
              subtitle="Até o momento"
              icon={TrendingUp}
              variant="accent"
              delay={100}
              editable
              onValueChange={(value) => {
                setSalesData(prev => ({ ...prev, vendasMes: value }));
                const numValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
                if (!isNaN(numValue)) setCurrentSales(numValue);
              }}
            />
            <EditableStatCard
              title="Meta Mensal"
              value={salesData.metaMensal}
              subtitle={`${percentage}% atingido`}
              icon={Target}
              variant="accent"
              delay={200}
              editable
              onValueChange={(value) => {
                setSalesData(prev => ({ ...prev, metaMensal: value }));
                const numValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
                if (!isNaN(numValue)) setGoalValue(numValue);
              }}
            />
            <EditableStatCard
              title="Clientes Ativos"
              value={salesData.clientesAtivos}
              subtitle="Em contratos vigentes"
              icon={Users}
              delay={300}
              editable
              onValueChange={(value) => setSalesData(prev => ({ ...prev, clientesAtivos: value }))}
            />
          </div>
          
          {/* Goal Progress */}
          <div className="mb-4 md:mb-6">
            <EditableGoalProgress 
              current={currentSales} 
              goal={goalValue} 
              label={`Meta de ${getMesAtual().toLowerCase()}`}
              onCurrentChange={setCurrentSales}
              onGoalChange={setGoalValue}
            />
          </div>
          
          {/* Month Metrics */}
          <div className="mb-4 md:mb-6">
            <MonthMetrics />
          </div>

          {/* Chart */}
          <SalesChart />
        </main>
      </div>
      
      <WhatsAppButton />
    </div>
  );
};

export default Index;