import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WhatsAppButton } from "@/components/dashboard/WhatsAppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Kanban,
  DollarSign,
  User,
  Calendar,
  GripVertical,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Settings
} from "lucide-react";
import { usePersistentState } from "@/hooks/usePersistentState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Cliente {
  id: string;
  nome: string;
  empresa: string;
  ticket: number;
  responsavel: string;
  iniciais: string;
  dataContato: string;
  servico: string;
  telefone?: string;
  email?: string;
  observacoes?: string;
}

interface Coluna {
  id: string;
  titulo: string;
  cor: string;
  clientes: Cliente[];
}

const servicosDisponiveis = [
  "Gestão de Tráfego Pago",
  "Funis de Vendas",
  "Marketing 360",
  "Branding e Posicionamento"
];

const responsaveisDisponiveis = ["Gustavo Fontes", "Davi Nascimento"];

const coresDisponiveis = [
  { nome: "Azul", valor: "bg-blue-500" },
  { nome: "Roxo", valor: "bg-primary" },
  { nome: "Laranja", valor: "bg-warning" },
  { nome: "Verde", valor: "bg-accent" },
  { nome: "Rosa", valor: "bg-pink-500" },
  { nome: "Vermelho", valor: "bg-red-500" },
];

const colunasIniciais: Coluna[] = [
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
        servico: "Gestão de Tráfego Pago"
      },
      {
        id: "2",
        nome: "Ana Paula",
        empresa: "Beauty Store",
        ticket: 2800,
        responsavel: "Davi Nascimento",
        iniciais: "AP",
        dataContato: "06/12/2024",
        servico: "Funis de Vendas"
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
        servico: "Marketing 360"
      }
    ]
  },
  {
    id: "negociacao",
    titulo: "Em Negociação",
    cor: "bg-warning",
    clientes: [
      {
        id: "4",
        nome: "Julia Santos",
        empresa: "Delícias da Ju",
        ticket: 2500,
        responsavel: "Davi Nascimento",
        iniciais: "JS",
        dataContato: "04/12/2024",
        servico: "Funis de Vendas"
      }
    ]
  },
  {
    id: "fechado",
    titulo: "Fechado",
    cor: "bg-accent",
    clientes: [
      {
        id: "5",
        nome: "Pedro Costa",
        empresa: "Construtora PC",
        ticket: 8000,
        responsavel: "Gustavo Fontes",
        iniciais: "PC",
        dataContato: "28/11/2024",
        servico: "Marketing 360"
      }
    ]
  }
];

