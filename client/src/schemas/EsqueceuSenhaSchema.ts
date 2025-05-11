import { z } from "zod";

export const EsqueceuSenhaFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

export type EsqueceuSenhaFormFields = z.infer<typeof EsqueceuSenhaFormSchema>;
