import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, MessageSquare } from 'lucide-react';
import { getStylistAdvice } from '../services/gemini';

const AIStylist: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Bonjour! I am Kawai Stylist, your personal stylist. Looking for an outfit for a special event?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const advice = await getStylistAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: advice }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl mb-4 overflow-hidden border border-stone-100 fade-in flex flex-col max-h-[500px]">
          <div className="bg-stone-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-rose-400" />
              <h3 className="font-serif font-bold">Kawai Stylist</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-rose-500 text-white rounded-br-none' : 'bg-white border border-stone-200 text-stone-700 rounded-bl-none shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-stone-400 italic ml-2">Kawai is thinking...</div>}
          </div>

          <div className="p-3 bg-white border-t border-stone-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for fashion advice..."
              className="flex-1 bg-stone-50 border border-stone-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-rose-300"
            />
            <button onClick={handleSend} disabled={loading} className="p-2 bg-stone-900 text-white rounded-full hover:bg-stone-700 transition disabled:opacity-50">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 bg-stone-900 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all duration-300 hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} className="animate-pulse" />}
        {!isOpen && (
            <span className="absolute right-full mr-4 bg-white text-stone-800 px-3 py-1 rounded-lg text-xs font-semibold shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Chat with AI Stylist
            </span>
        )}
      </button>
    </div>
  );
};

export default AIStylist;
