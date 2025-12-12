import { useEffect, useState, useCallback, memo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WhatsAppButton } from "@/components/dashboard/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Target, 
  TrendingUp, 
  Award,
  DollarSign,
  Users,
  Phone,
  Mail,
  Pencil,
  Calendar,
  CheckCircle,
  MessageCircle,
  Plus,
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMesAtual } from "@/lib/dateUtils";
import { toast } from "sonner";

interface Vendedor {
  id: string;
  nome: string;
  iniciais: string;
  email: string | null;
  telefone: string | null;
  whatsapp: string | null;
  cor: string | null;
  meta_mensal: number;
  vendas_mes: number;
  clientes_ativos: number;
  negocios_fechados: number;
  reunioes_agendadas: number;
  reunioes_fechadas: number;
}

const StatCard = memo(({ icon: Icon, label, value, bgColor, iconColor }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  bgColor: string;
  iconColor: string;
}) => (
  <Card className="hover-lift">
    <CardContent className="p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{label}</p>
          <p className="text-sm sm:text-lg font-bold text-foreground truncate">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
));
StatCard.displayName = "StatCard";

const CORES = [
  "from-primary to-accent",
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-orange-500 to-red-500",
  "from-green-500 to-teal-500",
  "from-indigo-500 to-purple-500"
];