const CRM = () => {
  const [colunas, setColunas] = usePersistentState<Coluna[]>("fly-crm-kanban-v2", colunasIniciais);
  const [draggedItem, setDraggedItem] = useState<{ colunaId: string; clienteId: string } | null>(null);
  const [dragOverColuna, setDragOverColuna] = useState<string | null>(null);
  
  // Modal states
  const [clienteModalOpen, setClienteModalOpen] = useState(false);
  const [detalhesModalOpen, setDetalhesModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [colunaModalOpen, setColunaModalOpen] = useState(false);
  
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [clienteVisualizando, setClienteVisualizando] = useState<Cliente | null>(null);
  const [colunaDestino, setColunaDestino] = useState<string>("");
  const [colunaEditando, setColunaEditando] = useState<Coluna | null>(null);
  
  // Form state
  const [formCliente, setFormCliente] = useState<Partial<Cliente>>({
    nome: "",
    empresa: "",
    ticket: 0,
    responsavel: "",
    servico: "",
    telefone: "",
    email: "",
    observacoes: ""
  });
  
  const [formColuna, setFormColuna] = useState({ titulo: "", cor: "bg-blue-500" });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const gerarIniciais = (nome: string) => {
    const partes = nome.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  };

  const gerarId = () => Math.random().toString(36).substring(2, 9);

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, colunaId: string, clienteId: string) => {
    setDraggedItem({ colunaId, clienteId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colunaId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColuna(colunaId);
  };

  const handleDragLeave = () => {
    setDragOverColuna(null);
  };

  const handleDrop = (e: React.DragEvent, targetColunaId: string) => {
    e.preventDefault();
    setDragOverColuna(null);
    
    if (!draggedItem) return;
    if (draggedItem.colunaId === targetColunaId) {
      setDraggedItem(null);
      return;
    }

    setColunas(prevColunas => {
      const newColunas = prevColunas.map(c => ({...c, clientes: [...c.clientes]}));
      
      const sourceColIndex = newColunas.findIndex(c => c.id === draggedItem.colunaId);
      const clientIndex = newColunas[sourceColIndex].clientes.findIndex(c => c.id === draggedItem.clienteId);
      const [cliente] = newColunas[sourceColIndex].clientes.splice(clientIndex, 1);
      
      const targetColIndex = newColunas.findIndex(c => c.id === targetColunaId);
      newColunas[targetColIndex].clientes.push(cliente);
      
      return newColunas;
    });

    const targetColuna = colunas.find(c => c.id === targetColunaId);
    toast.success(`Cliente movido para ${targetColuna?.titulo}`);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverColuna(null);
  };

  // CRUD de Clientes
  const abrirModalNovoCliente = (colunaId: string) => {
    setClienteEditando(null);
    setColunaDestino(colunaId);
    setFormCliente({
      nome: "",
      empresa: "",
      ticket: 0,
      responsavel: "",
      servico: "",
      telefone: "",
      email: "",
      observacoes: ""
    });
    setClienteModalOpen(true);
  };

  const abrirModalEditarCliente = (cliente: Cliente, colunaId: string) => {
    setClienteEditando(cliente);
    setColunaDestino(colunaId);
    setFormCliente({...cliente});
    setClienteModalOpen(true);
  };

  const abrirModalDetalhes = (cliente: Cliente) => {
    setClienteVisualizando(cliente);
    setDetalhesModalOpen(true);
  };

  const salvarCliente = () => {
    if (!formCliente.nome || !formCliente.empresa || !formCliente.responsavel || !formCliente.servico) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const hoje = new Date().toLocaleDateString('pt-BR');
    
    if (clienteEditando) {
      // Editar
      setColunas(prev => prev.map(col => ({
        ...col,
        clientes: col.clientes.map(c => 
          c.id === clienteEditando.id 
            ? {
                ...c,
                ...formCliente,
                iniciais: gerarIniciais(formCliente.nome || ""),
              } as Cliente
            : c
        )
      })));
      toast.success("Cliente atualizado com sucesso");
    } else {
      // Criar
      const novoCliente: Cliente = {
        id: gerarId(),
        nome: formCliente.nome || "",
        empresa: formCliente.empresa || "",
        ticket: formCliente.ticket || 0,
        responsavel: formCliente.responsavel || "",
        iniciais: gerarIniciais(formCliente.nome || ""),
        dataContato: hoje,
        servico: formCliente.servico || "",
        telefone: formCliente.telefone,
        email: formCliente.email,
        observacoes: formCliente.observacoes
      };

      setColunas(prev => prev.map(col => 
        col.id === colunaDestino 
          ? { ...col, clientes: [...col.clientes, novoCliente] }
          : col
      ));
      toast.success("Cliente adicionado com sucesso");
    }
    
    setClienteModalOpen(false);
  };

  const excluirCliente = (clienteId: string, colunaId: string) => {
    setColunas(prev => prev.map(col => 
      col.id === colunaId 
        ? { ...col, clientes: col.clientes.filter(c => c.id !== clienteId) }
        : col
    ));
    toast.success("Cliente removido");
  };

  // CRUD de Colunas
  const abrirModalNovaColuna = () => {
    setColunaEditando(null);
    setFormColuna({ titulo: "", cor: "bg-blue-500" });
    setColunaModalOpen(true);
  };

  const abrirModalEditarColuna = (coluna: Coluna) => {
    setColunaEditando(coluna);
    setFormColuna({ titulo: coluna.titulo, cor: coluna.cor });
    setColunaModalOpen(true);
  };

  const salvarColuna = () => {
    if (!formColuna.titulo) {
      toast.error("Digite o nome da coluna");
      return;
    }

    if (colunaEditando) {
      setColunas(prev => prev.map(col => 
        col.id === colunaEditando.id 
          ? { ...col, titulo: formColuna.titulo, cor: formColuna.cor }
          : col
      ));
      toast.success("Coluna atualizada");
    } else {
      const novaColuna: Coluna = {
        id: gerarId(),
        titulo: formColuna.titulo,
        cor: formColuna.cor,
        clientes: []
      };
      setColunas(prev => [...prev, novaColuna]);
      toast.success("Coluna adicionada");
    }
    
    setColunaModalOpen(false);
  };

  const excluirColuna = (colunaId: string) => {
    const coluna = colunas.find(c => c.id === colunaId);
    if (coluna && coluna.clientes.length > 0) {
      toast.error("Mova os clientes antes de excluir a coluna");
      return;
    }
    setColunas(prev => prev.filter(c => c.id !== colunaId));
    toast.success("Coluna removida");
  };

  // Stats
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <Kanban className="w-7 h-7 text-primary" />
                CRM - Pipeline de Vendas
              </h2>
              <p className="text-muted-foreground mt-1">Arraste os cards para atualizar o status dos clientes</p>
            </div>
            <Button onClick={() => setConfigModalOpen(true)} variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
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
                <p className="text-xl font-bold text-primary">{clientesFechados}</p>
              </CardContent>
            </Card>
            <Card className="hover-lift">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Valor Fechado</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(ticketFechado)}</p>
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
                  onDragOver={(e) => handleDragOver(e, coluna.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, coluna.id)}
                >
                  <Card className={`bg-secondary/30 border-dashed transition-all ${
                    dragOverColuna === coluna.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${coluna.cor}`} />
                          <CardTitle className="text-base">{coluna.titulo}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {coluna.clientes.length}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => abrirModalNovoCliente(coluna.id)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => abrirModalEditarColuna(coluna)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Editar coluna
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => excluirColuna(coluna.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir coluna
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 min-h-[200px]">
                      {coluna.clientes.map((cliente) => (
                        <Card
                          key={cliente.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, coluna.id, cliente.id)}
                          onDragEnd={handleDragEnd}
                          className={`cursor-grab active:cursor-grabbing hover-lift bg-card border shadow-sm hover:shadow-purple transition-all ${
                            draggedItem?.clienteId === cliente.id ? 'opacity-50 rotate-2' : ''
                          }`}
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
                                  <DropdownMenuItem onClick={() => abrirModalDetalhes(cliente)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver detalhes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => abrirModalEditarCliente(cliente, coluna.id)}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => excluirCliente(cliente.id, coluna.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remover
                                  </DropdownMenuItem>
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
              
              {/* Add Column Button */}
              <div className="w-80 flex-shrink-0">
                <Card 
                  className="bg-secondary/10 border-dashed border-2 cursor-pointer hover:bg-secondary/20 transition-all min-h-[300px] flex items-center justify-center"
                  onClick={abrirModalNovaColuna}
                >
                  <div className="text-center text-muted-foreground">
                    <Plus className="w-8 h-8 mx-auto mb-2" />
                    <p>Adicionar Coluna</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Cliente */}
      <Dialog open={clienteModalOpen} onOpenChange={setClienteModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {clienteEditando ? "Editar Cliente" : "Novo Cliente"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input 
                  id="nome"
                  value={formCliente.nome || ""}
                  onChange={(e) => setFormCliente({...formCliente, nome: e.target.value})}
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa *</Label>
                <Input 
                  id="empresa"
                  value={formCliente.empresa || ""}
                  onChange={(e) => setFormCliente({...formCliente, empresa: e.target.value})}
                  placeholder="Nome da empresa"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticket">Ticket Mensal (R$) *</Label>
                <Input 
                  id="ticket"
                  type="number"
                  value={formCliente.ticket || ""}
                  onChange={(e) => setFormCliente({...formCliente, ticket: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Responsável *</Label>
                <Select 
                  value={formCliente.responsavel}
                  onValueChange={(value) => setFormCliente({...formCliente, responsavel: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsaveisDisponiveis.map(resp => (
                      <SelectItem key={resp} value={resp}>{resp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Serviço *</Label>
              <Select 
                value={formCliente.servico}
                onValueChange={(value) => setFormCliente({...formCliente, servico: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {servicosDisponiveis.map(serv => (
                    <SelectItem key={serv} value={serv}>{serv}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input 
                  id="telefone"
                  value={formCliente.telefone || ""}
                  onChange={(e) => setFormCliente({...formCliente, telefone: e.target.value})}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={formCliente.email || ""}
                  onChange={(e) => setFormCliente({...formCliente, email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Input 
                id="observacoes"
                value={formCliente.observacoes || ""}
                onChange={(e) => setFormCliente({...formCliente, observacoes: e.target.value})}
                placeholder="Notas sobre o cliente"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setClienteModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarCliente}>
              {clienteEditando ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Detalhes */}
      <Dialog open={detalhesModalOpen} onOpenChange={setDetalhesModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-12 h-12 bg-gradient-to-br from-primary to-accent">
                <AvatarFallback className="text-sm font-bold text-primary-foreground bg-transparent">
                  {clienteVisualizando?.iniciais}
                </AvatarFallback>
              </Avatar>
              <div>
                <p>{clienteVisualizando?.nome}</p>
                <p className="text-sm font-normal text-muted-foreground">{clienteVisualizando?.empresa}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {clienteVisualizando && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Ticket Mensal</p>
                  <p className="font-semibold text-primary">{formatCurrency(clienteVisualizando.ticket)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Serviço</p>
                  <Badge variant="outline">{clienteVisualizando.servico}</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Responsável</p>
                  <p className="font-medium">{clienteVisualizando.responsavel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Data de Contato</p>
                  <p className="font-medium">{clienteVisualizando.dataContato}</p>
                </div>
              </div>
              
              {(clienteVisualizando.telefone || clienteVisualizando.email) && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  {clienteVisualizando.telefone && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Telefone</p>
                      <p className="font-medium">{clienteVisualizando.telefone}</p>
                    </div>
                  )}
                  {clienteVisualizando.email && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium text-sm">{clienteVisualizando.email}</p>
                    </div>
                  )}
                </div>
              )}
              
              {clienteVisualizando.observacoes && (
                <div className="pt-2 border-t space-y-1">
                  <p className="text-xs text-muted-foreground">Observações</p>
                  <p className="text-sm">{clienteVisualizando.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Configurações */}
      <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Configurações do CRM</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Gerencie as colunas do pipeline clicando no menu de cada coluna, ou adicione novas colunas usando o botão + no final do kanban.
            </p>
            
            <div className="space-y-2">
              <p className="font-medium text-sm">Colunas atuais:</p>
              {colunas.map((col) => (
                <div key={col.id} className="flex items-center gap-2 p-2 rounded bg-secondary/30">
                  <div className={`w-3 h-3 rounded-full ${col.cor}`} />
                  <span className="flex-1">{col.titulo}</span>
                  <Badge variant="secondary">{col.clientes.length}</Badge>
                </div>
              ))}
            </div>
            
            <Button onClick={abrirModalNovaColuna} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Nova Coluna
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Nova/Editar Coluna */}
      <Dialog open={colunaModalOpen} onOpenChange={setColunaModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {colunaEditando ? "Editar Coluna" : "Nova Coluna"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tituloColuna">Nome da Coluna</Label>
              <Input 
                id="tituloColuna"
                value={formColuna.titulo}
                onChange={(e) => setFormColuna({...formColuna, titulo: e.target.value})}
                placeholder="Ex: Em Análise"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex gap-2 flex-wrap">
                {coresDisponiveis.map((cor) => (
                  <button
                    key={cor.valor}
                    onClick={() => setFormColuna({...formColuna, cor: cor.valor})}
                    className={`w-8 h-8 rounded-full ${cor.valor} transition-all ${
                      formColuna.cor === cor.valor ? 'ring-2 ring-offset-2 ring-foreground' : ''
                    }`}
                    title={cor.nome}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setColunaModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarColuna}>
              {colunaEditando ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WhatsAppButton />
    </div>
  );
};

export default CRM;
