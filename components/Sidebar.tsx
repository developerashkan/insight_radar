
import React from 'react';
import { LayoutDashboard, ShieldCheck, ListTodo, History, Radio } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Radar', icon: LayoutDashboard },
    { id: AppView.VERIFY, label: 'Verify Signal', icon: ShieldCheck },
    { id: AppView.WATCHLIST, label: 'Watchlist', icon: ListTodo },
    { id: AppView.HISTORY, label: 'Signal Logs', icon: History },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="relative">
          <Radio className="text-emerald-500 w-8 h-8" />
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">LiveSignal</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.id
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Agent Live</span>
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Continuously monitoring global search vectors for anomalies.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
