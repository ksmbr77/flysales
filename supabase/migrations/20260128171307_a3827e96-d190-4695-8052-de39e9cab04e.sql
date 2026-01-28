-- =============================================
-- EVOLUÇÃO DO CRM FLY AGENCY - FASE 1
-- =============================================

-- 1. Atualizar tabela crm_clientes (leads) com novos campos
ALTER TABLE public.crm_clientes 
ADD COLUMN IF NOT EXISTS probabilidade integer DEFAULT 20,
ADD COLUMN IF NOT EXISTS origem text DEFAULT 'organico',
ADD COLUMN IF NOT EXISTS motivo_perda text,
ADD COLUMN IF NOT EXISTS data_perda timestamp with time zone,
ADD COLUMN IF NOT EXISTS estagio_quando_perdeu text,
ADD COLUMN IF NOT EXISTS tipo_cliente text DEFAULT 'novo',
ADD COLUMN IF NOT EXISTS data_primeiro_contato timestamp with time zone,
ADD COLUMN IF NOT EXISTS data_fechamento timestamp with time zone,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'ativo';

-- 2. Criar tabela de clientes ativos (pós-venda)
CREATE TABLE IF NOT EXISTS public.clientes_ativos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid REFERENCES public.crm_clientes(id) ON DELETE SET NULL,
  nome text NOT NULL,
  empresa text NOT NULL,
  valor_mensal numeric NOT NULL DEFAULT 0,
  data_inicio_contrato timestamp with time zone NOT NULL DEFAULT now(),
  data_renovacao timestamp with time zone,
  escopo_contratado text,
  status_cliente text NOT NULL DEFAULT 'saudavel',
  sinais_risco text[] DEFAULT '{}',
  ultima_interacao timestamp with time zone DEFAULT now(),
  tag_pareto text,
  observacoes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on clientes_ativos
ALTER TABLE public.clientes_ativos ENABLE ROW LEVEL SECURITY;

-- RLS policies for clientes_ativos
CREATE POLICY "authenticated_select_clientes_ativos" ON public.clientes_ativos
FOR SELECT USING (true);

CREATE POLICY "authenticated_insert_clientes_ativos" ON public.clientes_ativos
FOR INSERT WITH CHECK (true);

CREATE POLICY "authenticated_update_clientes_ativos" ON public.clientes_ativos
FOR UPDATE USING (true);

CREATE POLICY "authenticated_delete_clientes_ativos" ON public.clientes_ativos
FOR DELETE USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_clientes_ativos_updated_at
BEFORE UPDATE ON public.clientes_ativos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Criar tabela de configurações do CRM
CREATE TABLE IF NOT EXISTS public.crm_configuracoes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meta_mensal numeric NOT NULL DEFAULT 30000,
  meta_semanal_calls integer NOT NULL DEFAULT 5,
  meta_semanal_propostas integer NOT NULL DEFAULT 5,
  meta_semanal_fechamentos integer NOT NULL DEFAULT 2,
  foco_mes text DEFAULT 'aquisicao',
  churn_mes_atual numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on crm_configuracoes
ALTER TABLE public.crm_configuracoes ENABLE ROW LEVEL SECURITY;

-- RLS policies for crm_configuracoes
CREATE POLICY "authenticated_select_crm_config" ON public.crm_configuracoes
FOR SELECT USING (true);

CREATE POLICY "authenticated_insert_crm_config" ON public.crm_configuracoes
FOR INSERT WITH CHECK (true);

CREATE POLICY "authenticated_update_crm_config" ON public.crm_configuracoes
FOR UPDATE USING (true);

CREATE POLICY "authenticated_delete_crm_config" ON public.crm_configuracoes
FOR DELETE USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_crm_configuracoes_updated_at
BEFORE UPDATE ON public.crm_configuracoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Criar tabela para histórico de perdas (análise)
CREATE TABLE IF NOT EXISTS public.crm_perdas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid REFERENCES public.crm_clientes(id) ON DELETE SET NULL,
  nome text NOT NULL,
  empresa text NOT NULL,
  valor numeric NOT NULL DEFAULT 0,
  motivo text NOT NULL,
  estagio_quando_perdeu text NOT NULL,
  data_perda timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on crm_perdas
ALTER TABLE public.crm_perdas ENABLE ROW LEVEL SECURITY;

-- RLS policies for crm_perdas
CREATE POLICY "authenticated_select_crm_perdas" ON public.crm_perdas
FOR SELECT USING (true);

CREATE POLICY "authenticated_insert_crm_perdas" ON public.crm_perdas
FOR INSERT WITH CHECK (true);

CREATE POLICY "authenticated_delete_crm_perdas" ON public.crm_perdas
FOR DELETE USING (true);

-- 5. Adicionar probabilidade às colunas do pipeline
UPDATE public.crm_colunas SET cor = 'bg-blue-500' WHERE titulo = 'Novos Leads';
UPDATE public.crm_colunas SET cor = 'bg-yellow-500' WHERE titulo = 'Qualificados';
UPDATE public.crm_colunas SET cor = 'bg-orange-500' WHERE titulo = 'Aguardando Confirmação';
UPDATE public.crm_colunas SET cor = 'bg-green-500' WHERE titulo = 'Fechado';

-- Adicionar campo de probabilidade na tabela de colunas
ALTER TABLE public.crm_colunas 
ADD COLUMN IF NOT EXISTS probabilidade integer DEFAULT 20;

-- Atualizar probabilidades por coluna
UPDATE public.crm_colunas SET probabilidade = 20 WHERE titulo = 'Novos Leads';
UPDATE public.crm_colunas SET probabilidade = 40 WHERE titulo = 'Qualificados';
UPDATE public.crm_colunas SET probabilidade = 75 WHERE titulo = 'Aguardando Confirmação';
UPDATE public.crm_colunas SET probabilidade = 100 WHERE titulo = 'Fechado';

-- 6. Inserir configuração padrão
INSERT INTO public.crm_configuracoes (meta_mensal, meta_semanal_calls, meta_semanal_propostas, meta_semanal_fechamentos, foco_mes)
VALUES (30000, 5, 5, 2, 'aquisicao')
ON CONFLICT DO NOTHING;