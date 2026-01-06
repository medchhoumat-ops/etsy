
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TrendSpy from './pages/TrendSpy';
import ListingGenerator from './pages/ListingGenerator';
import ChatBot from './components/ChatBot';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard: return <Dashboard />;
      case Page.TrendSpy: return <TrendSpy />;
      case Page.ListingGenerator: return <ListingGenerator />;
      case Page.Settings: return (
        <div className="p-8 flex items-center justify-center h-full">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">settings</span>
            <h2 className="text-2xl font-bold">Settings</h2>
            <p className="text-slate-500">Configure your Etsy API credentials and subscription here.</p>
          </div>
        </div>
      );
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f7f5] font-['Inter']">
      <Sidebar currentPage={currentPage} setPage={setCurrentPage} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-[#e9d9ce]/50 sticky top-0 z-10">
          <div className="flex items-center w-full max-w-md">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-[#f97415] transition-colors">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2 border-none rounded-lg bg-slate-100/50 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f97415]/20 focus:bg-white transition-all" 
                placeholder="Search trends, listings..." 
                type="text"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 text-slate-600 transition-colors relative">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 size-2 bg-[#f97415] rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:border-[#f97415]/50 hover:text-[#f97415] transition-all shadow-sm">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              <span>Today</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#f8f7f5]">
          {renderPage()}
        </div>

        <ChatBot />
      </main>
    </div>
  );
};

export default App;
