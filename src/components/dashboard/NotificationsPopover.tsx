import { Bell, Lightbulb, Rocket, Sparkles, Target, TrendingUp, Star, Zap, Heart, Award, Gift, Sun, Coffee, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo } from "react";

// Pool de notificações por categoria - Fly Agency foco em vendas de marketing
const welcomeMessages = [
  { title: "Bom dia, Fly Agency!", message: "Que hoje seja um dia de muitas vendas e conquistas!" },
  { title: "Olá, Campeão!", message: "Mais um dia para conquistar novos clientes. Vamos nessa!" },
  { title: "Seja bem-vindo!", message: "A Fly Agency está pronta para mais um dia de sucesso!" },
  { title: "Bom dia, Vendedor!", message: "Cada dia é uma nova oportunidade de fechar negócios!" },
  { title: "Olá, Fly Agency!", message: "Prepare-se para decolar nas vendas hoje!" },
  { title: "Bem-vindo de volta!", message: "Sua dedicação está fazendo a diferença!" },
  { title: "Bom dia, Sucesso!", message: "Hoje é dia de bater recordes. Vamos lá!" },
];

const tipMessages = [
  { title: "Dica de Ouro", message: "Responda os leads em até 5 minutos e aumente suas conversões em 40%!" },
  { title: "Segredo do Sucesso", message: "Qualifique bem os leads para aumentar a taxa de fechamento!" },
  { title: "Estratégia Vencedora", message: "Apresentações personalizadas convertem até 2x mais!" },
  { title: "Truque de Mestre", message: "Use cases de sucesso para gerar confiança nos prospects!" },
  { title: "Dica Premium", message: "Follow-up consistente é a chave para fechar mais negócios!" },
  { title: "Hack de Vendas", message: "Entenda as dores do cliente antes de apresentar soluções!" },
  { title: "Insight Valioso", message: "Clientes indicados têm 4x mais chance de fechar!" },
  { title: "Dica do Expert", message: "Reuniões com decisores aumentam a taxa de conversão!" },
  { title: "Segredo Revelado", message: "Propostas enviadas em até 24h têm mais chances de sucesso!" },
  { title: "Tática Infalível", message: "Mostre ROI claro e aumente suas vendas!" },
];

const motivationMessages = [
  { title: "Você é Incrível!", message: "Cada reunião é um passo rumo à meta. Continue firme!" },
  { title: "Rumo ao Topo!", message: "Grandes conquistas começam com pequenos passos diários!" },
  { title: "Você Consegue!", message: "Sua meta está mais perto do que você imagina. Acredite!" },
  { title: "Campeão em Ação!", message: "Os melhores vendedores são os que nunca desistem!" },
  { title: "Energia Total!", message: "Transforme cada desafio em uma oportunidade de crescer!" },
  { title: "Foco no Objetivo!", message: "Persistência é a chave. Você está no caminho certo!" },
  { title: "Brilhe Hoje!", message: "Seu potencial é ilimitado. Mostre do que é capaz!" },
  { title: "Sucesso Garantido!", message: "Quem trabalha com paixão sempre colhe resultados!" },
  { title: "Vai com Tudo!", message: "Hoje é seu dia de fazer história nas vendas!" },
  { title: "Você é Top!", message: "Os números não mentem: você está evoluindo a cada dia!" },
];

const celebrationMessages = [
  { title: "Parabéns!", message: "Suas vendas estão crescendo! Continue nesse ritmo!" },
  { title: "Que Orgulho!", message: "A Fly Agency está conquistando o mercado!" },
  { title: "Conquista Desbloqueada!", message: "Você está superando as expectativas. Incrível!" },
  { title: "Recorde à Vista!", message: "Seu desempenho está melhor a cada mês!" },
  { title: "Sucesso Total!", message: "Você está provando que dedicação traz resultados!" },
];

// Função para obter seed baseada na data (muda a cada dia)
const getDailySeed = () => {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
};

// Função para selecionar item aleatório baseado em seed
const seededRandom = (seed: number, index: number) => {
  const x = Math.sin(seed + index) * 10000;
  return x - Math.floor(x);
};

const getRandomItem = <T,>(array: T[], seed: number, offset: number): T => {
  const index = Math.floor(seededRandom(seed, offset) * array.length);
  return array[index];
};

// Ícones disponíveis por tipo
const iconsByType = {
  welcome: [Sparkles, Sun, Coffee, Star],
  tip: [Lightbulb, Zap, Target, TrendingUp],
  motivation: [Rocket, Flame, Heart, Award],
  celebration: [Gift, Star, Award, TrendingUp],
};

const getGreetingTime = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

export function NotificationsPopover() {
  const notifications = useMemo(() => {
    const seed = getDailySeed();
    const greeting = getGreetingTime();
    
    // Seleciona mensagens diferentes baseadas na data
    const welcomeMsg = getRandomItem(welcomeMessages, seed, 1);
    const tipMsg = getRandomItem(tipMessages, seed, 2);
    const motivationMsg = getRandomItem(motivationMessages, seed, 3);
    const celebrationMsg = getRandomItem(celebrationMessages, seed, 4);
    
    // Seleciona ícones baseados na data
    const welcomeIcon = getRandomItem(iconsByType.welcome, seed, 5);
    const tipIcon = getRandomItem(iconsByType.tip, seed, 6);
    const motivationIcon = getRandomItem(iconsByType.motivation, seed, 7);
    const celebrationIcon = getRandomItem(iconsByType.celebration, seed, 8);
    
    return [
      {
        id: 1,
        type: "welcome",
        icon: welcomeIcon,
        title: welcomeMsg.title.replace("Bom dia", greeting),
        message: welcomeMsg.message,
        time: "Agora",
        color: "text-primary",
        bgColor: "bg-primary/10",
      },
      {
        id: 2,
        type: "tip",
        icon: tipIcon,
        title: tipMsg.title,
        message: tipMsg.message,
        time: "5 min",
        color: "text-warning",
        bgColor: "bg-warning/10",
      },
      {
        id: 3,
        type: "motivation",
        icon: motivationIcon,
        title: motivationMsg.title,
        message: motivationMsg.message,
        time: "30 min",
        color: "text-success",
        bgColor: "bg-success/10",
      },
      {
        id: 4,
        type: "celebration",
        icon: celebrationIcon,
        title: celebrationMsg.title,
        message: celebrationMsg.message,
        time: "1h",
        color: "text-accent",
        bgColor: "bg-accent/10",
      },
    ];
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
            {notifications.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Notificações</h3>
          <p className="text-sm text-muted-foreground">
            {notifications.length} novas mensagens
          </p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div
                key={notification.id}
                className="p-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="flex gap-3">
                  <div className={`p-2 rounded-lg ${notification.bgColor} shrink-0`}>
                    <IconComponent className={`w-4 h-4 ${notification.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm text-foreground truncate">
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
