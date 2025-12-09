import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { WhatsAppButton } from "@/components/dashboard/WhatsAppButton";
import { Card } from "@/components/ui/card";
import { 
  Lightbulb, 
  Target, 
  DollarSign, 
  Megaphone, 
  TrendingUp,
  CheckCircle2,
  Rocket,
  Users
} from "lucide-react";

const tipCategories = [
  {
    icon: Megaphone,
    title: "Tráfego Pago",
    color: "primary",
    tips: [
      "Defina públicos específicos para cada campanha",
      "Teste diferentes criativos semanalmente",
      "Monitore o CPA e ROAS diariamente",
      "Use remarketing para leads quentes"
    ]
  },
  {
    icon: TrendingUp,
    title: "Funis de Vendas",
    color: "accent",
    tips: [
      "Crie páginas de captura otimizadas",
      "Automatize o follow-up de leads",
      "Segmente leads por temperatura",
      "Acompanhe métricas de conversão"
    ]
  },
  {
    icon: DollarSign,
    title: "Gestão Financeira",
    color: "warning",
    tips: [
      "Separe conta pessoal da empresarial",
      "Reserve 30% do lucro para impostos",
      "Controle o fluxo de caixa semanalmente",
      "Defina preços com margem adequada"
    ]
  },
  {
    icon: Target,
    title: "Metas e OKRs",
    color: "primary",
    tips: [
      "Defina metas mensais realistas",
      "Divida a meta mensal em semanal",
      "Acompanhe o progresso diariamente",
      "Celebre cada conquista alcançada"
    ]
  },
  {
    icon: Users,
    title: "Atendimento ao Cliente",
    color: "accent",
    tips: [
      "Responda em até 2 horas úteis",
      "Use templates para agilizar respostas",
      "Faça follow-up proativo",
      "Peça feedback após entregas"
    ]
  },
  {
    icon: Rocket,
    title: "Marketing 360°",
    color: "primary",
    tips: [
      "Integre todas as estratégias digitais",
      "Mantenha consistência na comunicação",
      "Analise dados de todas as fontes",
      "Otimize baseado em resultados"
    ]
  }
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    primary: { bg: "bg-primary/10", text: "text-primary" },
    accent: { bg: "bg-accent/10", text: "text-accent" },
    warning: { bg: "bg-warning/10", text: "text-warning" },
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
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">Central de Conhecimento</h2>
            <p className="text-sm md:text-base text-muted-foreground">Dicas práticas para melhorar sua gestão e resultados</p>
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
          <Card className="mt-6 p-4 md:p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border-0 shadow-card">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Dica do Dia</h4>
                <p className="text-muted-foreground">
                  Clientes satisfeitos são sua melhor propaganda. Invista em um atendimento excepcional 
                  e resultados consistentes para criar cases de sucesso que atraem novos clientes!
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