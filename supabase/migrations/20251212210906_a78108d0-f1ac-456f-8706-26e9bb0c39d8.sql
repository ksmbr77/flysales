-- Criar tabela de metas trimestrais 2026
CREATE TABLE public.metas_trimestrais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trimestre TEXT NOT NULL,
  periodo TEXT NOT NULL,
  ano INTEGER NOT NULL DEFAULT 2026,
  meta_faturamento_min NUMERIC NOT NULL DEFAULT 0,
  meta_faturamento_max NUMERIC NOT NULL DEFAULT 0,
  meta_clientes_min INTEGER NOT NULL DEFAULT 0,
  meta_clientes_max INTEGER NOT NULL DEFAULT 0,
  meta_ticket_min NUMERIC NOT NULL DEFAULT 0,
  meta_ticket_max NUMERIC NOT NULL DEFAULT 0,
  progresso NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(trimestre, ano)
);

-- Criar tabela de ações-chave
CREATE TABLE public.acoes_trimestrais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_trimestral_id UUID NOT NULL REFERENCES public.metas_trimestrais(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  valor_atual INTEGER NOT NULL DEFAULT 0,
  valor_meta INTEGER NOT NULL DEFAULT 0,
  concluida BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.metas_trimestrais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acoes_trimestrais ENABLE ROW LEVEL SECURITY;

-- Policies para metas_trimestrais (requer autenticação)
CREATE POLICY "authenticated_select_metas" ON public.metas_trimestrais
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_metas" ON public.metas_trimestrais
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_metas" ON public.metas_trimestrais
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_delete_metas" ON public.metas_trimestrais
  FOR DELETE TO authenticated USING (true);

-- Policies para acoes_trimestrais (requer autenticação)
CREATE POLICY "authenticated_select_acoes" ON public.acoes_trimestrais
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_acoes" ON public.acoes_trimestrais
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_acoes" ON public.acoes_trimestrais
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_delete_acoes" ON public.acoes_trimestrais
  FOR DELETE TO authenticated USING (true);

-- Atualizar políticas das tabelas existentes para exigir autenticação
-- crm_clientes
DROP POLICY IF EXISTS "Acesso público para leitura" ON public.crm_clientes;
DROP POLICY IF EXISTS "Acesso público para inserção" ON public.crm_clientes;
DROP POLICY IF EXISTS "Acesso público para atualização" ON public.crm_clientes;
DROP POLICY IF EXISTS "Acesso público para exclusão" ON public.crm_clientes;

CREATE POLICY "authenticated_select" ON public.crm_clientes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert" ON public.crm_clientes
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update" ON public.crm_clientes
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_delete" ON public.crm_clientes
  FOR DELETE TO authenticated USING (true);

-- crm_colunas
DROP POLICY IF EXISTS "Acesso público para leitura" ON public.crm_colunas;
DROP POLICY IF EXISTS "Acesso público para inserção" ON public.crm_colunas;
DROP POLICY IF EXISTS "Acesso público para atualização" ON public.crm_colunas;
DROP POLICY IF EXISTS "Acesso público para exclusão" ON public.crm_colunas;

CREATE POLICY "authenticated_select" ON public.crm_colunas
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert" ON public.crm_colunas
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update" ON public.crm_colunas
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_delete" ON public.crm_colunas
  FOR DELETE TO authenticated USING (true);

-- vendedores
DROP POLICY IF EXISTS "Acesso público para leitura" ON public.vendedores;
DROP POLICY IF EXISTS "Acesso público para inserção" ON public.vendedores;
DROP POLICY IF EXISTS "Acesso público para atualização" ON public.vendedores;
DROP POLICY IF EXISTS "Acesso público para exclusão" ON public.vendedores;

CREATE POLICY "authenticated_select" ON public.vendedores
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert" ON public.vendedores
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update" ON public.vendedores
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_delete" ON public.vendedores
  FOR DELETE TO authenticated USING (true);

-- faturamento_mensal
DROP POLICY IF EXISTS "Acesso público para leitura" ON public.faturamento_mensal;
DROP POLICY IF EXISTS "Acesso público para inserção" ON public.faturamento_mensal;
DROP POLICY IF EXISTS "Acesso público para atualização" ON public.faturamento_mensal;
DROP POLICY IF EXISTS "Acesso público para exclusão" ON public.faturamento_mensal;

CREATE POLICY "authenticated_select" ON public.faturamento_mensal
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert" ON public.faturamento_mensal
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update" ON public.faturamento_mensal
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_delete" ON public.faturamento_mensal
  FOR DELETE TO authenticated USING (true);

-- dashboard_config
DROP POLICY IF EXISTS "Acesso público para leitura" ON public.dashboard_config;
DROP POLICY IF EXISTS "Acesso público para inserção" ON public.dashboard_config;
DROP POLICY IF EXISTS "Acesso público para atualização" ON public.dashboard_config;
DROP POLICY IF EXISTS "Acesso público para exclusão" ON public.dashboard_config;

CREATE POLICY "authenticated_select" ON public.dashboard_config
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert" ON public.dashboard_config
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update" ON public.dashboard_config
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "authenticated_delete" ON public.dashboard_config
  FOR DELETE TO authenticated USING (true);

-- Trigger para updated_at
CREATE TRIGGER update_metas_trimestrais_updated_at
  BEFORE UPDATE ON public.metas_trimestrais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_acoes_trimestrais_updated_at
  BEFORE UPDATE ON public.acoes_trimestrais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais das metas trimestrais 2026
INSERT INTO public.metas_trimestrais (trimestre, periodo, ano, meta_faturamento_min, meta_faturamento_max, meta_clientes_min, meta_clientes_max, meta_ticket_min, meta_ticket_max, progresso) VALUES
('Q1', 'JAN-MAR', 2026, 7000, 10000, 4, 6, 1700, 2000, 0),
('Q2', 'ABR-JUN', 2026, 10000, 14000, 6, 8, 1500, 2500, 0),
('Q3', 'JUL-SET', 2026, 15000, 20000, 7, 9, 1800, 3000, 0),
('Q4', 'OUT-DEZ', 2026, 20000, 20000, 8, 10, 2200, 3500, 0);