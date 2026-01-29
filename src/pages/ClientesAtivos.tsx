import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users,
  Plus,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Pencil,
  Trash2,
  Eye,
  Filter,
  UserMinus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ClientChurnModal } from "@/components/crm/ClientChurnModal";

interface ClienteAtivo {
  id: string;
  nome: string;
  empresa: string;
  valor_mensal: number;
  data_inicio_contrato: string;
  data_renovacao: string | null;
  escopo_contratado: string | null;
  status_cliente: string;
  sinais_risco: string[];
  ultima_interacao: string | null;
  tag_pareto: string | null;
  observacoes: string | null;
}

const sinaisRiscoOpcoes = [
  { id: "pagamento", label: "💳 Atrasou pagamento" },
  { id: "pausa", label: "⏸️ Pediu pausa no serviço" },
  { id: "demanda", label: "📉 Diminuiu demanda/escopo" },
  { id: "caixa", label: "💬 Reclamou de caixa/dinheiro" },
  { id: "anuncios", label: "🚫 Parou anúncios/ações" },
  { id: "insatisfeito", label: "😟 Insatisfeito com resultados" },
  { id: "sumiu", label: "👻 Sumiu / Não responde" },
];

const servicosDisponiveis = [
  "Gestão de Tráfego Pago",
  "Funis de Vendas",
  "Marketing 360",
  "Branding e Posicionamento"
];

const statusColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  saudavel: { 
    bg: "bg-green-500/10 border-green-500/30", 
    text: "text-green-600",
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
  },
  atencao: { 
    bg: "bg-yellow-500/10 border-yellow-500/30", 
    text: "text-yellow-600",
    icon: <AlertCircle className="w-4 h-4 text-yellow-500" />
  },
  risco_churn: { 
    bg: "bg-red-500/10 border-red-500/30", 
    text: "text-red-600",
    icon: <AlertTriangle className="w-4 h-4 text-red-500" />
  },
};

const statusLabels: Record<string, string> = {
  saudavel: "🟢 Saudável",
  atencao: "🟡 Atenção",
  risco_churn: "🔴 Risco de Churn",
};

