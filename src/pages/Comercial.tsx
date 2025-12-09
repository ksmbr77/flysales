import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Target, 
  TrendingUp, 
  Award,
  DollarSign,
  Users,
  Calendar,
  Phone,
  Mail
} from "lucide-react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { getMesAtual } from "@/lib/dateUtils";

interface Vendedor {
  id: string;
  nome: string;
  iniciais: string;
  email: string;
  telefone: string;
  cor: string;
  metaMensal: number;
  vendasMes: number;
  clientesAtivos: number;
  negociosFechados: number;
}

const Comercial = () => {
  const [vendedores, setVendedores] = usePersistentState<Vendedor[]>("fly-vendedores", [
    {
      id: "1",
      nome: "Gustavo Fontes",
      iniciais: "GF",
      email: "gustavo@flyagency.com",
      telefone: "(11) 99999-1234",
      cor: "from-primary to-accent",
      metaMensal: 50000,
      vendasMes: 32500,
      clientesAtivos: 12,
      negociosFechados: 8
    },
    {
      id: "2",
      nome: "Davi Nascimento",
      iniciais: "DN",
      email: "davi@flyagency.com",
      telefone: "(11) 99999-5678",
      cor: "from-accent to-primary",
      metaMensal: 50000,
      vendasMes: 41200,
      clientesAtivos: 15,
      negociosFechados: 11
    }
  ]);

  const totalVendas = vendedores.reduce((acc, v) => acc + v.vendasMes, 0);
  const totalMeta = vendedores.reduce((acc, v) => acc + v.metaMensal, 0);
  const totalClientes = vendedores.reduce((acc, v) => acc + v.clientesAtivos, 0);
  const totalNegocios = vendedores.reduce((acc, v) => acc + v.negociosFechados, 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:ml-64">
        <Header />
        
        <main className="p-4 md:p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-7 h-7 text-primary" />
              Equipe Comercial
            </h2>
            <p className="text-muted-foreground mt-1">Acompanhe o desempenho dos vendedores</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Vendas do Mês</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(totalVendas)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Meta Total</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(totalMeta)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Clientes Ativos</p>
                    <p className="text-lg font-bold text-foreground">{totalClientes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Negócios Fechados</p>
                    <p className="text-lg font-bold text-foreground">{totalNegocios}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vendedores Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vendedores.map((vendedor, index) => {
              const porcentagem = (vendedor.vendasMes / vendedor.metaMensal) * 100;
              const isTop = porcentagem === Math.max(...vendedores.map(v => (v.vendasMes / v.metaMensal) * 100));
              
              return (
                <Card 
                  key={vendedor.id} 
                  className="hover-lift overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Header gradient */}
                  <div className={`h-2 bg-gradient-to-r ${vendedor.cor}`} />
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className={`w-16 h-16 bg-gradient-to-br ${vendedor.cor} shadow-purple`}>
                          <AvatarFallback className="text-lg font-bold text-primary-foreground bg-transparent">
                            {vendedor.iniciais}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            {vendedor.nome}
                            {isTop && (
                              <Badge className="bg-warning text-warning-foreground">
                                <Award className="w-3 h-3 mr-1" />
                                Top Vendedor
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">Consultor de Vendas</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        {vendedor.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        {vendedor.telefone}
                      </div>
                    </div>

                    {/* Meta Progress */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Target className="w-4 h-4 text-primary" />
                          Meta de {getMesAtual().split(' ')[0]}
                        </span>
                        <span className="text-sm font-bold text-primary">{porcentagem.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={Math.min(porcentagem, 100)} 
                        className="h-3"
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Vendido: <span className="font-semibold text-foreground">{formatCurrency(vendedor.vendasMes)}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Meta: <span className="font-semibold text-foreground">{formatCurrency(vendedor.metaMensal)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="text-center p-3 rounded-xl bg-secondary/50">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                          <Users className="w-3 h-3" />
                          Clientes Ativos
                        </div>
                        <p className="text-2xl font-bold text-foreground">{vendedor.clientesAtivos}</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-secondary/50">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                          <TrendingUp className="w-3 h-3" />
                          Negócios Fechados
                        </div>
                        <p className="text-2xl font-bold text-foreground">{vendedor.negociosFechados}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Comercial;