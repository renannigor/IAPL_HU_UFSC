import { z } from "zod";

export const PerfilUsuarioSchema = z.object({
  nome: z
    .string()
    .min(2, "O nome deve ter ao menos 2 caracteres")
    .nonempty("Nome é obrigatório"),
  tipo: z.string().optional(),
  email: z.string().email("Email inválido"),
  ultimo_acesso: z.string().optional(),
});

export type PerfilUsuarioFields = z.infer<typeof PerfilUsuarioSchema>;
