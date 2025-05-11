import { User, Users2, Info, UserCircle } from "lucide-react";
import { useAuth } from "../../components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { usuarioAtual } = useAuth();
  const navigate = useNavigate();

  const cards = [
    {
      title: "Pacientes",
      description: "Lista de pacientes cadastrados no sistema AGHU.",
      icon: <UserCircle size={40} />,
      onClick: () => navigate("/dashboard/pacientes"),
    },
    {
      title: "Usuários",
      description: "Gerencie usuários do sistema.",
      icon: <Users2 size={40} />,
      onClick: () => navigate("/dashboard/usuarios"), 
      onlyAdmin: true,
    },
    {
      title: "Perfil",
      description: "Veja e edite seu perfil.",
      icon: <User size={40} />,
      onClick: () => navigate("/dashboard/perfil"),
    },
    {
      title: "Sobre",
      description: "Sobre o sistema IAPL.",
      icon: <Info size={40} />,
      onClick: () => navigate("/dashboard/sobre"),
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Bem-vindo, {usuarioAtual?.nome}
          </h1>
          <p className="text-gray-600">
            Escolha uma opção abaixo para continuar.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            if (card.onlyAdmin && !usuarioAtual?.admin) return null;
            return (
              <div
                key={index}
                onClick={card.onClick}
                className="bg-white p-6 rounded-2xl shadow-md cursor-pointer border border-gray-100 hover:shadow-lg transition hover:border-green-200 hover:bg-green-50 group"
              >
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="text-green-600 group-hover:scale-105 transition">
                    {card.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
