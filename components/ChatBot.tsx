
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hello! I am your EtsyBooster assistant. How can I help you optimize your shop today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithAssistant(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-[380px] h-[550px] bg-white border border-[#e9d9ce] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
          <header className="p-4 bg-[#f97415] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div>
                <p className="font-bold text-sm">Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 bg-green-400 rounded-full"></span>
                  <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#fcfaf8]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-[#f97415] text-white rounded-br-none' 
                    : 'bg-white border border-[#e9d9ce] text-slate-700 rounded-bl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#e9d9ce] p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                  <div className="size-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="size-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                  <div className="size-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-[#e9d9ce] flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 border-none bg-slate-100 rounded-lg text-sm px-4 focus:ring-1 focus:ring-[#f97415]"
            />
            <button 
              onClick={handleSend}
              className="size-10 bg-[#f97415] text-white rounded-lg flex items-center justify-center hover:bg-orange-600 transition-all shadow-md shadow-[#f97415]/20"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="size-14 bg-[#f97415] text-white rounded-full shadow-xl shadow-[#f97415]/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        >
          <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">chat</span>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
