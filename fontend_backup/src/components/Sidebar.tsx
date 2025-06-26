import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/cloud', label: 'Cloud' },
  { path: '/licenses', label: 'SaaS Licencias' },
  { path: '/recommendations', label: 'Recomendaciones' },
  { path: '/budget', label: 'Presupuesto' },
  { path: '/alerts', label: 'Alertas' },
  { path: '/integrations', label: 'Integraciones' },
  { path: '/settings', label: 'Configuración' },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 h-screen bg-blue-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-semibold border-b border-white/10">
        Nukae
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`block px-4 py-2 rounded hover:bg-white/10 ${
              pathname === path ? 'bg-white/10 font-semibold' : 'text-white/80'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

