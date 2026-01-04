
import React, { useState, useEffect } from 'react';
import { WORLD_LAYERS } from '../constants';
import { WorldLayer } from '../types';

const WorldModelInspector: React.FC = () => {
  const [activeLayers, setActiveLayers] = useState<WorldLayer[]>(WORLD_LAYERS);
  const [simulationPulse, setSimulationPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulationPulse(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const toggleLayer = (id: string) => {
    setActiveLayers(prev => prev.map(l => 
      l.id === id ? { ...l, opacity: l.opacity === 0 ? 1 : 0 } : l
    ));
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-full shadow-2xl group">
      <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <span className="text-[10px] font-mono text-sky-500 font-black uppercase tracking-widest">World_Model_Layering</span>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
          <span className="text-[8px] text-slate-500 font-mono">STREAMS_ACTIVE</span>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-8 bg-black/40 overflow-hidden">
        {/* The Isometric Stack */}
        <div className="relative w-full h-full max-h-[300px] flex flex-col items-center justify-center perspective-[1000px]">
          {activeLayers.map((layer, idx) => (
            <div
              key={layer.id}
              className="absolute w-64 h-32 border border-sky-500/20 transition-all duration-700 ease-out preserve-3d"
              style={{
                transform: `rotateX(60deg) rotateZ(-45deg) translateY(${idx * -40}px)`,
                opacity: layer.opacity,
                backgroundColor: `${layer.color}10`,
                borderColor: layer.color,
                zIndex: 10 - idx
              }}
            >
              {/* Animated scanning line for the active layer */}
              <div 
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ opacity: 0.3 }}
              >
                 <div 
                  className="absolute w-full h-[1px] bg-sky-400 shadow-[0_0_10px_#0ea5e9] animate-[scan_4s_linear_infinite]"
                  style={{ top: `${(simulationPulse + idx * 25) % 100}%` }}
                 ></div>
              </div>

              {/* Layer Metadata Label (Floating beside) */}
              <div 
                className="absolute -right-24 top-0 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ transform: 'rotateZ(45deg) rotateX(-60deg)' }}
              >
                <span className="text-[8px] font-mono text-slate-500 bg-black/80 px-2 py-0.5 border border-slate-800 rounded-full flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: layer.color }}></div>
                  {layer.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Sync Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between">
           <div className="flex flex-col gap-1">
              <span className="text-[8px] text-slate-600 font-mono uppercase tracking-tighter">Sync_Latency</span>
              <span className="text-[10px] text-emerald-500 font-black font-mono">0.42ms <span className="text-[8px] text-slate-600">±0.02</span></span>
           </div>
           <div className="flex flex-col gap-1 items-end">
              <span className="text-[8px] text-slate-600 font-mono uppercase tracking-tighter">Consistency_Score</span>
              <div className="flex gap-0.5">
                 {[1,2,3,4,5].map(i => <div key={i} className={`w-1 h-2 rounded-sm ${i < 5 ? 'bg-sky-500' : 'bg-slate-800'}`}></div>)}
              </div>
           </div>
        </div>
      </div>

      {/* Layer Control Panel */}
      <div className="p-3 bg-slate-900/30 border-t border-slate-800 grid grid-cols-2 gap-2">
        {activeLayers.map(layer => (
          <button
            key={layer.id}
            onClick={() => toggleLayer(layer.id)}
            className={`flex items-center gap-2 px-2 py-1.5 rounded border transition-all ${
              layer.opacity > 0 
                ? 'bg-slate-900 border-slate-700 text-slate-300' 
                : 'bg-black/20 border-slate-900 text-slate-600 opacity-50'
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: layer.color }}></div>
            <span className="text-[9px] font-black uppercase truncate">{layer.id}</span>
          </button>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}} />
    </div>
  );
};

export default WorldModelInspector;
