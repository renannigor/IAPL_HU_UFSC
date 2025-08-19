function SobrePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-28 max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-10">
          Sobre o Sistema IAPL
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {/* Sobre o Sistema */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Sobre o Sistema
            </h3>
            <p className="text-gray-600">
              O IAPL é uma ferramenta desenvolvida para auxiliar os
              profissionais do HU-UFSC no tratamento e na avaliação de lesões de
              pacientes atendidos em ambientes hospitalares e ambulatoriais. Seu
              objetivo é agilizar o registro e o acompanhamento das lesões,
              proporcionando mais eficiência e organização no trabalho da equipe
              de saúde.
            </p>
          </div>

          {/* Principais Funcionalidades */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Principais Funcionalidades
            </h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Registro de lesões dos pacientes</li>
              <li>Consulta detalhada de cada registro</li>
              <li>
                Geração de histórico individual para cada lesão cadastrada
              </li>
              <li>Edição de informações pessoais do usuário</li>
            </ul>
          </div>

          {/* Tecnologias Utilizadas */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Tecnologias Utilizadas
            </h3>
            <p className="text-gray-600">
              O sistema foi desenvolvido utilizando as seguintes tecnologias:
              React, Node.js e PostgreSQL.
            </p>
          </div>

          {/* Desenvolvedor */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Desenvolvedor
            </h3>
            <p className="text-gray-600">
              O sistema foi criado por Renan Igor de Lima Ferreira, estudante de
              Ciências da Computação na UFSC e bolsista do projeto.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SobrePage;
