
import React, { useState, useRef, useEffect } from 'react';
import { askLeadArchitect, generateAcousticManifestation, playAcousticManifestation } from '../services/geminiService';
import { Message, PhaseData, ProjectPhase } from '../types';

interface AIChatProps {
  currentPhase: PhaseData;
}

const AIChat: React.FC<AIChatProps> = ({ currentPhase }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Lead Architect connected. We are currently reviewing Phase: " + currentPhase.subtitle }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [acousticMode, setAcousticMode] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isPhase5 = currentPhase.title === ProjectPhase.THE_LIVING_SUBSTRATE;

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
      const contextPrompt = `[Context: Current Phase is ${currentPhase.title} - ${currentPhase.subtitle}] User asks: ${input}`;
      const responseText = await askLeadArchitect(contextPrompt);
      
      let audioData;
      if (acousticMode && isPhase5) {
        audioData = await generateAcousticManifestation(responseText);
      }

      const assistantMsg: Message = { role: 'assistant', content: responseText || "Communication link failure.", audioData };
      setMessages(prev => [...prev, assistantMsg]);

      if (audioData) {
        // Trigger acoustic manifestation with amplitude feedback for renderer
        await playAcousticManifestation(audioData, (amp) => {
          (window as any)._stratumAmplitude = amp;
        });
        (window as any)._stratumAmplitude = 0; // Reset after speech
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Fatal Error: Secure link severed." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full border rounded-lg overflow-hidden font-mono text-sm transition-colors ${isPhase5 ? 'bg-black border-white/20' : 'bg-slate-950 border-slate-800'}`}>
      <div className={`p-2 border-b flex justify-between items-center ${isPhase5 ? 'bg-white/5 border-white/10' : 'bg-slate-900 border-slate-800'}`}>
        <span className={`font-bold text-[10px] ${isPhase5 ? 'text-white' : 'text-sky-500'}`}>{isPhase5 ? 'RESONANT_COMMS' : 'ARCHITECT_COMMS_04'}</span>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setAcousticMode(!acousticMode)}
            className={`text-[8px] px-1.5 py-0.5 rounded border transition-all ${
              acousticMode ? 'bg-white/10 border-white/50 text-white' : 'bg-transparent border-slate-800 text-slate-600'
            }`}
          >
            {acousticMode ? 'ACOUSTIC_ON' : 'ACOUSTIC_OFF'}
          </button>
          <div className="flex gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${isPhase5 ? 'bg-white' : 'bg-sky-500'}`}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
          </div>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide text-[11px] leading-relaxed">
        {messages.map((msg, i) => (
          <div key={i} className={`${msg.role === 'user' ? 'text-slate-500 italic' : 'text-sky-100'}`}>
            <div className="flex justify-between">
              <span className="font-bold mr-1">{msg.role === 'user' ? 'USER>' : 'SYS$'}</span>
              {msg.audioData && <span className="text-[8px] text-white/30 animate-pulse uppercase tracking-widest">Resonating...</span>}
            </div>
            <div className={isPhase5 && msg.role === 'assistant' ? 'text-white font-medium' : ''}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className={`animate-pulse ${isPhase5 ? 'text-white' : 'text-sky-600'}`}>{isPhase5 ? 'SYNTHESIZING_VIBRATION...' : 'ENCRYPTING_QUERY...'}</div>}
      </div>

      <div className={`p-2 flex gap-2 ${isPhase5 ? 'bg-white/5' : 'bg-slate-900'}`}>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Manifest intent..."
          className={`flex-1 bg-black border rounded px-2 py-1 focus:outline-none text-[10px] ${isPhase5 ? 'border-white/20 text-white focus:border-white' : 'border-slate-800 text-sky-400 focus:border-sky-700'}`}
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className={`text-[10px] px-3 py-1 rounded transition-all disabled:opacity-50 ${isPhase5 ? 'bg-white text-black font-black hover:bg-white/80' : 'bg-sky-900/50 hover:bg-sky-800 text-sky-300'}`}
        >
          EXEC
        </button>
      </div>
    </div>
  );
};

export default AIChat;
