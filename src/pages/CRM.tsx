import { useState, useEffect, useCallback, memo } from "react";
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
  Settings,
  TrendingDown,
  Globe,
  Users,
  MessageSquare,
  Mail,
  Target,
  Zap,
  Percent
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { validateClienteForm } from "@/lib/validations/crm";
import { BusinessHealthCard } from "@/components/crm/BusinessHealthCard";
import { PipelineStats } from "@/components/crm/PipelineStats";
import { LossReasonModal } from "@/components/crm/LossReasonModal";
import { ChurnAlertsCard } from "@/components/crm/ChurnAlertsCard";
import { LossAnalysisCard } from "@/components/crm/LossAnalysisCard";
import { useNavigate } from "react-router-dom";

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
  probabilidade?: number;
  origem?: string;
  tipo_cliente?: string;
}

interface Coluna {
  id: string;
  titulo: string;
  cor: string;
  ordem: number;
  probabilidade?: number;
  clientes: Cliente[];
}

interface ClienteRisco {
  id: string;
  nome: string;
  empresa: string;
  valor_mensal: number;
  sinais_risco: string[];
}

interface CrmConfig {
  id?: string;
  meta_mensal: number;
  churn_mes_atual: number;
}

interface PerdaAnalise {
  motivo: string;
  quantidade: number;
  percentual: number;
}

const servicosDisponiveis = [
  "Gestão de Tráfego Pago",
  "Funis de Vendas",
  "Marketing 360",
  "Branding e Posicionamento"
];

const origensDisponiveis = [
  { value: "organico", label: "🌐 Orgânico", icon: Globe },
  { value: "indicacao", label: "👥 Indicação", icon: Users },
  { value: "trafego_pago", label: "💰 Tráfego Pago", icon: Target },
  { value: "whatsapp", label: "💬 WhatsApp Direto", icon: MessageSquare },
  { value: "email", label: "📧 E-mail Marketing", icon: Mail },
  { value: "networking", label: "🎯 Networking/Eventos", icon: Zap },
  { value: "outro", label: "✏️ Outro", icon: Pencil },
];

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

const probabilidadesPorTitulo: Record<string, number> = {
  "novos leads": 20,
  "qualificados": 40,
  "aguardando confirmação": 75,
  "fechado": 100,
};

// Componente de card do cliente memoizado
const ClienteCard = memo(({ 
  cliente, 
  colunaId,
  probabilidade,
  onDragStart, 
  onDragEnd, 
  onView, 
  onEdit, 
  onDelete,
  onMarkLost,
  formatCurrency 
}: {
  cliente: Cliente;
  colunaId: string;
  probabilidade: number;
  onDragStart: (e: React.DragEvent, colunaId: string, clienteId: string) => void;
  onDragEnd: () => void;
  onView: (cliente: Cliente) => void;
  onEdit: (cliente: Cliente) => void;
  onDelete: (clienteId: string) => void;
  onMarkLost: (cliente: Cliente) => void;
  formatCurrency: (value: number) => string;
}) => {
  const valorProvavel = (Number(cliente.ticket) || 0) * (probabilidade / 100);
  
  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, colunaId, cliente.id)}
      onDragEnd={onDragEnd}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
    >
      <CardContent className="p-2 sm:p-3">
        <div className="flex items-start justify-between mb-1.5 sm:mb-2 gap-1">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <GripVertical className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            <Avatar className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 flex-shrink-0">
              <AvatarFallback className="text-[10px] sm:text-xs font-medium text-primary bg-transparent">
                {cliente.iniciais}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-xs sm:text-sm truncate">{cliente.nome}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{cliente.empresa}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6 opacity-0 group-hover:opacity-100 flex-shrink-0">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-popover">
              <DropdownMenuItem onClick={() => onView(cliente)}>
                <Eye className="w-4 h-4 mr-2" />
                Ver detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(cliente)}>
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMarkLost(cliente)} className="text-orange-500">
                <TrendingDown className="w-4 h-4 mr-2" />
                Marcar como perdido
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(cliente.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-primary font-medium">
              <DollarSign className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
              <span className="truncate">{formatCurrency(Number(cliente.ticket || 0))}</span>
            </div>
            <Badge variant="outline" className="text-[9px] px-1">
              <Percent className="w-2 h-2 mr-0.5" />
              {probabilidade}%
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
            <span className="truncate">{cliente.responsavel}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
            <span className="truncate">{cliente.data_contato}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-dashed">
          {cliente.servico && (
            <Badge variant="outline" className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0 truncate max-w-[60%]">
              {cliente.servico}
            </Badge>
          )}
          <span className="text-[9px] text-muted-foreground">
            ~{formatCurrency(valorProvavel)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
});