const Comercial = () => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendedorEditando, setVendedorEditando] = useState<Vendedor | null>(null);
  const [vendedorParaDeletar, setVendedorParaDeletar] = useState<Vendedor | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    iniciais: '',
    email: '',
    telefone: '',
    whatsapp: '',
    cor: CORES[0],
    meta_mensal: 15000,
    vendas_mes: 0,
    reunioes_agendadas: 0,
    reunioes_fechadas: 0,
    clientes_ativos: 0,
    negocios_fechados: 0
  });

  const fetchVendedores = useCallback(async () => {
    const { data, error } = await supabase
      .from('vendedores')
      .select('*')
      .order('nome');
    
    if (error) {
      toast.error('Erro ao carregar vendedores');
    } else {
      setVendedores(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVendedores();
  }, [fetchVendedores]);

  const abrirModalEditar = useCallback((vendedor: Vendedor) => {
    setVendedorEditando(vendedor);
    setFormData({
      nome: vendedor.nome,
      iniciais: vendedor.iniciais,
      email: vendedor.email || '',
      telefone: vendedor.telefone || '',
      whatsapp: vendedor.whatsapp || '',
      cor: vendedor.cor || CORES[0],
      meta_mensal: Number(vendedor.meta_mensal) || 0,
      vendas_mes: Number(vendedor.vendas_mes) || 0,
      reunioes_agendadas: vendedor.reunioes_agendadas || 0,
      reunioes_fechadas: vendedor.reunioes_fechadas || 0,
      clientes_ativos: vendedor.clientes_ativos || 0,
      negocios_fechados: vendedor.negocios_fechados || 0
    });
    setEditModalOpen(true);
  }, []);

  const abrirModalAdicionar = useCallback(() => {
    setFormData({
      nome: '',
      iniciais: '',
      email: '',
      telefone: '',
      whatsapp: '',
      cor: CORES[Math.floor(Math.random() * CORES.length)],
      meta_mensal: 15000,
      vendas_mes: 0,
      reunioes_agendadas: 0,
      reunioes_fechadas: 0,
      clientes_ativos: 0,
      negocios_fechados: 0
    });
    setAddModalOpen(true);
  }, []);

  const salvarVendedor = useCallback(async () => {
    if (!vendedorEditando) return;

    const { error } = await supabase
      .from('vendedores')
      .update({
        nome: formData.nome,
        iniciais: formData.iniciais,
        email: formData.email || null,
        telefone: formData.telefone || null,
        whatsapp: formData.whatsapp || null,
        cor: formData.cor,
        meta_mensal: formData.meta_mensal,
        vendas_mes: formData.vendas_mes,
        reunioes_agendadas: formData.reunioes_agendadas,
        reunioes_fechadas: formData.reunioes_fechadas,
        clientes_ativos: formData.clientes_ativos,
        negocios_fechados: formData.negocios_fechados
      })
      .eq('id', vendedorEditando.id);

    if (error) {
      toast.error('Erro ao atualizar vendedor');
    } else {
      toast.success('Vendedor atualizado!');
      fetchVendedores();
      setEditModalOpen(false);
    }
  }, [vendedorEditando, formData, fetchVendedores]);

  const adicionarVendedor = useCallback(async () => {
    if (!formData.nome.trim() || !formData.iniciais.trim()) {
      toast.error('Nome e iniciais são obrigatórios');
      return;
    }

    const { error } = await supabase
      .from('vendedores')
      .insert({
        nome: formData.nome,
        iniciais: formData.iniciais.toUpperCase().slice(0, 2),
        email: formData.email || null,
        telefone: formData.telefone || null,
        whatsapp: formData.whatsapp || null,
        cor: formData.cor,
        meta_mensal: formData.meta_mensal,
        vendas_mes: formData.vendas_mes,
        reunioes_agendadas: formData.reunioes_agendadas,
        reunioes_fechadas: formData.reunioes_fechadas,
        clientes_ativos: formData.clientes_ativos,
        negocios_fechados: formData.negocios_fechados
      });

    if (error) {
      toast.error('Erro ao adicionar vendedor');
    } else {
      toast.success('Vendedor adicionado!');
      fetchVendedores();
      setAddModalOpen(false);
    }
  }, [formData, fetchVendedores]);

  const confirmarExclusao = useCallback((vendedor: Vendedor) => {
    setVendedorParaDeletar(vendedor);
    setDeleteDialogOpen(true);
  }, []);

  const excluirVendedor = useCallback(async () => {
    if (!vendedorParaDeletar) return;

    const { error } = await supabase
      .from('vendedores')
      .delete()
      .eq('id', vendedorParaDeletar.id);

    if (error) {
      toast.error('Erro ao excluir vendedor');
    } else {
      toast.success('Vendedor excluído!');
      fetchVendedores();
    }
    setDeleteDialogOpen(false);
    setVendedorParaDeletar(null);
  }, [vendedorParaDeletar, fetchVendedores]);

  const openWhatsApp = useCallback((whatsapp: string | null, nome: string) => {
    if (!whatsapp) return;
    const mensagem = encodeURIComponent(`Oi ${nome.split(' ')[0]}! Como estão as vendas?`);
    window.open(`https://wa.me/${whatsapp}?text=${mensagem}`, '_blank');
  }, []);

  const formatCurrency = useCallback((value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }, []);

  const totalVendas = vendedores.reduce((acc, v) => acc + Number(v.vendas_mes || 0), 0);
  const totalMeta = vendedores.reduce((acc, v) => acc + Number(v.meta_mensal || 0), 0);
  const totalClientes = vendedores.reduce((acc, v) => acc + (v.clientes_ativos || 0), 0);
  const totalNegocios = vendedores.reduce((acc, v) => acc + (v.negocios_fechados || 0), 0);
  const totalReunioes = vendedores.reduce((acc, v) => acc + (v.reunioes_agendadas || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  const VendedorModal = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nome *</Label>
          <Input
            value={formData.nome}
            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            placeholder="Nome completo"
          />
        </div>
        <div>
          <Label>Iniciais *</Label>
          <Input
            value={formData.iniciais}
            maxLength={2}
            onChange={(e) => setFormData(prev => ({ ...prev, iniciais: e.target.value.toUpperCase() }))}
            placeholder="GF"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="email@exemplo.com"
          />
        </div>
        <div>
          <Label>Telefone</Label>
          <Input
            value={formData.telefone}
            onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
            placeholder="+55 79 9999-9999"
          />
        </div>
      </div>
      <div>
        <Label>WhatsApp (número completo)</Label>
        <Input
          value={formData.whatsapp}
          onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
          placeholder="5579999999999"
        />
      </div>
      <div>
        <Label>Cor do Perfil</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {CORES.map((cor) => (
            <button
              key={cor}
              type="button"
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${cor} ${formData.cor === cor ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, cor }))}
            />
          ))}
        </div>
      </div>
      <div className="border-t pt-4">
        <p className="text-sm font-medium mb-3">Métricas</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Meta Mensal (R$)</Label>
            <Input
              type="number"
              value={formData.meta_mensal}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_mensal: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label>Vendas do Mês (R$)</Label>
            <Input
              type="number"
              value={formData.vendas_mes}
              onChange={(e) => setFormData(prev => ({ ...prev, vendas_mes: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label>Reuniões Agendadas</Label>
            <Input
              type="number"
              value={formData.reunioes_agendadas}
              onChange={(e) => setFormData(prev => ({ ...prev, reunioes_agendadas: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label>Reuniões Fechadas</Label>
            <Input
              type="number"
              value={formData.reunioes_fechadas}
              onChange={(e) => setFormData(prev => ({ ...prev, reunioes_fechadas: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label>Clientes Ativos</Label>
            <Input
              type="number"
              value={formData.clientes_ativos}
              onChange={(e) => setFormData(prev => ({ ...prev, clientes_ativos: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label>Negócios Fechados</Label>
            <Input
              type="number"
              value={formData.negocios_fechados}
              onChange={(e) => setFormData(prev => ({ ...prev, negocios_fechados: Number(e.target.value) }))}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:ml-64">
        <Header />
        
        <main className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary flex-shrink-0" />
                <span className="truncate">Equipe Comercial</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Gera reunião qualificada - Kauã fecha
              </p>
            </div>
            <Button onClick={abrirModalAdicionar} className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Vendedor
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            <StatCard icon={DollarSign} label="Vendas do Mês" value={formatCurrency(totalVendas)} bgColor="gradient-primary" iconColor="text-primary-foreground" />
            <StatCard icon={Target} label="Meta Total" value={formatCurrency(totalMeta)} bgColor="bg-accent/20" iconColor="text-accent" />
            <StatCard icon={Calendar} label="Reuniões" value={totalReunioes} bgColor="bg-primary/20" iconColor="text-primary" />
            <StatCard icon={Users} label="Clientes" value={totalClientes} bgColor="bg-primary/20" iconColor="text-primary" />
            <StatCard icon={Award} label="Fechados" value={totalNegocios} bgColor="bg-warning/20" iconColor="text-warning" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {vendedores.map((vendedor, index) => {
              const porcentagem = vendedor.meta_mensal > 0 
                ? (Number(vendedor.vendas_mes || 0) / Number(vendedor.meta_mensal)) * 100 
                : 0;
              const isTop = vendedores.length > 1 && porcentagem === Math.max(...vendedores.map(v => 
                v.meta_mensal > 0 ? (Number(v.vendas_mes || 0) / Number(v.meta_mensal)) * 100 : 0
              ));
              
              return (
                <Card key={vendedor.id} className="hover-lift overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={`h-1.5 sm:h-2 bg-gradient-to-r ${vendedor.cor || 'from-primary to-accent'}`} />
                  
                  <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                        <Avatar className={`w-10 h-10 sm:w-14 md:w-16 sm:h-14 md:h-16 bg-gradient-to-br ${vendedor.cor || 'from-primary to-accent'} shadow-purple flex-shrink-0`}>
                          <AvatarFallback className="text-sm sm:text-lg font-bold text-primary-foreground bg-transparent">
                            {vendedor.iniciais}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-1 sm:gap-2 flex-wrap">
                            <span className="truncate">{vendedor.nome}</span>
                            {isTop && (
                              <Badge className="bg-warning text-warning-foreground text-[10px] sm:text-xs px-1 sm:px-2">
                                <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                                Top
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-xs sm:text-sm text-muted-foreground">Consultor</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-9 sm:w-9 flex-shrink-0" onClick={() => abrirModalEditar(vendedor)}>
                          <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-9 sm:w-9 flex-shrink-0 text-destructive hover:text-destructive" onClick={() => confirmarExclusao(vendedor)}>
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-1.5 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                      {vendedor.email && (
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                          <span className="truncate">{vendedor.email}</span>
                        </div>
                      )}
                      {vendedor.telefone && (
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                          <span className="truncate">{vendedor.telefone}</span>
                        </div>
                      )}
                    </div>

                    {vendedor.whatsapp && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full h-8 sm:h-9 text-xs sm:text-sm border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={() => openWhatsApp(vendedor.whatsapp, vendedor.nome)}
                      >
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        Suporte no WhatsApp
                      </Button>
                    )}

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                          <Target className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                          Meta de {getMesAtual().split(' ')[0]}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-primary">{porcentagem.toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(porcentagem, 100)} className="h-2 sm:h-3" />
                      <div className="flex justify-between text-[10px] sm:text-xs">
                        <span className="text-muted-foreground">
                          <span className="font-semibold text-foreground">{formatCurrency(Number(vendedor.vendas_mes || 0))}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Meta: <span className="font-semibold text-foreground">{formatCurrency(Number(vendedor.meta_mensal || 0))}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
                      <div className="text-center p-2 sm:p-3 rounded-xl bg-secondary/50">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] sm:text-xs mb-0.5 sm:mb-1">
                          <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="truncate">Agendadas</span>
                        </div>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{vendedor.reunioes_agendadas || 0}</p>
                      </div>
                      <div className="text-center p-2 sm:p-3 rounded-xl bg-secondary/50">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] sm:text-xs mb-0.5 sm:mb-1">
                          <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="truncate">Fechadas</span>
                        </div>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{vendedor.reunioes_fechadas || 0}</p>
                      </div>
                      <div className="text-center p-2 sm:p-3 rounded-xl bg-secondary/50">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] sm:text-xs mb-0.5 sm:mb-1">
                          <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="truncate">Clientes</span>
                        </div>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{vendedor.clientes_ativos || 0}</p>
                      </div>
                      <div className="text-center p-2 sm:p-3 rounded-xl bg-secondary/50">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] sm:text-xs mb-0.5 sm:mb-1">
                          <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="truncate">Negócios</span>
                        </div>
                        <p className="text-lg sm:text-2xl font-bold text-foreground">{vendedor.negocios_fechados || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>

      <WhatsAppButton />

      {/* Modal Editar */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Vendedor</DialogTitle>
            <DialogDescription>Atualize as informações do vendedor</DialogDescription>
          </DialogHeader>
          <VendedorModal isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={salvarVendedor} className="gradient-primary text-primary-foreground">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Adicionar */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Vendedor</DialogTitle>
            <DialogDescription>Preencha as informações do novo vendedor</DialogDescription>
          </DialogHeader>
          <VendedorModal />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>Cancelar</Button>
            <Button onClick={adicionarVendedor} className="gradient-primary text-primary-foreground">Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirmar Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Vendedor</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {vendedorParaDeletar?.nome}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={excluirVendedor} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Comercial;
