import { Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { usuarioAtual, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  // Redireciona para dashboard se estiver logado e tentar acessar outras rotas públicas
  if (usuarioAtual) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
