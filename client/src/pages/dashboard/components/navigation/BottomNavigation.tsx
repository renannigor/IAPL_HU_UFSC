import React from "react";
import clsx from "clsx";
import { useLocation } from "react-router-dom";

type MenuItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

type BottomNavigationProps = {
  menuItems: MenuItem[];
};

export function BottomNavigation({ menuItems }: BottomNavigationProps) {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md flex justify-around py-2 md:hidden">
      {menuItems.map((item) => {
        const active = pathname === item.url;
        const Icon = item.icon;

        return (
          <a
            key={item.title}
            href={item.url}
            className={clsx(
              "flex flex-col items-center text-xs transition-colors px-3 py-1 rounded-md",
              active
                ? "text-[#1F4D2C] bg-[#1F4D2C]/10"
                : "text-gray-600 hover:text-[#1F4D2C]"
            )}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span>{item.title}</span>
          </a>
        );
      })}
    </nav>
  );
}
