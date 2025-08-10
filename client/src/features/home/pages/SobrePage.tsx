import { BreadcrumbNav } from "@/shared/components/layout/BreadcrumbNav";

const SobrePage = () => {
  return (
    <div className="w-full max-w-full px-6 py-8 bg-white rounded shadow space-y-6">
      <BreadcrumbNav
        itens={[
          { titulo: "Home", href: "/" },
          { titulo: "Sobre", href: "/dashboard/sobre" },
        ]}
      />

      <h1 className="text-3xl font-bold text-green-800">Sobre o Sistema</h1>
      <p className="text-muted-foreground text-lg">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </p>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Funcionalidades</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Lorem Ipsum</li>
          <li>Lorem Ipsum</li>
          <li>Lorem Ipsum</li>
          <li>Lorem Ipsum</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Tecnologias Utilizadas</h2>
        <p className="text-muted-foreground">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Desenvolvedor</h2>
        <p className="text-muted-foreground">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </p>
      </div>
    </div>
  );
};

export default SobrePage;
