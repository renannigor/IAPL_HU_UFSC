import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

const RotaProtegida = ({ children }: { children: React.ReactNode }) => {
  const { usuarioAtual, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;
  if (!usuarioAtual) return <Navigate to="/entrar" replace />;

  return <>{children}</>;
};

export default RotaProtegida;
