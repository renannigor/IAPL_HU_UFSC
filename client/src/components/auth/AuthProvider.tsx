import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/api/api.ts";
import { Usuario } from "@/types/Usuario";
import AuthService from "@/services/AuthService.ts";

// Tipagem para o contexto de autenticação
interface AuthContextType {
  usuarioAtual: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  cadastrarUsuario: (
    cpf: string,
    nome: string,
    email: string,
    tipo: number,
    senha: string,
    cep: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    estado: string,
    numero: string
  ) => Promise<void>;
  esqueceuSenha: (email: string) => Promise<void>;
  verificarTokenRedefinicaoSenha: (token: string) => Promise<void>;
  redefinirSenha: (novaSenha: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Criando contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para consumir o contexto
export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth deve estar dentro de um AuthProvider");
  }
  return authContext;
};

// Tipagem para as props do AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca os dados do usuário ao carregar a aplicação
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("🔍 Buscando usuário...");
        const data = await AuthService.getUsuarioAtual();
        console.log("✅ Usuário encontrado:", data.user);
        setAccessToken(data.accessToken);
        setUsuarioAtual(data.user);
      } catch {
        setAccessToken(null);
        setUsuarioAtual(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Interceptor para anexar o accessToken a cada requisição
  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  // Interceptor para renovar o accessToken quando expirar
  useLayoutEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        // Verifica se a resposta é 401 e se o token de acesso já foi carregado
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const data = await AuthService.refreshToken();
            setAccessToken(data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          } catch {
            setAccessToken(null);
            setUsuarioAtual(null);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  // Função de cadastro
  const cadastrarUsuario = async (
    cpf: string,
    nome: string,
    email: string,
    tipo: number,
    senha: string,
    cep: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    estado: string,
    numero: string
  ) => {
    const data = await AuthService.cadastrarUsuario(
      cpf,
      nome,
      email,
      tipo,
      senha,
      cep,
      logradouro,
      bairro,
      cidade,
      estado,
      numero
    );
    setAccessToken(data.accessToken);
    setUsuarioAtual(data.usuario);
  };

  // Função de login
  const login = async (email: string, senha: string) => {
    const data = await AuthService.login(email, senha);
    setAccessToken(data.accessToken);
    setUsuarioAtual(data.usuario);
  };

  // Função de Esqueceu Senha
  const esqueceuSenha = async (email: string) => {
    await AuthService.esqueceuSenha(email);
  };

  // Função para Verificar se Token de Redefinição de Senha já Expirou
  const verificarTokenRedefinicaoSenha = async (token: string) => {
    await AuthService.verificarTokenRedefinicaoSenha(token);
  };

  // Função de Redefinir Senha
  const redefinirSenha = async (novaSenha: string, token: string) => {
    await AuthService.redefinirSenha(novaSenha, token);
  };

  // Função de logout
  const logout = async () => {
    if (usuarioAtual?.cpf) {
      await AuthService.logout(usuarioAtual.cpf);
    }
    setAccessToken(null);
    setUsuarioAtual(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        usuarioAtual,
        loading,
        login,
        cadastrarUsuario,
        esqueceuSenha,
        verificarTokenRedefinicaoSenha,
        redefinirSenha,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
