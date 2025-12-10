-- Tabela de configurações do dashboard (dados gerais)
CREATE TABLE public.dashboard_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT NOT NULL UNIQUE,
  valor JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de vendedores
CREATE TABLE public.vendedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  iniciais TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  whatsapp TEXT,
  cor TEXT DEFAULT 'from-primary to-accent',
  meta_mensal NUMERIC DEFAULT 15000,
  vendas_mes NUMERIC DEFAULT 0,
  clientes_ativos INTEGER DEFAULT 0,
  negocios_fechados INTEGER DEFAULT 0,
  reunioes_agendadas INTEGER DEFAULT 0,
  reunioes_fechadas INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de colunas do CRM
CREATE TABLE public.crm_colunas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  cor TEXT NOT NULL DEFAULT 'bg-blue-500',
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de clientes do CRM
CREATE TABLE public.crm_clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coluna_id UUID REFERENCES public.crm_colunas(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  empresa TEXT NOT NULL,
  ticket NUMERIC DEFAULT 0,
  responsavel TEXT,
  iniciais TEXT,
  data_contato TEXT,
  servico TEXT,
  telefone TEXT,
  email TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de faturamento mensal
CREATE TABLE public.faturamento_mensal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mes TEXT NOT NULL,
  ano INTEGER NOT NULL,
  valor NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(mes, ano)
);

-- Habilitar RLS (acesso público para este dashboard interno)
ALTER TABLE public.dashboard_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_colunas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faturamento_mensal ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público (dashboard interno sem autenticação)
CREATE POLICY "Acesso público para leitura" ON public.dashboard_config FOR SELECT USING (true);
CREATE POLICY "Acesso público para inserção" ON public.dashboard_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Acesso público para atualização" ON public.dashboard_config FOR UPDATE USING (true);
CREATE POLICY "Acesso público para exclusão" ON public.dashboard_config FOR DELETE USING (true);

CREATE POLICY "Acesso público para leitura" ON public.vendedores FOR SELECT USING (true);
CREATE POLICY "Acesso público para inserção" ON public.vendedores FOR INSERT WITH CHECK (true);
CREATE POLICY "Acesso público para atualização" ON public.vendedores FOR UPDATE USING (true);
CREATE POLICY "Acesso público para exclusão" ON public.vendedores FOR DELETE USING (true);

CREATE POLICY "Acesso público para leitura" ON public.crm_colunas FOR SELECT USING (true);
CREATE POLICY "Acesso público para inserção" ON public.crm_colunas FOR INSERT WITH CHECK (true);
CREATE POLICY "Acesso público para atualização" ON public.crm_colunas FOR UPDATE USING (true);
CREATE POLICY "Acesso público para exclusão" ON public.crm_colunas FOR DELETE USING (true);

CREATE POLICY "Acesso público para leitura" ON public.crm_clientes FOR SELECT USING (true);
CREATE POLICY "Acesso público para inserção" ON public.crm_clientes FOR INSERT WITH CHECK (true);
CREATE POLICY "Acesso público para atualização" ON public.crm_clientes FOR UPDATE USING (true);
CREATE POLICY "Acesso público para exclusão" ON public.crm_clientes FOR DELETE USING (true);

CREATE POLICY "Acesso público para leitura" ON public.faturamento_mensal FOR SELECT USING (true);
CREATE POLICY "Acesso público para inserção" ON public.faturamento_mensal FOR INSERT WITH CHECK (true);
CREATE POLICY "Acesso público para atualização" ON public.faturamento_mensal FOR UPDATE USING (true);
CREATE POLICY "Acesso público para exclusão" ON public.faturamento_mensal FOR DELETE USING (true);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_dashboard_config_updated_at BEFORE UPDATE ON public.dashboard_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendedores_updated_at BEFORE UPDATE ON public.vendedores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crm_colunas_updated_at BEFORE UPDATE ON public.crm_colunas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crm_clientes_updated_at BEFORE UPDATE ON public.crm_clientes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faturamento_mensal_updated_at BEFORE UPDATE ON public.faturamento_mensal FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais dos vendedores
INSERT INTO public.vendedores (nome, iniciais, email, telefone, whatsapp, cor, meta_mensal, vendas_mes, reunioes_agendadas, reunioes_fechadas) VALUES
('Gustavo Fontes', 'GF', 'gustavo@flyagency.pro', '+55 79 9815-5974', '5579981559574', 'from-primary to-accent', 15000, 0, 0, 0),
('Davi Nascimento', 'DN', 'davi@flyagency.pro', '+55 79 9894-4502', '5579989444502', 'from-accent to-primary', 15000, 0, 0, 0);

-- Inserir colunas do CRM
INSERT INTO public.crm_colunas (id, titulo, cor, ordem) VALUES
('11111111-1111-1111-1111-111111111111', 'Novos Leads', 'bg-blue-500', 0),
('22222222-2222-2222-2222-222222222222', 'Qualificados', 'bg-primary', 1),
('33333333-3333-3333-3333-333333333333', 'Em Negociação', 'bg-warning', 2),
('44444444-4444-4444-4444-444444444444', 'Fechado', 'bg-accent', 3);

-- Inserir faturamento de novembro e dezembro 2025
INSERT INTO public.faturamento_mensal (mes, ano, valor) VALUES
('Nov', 2025, 2900),
('Dez', 2025, 6100);