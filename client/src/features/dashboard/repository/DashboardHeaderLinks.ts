import { Home, Users, User, Info } from "lucide-react";

export const dashboardHeaderLinks = [
  { to: "/", label: "Início", icon: Home },
  { to: "/dashboard/pacientes", label: "Pacientes", icon: Users },
  { to: "/dashboard/perfil", label: "Perfil", icon: User },
  { to: "/dashboard/sobre", label: "Sobre", icon: Info },
];
