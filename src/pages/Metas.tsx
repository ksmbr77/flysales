import { useState, useEffect, useCallback, memo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { WhatsAppButton } from "@/components/dashboard/WhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Target, Calendar, TrendingUp, Award, Pencil, DollarSign, Users, CheckCircle, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MetaTrimestral {
  id: string;
  trimestre: string;
  periodo: string;
  ano: number;
  meta_faturamento_min: number;
  meta_faturamento_max: number;
  meta_clientes_min: number;
  meta_clientes_max: number;
  meta_ticket_min: number;
  meta_ticket_max: number;
  progresso: number;
}

interface AcaoTrimestral {
  id: string;
  meta_trimestral_id: string;
  titulo: string;
  valor_atual: number;
  valor_meta: number;
  concluida: boolean;
}

const TRIMESTRE_CORES: Record<string, string> = {
  Q1: "from-blue-500 to-cyan-500",
  Q2: "from-green-500 to-emerald-500",
  Q3: "from-orange-500 to-amber-500",
  Q4: "from-purple-500 to-pink-500"
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
};

const TrimestreCard = memo(({ 
  meta, 
  acoes, 
  onEdit, 
  onToggleAcao, 
  onAddAcao,
  onDeleteAcao,
  onUpdateAcaoValor 
}: {
  meta: MetaTrimestral;
  acoes: AcaoTrimestral[];
  onEdit: () => void;
  onToggleAcao: (id: string, concluida: boolean) => void;
  onAddAcao: (metaId: string) => void;
  onDeleteAcao: (id: string) => void;
  onUpdateAcaoValor: (id: string, valor: number) => void;
}) => {
  const cor = TRIMESTRE_CORES[meta.trimestre] || "from-primary to-accent";
  const acoesDoTrimestre = acoes.filter(a => a.meta_trimestral_id === meta.id);
  const acoesConcluidas = acoesDoTrimestre.filter(a => a.concluida).length;
  const progressoAcoes = acoesDoTrimestre.length > 0 ? (acoesConcluidas / acoesDoTrimestre.length) * 100 : 0;

  return (
    <Card className="hover-lift overflow-hidden animate-slide-up">
      <div className={`h-2 bg-gradient-to-r ${cor}`} />
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cor} flex items-center justify-center shadow-lg`}>
              <span className="text-lg font-bold text-white">{meta.trimestre}</span>
            </div>
            <div>
              <CardTitle className="text-lg">{meta.periodo} {meta.ano}</CardTitle>
              <p className="text-xs text-muted-foreground">Trimestre {meta.trimestre.replace('Q', '')}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 px-4 pb-4">
        {/* Metas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-secondary/50">
            <DollarSign className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-[10px] text-muted-foreground">Faturamento/mês</p>
            <p className="text-xs font-bold">{formatCurrency(meta.meta_faturamento_min)}</p>
            <p className="text-[10px] text-muted-foreground">a {formatCurrency(meta.meta_faturamento_max)}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-secondary/50">
            <Users className="w-4 h-4 mx-auto mb-1 text-accent" />
            <p className="text-[10px] text-muted-foreground">Clientes Ativos</p>
            <p className="text-xs font-bold">{meta.meta_clientes_min}-{meta.meta_clientes_max}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-secondary/50">
            <Target className="w-4 h-4 mx-auto mb-1 text-warning" />
            <p className="text-[10px] text-muted-foreground">Ticket Médio</p>
            <p className="text-xs font-bold">{formatCurrency(meta.meta_ticket_min)}</p>
            <p className="text-[10px] text-muted-foreground">a {formatCurrency(meta.meta_ticket_max)}</p>
          </div>
        </div>

        {/* Progresso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progresso Geral</span>
            <span className="font-bold text-primary">{progressoAcoes.toFixed(0)}%</span>
          </div>
          <Progress value={progressoAcoes} className="h-2" />
        </div>

        {/* Ações */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Ações-chave</p>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => onAddAcao(meta.id)}>
              <Plus className="w-3 h-3 mr-1" />
              Adicionar
            </Button>
          </div>
          {acoesDoTrimestre.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-2">Nenhuma ação definida</p>
          ) : (
            <div className="space-y-2">
              {acoesDoTrimestre.map((acao) => (
                <div key={acao.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 group">
                  <Checkbox
                    checked={acao.concluida}
                    onCheckedChange={(checked) => onToggleAcao(acao.id, checked as boolean)}
                    className="data-[state=checked]:bg-primary"
                  />
                  <span className={`text-xs flex-1 ${acao.concluida ? 'line-through text-muted-foreground' : ''}`}>
                    {acao.titulo}
                  </span>
                  {acao.valor_meta > 0 && (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={acao.valor_atual}
                        onChange={(e) => onUpdateAcaoValor(acao.id, Number(e.target.value))}
                        className="h-6 w-12 text-xs text-center p-1"
                      />
                      <span className="text-[10px] text-muted-foreground">/{acao.valor_meta}</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDeleteAcao(acao.id)}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
TrimestreCard.displayName = "TrimestreCard";

const Metas = () => {
  const [metas, setMetas] = useState<MetaTrimestral[]>([]);
  const [acoes, setAcoes] = useState<AcaoTrimestral[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addAcaoModalOpen, setAddAcaoModalOpen] = useState(false);
  const [metaEditando, setMetaEditando] = useState<MetaTrimestral | null>(null);
  const [metaParaAcao, setMetaParaAcao] = useState<string | null>(null);
  const [novaAcao, setNovaAcao] = useState({ titulo: '', valor_meta: 0 });
  const [formData, setFormData] = useState({
    meta_faturamento_min: 0,
    meta_faturamento_max: 0,
    meta_clientes_min: 0,
    meta_clientes_max: 0,
    meta_ticket_min: 0,
    meta_ticket_max: 0
  });

  const fetchData = useCallback(async () => {
    const [metasRes, acoesRes] = await Promise.all([
      supabase.from('metas_trimestrais').select('*').order('trimestre'),
      supabase.from('acoes_trimestrais').select('*')
    ]);

    if (metasRes.error) toast.error('Erro ao carregar metas');
    else setMetas(metasRes.data || []);

    if (acoesRes.error) toast.error('Erro ao carregar ações');
    else setAcoes(acoesRes.data || []);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const abrirModalEditar = useCallback((meta: MetaTrimestral) => {
    setMetaEditando(meta);
    setFormData({
      meta_faturamento_min: Number(meta.meta_faturamento_min),
      meta_faturamento_max: Number(meta.meta_faturamento_max),
      meta_clientes_min: meta.meta_clientes_min,
      meta_clientes_max: meta.meta_clientes_max,
      meta_ticket_min: Number(meta.meta_ticket_min),
      meta_ticket_max: Number(meta.meta_ticket_max)
    });
    setEditModalOpen(true);
  }, []);

  const salvarMeta = useCallback(async () => {
    if (!metaEditando) return;

    const { error } = await supabase
      .from('metas_trimestrais')
      .update(formData)
      .eq('id', metaEditando.id);

    if (error) toast.error('Erro ao atualizar meta');
    else {
      toast.success('Meta atualizada!');
      fetchData();
      setEditModalOpen(false);
    }
  }, [metaEditando, formData, fetchData]);

  const toggleAcao = useCallback(async (id: string, concluida: boolean) => {
    const { error } = await supabase
      .from('acoes_trimestrais')
      .update({ concluida })
      .eq('id', id);

    if (error) toast.error('Erro ao atualizar ação');
    else {
      setAcoes(prev => prev.map(a => a.id === id ? { ...a, concluida } : a));
    }
  }, []);

  const updateAcaoValor = useCallback(async (id: string, valor: number) => {
    const { error } = await supabase
      .from('acoes_trimestrais')
      .update({ valor_atual: valor })
      .eq('id', id);

    if (error) toast.error('Erro ao atualizar ação');
    else {
      setAcoes(prev => prev.map(a => a.id === id ? { ...a, valor_atual: valor } : a));
    }
  }, []);

  const abrirModalAcao = useCallback((metaId: string) => {
    setMetaParaAcao(metaId);
    setNovaAcao({ titulo: '', valor_meta: 0 });
    setAddAcaoModalOpen(true);
  }, []);

  const adicionarAcao = useCallback(async () => {
    if (!metaParaAcao || !novaAcao.titulo.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    const { error, data } = await supabase
      .from('acoes_trimestrais')
      .insert({
        meta_trimestral_id: metaParaAcao,
        titulo: novaAcao.titulo,
        valor_meta: novaAcao.valor_meta,
        valor_atual: 0,
        concluida: false
      })
      .select()
      .single();

    if (error) toast.error('Erro ao adicionar ação');
    else {
      setAcoes(prev => [...prev, data]);
      toast.success('Ação adicionada!');
      setAddAcaoModalOpen(false);
    }
  }, [metaParaAcao, novaAcao]);

  const deletarAcao = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('acoes_trimestrais')
      .delete()
      .eq('id', id);

    if (error) toast.error('Erro ao excluir ação');
    else {
      setAcoes(prev => prev.filter(a => a.id !== id));
      toast.success('Ação excluída!');
    }
  }, []);

  // Calcular totais
  const totalMetaAnual = metas.reduce((acc, m) => acc + (Number(m.meta_faturamento_max) * 3), 0);
  const totalClientes = metas.length > 0 ? metas[metas.length - 1].meta_clientes_max : 0;
  const acoesTotais = acoes.length;
  const acoesConcluidas = acoes.filter(a => a.concluida).length;

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
        
        <main className="p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Target className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              Metas 2026
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Planejamento estratégico por trimestre</p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <Card className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Meta Anual</p>
                    <p className="text-lg font-bold">{formatCurrency(totalMetaAnual)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Meta Clientes</p>
                    <p className="text-lg font-bold">{totalClientes} clientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ações Concluídas</p>
                    <p className="text-lg font-bold">{acoesConcluidas}/{acoesTotais}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Progresso</p>
                    <p className="text-lg font-bold">{acoesTotais > 0 ? ((acoesConcluidas / acoesTotais) * 100).toFixed(0) : 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {metas.map((meta, index) => (
              <div key={meta.id} style={{ animationDelay: `${index * 100}ms` }}>
                <TrimestreCard
                  meta={meta}
                  acoes={acoes}
                  onEdit={() => abrirModalEditar(meta)}
                  onToggleAcao={toggleAcao}
                  onAddAcao={abrirModalAcao}
                  onDeleteAcao={deletarAcao}
                  onUpdateAcaoValor={updateAcaoValor}
                />
              </div>
            ))}
          </div>
        </main>
      </div>
      
      <WhatsAppButton />

      {/* Modal Editar Meta */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Meta {metaEditando?.trimestre}</DialogTitle>
            <DialogDescription>Atualize as metas do trimestre</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Faturamento Min (R$)</Label>
                <Input
                  type="number"
                  value={formData.meta_faturamento_min}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_faturamento_min: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Faturamento Max (R$)</Label>
                <Input
                  type="number"
                  value={formData.meta_faturamento_max}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_faturamento_max: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Clientes Min</Label>
                <Input
                  type="number"
                  value={formData.meta_clientes_min}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_clientes_min: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Clientes Max</Label>
                <Input
                  type="number"
                  value={formData.meta_clientes_max}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_clientes_max: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ticket Médio Min (R$)</Label>
                <Input
                  type="number"
                  value={formData.meta_ticket_min}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_ticket_min: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Ticket Médio Max (R$)</Label>
                <Input
                  type="number"
                  value={formData.meta_ticket_max}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_ticket_max: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={salvarMeta} className="gradient-primary text-primary-foreground">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Adicionar Ação */}
      <Dialog open={addAcaoModalOpen} onOpenChange={setAddAcaoModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Ação</DialogTitle>
            <DialogDescription>Adicione uma ação-chave para o trimestre</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Título da Ação *</Label>
              <Input
                value={novaAcao.titulo}
                onChange={(e) => setNovaAcao(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Ex: Fechar 3 contratos novos"
              />
            </div>
            <div>
              <Label>Meta Numérica (opcional)</Label>
              <Input
                type="number"
                value={novaAcao.valor_meta}
                onChange={(e) => setNovaAcao(prev => ({ ...prev, valor_meta: Number(e.target.value) }))}
                placeholder="Ex: 10 prospecções"
              />
              <p className="text-xs text-muted-foreground mt-1">Deixe 0 para apenas checkbox</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddAcaoModalOpen(false)}>Cancelar</Button>
            <Button onClick={adicionarAcao} className="gradient-primary text-primary-foreground">Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Metas;
