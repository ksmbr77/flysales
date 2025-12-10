export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      crm_clientes: {
        Row: {
          coluna_id: string
          created_at: string
          data_contato: string | null
          email: string | null
          empresa: string
          id: string
          iniciais: string | null
          nome: string
          observacoes: string | null
          responsavel: string | null
          servico: string | null
          telefone: string | null
          ticket: number | null
          updated_at: string
        }
        Insert: {
          coluna_id: string
          created_at?: string
          data_contato?: string | null
          email?: string | null
          empresa: string
          id?: string
          iniciais?: string | null
          nome: string
          observacoes?: string | null
          responsavel?: string | null
          servico?: string | null
          telefone?: string | null
          ticket?: number | null
          updated_at?: string
        }
        Update: {
          coluna_id?: string
          created_at?: string
          data_contato?: string | null
          email?: string | null
          empresa?: string
          id?: string
          iniciais?: string | null
          nome?: string
          observacoes?: string | null
          responsavel?: string | null
          servico?: string | null
          telefone?: string | null
          ticket?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_clientes_coluna_id_fkey"
            columns: ["coluna_id"]
            isOneToOne: false
            referencedRelation: "crm_colunas"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_colunas: {
        Row: {
          cor: string
          created_at: string
          id: string
          ordem: number
          titulo: string
          updated_at: string
        }
        Insert: {
          cor?: string
          created_at?: string
          id?: string
          ordem?: number
          titulo: string
          updated_at?: string
        }
        Update: {
          cor?: string
          created_at?: string
          id?: string
          ordem?: number
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_config: {
        Row: {
          chave: string
          created_at: string
          id: string
          updated_at: string
          valor: Json
        }
        Insert: {
          chave: string
          created_at?: string
          id?: string
          updated_at?: string
          valor: Json
        }
        Update: {
          chave?: string
          created_at?: string
          id?: string
          updated_at?: string
          valor?: Json
        }
        Relationships: []
      }
      faturamento_mensal: {
        Row: {
          ano: number
          created_at: string
          id: string
          mes: string
          updated_at: string
          valor: number
        }
        Insert: {
          ano: number
          created_at?: string
          id?: string
          mes: string
          updated_at?: string
          valor?: number
        }
        Update: {
          ano?: number
          created_at?: string
          id?: string
          mes?: string
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      vendedores: {
        Row: {
          clientes_ativos: number | null
          cor: string | null
          created_at: string
          email: string | null
          id: string
          iniciais: string
          meta_mensal: number | null
          negocios_fechados: number | null
          nome: string
          reunioes_agendadas: number | null
          reunioes_fechadas: number | null
          telefone: string | null
          updated_at: string
          vendas_mes: number | null
          whatsapp: string | null
        }
        Insert: {
          clientes_ativos?: number | null
          cor?: string | null
          created_at?: string
          email?: string | null
          id?: string
          iniciais: string
          meta_mensal?: number | null
          negocios_fechados?: number | null
          nome: string
          reunioes_agendadas?: number | null
          reunioes_fechadas?: number | null
          telefone?: string | null
          updated_at?: string
          vendas_mes?: number | null
          whatsapp?: string | null
        }
        Update: {
          clientes_ativos?: number | null
          cor?: string | null
          created_at?: string
          email?: string | null
          id?: string
          iniciais?: string
          meta_mensal?: number | null
          negocios_fechados?: number | null
          nome?: string
          reunioes_agendadas?: number | null
          reunioes_fechadas?: number | null
          telefone?: string | null
          updated_at?: string
          vendas_mes?: number | null
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
