import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  PerfilUsuarioSchema,
  PerfilUsuarioFields,
} from "../schemas/PerfilUsuarioSchema";
import { Input } from "@/shared/components/form/Input";
import { Usuario } from "../types/Usuario";
import { User, LogOut } from "lucide-react";
import AuthService from "@/features/auth/services/AuthService";
import { cores } from "@/shared/constants/cores";
import UsuarioService from "../services/UsuarioService";
import EnderecoService from "../services/EnderecoService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario>();
  const [isEditing, setIsEditing] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<PerfilUsuarioFields>({
    resolver: zodResolver(PerfilUsuarioSchema),
  });

  const carregarUsuario = async () => {
    const dados = await AuthService.getUsuarioAtual();
    setUsuario(dados.user);
    reset({
      nome: dados.user.nome || "",
      tipo: dados.user.tipo || "",
      email: dados.user.email || "",
      cep: dados.user.cep || "",
      logradouro: dados.user.logradouro || "",
      bairro: dados.user.bairro || "",
      cidade: dados.user.cidade || "",
      estado: dados.user.estado || "",
      numeroResidencial: dados.user.numero || "",
    });
    setIsReadOnly(true);
  };

  useEffect(() => {
    carregarUsuario();
  }, [reset]);

  const redefinirCamposEndereco = () => {
    setValue("logradouro", "");
    setValue("bairro", "");
    setValue("cidade", "");
    setValue("estado", "");
    setIsReadOnly(true);
  };

  const verificaMudancaCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (!cepLimpo || cepLimpo.length !== 8) {
      setError("cep", { message: "CEP inválido" });
      redefinirCamposEndereco();
      return;
    }

    const endereco = await EnderecoService.obterEndereco(cepLimpo);
    if (!endereco) {
      setError("cep", { message: "CEP não encontrado" });
      redefinirCamposEndereco();
    } else {
      setValue("logradouro", endereco.logradouro || "");
      setValue("bairro", endereco.bairro || "");
      setValue("cidade", endereco.localidade || "");
      setValue("estado", endereco.uf || "");
      setIsReadOnly(false);
    }
  };

  const onSubmit = async (data: PerfilUsuarioFields) => {
    try {
      await UsuarioService.atualizarPerfil(usuario?.cpf!, data);
      setIsEditing(false);
      setIsReadOnly(true);
      carregarUsuario();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      const errorMessage = isAxiosError(err)
        ? err.response?.data?.error || "Erro ao atualizar informações pessoais"
        : "Erro inesperado. Tente novamente.";
      setError("root", { message: errorMessage });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/entrar");
  };

  if (!usuario) {
    return (
      <div className="p-6 text-gray-500">Carregando dados do usuário...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho do perfil */}
      <div className="flex flex-col items-center mb-10 relative">
        <div className="absolute top-0 right-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-2 rounded text-white transition"
            style={{ backgroundColor: cores.textSecondary }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#757575")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = cores.textSecondary)
            }
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
        <div className="bg-gray-200 p-6 rounded-full mb-4">
          <User size={64} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">{usuario.nome}</h2>
        <p className="text-gray-500 text-sm">
          Último acesso: {usuario.ultimo_acesso}
        </p>
      </div>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-2xl shadow-md space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome"
            error={errors.nome?.message}
            {...register("nome")}
            disabled={!isEditing}
          />

          <Input
            label="Email"
            error={errors.email?.message}
            {...register("email")}
            disabled
          />

          <Input
            label="Tipo"
            error={errors.tipo?.message}
            {...register("tipo")}
            disabled
          />

          <Input
            label="CEP"
            error={errors.cep?.message}
            {...register("cep")}
            disabled={!isEditing}
            onBlur={(e) => verificaMudancaCep(e.target.value)}
          />

          <Input
            label="Número Residencial"
            error={errors.numeroResidencial?.message}
            {...register("numeroResidencial")}
            disabled={!isEditing}
          />

          <Input
            label="Logradouro"
            error={errors.logradouro?.message}
            {...register("logradouro")}
            disabled={!isEditing || isReadOnly}
          />

          <Input
            label="Bairro"
            error={errors.bairro?.message}
            {...register("bairro")}
            disabled={!isEditing || isReadOnly}
          />

          <Input
            label="Cidade"
            error={errors.cidade?.message}
            {...register("cidade")}
            disabled={!isEditing || isReadOnly}
          />

          <Input
            label="Estado"
            error={errors.estado?.message}
            {...register("estado")}
            disabled={!isEditing || isReadOnly}
          />
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4 mt-4">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded text-white transition"
              style={{
                backgroundColor: cores.primaryNeutral1,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = cores.primaryNeutral2)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = cores.primaryNeutral1)
              }
            >
              Editar
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  carregarUsuario();
                  setIsEditing(false);
                }}
                className="px-4 py-2 rounded text-white transition"
                style={{ backgroundColor: cores.textSecondary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#757575")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = cores.textSecondary)
                }
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded text-white transition"
                style={{ backgroundColor: cores.primary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = cores.primaryLight)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = cores.primary)
                }
              >
                Salvar
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default PerfilPage;