ClienteCard.displayName = "ClienteCard";

interface Vendedor {
  id: string;
  nome: string;
}

const CRM = () => {
  const navigate = useNavigate();
  const [colunas, setColunas] = useState<Coluna[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [clientesAtivosRisco, setClientesAtivosRisco] = useState<ClienteRisco[]>([]);
  const [config, setConfig] = useState<CrmConfig>({ meta_mensal: 30000, churn_mes_atual: 0 });
  const [perdas, setPerdas] = useState<PerdaAnalise[]>([]);
  const [totalPerdas, setTotalPerdas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<{ colunaId: string; clienteId: string } | null>(null);
  const [dragOverColuna, setDragOverColuna] = useState<string | null>(null);
  
  // Modal states
  const [clienteModalOpen, setClienteModalOpen] = useState(false);
  const [detalhesModalOpen, setDetalhesModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [colunaModalOpen, setColunaModalOpen] = useState(false);
  const [lossReasonModalOpen, setLossReasonModalOpen] = useState(false);
  
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [clienteVisualizando, setClienteVisualizando] = useState<Cliente | null>(null);
  const [clientePerdendo, setClientePerdendo] = useState<Cliente | null>(null);
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
    observacoes: "",
    origem: "organico",
    tipo_cliente: "novo"
  });
  
  const [formColuna, setFormColuna] = useState({ titulo: "", cor: "bg-blue-500" });

  const fetchData = useCallback(async () => {
    const [colunasRes, clientesRes, vendedoresRes, configRes, clientesAtivosRes, perdasRes] = await Promise.all([
      supabase.from('crm_colunas').select('*').order('ordem'),
      supabase.from('crm_clientes').select('*').order('created_at'),
      supabase.from('vendedores').select('id, nome').order('nome'),
      supabase.from('crm_configuracoes').select('*').limit(1).maybeSingle(),
      supabase.from('clientes_ativos').select('id, nome, empresa, valor_mensal, sinais_risco'),
      supabase.from('crm_perdas').select('*').gte('data_perda', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    if (colunasRes.error) {
      console.error('Erro ao buscar colunas:', colunasRes.error);
      toast.error('Erro ao carregar colunas');
      return;
    }

    if (clientesRes.error) {
      console.error('Erro ao buscar clientes:', clientesRes.error);
      toast.error('Erro ao carregar clientes');
      return;
    }

    // Processar colunas com probabilidades
    const colunasComClientes: Coluna[] = (colunasRes.data || []).map(col => {
      const prob = col.probabilidade || probabilidadesPorTitulo[col.titulo.toLowerCase()] || 20;
      return {
        ...col,
        probabilidade: prob,
        clientes: (clientesRes.data || []).filter(c => c.coluna_id === col.id)
      };
    });

    setColunas(colunasComClientes);
    setVendedores(vendedoresRes.data || []);
    
    if (configRes.data) {
      setConfig(configRes.data);
    }

    // Clientes em risco
    const clientesRisco = (clientesAtivosRes.data || [])
      .filter(c => (c.sinais_risco?.length || 0) >= 2)
      .map(c => ({
        ...c,
        sinais_risco: c.sinais_risco || []
      }));
    setClientesAtivosRisco(clientesRisco);

    // Análise de perdas
    if (perdasRes.data && perdasRes.data.length > 0) {
      const motivosCount: Record<string, number> = {};
      perdasRes.data.forEach(p => {
        motivosCount[p.motivo] = (motivosCount[p.motivo] || 0) + 1;
      });
      
      const total = perdasRes.data.length;
      const perdasAnalise = Object.entries(motivosCount)
        .map(([motivo, quantidade]) => ({
          motivo,
          quantidade,
          percentual: Math.round((quantidade / total) * 100)
        }))
        .sort((a, b) => b.quantidade - a.quantidade);
      
      setPerdas(perdasAnalise);
      setTotalPerdas(total);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = useCallback((value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }, []);

  const gerarIniciais = useCallback((nome: string) => {
    const partes = nome.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  }, []);

  // Calcular estatísticas
  const calcularEstatisticas = useCallback(() => {
    let totalPipeline = 0;
    let receitaProvavel = 0;
    let totalLeadsAtivos = 0;
    let negociosFechados = 0;
    let valorFechado = 0;
    
    colunas.forEach(coluna => {
      const prob = coluna.probabilidade || 20;
      const isFechado = coluna.titulo.toLowerCase().includes('fechado');
      
      coluna.clientes.forEach(cliente => {
        const ticket = Number(cliente.ticket) || 0;
        totalPipeline += ticket;
        receitaProvavel += ticket * (prob / 100);
        
        if (isFechado) {
          negociosFechados++;
          valorFechado += ticket;
        } else {
          totalLeadsAtivos++;
        }
      });
    });

    return { totalPipeline, receitaProvavel, totalLeadsAtivos, negociosFechados, valorFechado };
  }, [colunas]);

  const stats = calcularEstatisticas();

  // MRR dos clientes ativos
  const mrr = clientesAtivosRisco.reduce((acc, c) => acc + c.valor_mensal, 0);

  // Drag and Drop
  const handleDragStart = useCallback((e: React.DragEvent, colunaId: string, clienteId: string) => {
    setDraggedItem({ colunaId, clienteId });
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, colunaId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColuna(colunaId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColuna(null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetColunaId: string) => {
    e.preventDefault();
    setDragOverColuna(null);
    
    if (!draggedItem) return;
    if (draggedItem.colunaId === targetColunaId) {
      setDraggedItem(null);
      return;
    }

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
  }, [draggedItem, colunas, fetchData]);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverColuna(null);
  }, []);

  // Marcar como perdido
  const abrirModalPerda = useCallback((cliente: Cliente) => {
    setClientePerdendo(cliente);
    setLossReasonModalOpen(true);
  }, []);

  const confirmarPerda = useCallback(async (motivo: string, detalhes: string) => {
    if (!clientePerdendo) return;

    const colunaAtual = colunas.find(c => c.id === clientePerdendo.coluna_id);
    
    // Salvar na tabela de perdas
    const { error: perdaError } = await supabase.from('crm_perdas').insert({
      lead_id: clientePerdendo.id,
      nome: clientePerdendo.nome,
      empresa: clientePerdendo.empresa,
      valor: clientePerdendo.ticket,
      motivo: motivo,
      estagio_quando_perdeu: colunaAtual?.titulo || 'Desconhecido'
    });

    if (perdaError) {
      console.error('Erro ao registrar perda:', perdaError);
    }

    // Atualizar o cliente com status de perdido
    const { error } = await supabase
      .from('crm_clientes')
      .update({ 
        status: 'perdido',
        motivo_perda: motivo,
        data_perda: new Date().toISOString(),
        estagio_quando_perdeu: colunaAtual?.titulo
      })
      .eq('id', clientePerdendo.id);

    // Remover do pipeline
    await supabase.from('crm_clientes').delete().eq('id', clientePerdendo.id);

    if (error) {
      toast.error('Erro ao registrar perda');
    } else {
      toast.success('Perda registrada com sucesso');
      fetchData();
    }

    setLossReasonModalOpen(false);
    setClientePerdendo(null);
  }, [clientePerdendo, colunas, fetchData]);

  // CRUD de Clientes
  const abrirModalNovoCliente = useCallback((colunaId: string) => {
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
      observacoes: "",
      origem: "organico",
      tipo_cliente: "novo"
    });
    setClienteModalOpen(true);
  }, []);

  const abrirModalEditarCliente = useCallback((cliente: Cliente) => {
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
      observacoes: cliente.observacoes || "",
      origem: cliente.origem || "organico",
      tipo_cliente: cliente.tipo_cliente || "novo"
    });
    setClienteModalOpen(true);
  }, []);

  const abrirModalDetalhes = useCallback((cliente: Cliente) => {
    setClienteVisualizando(cliente);
    setDetalhesModalOpen(true);
  }, []);

  const salvarCliente = useCallback(async () => {
    const validationResult = validateClienteForm(formCliente);
    
    if (validationResult.success === false) {
      validationResult.errors.forEach((error) => toast.error(error));
      return;
    }

    const validatedData = validationResult.data;
    const hoje = new Date().toLocaleDateString('pt-BR');
    
    if (clienteEditando) {
      const { error } = await supabase
        .from('crm_clientes')
        .update({
          nome: validatedData.nome,
          empresa: validatedData.empresa,
          ticket: validatedData.ticket,
          responsavel: validatedData.responsavel,
          iniciais: gerarIniciais(validatedData.nome),
          servico: validatedData.servico,
          telefone: validatedData.telefone,
          email: validatedData.email,
          observacoes: validatedData.observacoes,
          origem: formCliente.origem,
          tipo_cliente: formCliente.tipo_cliente
        })
        .eq('id', clienteEditando.id);

      if (error) {
        toast.error('Erro ao atualizar cliente');
      } else {
        toast.success("Cliente atualizado com sucesso");
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from('crm_clientes')
        .insert({
          coluna_id: colunaDestino,
          nome: validatedData.nome,
          empresa: validatedData.empresa,
          ticket: validatedData.ticket,
          responsavel: validatedData.responsavel,
          iniciais: gerarIniciais(validatedData.nome),
          data_contato: hoje,
          servico: validatedData.servico,
          telefone: validatedData.telefone,
          email: validatedData.email,
          observacoes: validatedData.observacoes,
          origem: formCliente.origem,
          tipo_cliente: formCliente.tipo_cliente,
          data_primeiro_contato: new Date().toISOString()
        });

      if (error) {
        toast.error('Erro ao adicionar cliente');
      } else {
        toast.success("Cliente adicionado com sucesso");
        fetchData();
      }
    }
    
    setClienteModalOpen(false);
  }, [formCliente, clienteEditando, colunaDestino, gerarIniciais, fetchData]);

  const excluirCliente = useCallback(async (clienteId: string) => {
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
  }, [fetchData]);

  // CRUD de Colunas
  const abrirModalNovaColuna = useCallback(() => {
    setColunaEditando(null);
    setFormColuna({ titulo: "", cor: "bg-blue-500" });
    setColunaModalOpen(true);
  }, []);

  const abrirModalEditarColuna = useCallback((coluna: Coluna) => {
    setColunaEditando(coluna);
    setFormColuna({ titulo: coluna.titulo, cor: coluna.cor });
    setColunaModalOpen(true);
  }, []);

  const salvarColuna = useCallback(async () => {
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
  }, [formColuna, colunaEditando, colunas, fetchData]);

  const excluirColuna = useCallback(async (colunaId: string) => {
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
  }, [colunas, fetchData]);

  // Atualizar meta mensal
  const atualizarMetaMensal = useCallback(async (novaMeta: number) => {
    if (config.id) {
      await supabase.from('crm_configuracoes').update({ meta_mensal: novaMeta }).eq('id', config.id);
    } else {
      await supabase.from('crm_configuracoes').insert({ meta_mensal: novaMeta });
    }
    setConfig(prev => ({ ...prev, meta_mensal: novaMeta }));
    toast.success('Meta atualizada');
  }, [config.id]);

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
          {/* Page Title */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <Kanban className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary flex-shrink-0" />
                <span className="truncate">CRM - Pipeline</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Arraste os cards para atualizar status</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/clientes-ativos')} variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Clientes Ativos</span>
              </Button>
              <Button onClick={() => setConfigModalOpen(true)} variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Configurar</span>
              </Button>
            </div>
          </div>

          {/* Business Health Card + Churn Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 sm:mb-6">
            <div className="lg:col-span-2">
              <BusinessHealthCard
                mrr={mrr}
                receitaNovaPrevista={stats.receitaProvavel}
                churnMes={config.churn_mes_atual}
                metaMensal={config.meta_mensal}
                receitaFechada={stats.valorFechado}
                onUpdateMeta={atualizarMetaMensal}
              />
            </div>
            <div className="space-y-4">
              <ChurnAlertsCard 
                clientesEmRisco={clientesAtivosRisco} 
                onVerDetalhes={() => navigate('/clientes-ativos')}
              />
              {perdas.length > 0 && (
                <LossAnalysisCard perdas={perdas} totalPerdas={totalPerdas} />
              )}
            </div>
          </div>

          {/* Pipeline Stats */}
          <div className="mb-4 sm:mb-6">
            <PipelineStats
              totalPipeline={stats.totalPipeline}
              receitaProvavel={stats.receitaProvavel}
              leadsAtivos={stats.totalLeadsAtivos}
              negociosFechados={stats.negociosFechados}
              valorFechado={stats.valorFechado}
            />
          </div>

          {/* Kanban Board */}
          <div className="overflow-x-auto pb-4 -mx-3 px-3 sm:-mx-4 sm:px-4 md:-mx-6 md:px-6">
            <div className="flex gap-3 sm:gap-4 min-w-max">
              {colunas.map((coluna) => (
                <div
                  key={coluna.id}
                  className="w-64 sm:w-72 md:w-80 flex-shrink-0"
                  onDragOver={(e) => handleDragOver(e, coluna.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, coluna.id)}
                >
                  <Card className={`bg-secondary/30 border-dashed transition-all ${
                    dragOverColuna === coluna.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}>
                    <CardHeader className="pb-2 sm:pb-3 px-2 sm:px-4">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${coluna.cor} flex-shrink-0`} />
                          <CardTitle className="text-sm sm:text-base truncate">{coluna.titulo}</CardTitle>
                          <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 flex-shrink-0">
                            {coluna.clientes.length}
                          </Badge>
                          <Badge variant="outline" className="text-[9px] px-1 flex-shrink-0">
                            {coluna.probabilidade}%
                          </Badge>
                        </div>
                        <div className="flex gap-0.5 flex-shrink-0">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 sm:h-8 sm:w-8"
                            onClick={() => abrirModalNovoCliente(coluna.id)}
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                                <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="z-50 bg-popover">
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
                    <CardContent className="space-y-2 sm:space-y-3 min-h-[150px] sm:min-h-[200px] px-2 sm:px-4 pb-2 sm:pb-4">
                      {coluna.clientes.map((cliente) => (
                        <ClienteCard
                          key={cliente.id}
                          cliente={cliente}
                          colunaId={coluna.id}
                          probabilidade={coluna.probabilidade || 20}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onView={abrirModalDetalhes}
                          onEdit={abrirModalEditarCliente}
                          onDelete={excluirCliente}
                          onMarkLost={abrirModalPerda}
                          formatCurrency={formatCurrency}
                        />
                      ))}
                      {coluna.clientes.length === 0 && (
                        <div className="text-center py-6 sm:py-8 text-muted-foreground text-xs sm:text-sm">
                          Arraste clientes aqui
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
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Pipeline</DialogTitle>
            <DialogDescription>Gerencie as colunas do seu CRM</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button onClick={abrirModalNovaColuna} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Nova Coluna
            </Button>
            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              <p className="text-sm font-medium">Colunas existentes:</p>
              {colunas.map((coluna) => (
                <div key={coluna.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className={`w-3 h-3 rounded-full ${coluna.cor} flex-shrink-0`} />
                    <span className="text-sm truncate">{coluna.titulo}</span>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">{coluna.clientes.length}</Badge>
                    <Badge variant="outline" className="text-[10px] flex-shrink-0">{coluna.probabilidade}%</Badge>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
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
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{colunaEditando ? "Editar Coluna" : "Nova Coluna"}</DialogTitle>
            <DialogDescription>Configure o nome e a cor da coluna</DialogDescription>
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
                <SelectContent className="z-50 bg-popover">
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
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setColunaModalOpen(false)}>Cancelar</Button>
            <Button onClick={salvarColuna}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Cliente */}
      <Dialog open={clienteModalOpen} onOpenChange={setClienteModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{clienteEditando ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
            <DialogDescription>Preencha os dados do cliente</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 py-3 sm:py-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label className="text-xs sm:text-sm">Nome *</Label>
                <Input
                  className="h-9 sm:h-10 text-sm"
                  value={formCliente.nome}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <Label className="text-xs sm:text-sm">Empresa *</Label>
                <Input
                  className="h-9 sm:h-10 text-sm"
                  value={formCliente.empresa}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, empresa: e.target.value }))}
                  placeholder="Nome da empresa"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label className="text-xs sm:text-sm">Ticket (R$)</Label>
                <Input
                  type="number"
                  className="h-9 sm:h-10 text-sm"
                  value={formCliente.ticket}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, ticket: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label className="text-xs sm:text-sm">Responsável *</Label>
                <Select 
                  value={formCliente.responsavel} 
                  onValueChange={(value) => setFormCliente(prev => ({ ...prev, responsavel: value }))}
                >
                  <SelectTrigger className="h-9 sm:h-10 text-sm">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    {vendedores.map((v) => (
                      <SelectItem key={v.id} value={v.nome}>{v.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label className="text-xs sm:text-sm">Serviço *</Label>
                <Select 
                  value={formCliente.servico} 
                  onValueChange={(value) => setFormCliente(prev => ({ ...prev, servico: value }))}
                >
                  <SelectTrigger className="h-9 sm:h-10 text-sm">
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    {servicosDisponiveis.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs sm:text-sm">Origem do Lead</Label>
                <Select 
                  value={formCliente.origem} 
                  onValueChange={(value) => setFormCliente(prev => ({ ...prev, origem: value }))}
                >
                  <SelectTrigger className="h-9 sm:h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    {origensDisponiveis.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label className="text-xs sm:text-sm">Telefone</Label>
                <Input
                  className="h-9 sm:h-10 text-sm"
                  value={formCliente.telefone}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <Label className="text-xs sm:text-sm">Email</Label>
                <Input
                  type="email"
                  className="h-9 sm:h-10 text-sm"
                  value={formCliente.email}
                  onChange={(e) => setFormCliente(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs sm:text-sm">Observações</Label>
              <Textarea
                className="text-sm"
                value={formCliente.observacoes}
                onChange={(e) => setFormCliente(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Anotações..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setClienteModalOpen(false)}>Cancelar</Button>
            <Button size="sm" onClick={salvarCliente}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes */}
      <Dialog open={detalhesModalOpen} onOpenChange={setDetalhesModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>Informações completas do lead</DialogDescription>
          </DialogHeader>
          {clienteVisualizando && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 flex-shrink-0">
                  <AvatarFallback className="text-lg sm:text-xl font-bold text-primary bg-transparent">
                    {clienteVisualizando.iniciais}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold truncate">{clienteVisualizando.nome}</h3>
                  <p className="text-sm text-muted-foreground truncate">{clienteVisualizando.empresa}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Ticket</p>
                  <p className="font-medium text-primary">{formatCurrency(Number(clienteVisualizando.ticket || 0))}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Responsável</p>
                  <p className="font-medium truncate">{clienteVisualizando.responsavel}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Serviço</p>
                  <p className="font-medium truncate">{clienteVisualizando.servico}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Data de Contato</p>
                  <p className="font-medium">{clienteVisualizando.data_contato}</p>
                </div>
                {clienteVisualizando.origem && (
                  <div>
                    <p className="text-muted-foreground text-xs">Origem</p>
                    <p className="font-medium">{origensDisponiveis.find(o => o.value === clienteVisualizando.origem)?.label}</p>
                  </div>
                )}
                {clienteVisualizando.telefone && (
                  <div>
                    <p className="text-muted-foreground text-xs">Telefone</p>
                    <p className="font-medium">{clienteVisualizando.telefone}</p>
                  </div>
                )}
                {clienteVisualizando.email && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs">Email</p>
                    <p className="font-medium truncate">{clienteVisualizando.email}</p>
                  </div>
                )}
              </div>
              {clienteVisualizando.observacoes && (
                <div>
                  <p className="text-muted-foreground text-xs">Observações</p>
                  <p className="text-sm mt-1 p-2 bg-secondary/30 rounded">{clienteVisualizando.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Motivo de Perda */}
      <LossReasonModal
        open={lossReasonModalOpen}
        onOpenChange={setLossReasonModalOpen}
        clienteNome={clientePerdendo?.nome || ""}
        onConfirm={confirmarPerda}
        onCancel={() => {
          setLossReasonModalOpen(false);
          setClientePerdendo(null);
        }}
      />
    </div>
  );
};

export default CRM;
