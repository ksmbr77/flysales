import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/dashboard/WhatsAppButton";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  ArrowDown,
  Filter,
  BarChart3,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FunnelStage {
  id: string;
  titulo: string;
  cor: string;
  count: number;
  valor: number;
  probabilidade: number;
}

interface OrigemStats {
  origem: string;
  leads: number;
  vendas: number;
  taxa: number;
  valorTotal: number;
}

const origensLabels: Record<string, string> = {
  organico: "🌐 Orgânico",
  indicacao: "👥 Indicação",
  trafego_pago: "💰 Tráfego Pago",
  whatsapp: "💬 WhatsApp",
  email: "📧 E-mail",
  networking: "🎯 Networking",
  outro: "✏️ Outro"
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const FunilVendas = () => {
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [origemStats, setOrigemStats] = useState<OrigemStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("30");
  const [tempoMedioFechamento, setTempoMedioFechamento] = useState(0);
  const [ticketMedio, setTicketMedio] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - parseInt(periodo));

    const [colunasRes, clientesRes] = await Promise.all([
      supabase.from('crm_colunas').select('*').order('ordem'),
      supabase.from('crm_clientes').select('*').gte('created_at', dataLimite.toISOString())
    ]);

    if (colunasRes.data && clientesRes.data) {
      // Processar estágios do funil
      const stagesData: FunnelStage[] = colunasRes.data.map(col => {
        const clientesNaColuna = clientesRes.data.filter(c => c.coluna_id === col.id);
        return {
          id: col.id,
          titulo: col.titulo,
          cor: col.cor,
          count: clientesNaColuna.length,
          valor: clientesNaColuna.reduce((acc, c) => acc + (Number(c.ticket) || 0), 0),
          probabilidade: col.probabilidade || 20
        };
      });
      setStages(stagesData);

      // Estatísticas por origem
      const origemMap: Record<string, { leads: number; vendas: number; valor: number }> = {};
      clientesRes.data.forEach(c => {
        const origem = c.origem || 'outro';
        if (!origemMap[origem]) {
          origemMap[origem] = { leads: 0, vendas: 0, valor: 0 };
        }
        origemMap[origem].leads++;
        
        // Check if in "Fechado" column
        const coluna = colunasRes.data.find(col => col.id === c.coluna_id);
        if (coluna?.titulo.toLowerCase().includes('fechado')) {
          origemMap[origem].vendas++;
          origemMap[origem].valor += Number(c.ticket) || 0;
        }
      });

      const origemStatsData: OrigemStats[] = Object.entries(origemMap)
        .map(([origem, stats]) => ({
          origem,
          leads: stats.leads,
          vendas: stats.vendas,
          taxa: stats.leads > 0 ? Math.round((stats.vendas / stats.leads) * 100) : 0,
          valorTotal: stats.valor
        }))
        .sort((a, b) => b.taxa - a.taxa);
      
      setOrigemStats(origemStatsData);

      // Calcular tempo médio de fechamento
      const clientesFechados = clientesRes.data.filter(c => {
        const coluna = colunasRes.data.find(col => col.id === c.coluna_id);
        return coluna?.titulo.toLowerCase().includes('fechado') && c.data_primeiro_contato && c.data_fechamento;
      });

      if (clientesFechados.length > 0) {
        const totalDias = clientesFechados.reduce((acc, c) => {
          const inicio = new Date(c.data_primeiro_contato!);
          const fim = new Date(c.data_fechamento!);
          return acc + Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
        }, 0);
        setTempoMedioFechamento(Math.round(totalDias / clientesFechados.length));
      }

      // Ticket médio
      const fechados = clientesRes.data.filter(c => {
        const coluna = colunasRes.data.find(col => col.id === c.coluna_id);
        return coluna?.titulo.toLowerCase().includes('fechado');
      });
      if (fechados.length > 0) {
        const totalTicket = fechados.reduce((acc, c) => acc + (Number(c.ticket) || 0), 0);
        setTicketMedio(totalTicket / fechados.length);
      }
    }

    setLoading(false);
  }, [periodo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const totalLeads = stages.reduce((acc, s) => acc + s.count, 0);
  const totalVendas = stages.find(s => s.titulo.toLowerCase().includes('fechado'))?.count || 0;
  const taxaConversaoGeral = totalLeads > 0 ? Math.round((totalVendas / totalLeads) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="lg:ml-64">
          <Header />
          <main className="p-3 sm:p-4 md:p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
              <Skeleton className="h-64" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:ml-64">
        <Header />
        
        <main className="p-3 sm:p-4 md:p-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Header */}
            <motion.div 
              variants={itemVariants}
              className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                  Funil de Vendas
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Análise de conversão e performance
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="7">Últimos 7 dias</SelectItem>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="90">Últimos 90 dias</SelectItem>
                    <SelectItem value="365">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* KPIs */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6"
            >
              <Card className="hover-lift">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Leads Gerados</p>
                      <p className="text-lg sm:text-2xl font-bold">{totalLeads}</p>
                    </div>
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Vendas Fechadas</p>
                      <p className="text-lg sm:text-2xl font-bold text-green-600">{totalVendas}</p>
                    </div>
                    <Target className="w-5 h-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Taxa Conversão</p>
                      <p className="text-lg sm:text-2xl font-bold text-primary">{taxaConversaoGeral}%</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Ticket Médio</p>
                      <p className="text-lg sm:text-2xl font-bold">{formatCurrency(ticketMedio)}</p>
                    </div>
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Funnel Visual */}
            <motion.div variants={itemVariants}>
              <Card className="mb-4 sm:mb-6 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    📊 Funil de Conversão
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <div className="space-y-3">
                    <AnimatePresence>
                      {stages.map((stage, index) => {
                        const widthPercent = totalLeads > 0 ? Math.max((stage.count / totalLeads) * 100, 15) : 15;
                        const nextStage = stages[index + 1];
                        const conversionRate = nextStage && stage.count > 0 
                          ? Math.round((nextStage.count / stage.count) * 100) 
                          : null;
                        
                        return (
                          <motion.div
                            key={stage.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="relative">
                              <div 
                                className={`${stage.cor} rounded-lg p-3 sm:p-4 text-white transition-all duration-500`}
                                style={{ width: `${widthPercent}%`, minWidth: '200px' }}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <p className="font-semibold text-sm sm:text-base">{stage.titulo}</p>
                                    <p className="text-xs opacity-90">
                                      {stage.count} leads • {formatCurrency(stage.valor)}
                                    </p>
                                  </div>
                                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                                    {stage.probabilidade}%
                                  </Badge>
                                </div>
                              </div>
                              {conversionRate !== null && (
                                <div className="flex items-center gap-1 mt-1 ml-4 text-xs text-muted-foreground">
                                  <ArrowDown className="w-3 h-3" />
                                  <span>{conversionRate}% conversão</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Análise por Canal */}
              <motion.div variants={itemVariants}>
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      📊 Análise por Canal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-3">
                      {origemStats.length > 0 ? (
                        origemStats.map((stat, index) => (
                          <motion.div
                            key={stat.origem}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-2 sm:p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{origensLabels[stat.origem] || stat.origem}</span>
                              <Badge variant="outline" className="text-[10px]">
                                {stat.leads} leads
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-green-600">{stat.vendas} vendas</span>
                              <Badge 
                                variant={stat.taxa >= 20 ? "default" : "secondary"}
                                className="text-[10px]"
                              >
                                {stat.taxa}%
                              </Badge>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          Nenhum dado no período selecionado
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tempo de Ciclo */}
              <motion.div variants={itemVariants}>
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Ciclo de Vendas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                        className="relative"
                      >
                        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-primary/10 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-3xl sm:text-4xl font-bold text-primary">
                              {tempoMedioFechamento || '-'}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">dias</p>
                          </div>
                        </div>
                      </motion.div>
                      <p className="mt-4 text-sm text-muted-foreground text-center">
                        Tempo médio para fechar um negócio
                      </p>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Insights:</p>
                      <div className="space-y-2">
                        {origemStats.filter(o => o.taxa > 0).slice(0, 2).map(stat => (
                          <div key={stat.origem} className="flex items-center gap-2 text-xs">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span>
                              {origensLabels[stat.origem]} tem {stat.taxa}% de conversão
                            </span>
                          </div>
                        ))}
                        {taxaConversaoGeral < 20 && (
                          <div className="flex items-center gap-2 text-xs text-yellow-600">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <span>Taxa de conversão abaixo de 20%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>

      <WhatsAppButton />
    </div>
  );
};

export default FunilVendas;
