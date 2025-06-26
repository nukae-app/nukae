import React from "react";
import { Icon } from "@iconify/react";

interface SidebarProps {
  onNavigation: (view: string) => void;
  activeView: string;
}

export const Sidebar = ({ onNavigation, activeView }: SidebarProps) => {
  const menuItems = [
    { icon: "lucide:layout-dashboard", label: "Dashboard", view: "dashboard", active: activeView === "dashboard" },
    { icon: "lucide:cloud", label: "Cloud Costs", view: "cloud-costs", active: activeView === "cloud-costs" },
    { icon: "lucide:layers", label: "SaaS Licencias", view: "saas", active: activeView === "saas" },
    { icon: "lucide:lightbulb", label: "Recomendaciones", view: "recommendations", active: activeView === "recommendations" },
    { icon: "lucide:clipboard-list", label: "Presupuesto", view: "budgets", active: activeView === "budgets" },
    { icon: "lucide:bell", label: "Alertas", view: "alerts", active: activeView === "alerts" },
    { icon: "lucide:plug", label: "Integraciones", view: "integrations", active: activeView === "integrations" },
    { icon: "lucide:settings", label: "Configuracion", view: "configuration", active: activeView === "configuration" },
  ];

  return (
    <div className="w-80 bg-[#0a1b39] text-white flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <Icon icon="lucide:cube" className="text-blue-400 text-2xl" />
        <span className="text-xl font-semibold">Nukae Cloud</span>
      </div>
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className={`flex items-center gap-3 px-3 py-3 rounded-md ${
                  item.active
                    ? "bg-blue-900/30"
                    : "hover:bg-blue-900/20 transition-colors"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  item.view && onNavigation(item.view);
                }}
              >
                <Icon icon={item.icon} className="text-xl" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}