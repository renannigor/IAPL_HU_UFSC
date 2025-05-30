import { z } from "zod";

export const LesaoFormSchema = z
  .object({
    etiologias: z
      .array(z.string(), {
        required_error: "Selecione pelo menos uma etiologia.",
      })
      .min(1, "Selecione pelo menos uma etiologia."),
    classificacoesLesaoPressao: z
      .array(z.string(), {
        required_error: "Selecione pelo menos uma classificação.",
      })
      .optional(),
    regioesPerilesionais: z
      .array(z.string(), {
        required_error: "Selecione pelo menos uma região perilesional.",
      })
      .min(1, "Selecione pelo menos uma região perilesional."),
    outraRegiaoPerilesional: z.string().optional(),
    bordas: z
      .array(z.string(), { required_error: "Selecione pelo menos uma borda." })
      .min(1, "Selecione pelo menos uma borda."),
    tecido: z.object({
      estruturasNobres: z
        .array(z.string(), {
          required_error: "Selecione pelo menos uma estrutura nobre.",
        })
        .min(1, "Selecione pelo menos uma estrutura nobre."),
      outraEstruturaNobre: z.string().optional(),
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
    dor: z.enum(["sim", "nao"], {
      required_error: "Por favor, selecione uma opção.",
    }),
    nivelDor: z
      .number({ invalid_type_error: "Informe um número" })
      .min(1)
      .max(10)
      .optional(),
    quantificacoesDor: z
      .array(z.string(), {
        required_error: "Selecione pelo menos uma quantificação da dor.",
      })
      .min(1, "Selecione pelo menos uma quantificação da dor.")
      .optional(),
    exsudato: z.string({ required_error: "Exsudato é obrigatório." }),
    odor: z.string({ required_error: "Odor é obrigatório." }),
    tipoExsudato: z.string({
      required_error: "Tipo de exsudato é obrigatório.",
    }),
    tamanho: z.object({
      comprimento: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      largura: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      profundidade: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
    }),
    coberturaUtilizada: z.object({
      age: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      alginatoCalcioPrataPlaca: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      alginatoCalcioPrataFita: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      alginatoCalcioFita: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      botaUnna: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      carvaoAtivadoPrata: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      cintoEstomia: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      espumaPrataGrande: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      espumaPrataPequena: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      espumaSiliconePrataGrande: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      espumaSiliconePequena: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      hidrofibraPrata: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      hidrogel: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      melolin: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      membracel: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      pastaHidrocoloide: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      phmbGel: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      placaHidrocoloideFina: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      placaHidrocoloideGrossa: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      prataNanocristalina: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      rayonPetrolatum: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      filtroCarvaoAtivado: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      hidrocoloideBastao: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      pastaPeriestomal: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
    }),
    fechamentoCurativo: z.object({
      peliculaTransparenteRoloCurativos: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      botaUnna: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      redeTubular3: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      redeTubular6: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
      chumacoAtadura: z
        .number({ invalid_type_error: "Informe um número" })
        .min(0, "O valor deve ser maior que 0"),
    }),
  })
  .superRefine((data, ctx) => {
    // 1. Valida classificacoesLesaoPressao se "Lesão por Pressão" estiver nas etiologias
    if (
      data.etiologias.includes("Lesão por Pressão") &&
      (!data.classificacoesLesaoPressao ||
        data.classificacoesLesaoPressao.length === 0)
    ) {
      ctx.addIssue({
        path: ["classificacoesLesaoPressao"],
        code: z.ZodIssueCode.custom,
        message: "Informe a classificação da Lesão por Pressão",
      });
    }

    // 2. Valida outraRegiaoPerilesional se "Outro" estiver nas regioesPerilesionais
    if (
      data.regioesPerilesionais.includes("Outro") &&
      (!data.outraRegiaoPerilesional ||
        data.outraRegiaoPerilesional.trim() === "")
    ) {
      ctx.addIssue({
        path: ["outraRegiaoPerilesional"],
        code: z.ZodIssueCode.custom,
        message: "Informe a outra região perilesional",
      });
    }

    // 3. Valida outraEstruturaNobre se "Outro" estiver nas estruturasNobres
    if (
      data.tecido.estruturasNobres.includes("Outro") &&
      (!data.tecido.outraEstruturaNobre ||
        data.tecido.outraEstruturaNobre.trim() === "")
    ) {
      ctx.addIssue({
        path: ["tecido", "outraEstruturaNobre"],
        code: z.ZodIssueCode.custom,
        message: "Informe a outra estrutura nobre",
      });
    }

    // 4. Valida nivelDor e quantificacoesDor se dor for "sim"
    if (data.dor === "sim") {
      if (
        data.nivelDor === undefined ||
        data.nivelDor < 1 ||
        data.nivelDor > 10
      ) {
        ctx.addIssue({
          path: ["nivelDor"],
          code: z.ZodIssueCode.custom,
          message: "Informe o nível da dor entre 1 e 10",
        });
      }

      if (!data.quantificacoesDor || data.quantificacoesDor.length === 0) {
        ctx.addIssue({
          path: ["quantificacoesDor"],
          code: z.ZodIssueCode.custom,
          message: "Informe pelo menos uma quantificação da dor",
        });
      }
    }

    // 5. Valida soma dos tecidos = 100
    const somaTecidos =
      data.tecido.epitelizado +
      data.tecido.granulacao +
      data.tecido.hipergranulacao +
      data.tecido.necroseSeca +
      data.tecido.necroseUmida +
      data.tecido.esfacelo;

    if (somaTecidos !== 100) {
      ctx.addIssue({
        path: ["tecido"],
        code: z.ZodIssueCode.custom,
        message: "A soma das porcentagens dos tecidos deve ser igual a 100%",
      });
    }
  });

export type LesaoFormFields = z.infer<typeof LesaoFormSchema>;
