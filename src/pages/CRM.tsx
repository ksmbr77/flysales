import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Kanban,
  DollarSign,
  User,
  Calendar,
  GripVertical,
  Plus,
  MoreHorizontal
} from "lucide-react";
import { usePersistentState } from "@/hooks/usePersistentState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Cliente {
  id: string;
  nome: string;
  empresa: string;
  ticket: number;
  responsavel: string;
  iniciais: string;
  dataContato: string;
  servico: string;
}

interface Coluna {
  id: string;
  titulo: string;
  cor: string;
  clientes: Cliente[];
}

const CRM = () => {
  const [colunas, setColunas] = usePersistentState<Coluna[]>("fly-crm-kanban", [
    {
      id: "lead",
      titulo: "Novos Leads",
      cor: "bg-blue-500",
      clientes: [
        {
          id: "1",
          nome: "Carlos Silva",
          empresa: "Tech Solutions",
          ticket: 3500,
          responsavel: "Gustavo Fontes",
          iniciais: "CS",
          dataContato: "05/12/2024",
          servico: "Social Media"
        },
        {
          id: "2",
          nome: "Ana Paula",
          empresa: "Beauty Store",
          ticket: 2800,
          responsavel: "Davi Nascimento",
          iniciais: "AP",
          dataContato: "06/12/2024",
          servico: "Tráfego Pago"
        }
      ]
    },
    {
      id: "qualificado",
      titulo: "Qualificados",
      cor: "bg-primary",
      clientes: [
        {
          id: "3",
          nome: "Roberto Mendes",
          empresa: "Auto Peças RJ",
          ticket: 5000,
          responsavel: "Gustavo Fontes",
          iniciais: "RM",
          dataContato: "03/12/2024",
          servico: "Branding Completo"
        }
      ]
    },
    {
      id: "proposta",
      titulo: "Proposta Enviada",
      cor: "bg-warning",
      clientes: [
        {
          id: "4",
          nome: "Fernanda Lima",
          empresa: "Clínica Estética FL",
          ticket: 4200,
          responsavel: "Davi Nascimento",
          iniciais: "FL",
          dataContato: "01/12/2024",
          servico: "Marketing 360"
        },
        {
          id: "5",
          nome: "Marcos Oliveira",
          empresa: "Fit Gym",
          ticket: 3000,
          responsavel: "Gustavo Fontes",
          iniciais: "MO",
          dataContato: "02/12/2024",
          servico: "Social Media"
        }
      ]
    },
    {
      id: "negociacao",
      titulo: "Em Negociação",
      cor: "bg-accent",
      clientes: [
        {
          id: "6",
          nome: "Julia Santos",
          empresa: "Delícias da Ju",
          ticket: 2500,
          responsavel: "Davi Nascimento",
          iniciais: "JS",
          dataContato: "04/12/2024",
          servico: "Identidade Visual"
        }
      ]
    },
    {
      id: "fechado",
      titulo: "Fechado ✅",
      cor: "bg-success",
      clientes: [
        {
          id: "7",
          nome: "Pedro Costa",
          empresa: "Construtora PC",
          ticket: 8000,
          responsavel: "Gustavo Fontes",
          iniciais: "PC",
          dataContato: "28/11/2024",
          servico: "Marketing Completo"
        },
        {
          id: "8",
          nome: "Camila Rodrigues",
          empresa: "Moda CR",
          ticket: 3800,
          responsavel: "Davi Nascimento",
          iniciais: "CR",
          dataContato: "29/11/2024",
          servico: "E-commerce + Ads"
        }
      ]
    }
  ]);

  const [draggedItem, setDraggedItem] = useState<{ colunaId: string; clienteId: string } | null>(null);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleDragStart = (colunaId: string, clienteId: string) => {
    setDraggedItem({ colunaId, clienteId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColunaId: string) => {
    if (!draggedItem) return;

    if (draggedItem.colunaId === targetColunaId) {
      setDraggedItem(null);
      return;
    }

    setColunas(prevColunas => {
      const newColunas = [...prevColunas];
      
      // Find source column and client
      const sourceColIndex = newColunas.findIndex(c => c.id === draggedItem.colunaId);
      const clientIndex = newColunas[sourceColIndex].clientes.findIndex(c => c.id === draggedItem.clienteId);
      const [cliente] = newColunas[sourceColIndex].clientes.splice(clientIndex, 1);
      
      // Find target column and add client
      const targetColIndex = newColunas.findIndex(c => c.id === targetColunaId);
      newColunas[targetColIndex].clientes.push(cliente);
      
      return newColunas;
    });

    setDraggedItem(null);
  };

  const totalTicket = colunas.reduce((acc, col) => 
    acc + col.clientes.reduce((sum, c) => sum + c.ticket, 0), 0
  );
  const totalClientes = colunas.reduce((acc, col) => acc + col.clientes.length, 0);
  const clientesFechados = colunas.find(c => c.id === "fechado")?.clientes.length || 0;
  const ticketFechado = colunas.find(c => c.id === "fechado")?.clientes.reduce((sum, c) => sum + c.ticket, 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:ml-64">
        <Header />
        
        <main className="p-4 md:p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Kanban className="w-7 h-7 text-primary" />
              CRM - Pipeline de Vendas
            </h2>
            <p className="text-muted-foreground mt-1">Arraste os cards para atualizar o status dos clientes</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="hover-lift">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total no Pipeline</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(totalTicket)}</p>
              </CardContent>
            </Card>
            <Card className="hover-lift">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Leads Ativos</p>
                <p className="text-xl font-bold text-foreground">{totalClientes}</p>
              </CardContent>
            </Card>
            <Card className="hover-lift">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Negócios Fechados</p>
                <p className="text-xl font-bold text-success">{clientesFechados}</p>
              </CardContent>
            </Card>
            <Card className="hover-lift">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Valor Fechado</p>
                <p className="text-xl font-bold text-success">{formatCurrency(ticketFechado)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Kanban Board */}
          <div className="overflow-x-auto pb-4 kanban-scroll">
            <div className="flex gap-4 min-w-max">
              {colunas.map((coluna) => (
                <div
                  key={coluna.id}
                  className="w-80 flex-shrink-0"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(coluna.id)}
                >
                  <Card className="bg-secondary/30 border-dashed">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${coluna.cor}`} />
                          <CardTitle className="text-base">{coluna.titulo}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {coluna.clientes.length}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 min-h-[200px]">
                      {coluna.clientes.map((cliente) => (
                        <Card
                          key={cliente.id}
                          draggable
                          onDragStart={() => handleDragStart(coluna.id, cliente.id)}
                          className="cursor-grab active:cursor-grabbing hover-lift bg-card border shadow-sm hover:shadow-purple transition-all"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                                <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-accent">
                                  <AvatarFallback className="text-xs font-bold text-primary-foreground bg-transparent">
                                    {cliente.iniciais}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-sm text-foreground">{cliente.nome}</p>
                                  <p className="text-xs text-muted-foreground">{cliente.empresa}</p>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                                  <DropdownMenuItem>Editar</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            
                            <div className="space-y-2">
                              <Badge variant="outline" className="text-xs">
                                {cliente.servico}
                              </Badge>
                              
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <DollarSign className="w-3 h-3" />
                                  <span className="font-semibold text-foreground">{formatCurrency(cliente.ticket)}</span>
                                  <span>/mês</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <User className="w-3 h-3" />
                                  {cliente.responsavel.split(' ')[0]}
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {cliente.dataContato}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CRM;