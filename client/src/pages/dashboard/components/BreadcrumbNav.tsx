import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash as SlashIcon } from "lucide-react";

type Crumb = {
  titulo: string;
  href: string;
};

type BreadcrumbNavProps = {
  itens: Crumb[];
};

export function BreadcrumbNav({ itens }: BreadcrumbNavProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {itens.map((item, index) => (
          <div key={item.href} className="flex items-center">
            <BreadcrumbItem>
              <BreadcrumbLink href={item.href}>{item.titulo}</BreadcrumbLink>
            </BreadcrumbItem>
            {index < itens.length - 1 && (
              <BreadcrumbSeparator>
                <SlashIcon className="w-4 h-4 mx-2" />
              </BreadcrumbSeparator>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
