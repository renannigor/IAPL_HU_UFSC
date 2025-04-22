export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-green-800">Sobre o Sistema</h1>
      <p className="text-muted-foreground text-lg">
        Este sistema foi desenvolvido com o objetivo de facilitar o gerenciamento
        de usuários e promover uma experiência mais fluida e intuitiva para todos
        os envolvidos. Ele oferece funcionalidades modernas como autenticação,
        controle de acesso, perfis personalizados e muito mais.
      </p>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Funcionalidades</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Cadastro e autenticação de usuários</li>
          <li>Gerenciamento de perfis com edição segura</li>
          <li>Controle de acesso com base em permissões</li>
          <li>Design responsivo e amigável</li>
        </ul>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Tecnologias Utilizadas</h2>
        <p className="text-muted-foreground">
          O sistema foi construído com React, Vite, TailwindCSS e integra
          bibliotecas modernas para UI e controle de estado.
        </p>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Desenvolvedor</h2>
        <p className="text-muted-foreground">
          Esta aplicação foi criada por um time apaixonado por tecnologia,
          usabilidade e impacto. Estamos sempre abertos a melhorias e sugestões!
        </p>
      </div>
    </div>
  );
}
