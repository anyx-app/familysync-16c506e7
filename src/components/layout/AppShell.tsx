import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Calendar, CheckSquare, Settings, Menu, X, Home, Users, Bell } from 'lucide-react';
import { clsx } from 'clsx';

export default function AppShell() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: Home, to: '/' },
    { label: 'Calendar', icon: Calendar, to: '/calendar' },
    { label: 'Lists', icon: CheckSquare, to: '/lists' },
    { label: 'Settings', icon: Settings, to: '/settings' },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-2xl transition-transform duration-300 md:translate-x-0 md:static md:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="flex h-20 items-center justify-between px-8 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FF6F61] to-[#FFD54F] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#FF6F61]/20">
                FS
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">FamilySync</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* User Profile Snippet (Top of Sidebar) */}
          <div className="p-6 pb-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <Users size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 truncate">The Smiths</p>
                <p className="text-xs text-slate-500 truncate">Free Plan</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => clsx(
                    "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                    isActive 
                      ? "bg-[#FF6F61]/10 text-[#FF6F61]" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF6F61] rounded-r-full" />
                  )}
                  <item.icon size={20} className={clsx("transition-transform duration-300 group-hover:scale-110", isActive && "fill-current")} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-100">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
              <Bell size={18} />
              Notifications
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between px-4 md:hidden bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#FF6F61] to-[#FFD54F] flex items-center justify-center text-white font-bold text-sm">
                FS
              </div>
              <span className="font-bold text-slate-900">FamilySync</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
