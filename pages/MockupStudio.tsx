
import React, { useState } from 'react';
import { generateMockup, editMockup } from '../services/geminiService';

const MockupStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('Classic white t-shirt hanging on a wooden hanger, minimalist room');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [size, setSize] = useState('1K');
  const [generating, setGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [editing, setEditing] = useState(false);

  // Fix: Correctly handle asynchronous API key check and implement robust error handling
  const handleGenerate = async () => {
    // Instruction Check: Needs API Key selection for Gemini 3 Image
    // Use await for hasSelectedApiKey as it is an async operation
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey?.();
    if (!hasKey) {
      await (window as any).aistudio?.openSelectKey?.();
      // Assume success and proceed per instructions to avoid race conditions
    }
    
    setGenerating(true);
    try {
      const img = await generateMockup(prompt, aspectRatio, size);
      if (img) setResultImage(img);
    } catch (e: any) {
      console.error(e);
      // Handle missing billing or invalid key error specifically
      if (e.message?.includes("Requested entity was not found")) {
        alert("This feature requires an API key from a paid GCP project. Please select a valid key.");
        await (window as any).aistudio?.openSelectKey?.();
      } else {
        alert("Image generation failed. Please check your prompt and try again.");
      }
    } finally {
      setGenerating(false);
    }
  };

  // Fix: Added key selection check and error handling for edit functionality
  const handleEdit = async () => {
    if (!resultImage || !editPrompt) return;
    
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey?.();
    if (!hasKey) {
      await (window as any).aistudio?.openSelectKey?.();
    }

    setEditing(true);
    try {
      const edited = await editMockup(resultImage, editPrompt);
      if (edited) setResultImage(edited);
      setEditPrompt('');
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("Requested entity was not found")) {
        alert("Selected key project issue. Please select a valid key from a paid project.");
        await (window as any).aistudio?.openSelectKey?.();
      } else {
        alert("Editing failed.");
      }
    } finally {
      setEditing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
      <header>
        <h2 className="text-3xl font-bold text-[#1c130d] tracking-tight">Mockup Studio</h2>
        <p className="text-[#9e6b47] text-sm mt-1">Generate professional, high-resolution product photos with AI.</p>
      </header>

      <div className="bg-white p-6 rounded-xl border border-[#e9d9ce] shadow-sm flex flex-col lg:flex-row gap-6 items-end">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="md:col-span-1 flex flex-col gap-2">
            <label className="text-sm font-bold">Aspect Ratio</label>
            <select 
              value={aspectRatio} 
              onChange={e => setAspectRatio(e.target.value)}
              className="w-full rounded-lg border-[#e9d9ce] focus:ring-[#f97415] focus:border-[#f97415]"
            >
              <option>1:1</option>
              <option>3:4</option>
              <option>4:3</option>
              <option>16:9</option>
              <option>9:16</option>
            </select>
          </div>
          <div className="md:col-span-1 flex flex-col gap-2">
            <label className="text-sm font-bold">Image Resolution</label>
            <select 
              value={size} 
              onChange={e => setSize(e.target.value)}
              className="w-full rounded-lg border-[#e9d9ce] focus:ring-[#f97415] focus:border-[#f97415]"
            >
              <option>1K</option>
              <option>2K</option>
              <option>4K</option>
            </select>
          </div>
          <div className="md:col-span-1 flex flex-col gap-2">
            <label className="text-sm font-bold">Mockup Subject</label>
            <input 
              type="text" 
              value={prompt} 
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe the product..."
              className="w-full rounded-lg border-[#e9d9ce] focus:ring-[#f97415] focus:border-[#f97415]"
            />
          </div>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={generating}
          className="h-11 px-8 bg-[#f97415] text-white font-bold rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50 whitespace-nowrap"
        >
          {generating ? 'Generating...' : 'Generate Mockup'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Area */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Result Preview</h3>
          <div className="aspect-square bg-white rounded-xl border-2 border-dashed border-[#e9d9ce] overflow-hidden flex items-center justify-center relative">
            {resultImage ? (
              <img src={resultImage} alt="Generated" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-8 text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-2">image</span>
                <p>Your generated mockup will appear here</p>
              </div>
            )}
            {generating && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-[#f97415] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-[#f97415]">Painting your masterpiece...</p>
              </div>
            )}
          </div>
          {resultImage && (
            <div className="flex gap-3">
               <button className="flex-1 h-11 border border-[#e9d9ce] rounded-lg font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2">
                 <span className="material-symbols-outlined text-[20px]">download</span>
                 Download Original
               </button>
               <button className="flex-1 h-11 bg-white border border-[#f97415] text-[#f97415] rounded-lg font-bold hover:bg-orange-50 flex items-center justify-center gap-2">
                 <span className="material-symbols-outlined text-[20px]">publish</span>
                 Upload to Etsy
               </button>
            </div>
          )}
        </div>

        {/* AI Editor Area */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">AI Quick Edit</h3>
          <div className="bg-white p-6 rounded-xl border border-[#e9d9ce] shadow-sm flex flex-col gap-4">
            <p className="text-sm text-[#9e6b47]">Use natural language to tweak your image. Try "Change background to a modern office" or "Make it a black shirt".</p>
            <textarea 
              value={editPrompt}
              onChange={e => setEditPrompt(e.target.value)}
              placeholder="e.g. Add a retro coffee mug next to the shirt..."
              className="w-full p-4 rounded-lg bg-[#f8f7f5] border-[#e9d9ce] focus:ring-[#f97415] focus:border-[#f97415] resize-none"
              rows={4}
            />
            <button 
              onClick={handleEdit}
              disabled={editing || !resultImage || !editPrompt}
              className="h-11 bg-slate-900 text-white font-bold rounded-lg hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">{editing ? 'sync' : 'auto_fix_high'}</span>
              {editing ? 'Editing...' : 'Apply AI Edit'}
            </button>
            <div className="grid grid-cols-2 gap-3 mt-4">
               <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3 cursor-pointer hover:border-[#f97415]/30 group transition-all" onClick={() => setEditPrompt("Change background to beach setting")}>
                 <span className="material-symbols-outlined text-slate-400 group-hover:text-[#f97415]">beach_access</span>
                 <span className="text-xs font-bold text-slate-600">Beach Setting</span>
               </div>
               <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3 cursor-pointer hover:border-[#f97415]/30 group transition-all" onClick={() => setEditPrompt("Adjust lighting to sunset glow")}>
                 <span className="material-symbols-outlined text-slate-400 group-hover:text-[#f97415]">wb_sunny</span>
                 <span className="text-xs font-bold text-slate-600">Sunset Glow</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockupStudio;
