import { useEffect, useState } from "react";
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
} from "@/components/ui/dialog";
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
  MessageCircle
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

const Comercial = () => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [vendedorEditando, setVendedorEditando] = useState<Vendedor | null>(null);
  const [formData, setFormData] = useState({
    meta_mensal: 0,
    vendas_mes: 0,
    reunioes_agendadas: 0,
    reunioes_fechadas: 0,
    clientes_ativos: 0,
    negocios_fechados: 0
  });

  const fetchVendedores = async () => {
    const { data, error } = await supabase
      .from('vendedores')
      .select('*')
      .order('nome');
    
    if (error) {
      console.error('Erro ao buscar vendedores:', error);
      toast.error('Erro ao carregar vendedores');
    } else {
      setVendedores(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVendedores();
  }, []);

  const abrirModalEditar = (vendedor: Vendedor) => {
    setVendedorEditando(vendedor);
    setFormData({
      meta_mensal: Number(vendedor.meta_mensal) || 0,
      vendas_mes: Number(vendedor.vendas_mes) || 0,
      reunioes_agendadas: vendedor.reunioes_agendadas || 0,
      reunioes_fechadas: vendedor.reunioes_fechadas || 0,
      clientes_ativos: vendedor.clientes_ativos || 0,
      negocios_fechados: vendedor.negocios_fechados || 0
    });
    setEditModalOpen(true);
  };

  const salvarVendedor = async () => {
    if (!vendedorEditando) return;

    const { error } = await supabase
      .from('vendedores')
      .update({
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
      toast.success('Vendedor atualizado com sucesso');
      fetchVendedores();
      setEditModalOpen(false);
    }
  };

  const openWhatsApp = (whatsapp: string | null, nome: string) => {
    if (!whatsapp) return;
    const mensagem = encodeURIComponent(`Oi ${nome.split(' ')[0]}, você precisa vender mais! Bora fechar negócios!`);
    window.open(`https://wa.me/${whatsapp}?text=${mensagem}`, '_blank');
  };

  const totalVendas = vendedores.reduce((acc, v) => acc + Number(v.vendas_mes || 0), 0);
  const totalMeta = vendedores.reduce((acc, v) => acc + Number(v.meta_mensal || 0), 0);
  const totalClientes = vendedores.reduce((acc, v) => acc + (v.clientes_ativos || 0), 0);
  const totalNegocios = vendedores.reduce((acc, v) => acc + (v.negocios_fechados || 0), 0);
  const totalReunioes = vendedores.reduce((acc, v) => acc + (v.reunioes_agendadas || 0), 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

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
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-7 h-7 text-primary" />
              Equipe Comercial
            </h2>
            <p className="text-muted-foreground mt-1">
              O time gera reunião qualificada e Kauã Montalvão fecha
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reuniões Agendadas</p>
                    <p className="text-lg font-bold text-foreground">{totalReunioes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
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
              const porcentagem = vendedor.meta_mensal > 0 
                ? (Number(vendedor.vendas_mes || 0) / Number(vendedor.meta_mensal)) * 100 
                : 0;
              const isTop = vendedores.length > 1 && porcentagem === Math.max(...vendedores.map(v => 
                v.meta_mensal > 0 ? (Number(v.vendas_mes || 0) / Number(v.meta_mensal)) * 100 : 0
              ));
              
              return (
                <Card 
                  key={vendedor.id} 
                  className="hover-lift overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Header gradient */}
                  <div className={`h-2 bg-gradient-to-r ${vendedor.cor || 'from-primary to-accent'}`} />
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className={`w-16 h-16 bg-gradient-to-br ${vendedor.cor || 'from-primary to-accent'} shadow-purple`}>
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
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => abrirModalEditar(vendedor)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {vendedor.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          {vendedor.email}
                        </div>
                      )}
                      {vendedor.telefone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          {vendedor.telefone}
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Button */}
                    {vendedor.whatsapp && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={() => openWhatsApp(vendedor.whatsapp, vendedor.nome)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Cobrar pelo WhatsApp
                      </Button>
                    )}

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
                          Vendido: <span className="font-semibold text-foreground">{formatCurrency(Number(vendedor.vendas_mes || 0))}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Meta: <span className="font-semibold text-foreground">{formatCurrency(Number(vendedor.meta_mensal || 0))}</span>
                        </span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="text-center p-3 rounded-xl bg-secondary/50">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                          <Calendar className="w-3 h-3" />
                          Reuniões Agendadas
                        </div>
                        <p className="text-2xl font-bold text-foreground">{vendedor.reunioes_agendadas || 0}</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-secondary/50">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                          <CheckCircle className="w-3 h-3" />
                          Reuniões Fechadas
                        </div>
                        <p className="text-2xl font-bold text-foreground">{vendedor.reunioes_fechadas || 0}</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-secondary/50">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                          <Users className="w-3 h-3" />
                          Clientes Ativos
                        </div>
                        <p className="text-2xl font-bold text-foreground">{vendedor.clientes_ativos || 0}</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-secondary/50">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                          <TrendingUp className="w-3 h-3" />
                          Negócios Fechados
                        </div>
                        <p className="text-2xl font-bold text-foreground">{vendedor.negocios_fechados || 0}</p>
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

      {/* Modal de Edição */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar {vendedorEditando?.nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div className="grid grid-cols-2 gap-4">
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={salvarVendedor}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Comercial;
