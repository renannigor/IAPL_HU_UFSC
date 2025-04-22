import { z } from "zod";

export const ForgotPasswordFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

export type ForgotPasswordFormFields = z.infer<typeof ForgotPasswordFormSchema>;
