import { Users, User, Info } from "lucide-react";

export const cardsData = [
  {
    title: "Pacientes",
    description:
      "Gerencie informações dos pacientes de forma simples e rápida.",
    icon: Users,
    color: "text-blue-500",
    to: "/dashboard/pacientes",
  },
  {
    title: "Perfil",
    description: "Acesse e atualize os seus dados de forma segura.",
    icon: User,
    color: "text-green-500",
    to: "/dashboard/perfil",
  },
  {
    title: "Sobre",
    description:
      "Saiba mais sobre o sistema e como ele pode ajudar no dia a dia.",
    icon: Info,
    color: "text-purple-500",
    to: "/dashboard/sobre",
  },
];
