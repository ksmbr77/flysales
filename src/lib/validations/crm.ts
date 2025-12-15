import { z } from "zod";

// Email regex pattern for validation
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

// Phone regex pattern (Brazilian format)
const phoneRegex = /^[\d\s()+-]*$/;

export const clienteSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  empresa: z
    .string()
    .min(1, "Empresa é obrigatória")
    .max(100, "Empresa deve ter no máximo 100 caracteres"),
  ticket: z
    .number()
    .min(0, "Ticket não pode ser negativo")
    .max(999999999, "Ticket muito alto"),
  responsavel: z
    .string()
    .min(1, "Responsável é obrigatório")
    .max(100, "Responsável deve ter no máximo 100 caracteres"),
  servico: z
    .string()
    .min(1, "Serviço é obrigatório")
    .max(100, "Serviço deve ter no máximo 100 caracteres"),
  telefone: z
    .string()
    .max(20, "Telefone deve ter no máximo 20 caracteres")
    .refine((val) => !val || phoneRegex.test(val), "Formato de telefone inválido"),
  email: z
    .string()
    .max(255, "Email deve ter no máximo 255 caracteres")
    .refine((val) => !val || emailRegex.test(val), "Formato de email inválido"),
  observacoes: z
    .string()
    .max(1000, "Observações devem ter no máximo 1000 caracteres"),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;

// Sanitize text to prevent XSS (removes HTML tags)
export function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}

type ValidationSuccess = { success: true; data: ClienteFormData };
type ValidationFailure = { success: false; errors: string[] };
type ValidationResult = ValidationSuccess | ValidationFailure;

// Validate and sanitize cliente form data
export function validateClienteForm(data: {
  nome: string;
  empresa: string;
  ticket: number;
  responsavel: string;
  servico: string;
  telefone: string;
  email: string;
  observacoes: string;
}): ValidationResult {
  // Sanitize text fields first
  const sanitizedData = {
    ...data,
    nome: sanitizeText(data.nome),
    empresa: sanitizeText(data.empresa),
    observacoes: sanitizeText(data.observacoes),
  };

  const result = clienteSchema.safeParse(sanitizedData);

  if (!result.success) {
    const errors = result.error.errors.map((err) => err.message);
    return { success: false as const, errors };
  }

  return { success: true as const, data: result.data };
}
