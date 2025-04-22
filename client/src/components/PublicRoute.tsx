import { Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { usuarioAtual, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (usuarioAtual) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default PublicRoute;
