
import React, { useState, useEffect } from 'react';
import { getTrends } from '../services/geminiService';

const TrendSpy: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [needsKey, setNeedsKey] = useState(false);

  const checkAndFetchTrends = async () => {
    // gemini-3-pro-image-preview requires a selected API key
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey?.();
    if (!hasKey) {
      setNeedsKey(true);
      return;
    }
    setNeedsKey(false);
    fetchTrends();
  };

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const result = await getTrends();
      setAnalysis(result);
    } catch (e: any) {
      if (e.message?.includes("Requested entity was not found")) {
        // Reset key state if billing/project issues occur
        setNeedsKey(true);
      }
      setAnalysis("Error fetching trends. Please ensure you have a valid API key selected and are connected to the internet.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectKey = async () => {
    await (window as any).aistudio?.openSelectKey?.();
    setNeedsKey(false);
    fetchTrends();
  };

  useEffect(() => {
    checkAndFetchTrends();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1c130d] tracking-tight">Market Trend Spy</h2>
          <p className="text-[#9e6b47] text-sm mt-1">Live analysis of Etsy marketplace trends using Google Search data.</p>
        </div>
        <button 
          onClick={checkAndFetchTrends}
          disabled={loading}
          className="h-10 px-4 bg-white border border-[#e9d9ce] rounded-lg text-sm font-bold text-slate-700 hover:border-[#f97415] hover:text-[#f97415] transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">{loading ? 'sync' : 'refresh'}</span>
          Refresh Analysis
        </button>
      </header>

      {needsKey ? (
        <div className="flex-1 border-2 border-dashed border-[#e9d9ce] rounded-xl flex flex-col items-center justify-center p-12 text-center bg-white">
          <div className="p-4 bg-orange-50 rounded-full text-[#f97415] mb-4">
            <span className="material-symbols-outlined text-4xl">key</span>
          </div>
          <h3 className="text-lg font-bold text-[#1c130d]">API Key Required</h3>
          <p className="text-[#9e6b47] max-w-sm mt-2 mb-6">
            Trend analysis uses high-quality search grounding which requires a selected API key from a paid project.
            Please visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline text-[#f97415]">billing documentation</a> for details.
          </p>
          <button 
            onClick={handleSelectKey}
            className="px-8 py-3 bg-[#f97415] text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 transition-all"
          >
            Select API Key
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-xl border border-[#e9d9ce] shadow-sm min-h-[400px]">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-8 w-1/3 bg-slate-100 rounded"></div>
                  <div className="h-4 w-full bg-slate-100 rounded"></div>
                  <div className="h-4 w-full bg-slate-100 rounded"></div>
                  <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
                  <div className="pt-8 grid grid-cols-2 gap-4">
                    <div className="h-32 bg-slate-50 rounded-lg"></div>
                    <div className="h-32 bg-slate-50 rounded-lg"></div>
                  </div>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 bg-orange-50 rounded-full flex items-center justify-center text-[#f97415]">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1c130d] m-0">AI Trend Analysis</h3>
                  </div>
                  <div className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                    {analysis || "Click refresh to start analysis."}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-[#f97415]/5 border border-[#f97415]/20 p-6 rounded-xl">
                <h4 className="text-[#f97415] font-bold text-sm uppercase tracking-widest mb-4">Recommended Actions</h4>
                <ul className="flex flex-col gap-4">
                  {[
                    "Design 5 minimalist posters for the 'Japandi' niche.",
                    "Create listing drafts for 'Personalized Teacher Gifts'.",
                    "Experiment with 'Retro 70s' typography on apparel."
                  ].map((act, i) => (
                    <li key={i} className="flex gap-3 text-sm text-[#1c130d] font-medium leading-tight">
                      <span className="size-5 rounded-full bg-[#f97415] text-white flex items-center justify-center text-[10px] shrink-0">{i+1}</span>
                      {act}
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full py-3 bg-[#f97415] text-white rounded-lg font-bold text-sm shadow-lg shadow-[#f97415]/20 hover:scale-[1.02] active:scale-100 transition-all">
                  Quick Draft Niche 1
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#e9d9ce] shadow-sm">
                <h4 className="font-bold text-sm mb-4">Market Saturation</h4>
                <div className="flex flex-col gap-4">
                  {[
                    { name: "Digital Art", val: 85 },
                    { name: "Jewelry", val: 92 },
                    { name: "POD Apparel", val: 65 }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>{item.name}</span>
                        <span>{item.val}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#f97415]" style={{ width: `${item.val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendSpy;
