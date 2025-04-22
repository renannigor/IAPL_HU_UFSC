import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { usuarioAtual, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;
  if (!usuarioAtual) return <Navigate to="/entrar" replace />;
  if (!usuarioAtual.possui_acesso) return <Navigate to="/sem-acesso" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
