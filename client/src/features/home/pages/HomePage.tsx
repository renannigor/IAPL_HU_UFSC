import { useAuth } from "@/providers/AuthProvider";
import { Users2, Info, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cardsData } from "../utils/CardsData";

const iconMap = {
  Users2: <Users2 size={40} />,
  UserCircle: <UserCircle size={40} />,
  Info: <Info size={40} />,
};

const HomePage = () => {
  const { usuarioAtual } = useAuth();
  const navigate = useNavigate();

  // Mapeia os dados, adicionando o ícone e a função de navegação
  const cards = cardsData.map(({ title, description, route, iconName }) => ({
    title,
    description,
    icon: iconMap[iconName as keyof typeof iconMap],
    onClick: () => navigate(route),
  }));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Olá, {usuarioAtual?.nome}
          </h1>
          <p className="text-gray-600">
            Escolha uma opção abaixo para continuar.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
