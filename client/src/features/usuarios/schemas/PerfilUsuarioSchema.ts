import { z } from "zod";

export const PerfilUsuarioSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome deve ter ao menos 2 caracteres")
    .nonempty("Nome é obrigatório"),
  tipo: z.string().optional(),
  email: z.string().email("Email inválido"),
  ultimo_acesso: z.string().optional(),
  cep: z.string().length(8, "CEP deve ter 8 dígitos"),
  logradouro: z.string().min(1, "Campo obrigatório!"),
  bairro: z.string().min(1, "Campo obrigatório!"),
  cidade: z.string().min(1, "Campo obrigatório!"),
  estado: z.string().min(2, "Campo obrigatório!"),
  numeroResidencial: z
    .number({ invalid_type_error: "Informe um número" })
    .int("O valor deve ser um número inteiro")
    .min(0, "O valor deve ser maior que 0")
    .optional(),
});

export type PerfilUsuarioFields = z.infer<typeof PerfilUsuarioSchema>;
