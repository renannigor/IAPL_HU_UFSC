import { z } from "zod";

export const LoginUsuarioFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  senha: z
    .string()
    .min(6, { message: "A senha deve conter pelo menos 6 caracteres" }),
});

export type LoginUsuarioFormFields = z.infer<typeof LoginUsuarioFormSchema>;
