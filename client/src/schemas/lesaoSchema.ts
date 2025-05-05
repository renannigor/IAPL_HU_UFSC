import { z } from "zod";

export const LesaoFormSchema = z
  .object({
    etiologias: z
      .array(z.string())
      .nonempty("Selecione pelo menos uma etiologia."),
    classificacoes: z.array(z.string()).optional(),
    regioesPerilesionais: z
      .array(z.string())
      .nonempty("Selecione pelo menos uma região perilesional."),
    outraRegiaoPerilesional: z.string().optional(),
    bordas: z.array(z.string()).nonempty("Selecione pelo menos uma borda."),
    tecido: z.object({
      estruturasNobres: z
        .array(z.string())
        .nonempty("Selecione pelo menos uma estrutura nobre."),
      outroEstruturaNobre: z.string().optional(),
      epitelizado: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser no mínimo 0%")
        .max(100, "O valor deve ser no máximo 100%"),
      granulacao: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser no mínimo 0%")
        .max(100, "O valor deve ser no máximo 100%"),
      hipergranulacao: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser no mínimo 0%")
        .max(100, "O valor deve ser no máximo 100%"),
      necroseSeca: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser no mínimo 0%")
        .max(100, "O valor deve ser no máximo 100%"),
      necroseUmida: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser no mínimo 0%")
        .max(100, "O valor deve ser no máximo 100%"),
      esfacelo: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser no mínimo 0%")
        .max(100, "O valor deve ser no máximo 100%"),
    }),
  })
  // Valida "outraRegiaoPerilesional" se "Outro" estiver selecionado
  .refine(
    (data) =>
      !data.regioesPerilesionais.includes("Outro") ||
      (data.outraRegiaoPerilesional &&
        data.outraRegiaoPerilesional.trim() !== ""),
    {
      path: ["outraRegiaoPerilesional"],
      message: "Informe a outra região perilesional",
    }
  )
  // Valida "classificacoes" se "Lesão por Pressão" estiver nas etiologias
  .refine(
    (data) =>
      !data.etiologias.includes("Lesão por Pressão") ||
      (data.classificacoes && data.classificacoes.length > 0),
    {
      path: ["classificacoes"],
      message: "Informe a classificação da Lesão por Pressão",
    }
  )
  // Valida soma das porcentagens
  .refine(
    (data) => {
      const total =
        data.tecido.epitelizado +
        data.tecido.granulacao +
        data.tecido.hipergranulacao +
        data.tecido.necroseSeca +
        data.tecido.necroseUmida +
        data.tecido.esfacelo;
      return total === 100;
    },
    {
      message: "A soma das porcentagens deve ser 100%",
      path: ["tecido"],
    }
  )

  // Valida "outroEstruturaNobre" se "Outro" estiver selecionado nas estruturasNobres
  .refine(
    (data) =>
      !data.tecido.estruturasNobres.includes("Outro") ||
      (data.tecido.outroEstruturaNobre &&
        data.tecido.outroEstruturaNobre.trim() !== ""),
    {
      path: ["tecido", "outroEstruturaNobre"],
      message: "Informe a outra estrutura nobre",
    }
  );

export type LesaoFormFields = z.infer<typeof LesaoFormSchema>;
