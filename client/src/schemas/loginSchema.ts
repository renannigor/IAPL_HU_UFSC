import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  senha: z
    .string()
    .min(6, { message: "A senha deve conter pelo menos 6 caracteres" }),
});

export type LoginFormFields = z.infer<typeof LoginFormSchema>;
