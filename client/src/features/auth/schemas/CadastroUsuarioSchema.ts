import { z } from "zod";

const validaCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== Number(cpf[10])) return false;

  return true;
};

export const FormCadastroUsuarioSchema = z
  .object({
    nome: z.string().min(3, "Campo obrigatório!"),
    email: z.string().email("Email inválido!"),
    tipoUsuario: z.number({ required_error: "Campo obrigatório!" }),
    cpf: z.string().refine(validaCPF, {
      message: "CPF inválido",
    }),
    cep: z.string().length(8, "CEP deve ter 8 dígitos"),
    logradouro: z.string().min(1, "Campo obrigatório!"),
    bairro: z.string().min(1, "Campo obrigatório!"),
    cidade: z.string().min(1, "Campo obrigatório!"),
    estado: z.string().min(2, "Campo obrigatório!"),
    numeroResidencial: z.string().optional(),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    path: ["confirmarSenha"],
    message: "As senhas não coincidem",
  });

export type FormCadastroUsuarioFields = z.infer<typeof FormCadastroUsuarioSchema>;
