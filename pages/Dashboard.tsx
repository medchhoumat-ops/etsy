
import React from 'react';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Top Niche Today', value: 'Minimalist Wall Art', growth: '+12%', icon: 'trending_up', color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Avg Sales Velocity', value: '24 sales/day', growth: '+5%', icon: 'shopping_cart', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Trending POD', value: 'Embroidered Hoodies', growth: '+8%', icon: 'checkroom', color: 'text-[#f97415]', bg: 'bg-orange-50' },
  ];

  const trendingItems = [
    { id: 1, title: 'Digital Planner 2024', price: '$12.50', status: 'High Demand', score: 98, img: 'https://picsum.photos/seed/planner/400/300' },
    { id: 2, title: 'Boho Wall Set', price: '$24.00', status: 'High Demand', score: 94, img: 'https://picsum.photos/seed/wallart/400/300' },
    { id: 3, title: 'Custom Hoodie', price: '$45.00', status: 'Med Demand', score: 89, img: 'https://picsum.photos/seed/hoodie/400/300' },
    { id: 4, title: 'Crystal Necklace', price: '$18.99', status: 'Med Demand', score: 87, img: 'https://picsum.photos/seed/jewelry/400/300' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      <header>
        <h2 className="text-3xl font-bold text-[#1c130d] tracking-tight">Good morning, Seller</h2>
        <p className="text-[#9e6b47] text-sm mt-1">Here's what's happening in the Etsy marketplace today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-[#e9d9ce] shadow-sm flex flex-col justify-between h-40 hover:border-[#f97415]/30 transition-colors group">
            <div className="flex items-start justify-between">
              <div className={`p-3 ${stat.bg} rounded-xl ${stat.color}`}>
                <span className="material-symbols-outlined text-[28px]">{stat.icon}</span>
              </div>
              <span className="text-xs font-bold text-green-700 bg-green-100/60 px-2.5 py-1 rounded-full">{stat.growth}</span>
            </div>
            <div>
              <p className="text-[#9e6b47] text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-xl font-bold text-[#1c130d] group-hover:text-[#f97415] transition-colors">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#1c130d]">Trending Now</h3>
          <button className="text-[#f97415] text-sm font-bold flex items-center gap-1">
            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-xl border border-[#e9d9ce] overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer">
              <div className="aspect-[4/3] relative">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span className="material-symbols-outlined text-[#f97415] text-[16px] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  <span className="text-xs font-bold text-slate-700">{item.score}</span>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <h4 className="font-bold text-[#1c130d] truncate">{item.title}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 text-sm font-medium">{item.price}</p>
                  <p className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${item.status === 'High Demand' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</p>
                </div>
                <button className="w-full py-2 rounded-lg border border-[#f97415]/20 text-[#f97415] text-sm font-bold hover:bg-[#f97415] hover:text-white transition-all">
                  Analyze This
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
