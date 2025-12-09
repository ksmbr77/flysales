import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { EditableStatCard } from "@/components/dashboard/EditableStatCard";
import { EditableGoalProgress } from "@/components/dashboard/EditableGoalProgress";
import { ProductRanking } from "@/components/dashboard/ProductRanking";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { WhatsAppButton } from "@/components/dashboard/WhatsAppButton";
import { 
  ShoppingBag, 
  Target, 
  TrendingUp, 
  Package 
} from "lucide-react";
import { getMesAtual } from "@/lib/dateUtils";
import { usePersistentState } from "@/hooks/usePersistentState";

const Index = () => {
  const [salesData, setSalesData] = usePersistentState("fortlar-sales-data", {
    vendas30dias: "R$ 57.516,83",
    vendasMes: "R$ 20.710,53",
    metaMensal: "R$ 70.000,00",
    produtosAtivos: "16"
  });

  const [currentSales, setCurrentSales] = usePersistentState("fortlar-current-sales", 20710.53);
  const [goalValue, setGoalValue] = usePersistentState("fortlar-goal-value", 70000);

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
              title="Vendas 30 dias"
              value={salesData.vendas30dias}
              subtitle="Últimos 30 dias"
              icon={ShoppingBag}
              trend={{ value: 12.5, isPositive: true }}
              delay={0}
              editable
              onValueChange={(value) => setSalesData(prev => ({ ...prev, vendas30dias: value }))}
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
              variant="success"
              delay={200}
              editable
              onValueChange={(value) => {
                setSalesData(prev => ({ ...prev, metaMensal: value }));
                const numValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
                if (!isNaN(numValue)) setGoalValue(numValue);
              }}
            />
            <EditableStatCard
              title="Produtos Ativos"
              value={salesData.produtosAtivos}
              subtitle="Na loja Shopee"
              icon={Package}
              delay={300}
              editable
              onValueChange={(value) => setSalesData(prev => ({ ...prev, produtosAtivos: value }))}
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
          
          {/* Charts and Ranking */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            <SalesChart />
            <ProductRanking />
          </div>
        </main>
      </div>
      
      <WhatsAppButton />
    </div>
  );
};

export default Index;
