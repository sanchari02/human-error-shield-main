import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, History, UserCog, LogOut } from 'lucide-react';

const Item = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm
       ${isActive
        ? 'bg-brand-primary text-white shadow-lg shadow-blue-500/20'
        : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`
    }
  >
    {/* Icon wrapper to handle hover effects subtly */}
    <span className="opacity-70 group-hover:opacity-100 transition-opacity">
      {icon}
    </span>
    {children}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col sticky top-0">

      {/* --- Header / Logo --- */}
      <div className="p-6 flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="font-bold text-white text-lg tracking-tight">HES Admin</h1>
          <p className="text-xs text-gray-500">Safety Dashboard</p>
        </div>
      </div>

      {/* --- Navigation Links --- */}
      <nav className="flex-1 px-4 space-y-2">
        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">
          Menu
        </p>

        <Item to="/dashboard" icon={<LayoutDashboard size={20} />}>
          Dashboard
        </Item>

        <Item to="/history" icon={<History size={20} />}>
          History Logs
        </Item>

        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-8">
          Settings
        </p>

        <Item to="/admin" icon={<UserCog size={20} />}>
          Admin Panel
        </Item>
      </nav>

      {/* --- Footer / User Profile --- */}
      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 text-sm font-medium">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
}