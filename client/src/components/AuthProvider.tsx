import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  ReactNode,
} from "react";
import api from "../api/api.ts";
import { Usuario } from "../types/user.ts";
import { useNavigate } from "react-router-dom";

// Tipagem para o contexto de autenticação
interface AuthContextType {
  usuarioAtual: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  cadastrarUsuario: (
    cpf: string,
    nome: string,
    email: string,
    tipo: string,
    senha: string,
    cep: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    estado: string,
    numero: string
  ) => Promise<void>;
  esqueceuSenha: (email: string) => Promise<void>;
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
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca os dados do usuário ao carregar a aplicação
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me", {
          withCredentials: true,
        });

        setAccessToken(response.data.accessToken);
        setUsuarioAtual(response.data.user);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
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
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const response = await api.get("/auth/refresh-token", {
              withCredentials: true,
            });

            setAccessToken(response.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            console.error("Erro ao renovar token:", refreshError);
            setAccessToken(null);
            setUsuarioAtual(null);
            navigate("/entrar");
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
    tipo: string,
    senha: string,
    cep: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    estado: string,
    numero: string
  ) => {
    try {
      const response = await api.post(
        "/auth/cadastro",
        {
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
          numero,
        },
        { withCredentials: true }
      );

      setAccessToken(response.data.accessToken);
      setUsuarioAtual(response.data.usuario);
    } catch (error) {
      console.error("Erro no cadastro:", error);
      throw error;
    }
  };

  // Função de login
  const login = async (email: string, senha: string) => {
    try {
      const response = await api.post(
        "/auth/login",
        { email, senha },
        { withCredentials: true }
      );

      console.log(
        "RESPONSE DO LOGIN: " + JSON.stringify(response.data.usuario, null, 2)
      );

      setAccessToken(response.data.accessToken);
      setUsuarioAtual(response.data.usuario);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  // Função de Esqueceu Senha
  const esqueceuSenha = async (email: string) => {
    try {
      await api.post(
        "/auth/esqueceu-senha",
        { email },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Erro no envio do email de redefinição de senha:", error);
      throw error;
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await api.post(
        "/auth/logout",
        { cpf: usuarioAtual?.cpf },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      setAccessToken(null);
      setUsuarioAtual(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuarioAtual,
        loading,
        login,
        cadastrarUsuario,
        esqueceuSenha,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
