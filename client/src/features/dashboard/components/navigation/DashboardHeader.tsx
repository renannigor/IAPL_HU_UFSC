import { Link } from "react-router-dom";
import { dashboardLinks } from "../../repository/dashboardLinks";

export function DashboardHeader() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-700">Sistema IAPL</h1>

        <nav className="flex space-x-6">
          {dashboardLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Icon size={18} /> {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
