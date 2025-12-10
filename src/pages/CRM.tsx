import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WhatsAppButton } from "@/components/dashboard/WhatsAppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Cliente {
  id: string;
  coluna_id: string;
  nome: string;
  empresa: string;
  ticket: number;
  responsavel: string | null;
  iniciais: string | null;
  data_contato: string | null;
  servico: string | null;
  telefone: string | null;
  email: string | null;
  observacoes: string | null;
}

interface Coluna {
  id: string;
  titulo: string;
  cor: string;
  ordem: number;
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
  { nome: "Amarelo", valor: "bg-yellow-500" },
  { nome: "Ciano", valor: "bg-cyan-500" },
  { nome: "Indigo", valor: "bg-indigo-500" },
  { nome: "Esmeralda", valor: "bg-emerald-500" },
  { nome: "Violeta", valor: "bg-violet-500" },
  { nome: "Âmbar", valor: "bg-amber-500" },
];

const CRM = () => {
  const [colunas, setColunas] = useState<Coluna[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [formCliente, setFormCliente] = useState({
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

  const fetchData = async () => {
    // Buscar colunas
    const { data: colunasData, error: colunasError } = await supabase
      .from('crm_colunas')
      .select('*')
      .order('ordem');

    if (colunasError) {
      console.error('Erro ao buscar colunas:', colunasError);
      toast.error('Erro ao carregar colunas');
      return;
    }

    // Buscar clientes
    const { data: clientesData, error: clientesError } = await supabase
      .from('crm_clientes')
      .select('*')
      .order('created_at');

    if (clientesError) {
      console.error('Erro ao buscar clientes:', clientesError);
      toast.error('Erro ao carregar clientes');
      return;
    }

    // Organizar clientes por coluna
    const colunasComClientes: Coluna[] = (colunasData || []).map(col => ({
      ...col,
      clientes: (clientesData || []).filter(c => c.coluna_id === col.id)
    }));

    setColunas(colunasComClientes);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleDrop = async (e: React.DragEvent, targetColunaId: string) => {
    e.preventDefault();
    setDragOverColuna(null);
    
    if (!draggedItem) return;
    if (draggedItem.colunaId === targetColunaId) {
      setDraggedItem(null);
      return;
    }

    // Atualizar no banco
    const { error } = await supabase
      .from('crm_clientes')
      .update({ coluna_id: targetColunaId })
      .eq('id', draggedItem.clienteId);

    if (error) {
      toast.error('Erro ao mover cliente');
    } else {
      const targetColuna = colunas.find(c => c.id === targetColunaId);
      toast.success(`Cliente movido para ${targetColuna?.titulo}`);
      fetchData();
    }
    
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

  const abrirModalEditarCliente = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setColunaDestino(cliente.coluna_id);
    setFormCliente({
      nome: cliente.nome,
      empresa: cliente.empresa,
      ticket: Number(cliente.ticket) || 0,
      responsavel: cliente.responsavel || "",
      servico: cliente.servico || "",
      telefone: cliente.telefone || "",
      email: cliente.email || "",
      observacoes: cliente.observacoes || ""
    });
    setClienteModalOpen(true);
  };

  const abrirModalDetalhes = (cliente: Cliente) => {
    setClienteVisualizando(cliente);
    setDetalhesModalOpen(true);
  };

  const salvarCliente = async () => {
    if (!formCliente.nome || !formCliente.empresa || !formCliente.responsavel || !formCliente.servico) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const hoje = new Date().toLocaleDateString('pt-BR');
    
    if (clienteEditando) {
      // Editar
      const { error } = await supabase
        .from('crm_clientes')
        .update({
          nome: formCliente.nome,
          empresa: formCliente.empresa,
          ticket: formCliente.ticket,
          responsavel: formCliente.responsavel,
          iniciais: gerarIniciais(formCliente.nome),
          servico: formCliente.servico,
          telefone: formCliente.telefone,
          email: formCliente.email,
          observacoes: formCliente.observacoes
        })
        .eq('id', clienteEditando.id);

      if (error) {
        toast.error('Erro ao atualizar cliente');
      } else {
        toast.success("Cliente atualizado com sucesso");
        fetchData();
      }
    } else {
      // Criar
      const { error } = await supabase
        .from('crm_clientes')
        .insert({
          coluna_id: colunaDestino,
          nome: formCliente.nome,
          empresa: formCliente.empresa,
          ticket: formCliente.ticket,
          responsavel: formCliente.responsavel,
          iniciais: gerarIniciais(formCliente.nome),
          data_contato: hoje,
          servico: formCliente.servico,
          telefone: formCliente.telefone,
          email: formCliente.email,
          observacoes: formCliente.observacoes
        });

      if (error) {
        toast.error('Erro ao adicionar cliente');
      } else {
        toast.success("Cliente adicionado com sucesso");
        fetchData();
      }
    }
    
    setClienteModalOpen(false);
  };

  const excluirCliente = async (clienteId: string) => {
    const { error } = await supabase
      .from('crm_clientes')
      .delete()
      .eq('id', clienteId);

    if (error) {
      toast.error('Erro ao excluir cliente');
    } else {
      toast.success("Cliente removido");
      fetchData();
    }
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

  const salvarColuna = async () => {
    if (!formColuna.titulo) {
      toast.error("Digite o nome da coluna");
      return;
    }

    if (colunaEditando) {
      const { error } = await supabase
        .from('crm_colunas')
        .update({ titulo: formColuna.titulo, cor: formColuna.cor })
        .eq('id', colunaEditando.id);

      if (error) {
        toast.error('Erro ao atualizar coluna');
      } else {
        toast.success("Coluna atualizada");
        fetchData();
      }
    } else {
      const maxOrdem = Math.max(...colunas.map(c => c.ordem), -1);
      const { error } = await supabase
        .from('crm_colunas')
        .insert({
          titulo: formColuna.titulo,
          cor: formColuna.cor,
          ordem: maxOrdem + 1
        });

      if (error) {
        toast.error('Erro ao adicionar coluna');
      } else {
        toast.success("Coluna adicionada");
        fetchData();
      }
    }
    
    setColunaModalOpen(false);
  };

  const excluirColuna = async (colunaId: string) => {
    const coluna = colunas.find(c => c.id === colunaId);
    if (coluna && coluna.clientes.length > 0) {
      toast.error("Mova os clientes antes de excluir a coluna");
      return;
    }

    const { error } = await supabase
      .from('crm_colunas')
      .delete()
      .eq('id', colunaId);

    if (error) {
      toast.error('Erro ao excluir coluna');
    } else {
      toast.success("Coluna removida");
      fetchData();
    }
  };

  // Stats
  const totalTicket = colunas.reduce((acc, col) => 
    acc + col.clientes.reduce((sum, c) => sum + Number(c.ticket || 0), 0), 0
  );
  const totalClientes = colunas.reduce((acc, col) => acc + col.clientes.length, 0);
  const colunaFechado = colunas.find(c => c.titulo.toLowerCase().includes('fechado'));
  const clientesFechados = colunaFechado?.clientes.length || 0;
  const ticketFechado = colunaFechado?.clientes.reduce((sum, c) => sum + Number(c.ticket || 0), 0) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

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
                          className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Avatar className="w-8 h-8 bg-primary/10">
                                  <AvatarFallback className="text-xs font-medium text-primary bg-transparent">
                                    {cliente.iniciais}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{cliente.nome}</p>
                                  <p className="text-xs text-muted-foreground">{cliente.empresa}</p>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                    <MoreHorizontal className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => abrirModalDetalhes(cliente)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver detalhes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => abrirModalEditarCliente(cliente)}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => excluirCliente(cliente.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-1 text-primary font-medium">
                                <DollarSign className="w-3 h-3" />
                                {formatCurrency(Number(cliente.ticket || 0))}
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <User className="w-3 h-3" />
                                {cliente.responsavel}
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {cliente.data_contato}
                              </div>
                            </div>
                            {cliente.servico && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                {cliente.servico}
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                      {coluna.clientes.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          Arraste clientes aqui ou clique em + para adicionar
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <WhatsAppButton />

      {/* Modal de Configuração */}
      <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Pipeline</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button onClick={abrirModalNovaColuna} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Nova Coluna
            </Button>
            <div className="space-y-2">
              <p className="text-sm font-medium">Colunas existentes:</p>
              {colunas.map((coluna) => (
                <div key={coluna.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${coluna.cor}`} />
                    <span className="text-sm">{coluna.titulo}</span>
                    <Badge variant="secondary" className="text-xs">{coluna.clientes.length}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => abrirModalEditarColuna(coluna)}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-destructive"
                      onClick={() => excluirColuna(coluna.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Coluna */}
      <Dialog open={colunaModalOpen} onOpenChange={setColunaModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{colunaEditando ? "Editar Coluna" : "Nova Coluna"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nome da Coluna</Label>
              <Input
                value={formColuna.titulo}
                onChange={(e) => setFormColuna(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Ex: Em Análise"
              />
            </div>
            <div>
              <Label>Cor</Label>
              <Select 
                value={formColuna.cor} 
                onValueChange={(value) => setFormColuna(prev => ({ ...prev, cor: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {coresDisponiveis.map((cor) => (
                    <SelectItem key={cor.valor} value={cor.valor}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${cor.valor}`} />
                        {cor.nome}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setColunaModalOpen(false)}>Cancelar</Button>
            <Button onClick={salvarColuna}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Cliente */}
      <Dialog open={clienteModalOpen} onOpenChange={setClienteModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{clienteEditando ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome *</Label>
                <Input
                  value={formCliente.nome}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <Label>Empresa *</Label>
                <Input
                  value={formCliente.empresa}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, empresa: e.target.value }))}
                  placeholder="Nome da empresa"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ticket (R$)</Label>
                <Input
                  type="number"
                  value={formCliente.ticket}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, ticket: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Responsável *</Label>
                <Select 
                  value={formCliente.responsavel} 
                  onValueChange={(value) => setFormCliente(prev => ({ ...prev, responsavel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsaveisDisponiveis.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Serviço *</Label>
              <Select 
                value={formCliente.servico} 
                onValueChange={(value) => setFormCliente(prev => ({ ...prev, servico: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {servicosDisponiveis.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Telefone</Label>
                <Input
                  value={formCliente.telefone}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formCliente.email}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea
                value={formCliente.observacoes}
                onChange={(e) => setFormCliente(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Anotações sobre o cliente..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClienteModalOpen(false)}>Cancelar</Button>
            <Button onClick={salvarCliente}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes */}
      <Dialog open={detalhesModalOpen} onOpenChange={setDetalhesModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {clienteVisualizando && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 bg-primary/10">
                  <AvatarFallback className="text-xl font-bold text-primary bg-transparent">
                    {clienteVisualizando.iniciais}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{clienteVisualizando.nome}</h3>
                  <p className="text-muted-foreground">{clienteVisualizando.empresa}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Ticket</p>
                  <p className="font-medium text-primary">{formatCurrency(Number(clienteVisualizando.ticket || 0))}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Responsável</p>
                  <p className="font-medium">{clienteVisualizando.responsavel}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Serviço</p>
                  <p className="font-medium">{clienteVisualizando.servico}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data de Contato</p>
                  <p className="font-medium">{clienteVisualizando.data_contato}</p>
                </div>
                {clienteVisualizando.telefone && (
                  <div>
                    <p className="text-muted-foreground">Telefone</p>
                    <p className="font-medium">{clienteVisualizando.telefone}</p>
                  </div>
                )}
                {clienteVisualizando.email && (
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{clienteVisualizando.email}</p>
                  </div>
                )}
              </div>
              {clienteVisualizando.observacoes && (
                <div>
                  <p className="text-muted-foreground text-sm">Observações</p>
                  <p className="mt-1 text-sm bg-secondary/30 p-3 rounded-lg">{clienteVisualizando.observacoes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetalhesModalOpen(false)}>Fechar</Button>
            <Button onClick={() => {
              setDetalhesModalOpen(false);
              if (clienteVisualizando) abrirModalEditarCliente(clienteVisualizando);
            }}>
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRM;
