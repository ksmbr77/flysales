import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { WhatsAppButton } from "@/components/dashboard/WhatsAppButton";
import { Card } from "@/components/ui/card";
import { 
  Lightbulb, 
  Target, 
  DollarSign, 
  Building2, 
  ClipboardList, 
  TrendingUp,
  CheckCircle2
} from "lucide-react";

const tipCategories = [
  {
    icon: ClipboardList,
    title: "Organização",
    color: "primary",
    tips: [
      "Mantenha um controle diário do estoque",
      "Use planilhas para acompanhar pedidos pendentes",
      "Organize produtos por categoria e giro de vendas",
      "Defina horários fixos para responder mensagens"
    ]
  },
  {
    icon: TrendingUp,
    title: "Vendas",
    color: "success",
    tips: [
      "Responda clientes em até 5 minutos",
      "Ofereça combos e kits promocionais",
      "Destaque avaliações positivas no anúncio",
      "Mantenha fotos atualizadas e de qualidade"
    ]
  },
  {
    icon: DollarSign,
    title: "Financeiro",
    color: "warning",
    tips: [
      "Separe conta pessoal da empresarial",
      "Reserve 30% do lucro para impostos",
      "Controle o fluxo de caixa semanalmente",
      "Calcule o custo real de cada produto"
    ]
  },
  {
    icon: Target,
    title: "Metas",
    color: "accent",
    tips: [
      "Defina metas mensais realistas",
      "Divida a meta mensal em diária",
      "Acompanhe o progresso diariamente",
      "Celebre cada conquista alcançada"
    ]
  },
  {
    icon: Building2,
    title: "Gestão Empresarial",
    color: "info",
    tips: [
      "Formalize seu negócio (MEI ou ME)",
      "Invista em capacitação constante",
      "Construa relacionamento com fornecedores",
      "Planeje expansão gradual e sustentável"
    ]
  },
  {
    icon: Lightbulb,
    title: "Dicas Gerais",
    color: "primary",
    tips: [
      "Mantenha-se atualizado sobre o mercado",
      "Peça feedback aos clientes",
      "Analise a concorrência regularmente",
      "Automatize tarefas repetitivas"
    ]
  }
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    primary: { bg: "bg-primary/10", text: "text-primary" },
    success: { bg: "bg-success/10", text: "text-success" },
    warning: { bg: "bg-warning/10", text: "text-warning" },
    accent: { bg: "bg-accent/10", text: "text-accent" },
    info: { bg: "bg-blue-500/10", text: "text-blue-500" }
  };
  return colors[color] || colors.primary;
};

const Suporte = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:ml-64">
        <Header />
        
        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">Suporte ao Vendedor</h2>
            <p className="text-sm md:text-base text-muted-foreground">Dicas práticas para melhorar sua gestão e vendas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {tipCategories.map((category, index) => {
              const colorClasses = getColorClasses(category.color);
              return (
                <Card 
                  key={category.title}
                  className="p-4 md:p-6 shadow-card border-0 animate-scale-in hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                      <category.icon className={`w-5 h-5 ${colorClasses.text}`} />
                    </div>
                    <h3 className="font-semibold text-lg">{category.title}</h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {category.tips.map((tip, tipIndex) => (
                      <li 
                        key={tipIndex}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className={`w-4 h-4 ${colorClasses.text} shrink-0 mt-0.5`} />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>

          {/* Quick Tips Banner */}
          <Card className="mt-6 p-4 md:p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-success/10 border-0 shadow-card">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Dica do Dia</h4>
                <p className="text-muted-foreground">
                  Clientes satisfeitos são sua melhor propaganda. Invista em um atendimento excepcional 
                  e veja suas avaliações e vendas crescerem naturalmente!
                </p>
              </div>
            </div>
          </Card>
        </main>
      </div>
      
      <WhatsAppButton />
    </div>
  );
};

export default Suporte;
