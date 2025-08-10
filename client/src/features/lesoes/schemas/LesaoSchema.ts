import { CamposCondicionaisFormulario } from "@/features/lesoes/types/CamposCondicionaisFormulario";
import { z } from "zod";

export const FormLesaoSchema = (
  camposCondicionais: CamposCondicionaisFormulario
) =>
  z
    .object({
      // Etiologia
      etiologias: z
        .array(z.number(), {
          required_error: "Selecione pelo menos uma etiologia.",
        })
        .min(1, "Selecione pelo menos uma etiologia."),

      // Classificaçação da Lesão por Pressão
      classificacoesLesaoPressao: z
        .array(z.number(), {
          required_error: "Selecione pelo menos uma classificação.",
        })
        .optional(),

      // Região Perilesional
      regioesPerilesionais: z
        .array(z.number(), {
          required_error: "Selecione pelo menos uma região perilesional.",
        })
        .min(1, "Selecione pelo menos uma região perilesional."),

      // Outra Região Perilesional
      regiaoPerilesionalOutro: z.string().optional(),

      // Borda
      bordas: z
        .array(z.number(), {
          required_error: "Selecione pelo menos uma borda.",
        })
        .min(1, "Selecione pelo menos uma borda."),

      // Tecido (Porcentagens)
      tecidos: z.array(
        z.object({
          id: z.number(),
          nome: z.string(),
          valor: z
            .number({
              invalid_type_error: "Informe um número",
              required_error: "Campo obrigatório!",
            })
            .min(0, "O valor deve ser no mínimo 0%")
            .max(100, "O valor deve ser no máximo 100%"),
        })
      ),

      // Estrutura Nobre
      estruturasNobres: z
        .array(z.number(), {
          required_error: "Selecione pelo menos uma estrutura nobre.",
        })
        .min(1, "Selecione pelo menos uma estrutura nobre."),

      // Outra Estrutura Nobre
      estruturaNobreOutro: z.string().optional(),

      // Presença de Túnel
      presencaTunel: z.enum(["sim", "nao"], {
        required_error: "Por favor, selecione uma opção.",
      }),

      // Dor
      dor: z.enum(["sim", "nao"], {
        required_error: "Por favor, selecione uma opção.",
      }),

      // Escala Numérica da Dor
      escalaNumericaDor: z
        .number({
          invalid_type_error: "Informe um número",
          required_error: "Campo obrigatório!",
        })
        .min(1)
        .max(10)
        .optional(),

      // Classificações da Dor
      classificacoesDor: z
        .array(z.number(), {
          required_error: "Selecione pelo menos uma classificação da dor.",
        })
        .optional(),

      // Quantidade de Exsudato
      quantidadeExsudato: z.number({
        required_error: "Exsudato é obrigatório.",
      }),

      // Odor
      odor: z.number({ required_error: "Odor é obrigatório." }),

      // Tipo Exsudato
      tipoExsudato: z.number({
        required_error: "Tipo de exsudato é obrigatório.",
      }),

      // Tamanho (Comprimento, Largura, Profundidade)
      tamanho: z.object({
        comprimento: z
          .number({
            invalid_type_error: "Informe um número",
            required_error: "Informe o comprimento.",
          })
          .int("O valor deve ser um número inteiro")
          .min(0, "O valor deve ser maior que 0"),
        largura: z
          .number({
            invalid_type_error: "Informe um número",
            required_error: "Informe a largura.",
          })
          .int("O valor deve ser um número inteiro")
          .min(0, "O valor deve ser maior que 0"),
        profundidade: z
          .number({
            invalid_type_error: "Informe um número",
            required_error: "Informe a profundidade.",
          })
          .int("O valor deve ser um número inteiro")
          .min(0, "O valor deve ser maior que 0")
          .optional(),
      }),

      // Limpeza
      limpezas: z
        .array(z.number(), {
          required_error: "Selecione pelo menos uma limpeza.",
        })
        .min(1, "Selecione pelo menos uma limpeza."),

      // Outra Limpeza
      limpezaOutro: z.string().optional(),

      // Desbridamento
      desbridamentos: z
        .array(z.number(), {
          required_error: "Selecione pelo menos um desbridamento.",
        })
        .min(1, "Selecione pelo menos um desbridamento."),

      // Outro Desbridamento
      desbridamentoOutro: z.string().optional(),

      // Proteção
      protecoes: z
        .array(z.number(), {
          required_error: "Selecione pelo menos uma proteção.",
        })
        .min(1, "Selecione pelo menos uma proteção."),

      // Outra Proteção
      protecaoOutro: z.string().optional(),

      // Cobertura
      coberturas: z.array(
        z.object({
          id: z.number(),
          nome: z.string(),
          valor: z
            .number({
              invalid_type_error: "Informe um número",
              required_error: "Campo obrigatório!",
            })
            .min(0, "O valor deve ser maior ou igual a 0"),
        })
      ),

      // Tipos Fechamento Curativo
      tiposFechamentoCurativo: z.array(
        z.object({
          id: z.number(),
          nome: z.string(),
          valor: z
            .number({
              invalid_type_error: "Informe um número",
              required_error: "Campo obrigatório!",
            })
            .min(0, "O valor deve ser maior ou igual a 0"),
        })
      ),

      // Data da Próxima Avaliação
      dataProximaAvaliacao: z.date({
        required_error: "A data da próxima avaliação é obrigatória",
      }),

      // Localização da Lesão
      localizacaoLesao: z.string({
        required_error: "A localização da lesão é obrigatória",
      }),
    })
    .superRefine((data, ctx) => {
      // 1. Valida classificacoesLesaoPressao se "Lesão por Pressão" estiver nas etiologias
      const lesaoPorPressaoId = camposCondicionais.etiologiaLesaoPorPressao?.id;
      const isLesaoPorPressaoSelecionada = data.etiologias.includes(
        lesaoPorPressaoId!
      );

      if (isLesaoPorPressaoSelecionada) {
        if (
          !data.classificacoesLesaoPressao ||
          data.classificacoesLesaoPressao.length === 0
        ) {
          ctx.addIssue({
            path: ["classificacoesLesaoPressao"],
            code: z.ZodIssueCode.custom,
            message: "Informe a classificação da Lesão por Pressão",
          });
        }
      } else {
        // Limpando o campo classificacoesLesaoPressao
        data.classificacoesLesaoPressao = [];
      }

      // 2. Valida regiaoPerilesionalOutro se "Outro" estiver nas regioesPerilesionais
      if (
        data.regioesPerilesionais.includes(
          camposCondicionais.regiaoPerilesionalOutro?.id!
        ) &&
        (!data.regiaoPerilesionalOutro ||
          data.regiaoPerilesionalOutro.trim() === "")
      ) {
        ctx.addIssue({
          path: ["regiaoPerilesionalOutro"],
          code: z.ZodIssueCode.custom,
          message: "Informe a outra região perilesional",
        });
      }

      // 3. Valida estruturaNobreOutro se "Outro" estiver nas estruturasNobres
      if (
        data.estruturasNobres.includes(
          camposCondicionais.estruturaNobreOutro?.id!
        ) &&
        (!data.estruturaNobreOutro || data.estruturaNobreOutro.trim() === "")
      ) {
        ctx.addIssue({
          path: ["estruturaNobreOutro"],
          code: z.ZodIssueCode.custom,
          message: "Informe a outra estrutura nobre",
        });
      }

      // 4. Valida escalaNumericaDor e classificacoesDor se dor for "sim"
      if (data.dor === "sim") {
        if (
          data.escalaNumericaDor === undefined ||
          data.escalaNumericaDor < 1 ||
          data.escalaNumericaDor > 10
        ) {
          ctx.addIssue({
            path: ["escalaNumericaDor"],
            code: z.ZodIssueCode.custom,
            message: "Informe o nível da dor entre 1 e 10",
          });
        }

        if (!data.classificacoesDor || data.classificacoesDor.length === 0) {
          ctx.addIssue({
            path: ["classificacoesDor"],
            code: z.ZodIssueCode.custom,
            message: "Informe pelo menos uma classificação da dor",
          });
        }
      } else {
        // Limpando os campos escalaNumericaDor e classificacoesDor
        data.escalaNumericaDor = 0;
        data.classificacoesDor = [];
      }

      // 5. Valida soma dos tecidos = 100
      const somaTecidos = data.tecidos.reduce(
        (acc, t) => acc + (Number.isNaN(t.valor) ? 0 : t.valor),
        0
      );

      if (somaTecidos !== 100) {
        ctx.addIssue({
          path: ["tecidos"],
          code: z.ZodIssueCode.custom,
          message: "A soma das porcentagens dos tecidos deve ser igual a 100%",
        });
      }

      // 6. Valida limpezaOutro se "Outro" estiver nas limpezas
      if (
        data.limpezas.includes(camposCondicionais.limpezaOutro?.id!) &&
        (!data.limpezaOutro || data.limpezaOutro.trim() === "")
      ) {
        ctx.addIssue({
          path: ["limpezaOutro"],
          code: z.ZodIssueCode.custom,
          message: "Informe a outra limpeza",
        });
      }

      // 7. Valida desbridamentoOutro se "Outro" estiver no desbridamento
      if (
        data.desbridamentos.includes(
          camposCondicionais.desbridamentoOutro?.id!
        ) &&
        (!data.desbridamentoOutro || data.desbridamentoOutro.trim() === "")
      ) {
        ctx.addIssue({
          path: ["desbridamentoOutro"],
          code: z.ZodIssueCode.custom,
          message: "Informe o outro desbridamento",
        });
      }

      // 8. Valida protecaoOutro se "Outro" estiver em protecoes
      if (
        data.protecoes.includes(camposCondicionais.protecaoOutro?.id!) &&
        (!data.protecaoOutro || data.protecaoOutro.trim() === "")
      ) {
        ctx.addIssue({
          path: ["protecaoOutro"],
          code: z.ZodIssueCode.custom,
          message: "Informe a outra proteção",
        });
      }
    });

// Tipo completo do formulário
export type FormLesaoFields = z.infer<ReturnType<typeof FormLesaoSchema>>;

// Tipos auxiliares para objetos internos
export type Tecido = FormLesaoFields["tecidos"][number];
export type Cobertura = FormLesaoFields["coberturas"][number];
export type TipoFechamentoCurativo =
  FormLesaoFields["tiposFechamentoCurativo"][number];
