
import React, { useState, useRef, useEffect } from 'react';
import { askLeadArchitect } from '../services/geminiService';
import { Message, PhaseData } from '../types';

interface AIChatProps {
  currentPhase: PhaseData;
}

const AIChat: React.FC<AIChatProps> = ({ currentPhase }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Lead Architect connected. We are currently reviewing Phase: " + currentPhase.subtitle }
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

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Inject current phase context into the prompt
      const contextPrompt = `[Context: Current Phase is ${currentPhase.title} - ${currentPhase.subtitle}] User asks: ${input}`;
      const response = await askLeadArchitect(contextPrompt);
      setMessages(prev => [...prev, { role: 'assistant', content: response || "Communication link failure." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Fatal Error: Secure link severed." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden font-mono text-sm">
      <div className="bg-slate-900 p-2 border-b border-slate-800 flex justify-between items-center">
        <span className="text-sky-500 font-bold text-[10px]">ARCHITECT_COMMS_04</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide text-[11px] leading-relaxed">
        {messages.map((msg, i) => (
          <div key={i} className={`${msg.role === 'user' ? 'text-slate-500 italic' : 'text-sky-100'}`}>
            <span className="font-bold mr-1">{msg.role === 'user' ? 'USER>' : 'SYS$'}</span>
            {msg.content}
          </div>
        ))}
        {loading && <div className="animate-pulse text-sky-600">ENCRYPTING_QUERY...</div>}
      </div>

      <div className="p-2 bg-slate-900 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="System command..."
          className="flex-1 bg-black border border-slate-800 rounded px-2 py-1 focus:outline-none focus:border-sky-700 text-sky-400 text-[10px]"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-sky-900/50 hover:bg-sky-800 text-sky-300 text-[10px] px-3 py-1 rounded transition-all disabled:opacity-50"
        >
          EXEC
        </button>
      </div>
    </div>
  );
};

export default AIChat;
