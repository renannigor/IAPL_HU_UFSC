import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { useNavigate } from "react-router-dom";

/** Componente Breadcrumb reutilizável */
function BreadcrumbNav({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  const navigate = useNavigate();

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink
                  className="cursor-pointer"
                  onClick={() => navigate(item.href!)}
                >
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <span className="text-gray-800 font-medium">{item.label}</span>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator className="mx-2" />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbNav;
