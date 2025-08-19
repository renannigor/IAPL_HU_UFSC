import { Link } from "react-router-dom";
import { cardsData } from "../repository/cards";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-28 max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-10">
          Bem-vindo ao Sistema IAPL
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cardsData.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={index}
                to={card.to}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <Icon className={card.color} size={28} />
                  <h3 className="text-lg font-semibold text-gray-700">
                    {card.title}
                  </h3>
                </div>
                <p className="text-gray-600">{card.description}</p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default HomePage;
