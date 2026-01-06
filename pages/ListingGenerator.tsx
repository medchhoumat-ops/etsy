
import React, { useState, useRef } from 'react';
import { analyzeDesignAndGenerateListing, generateMockupFromDesign } from '../services/geminiService';
import { ListingData } from '../types';

const ListingGenerator: React.FC = () => {
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ListingData | null>(null);
  const [mockup, setMockup] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDesignImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const performGeneration = async () => {
    setLoading(true);
    setResult(null);
    setMockup(null);

    try {
      // Parallel generation: Visual SEO analysis + Lifestyle Mockup
      const [seoData, mockupImg] = await Promise.all([
        analyzeDesignAndGenerateListing(designImage!, description || "Modern minimalist style"),
        generateMockupFromDesign(designImage!, description || "Clean studio setting")
      ]);

      setResult(seoData);
      if (mockupImg) setMockup(mockupImg);
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("permission denied") || error.message?.includes("403")) {
        // If permission denied, explicitly ask for the paid key
        alert("This high-quality generation requires an API key from a paid project. Please select your key in the next dialog.");
        await (window as any).aistudio?.openSelectKey?.();
        // After key selection, the user can try again
      } else {
        alert("Something went wrong. Please try again with a clear description.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMagicButton = async () => {
    if (!designImage) {
      fileInputRef.current?.click();
      return;
    }

    // Check if key is already selected for the Pro models
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey?.();
    if (!hasKey) {
      await (window as any).aistudio?.openSelectKey?.();
      // Per instructions: assume success and proceed
    }
    
    performGeneration();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8 min-h-full">
      <header className="flex flex-col gap-1">
        <h2 className="text-4xl font-black text-[#1c130d] tracking-tight flex items-center gap-3">
          AI Creative Suite
          <span className="text-xs bg-[#f97415] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Pro</span>
        </h2>
        <p className="text-[#9e6b47] text-lg">One click to turn a design into a complete, professional Etsy listing.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1">
        {/* Input: The Magic Pad */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-[#e9d9ce] shadow-xl flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f97415]">design_services</span>
                Design Pad
              </h3>
              {designImage && (
                <button 
                  onClick={() => {setDesignImage(null); setResult(null); setMockup(null);}}
                  className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div 
              onClick={() => !loading && fileInputRef.current?.click()}
              className={`flex-1 relative rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                designImage ? 'border-[#f97415] bg-orange-50/10' : 'border-[#e9d9ce] hover:border-[#f97415] hover:bg-orange-50/20'
              }`}
            >
              {designImage ? (
                <div className="relative w-full h-full p-4 flex items-center justify-center">
                  <img src={designImage} alt="Design Preview" className="max-w-full max-h-full object-contain rounded-lg shadow-sm" />
                  {!loading && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                      <p className="text-white font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined">sync</span> Change Design
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-12">
                  <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-slate-300 text-4xl">cloud_upload</span>
                  </div>
                  <p className="text-lg font-bold text-slate-700">Drop Design File</p>
                  <p className="text-sm text-slate-400 mt-2">Upload your artwork with transparency for best results</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-700 flex justify-between">
                <span>Product Context</span>
                <span className="text-[10px] text-slate-400 font-normal uppercase italic">Helps AI niche down</span>
              </label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the product (e.g. Vintage 90s streetwear, oversized white tee...)"
                className="w-full p-4 rounded-xl bg-[#f8f7f5] border-[#e9d9ce] text-sm focus:ring-[#f97415] focus:border-[#f97415] border-2 transition-all"
                rows={3}
              />
            </div>

            <button 
              onClick={handleMagicButton}
              disabled={loading}
              className={`w-full h-16 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl ${
                loading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-[#f97415] hover:bg-orange-600 text-white shadow-[#f97415]/30 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                  <span>Brewing Magic...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
                  <span>{designImage ? 'Generate Everything' : 'Upload to Start'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output: The Studio */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="w-3 h-8 bg-[#f97415] rounded-full"></span>
              The Result Studio
            </h3>
            {result && (
              <button className="flex items-center gap-2 text-sm font-bold text-[#f97415] hover:underline">
                <span className="material-symbols-outlined text-[18px]">publish</span>
                Publish to Etsy Draft
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-6">
            {!result && !loading && (
              <div className="flex-1 bg-white border border-[#e9d9ce] border-dashed rounded-[2rem] flex flex-col items-center justify-center p-20 text-center opacity-60">
                <div className="size-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-6xl text-slate-200">photo_library</span>
                </div>
                <h4 className="text-xl font-bold text-slate-400 tracking-tight">Your Mockup & SEO Awaits</h4>
                <p className="text-slate-400 text-sm mt-2 max-w-sm">
                  Once generated, a professional lifestyle mockup and optimized listing copy will appear here.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex-1 bg-white border border-[#e9d9ce] rounded-[2rem] p-8 flex flex-col gap-8 animate-pulse">
                <div className="aspect-video bg-slate-100 rounded-2xl"></div>
                <div className="space-y-4">
                  <div className="h-10 w-3/4 bg-slate-100 rounded-lg"></div>
                  <div className="h-32 w-full bg-slate-100 rounded-lg"></div>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-6 w-16 bg-slate-100 rounded-full"></div>)}
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
                {/* Visual Mockup Card */}
                <div className="bg-white rounded-[2rem] border border-[#e9d9ce] overflow-hidden shadow-xl group">
                  <div className="aspect-video bg-[#0f172a] relative flex items-center justify-center overflow-hidden">
                    {mockup ? (
                      <img src={mockup} alt="Mockup" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-slate-500 flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-slate-700 border-t-white rounded-full animate-spin"></div>
                        <span className="text-xs font-bold uppercase tracking-widest">Rendering Lifestyle...</span>
                      </div>
                    )}
                    {mockup && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button className="size-10 bg-white/10 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-white/20 transition-all">
                          <span className="material-symbols-outlined">download</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-slate-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 border-t">
                    <span>Generated AI Mockup v1.0</span>
                    <span className="text-[#f97415]">High Resolution (1024px)</span>
                  </div>
                </div>

                {/* SEO Text Content */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white p-6 rounded-2xl border border-[#e9d9ce] shadow-sm group relative">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 block">Winning Title</label>
                    <p className="text-xl font-bold text-slate-900 leading-tight pr-10">{result.title}</p>
                    <button onClick={() => navigator.clipboard.writeText(result.title)} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-[#f97415]">
                      <span className="material-symbols-outlined text-[20px]">content_copy</span>
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-[#e9d9ce] shadow-sm group relative">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 block">High-Convert Description</label>
                    <div className="text-slate-600 text-sm leading-relaxed max-h-[300px] overflow-y-auto pr-8 custom-scrollbar whitespace-pre-line">
                      {result.description}
                    </div>
                    <button onClick={() => navigator.clipboard.writeText(result.description)} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-[#f97415]">
                      <span className="material-symbols-outlined text-[20px]">content_copy</span>
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-[#e9d9ce] shadow-sm">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 block">SEO Tags (13)</label>
                    <div className="flex flex-wrap gap-2">
                      {result.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-orange-50 text-[#f97415] border border-orange-100 rounded-lg text-xs font-bold hover:scale-105 transition-transform cursor-default">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingGenerator;