const ClientesAtivos = () => {
  const [clientes, setClientes] = useState<ClienteAtivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [churnModalOpen, setChurnModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<ClienteAtivo | null>(null);
  const [clienteVisualizando, setClienteVisualizando] = useState<ClienteAtivo | null>(null);
  const [clienteSaindo, setClienteSaindo] = useState<ClienteAtivo | null>(null);

  const [formCliente, setFormCliente] = useState({
    nome: "",
    empresa: "",
    valor_mensal: 0,
    data_inicio_contrato: "",
    data_renovacao: "",
    escopo_contratado: "",
    sinais_risco: [] as string[],
    tag_pareto: "",
    observacoes: ""
  });

  const fetchClientes = useCallback(async () => {
    const { data, error } = await supabase
      .from('clientes_ativos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Erro ao carregar clientes ativos');
    } else {
      setClientes(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

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

  const calcularStatus = (sinais: string[]): string => {
    if (sinais.length >= 3) return "risco_churn";
    if (sinais.length >= 1) return "atencao";
    return "saudavel";
  };

  const abrirModalNovo = () => {
    setClienteEditando(null);
    setFormCliente({
      nome: "",
      empresa: "",
      valor_mensal: 0,
      data_inicio_contrato: format(new Date(), 'yyyy-MM-dd'),
      data_renovacao: "",
      escopo_contratado: "",
      sinais_risco: [],
      tag_pareto: "",
      observacoes: ""
    });
    setModalOpen(true);
  };

  const abrirModalEditar = (cliente: ClienteAtivo) => {
    setClienteEditando(cliente);
    setFormCliente({
      nome: cliente.nome,
      empresa: cliente.empresa,
      valor_mensal: cliente.valor_mensal,
      data_inicio_contrato: cliente.data_inicio_contrato ? format(new Date(cliente.data_inicio_contrato), 'yyyy-MM-dd') : "",
      data_renovacao: cliente.data_renovacao ? format(new Date(cliente.data_renovacao), 'yyyy-MM-dd') : "",
      escopo_contratado: cliente.escopo_contratado || "",
      sinais_risco: cliente.sinais_risco || [],
      tag_pareto: cliente.tag_pareto || "",
      observacoes: cliente.observacoes || ""
    });
    setModalOpen(true);
  };

  const abrirDetalhes = (cliente: ClienteAtivo) => {
    setClienteVisualizando(cliente);
    setDetalhesOpen(true);
  };

  const handleSinaisChange = (sinalId: string, checked: boolean) => {
    setFormCliente(prev => ({
      ...prev,
      sinais_risco: checked 
        ? [...prev.sinais_risco, sinalId]
        : prev.sinais_risco.filter(s => s !== sinalId)
    }));
  };

  const salvarCliente = async () => {
    if (!formCliente.nome || !formCliente.empresa) {
      toast.error("Preencha nome e empresa");
      return;
    }

    const status = calcularStatus(formCliente.sinais_risco);
    const clienteData = {
      nome: formCliente.nome,
      empresa: formCliente.empresa,
      valor_mensal: formCliente.valor_mensal,
      data_inicio_contrato: formCliente.data_inicio_contrato || new Date().toISOString(),
      data_renovacao: formCliente.data_renovacao || null,
      escopo_contratado: formCliente.escopo_contratado || null,
      sinais_risco: formCliente.sinais_risco,
      status_cliente: status,
      tag_pareto: formCliente.tag_pareto || null,
      observacoes: formCliente.observacoes || null,
      ultima_interacao: new Date().toISOString()
    };

    if (clienteEditando) {
      const { error } = await supabase
        .from('clientes_ativos')
        .update(clienteData)
        .eq('id', clienteEditando.id);

      if (error) {
        toast.error('Erro ao atualizar cliente');
      } else {
        toast.success('Cliente atualizado');
        fetchClientes();
      }
    } else {
      const { error } = await supabase
        .from('clientes_ativos')
        .insert(clienteData);

      if (error) {
        toast.error('Erro ao adicionar cliente');
      } else {
        toast.success('Cliente adicionado');
        fetchClientes();
      }
    }
    setModalOpen(false);
  };

  const excluirCliente = async (id: string) => {
    const { error } = await supabase
      .from('clientes_ativos')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir cliente');
    } else {
      toast.success('Cliente removido');
      fetchClientes();
    }
  };

  const abrirModalChurn = (cliente: ClienteAtivo) => {
    setClienteSaindo(cliente);
    setChurnModalOpen(true);
  };

  const confirmarChurn = async (motivo: string, detalhes: string) => {
    if (!clienteSaindo) return;

    // Remove the client
    const { error } = await supabase
      .from('clientes_ativos')
      .delete()
      .eq('id', clienteSaindo.id);

    if (error) {
      toast.error('Erro ao registrar saída');
    } else {
      toast.success(`Cliente ${clienteSaindo.nome} marcado como inativo`);
      // TODO: Could log to a churn history table for analytics
      fetchClientes();
    }

    setChurnModalOpen(false);
    setClienteSaindo(null);
  };

  const clientesFiltrados = clientes.filter(c => 
    filtroStatus === "todos" || c.status_cliente === filtroStatus
  );

  const totalMRR = clientes.reduce((acc, c) => acc + c.valor_mensal, 0);
  const clientesSaudaveis = clientes.filter(c => c.status_cliente === "saudavel").length;
  const clientesRisco = clientes.filter(c => c.status_cliente === "risco_churn").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:ml-64">
        <Header />
        
        <main className="p-3 sm:p-4 md:p-6">
          {/* Header */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                Clientes Ativos
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Gestão de clientes pós-venda
              </p>
            </div>
            <Button onClick={abrirModalNovo} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Card>
              <CardContent className="p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Total Clientes</p>
                <p className="text-lg sm:text-2xl font-bold">{clientes.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-muted-foreground">MRR Total</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">{formatCurrency(totalMRR)}</p>
              </CardContent>
            </Card>
            <Card className="bg-green-500/5">
              <CardContent className="p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Saudáveis</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">{clientesSaudaveis}</p>
              </CardContent>
            </Card>
            <Card className="bg-red-500/5">
              <CardContent className="p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Em Risco</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600">{clientesRisco}</p>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-1 flex-wrap">
              {["todos", "saudavel", "atencao", "risco_churn"].map((status) => (
                <Button
                  key={status}
                  variant={filtroStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus(status)}
                  className="text-xs"
                >
                  {status === "todos" ? "Todos" : statusLabels[status]}
                </Button>
              ))}
            </div>
          </div>

          {/* Lista de Clientes */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            <AnimatePresence>
              {clientesFiltrados.map((cliente, index) => {
                const statusConfig = statusColors[cliente.status_cliente] || statusColors.saudavel;
                return (
                  <motion.div
                    key={cliente.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    layout
                  >
                    <Card 
                      className={`${statusConfig.bg} border transition-all hover:shadow-md hover:-translate-y-1`}
                    >
                      <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 bg-primary/10">
                          <AvatarFallback className="text-sm font-medium text-primary bg-transparent">
                            {gerarIniciais(cliente.nome)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-sm">{cliente.nome}</h3>
                          <p className="text-xs text-muted-foreground">{cliente.empresa}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => abrirDetalhes(cliente)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => abrirModalEditar(cliente)}>
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-orange-500" onClick={() => abrirModalChurn(cliente)}>
                          <UserMinus className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => excluirCliente(cliente.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-primary font-medium">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(cliente.valor_mensal)}/mês
                        </div>
                        <div className="flex items-center gap-1">
                          {statusConfig.icon}
                          <span className={`text-xs font-medium ${statusConfig.text}`}>
                            {statusLabels[cliente.status_cliente]?.split(' ')[1]}
                          </span>
                        </div>
                      </div>

                      {cliente.escopo_contratado && (
                        <Badge variant="outline" className="text-xs">
                          {cliente.escopo_contratado}
                        </Badge>
                      )}

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Início: {format(new Date(cliente.data_inicio_contrato), 'dd/MM/yyyy')}
                      </div>

                      {cliente.data_renovacao && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <RefreshCw className="w-3 h-3" />
                          Renovação: {format(new Date(cliente.data_renovacao), 'dd/MM/yyyy')}
                        </div>
                      )}

                      {cliente.ultima_interacao && (
                        <p className="text-xs text-muted-foreground">
                          Última interação: {formatDistanceToNow(new Date(cliente.ultima_interacao), { addSuffix: true, locale: ptBR })}
                        </p>
                      )}

                      {cliente.sinais_risco.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-[10px] text-muted-foreground mb-1">Sinais de risco:</p>
                          <div className="flex flex-wrap gap-1">
                            {cliente.sinais_risco.slice(0, 3).map((sinal, i) => {
                              const sinalInfo = sinaisRiscoOpcoes.find(s => s.id === sinal);
                              return (
                                <Badge key={i} variant="destructive" className="text-[10px] px-1.5">
                                  {sinalInfo?.label.split(' ')[0]}
                                </Badge>
                              );
                            })}
                            {cliente.sinais_risco.length > 3 && (
                              <Badge variant="outline" className="text-[10px]">
                                +{cliente.sinais_risco.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {cliente.tag_pareto && (
                        <Badge 
                          variant={cliente.tag_pareto === 'top_20' ? 'default' : cliente.tag_pareto === 'problematico' ? 'destructive' : 'secondary'}
                          className="text-[10px]"
                        >
                          {cliente.tag_pareto === 'top_20' ? '⭐ Top 20%' : cliente.tag_pareto === 'problematico' ? '⚠️ Problemático' : '🤝 Ideal'}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
            </AnimatePresence>
          </div>

          {clientesFiltrados.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Nenhum cliente encontrado</p>
              <Button onClick={abrirModalNovo} variant="outline" size="sm" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar primeiro cliente
              </Button>
            </div>
          )}
        </main>
      </div>

      <WhatsAppButton />

      {/* Modal de Cliente */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{clienteEditando ? "Editar Cliente" : "Novo Cliente Ativo"}</DialogTitle>
            <DialogDescription>Gerencie as informações do cliente</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
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
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Valor Mensal (R$)</Label>
                <Input
                  type="number"
                  value={formCliente.valor_mensal}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, valor_mensal: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Serviço Contratado</Label>
                <Select 
                  value={formCliente.escopo_contratado} 
                  onValueChange={(value) => setFormCliente(prev => ({ ...prev, escopo_contratado: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicosDisponiveis.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Início do Contrato</Label>
                <Input
                  type="date"
                  value={formCliente.data_inicio_contrato}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, data_inicio_contrato: e.target.value }))}
                />
              </div>
              <div>
                <Label>Data de Renovação</Label>
                <Input
                  type="date"
                  value={formCliente.data_renovacao}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, data_renovacao: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Tag Pareto</Label>
              <Select 
                value={formCliente.tag_pareto} 
                onValueChange={(value) => setFormCliente(prev => ({ ...prev, tag_pareto: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top_20">⭐ Top 20%</SelectItem>
                  <SelectItem value="ideal">🤝 Ideal</SelectItem>
                  <SelectItem value="problematico">⚠️ Problemático</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Sinais de Risco</Label>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-2 bg-secondary/30 rounded-lg">
                {sinaisRiscoOpcoes.map((sinal) => (
                  <div key={sinal.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={sinal.id}
                      checked={formCliente.sinais_risco.includes(sinal.id)}
                      onCheckedChange={(checked) => handleSinaisChange(sinal.id, !!checked)}
                    />
                    <label htmlFor={sinal.id} className="text-sm cursor-pointer">
                      {sinal.label}
                    </label>
                  </div>
                ))}
              </div>
              {formCliente.sinais_risco.length >= 3 && (
                <p className="text-xs text-red-500 mt-1">
                  ⚠️ Este cliente será marcado como "Risco de Churn"
                </p>
              )}
            </div>

            <div>
              <Label>Observações</Label>
              <Textarea
                value={formCliente.observacoes}
                onChange={(e) => setFormCliente(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Anotações sobre o cliente..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={salvarCliente}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes */}
      <Dialog open={detalhesOpen} onOpenChange={setDetalhesOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {clienteVisualizando && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 bg-primary/10">
                  <AvatarFallback className="text-xl font-bold text-primary bg-transparent">
                    {gerarIniciais(clienteVisualizando.nome)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{clienteVisualizando.nome}</h3>
                  <p className="text-muted-foreground">{clienteVisualizando.empresa}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Valor Mensal</p>
                  <p className="font-medium text-primary">{formatCurrency(clienteVisualizando.valor_mensal)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <p className="font-medium">{statusLabels[clienteVisualizando.status_cliente]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Serviço</p>
                  <p className="font-medium">{clienteVisualizando.escopo_contratado || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Início</p>
                  <p className="font-medium">{format(new Date(clienteVisualizando.data_inicio_contrato), 'dd/MM/yyyy')}</p>
                </div>
              </div>

              {clienteVisualizando.sinais_risco.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Sinais de Risco:</p>
                  <div className="space-y-1">
                    {clienteVisualizando.sinais_risco.map((sinal, i) => {
                      const sinalInfo = sinaisRiscoOpcoes.find(s => s.id === sinal);
                      return (
                        <Badge key={i} variant="destructive" className="text-xs mr-1">
                          {sinalInfo?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {clienteVisualizando.observacoes && (
                <div>
                  <p className="text-xs text-muted-foreground">Observações:</p>
                  <p className="text-sm mt-1 p-2 bg-secondary/30 rounded">{clienteVisualizando.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Churn */}
      <ClientChurnModal
        open={churnModalOpen}
        onOpenChange={setChurnModalOpen}
        clienteNome={clienteSaindo?.nome || ""}
        valorMensal={clienteSaindo?.valor_mensal || 0}
        onConfirm={confirmarChurn}
        onCancel={() => {
          setChurnModalOpen(false);
          setClienteSaindo(null);
        }}
      />
    </div>
  );
};

export default ClientesAtivos;
