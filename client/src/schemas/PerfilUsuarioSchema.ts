import { z } from "zod";

export const PerfilUsuarioSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.number({ required_error: "Campo obrigatório!" }),
  email: z.string().email({ message: "Email inválido" }),
});

export type PerfilUsuarioFields = z.infer<typeof PerfilUsuarioSchema>;
