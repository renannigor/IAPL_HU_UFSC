import { z } from "zod";

export const ResetPasswordFormSchema = z
  .object({
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    path: ["confirmarSenha"],
    message: "As senhas não coincidem",
  });

export type ResetPasswordFormFields = z.infer<typeof ResetPasswordFormSchema>;
