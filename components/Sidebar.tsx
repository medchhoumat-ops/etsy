
import React from 'react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage }) => {
  const menuItems = [
    { id: Page.Dashboard, icon: 'dashboard', label: 'Dashboard' },
    { id: Page.TrendSpy, icon: 'visibility', label: 'Trend Spy' },
    { id: Page.ListingGenerator, icon: 'auto_awesome', label: 'AI Creative Suite' },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-white h-screen flex flex-col border-r border-slate-800 shadow-xl shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-8 rounded-lg bg-[#f97415] text-white shadow-lg">
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
          </div>
          <h1 className="text-white text-lg font-bold tracking-tight">EtsyBooster</h1>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              currentPage === item.id
                ? 'bg-[#f97415] text-white shadow-md shadow-[#f97415]/10'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
        
        <div className="my-4 border-t border-slate-800/50 mx-3"></div>
        
        <button
          onClick={() => setPage(Page.Settings)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
            currentPage === Page.Settings
              ? 'bg-[#f97415] text-white'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800/50 bg-black/10">
        <div className="flex items-center gap-3">
          <img 
            src="https://picsum.photos/seed/user1/100/100" 
            alt="User" 
            className="size-10 rounded-full border-2 border-slate-600"
          />
          <div className="flex flex-col">
            <p className="text-white text-sm font-medium">Alex Seller</p>
            <p className="text-slate-500 text-xs">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
