
import React, { useState } from 'react';
import { PHASES } from './constants';
import { PhaseData } from './types';
import VoxelVisualizer from './components/VoxelVisualizer';
import AIChat from './components/AIChat';
import SystemTelemetry from './components/SystemTelemetry';

const App: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<PhaseData>(PHASES[0]);

  return (
    <div className="min-h-screen bg-[#010409] blueprint-bg flex flex-col font-sans selection:bg-sky-500/30">
      {/* Decorative Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[100] bg-[length:100%_2px,3px_100%]"></div>

      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
               <div className="absolute inset-0 bg-sky-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
               <div className="relative w-8 h-8 bg-sky-600 rounded flex items-center justify-center font-mono font-black text-slate-950 text-xl border border-sky-400">
                Σ
              </div>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-[0.2em] text-white uppercase flex items-center gap-2">
                The Stratum
                <span className="text-[10px] text-sky-500 font-mono font-normal">v1.2_BETA</span>
              </h1>
              <p className="text-[8px] text-slate-500 font-mono tracking-widest uppercase">Systemic Architecture Interface</p>
            </div>
          </div>
          <div className="hidden md:flex gap-6 items-center">
             <div className="h-6 w-px bg-slate-800"></div>
             <div className="text-[9px] font-mono text-slate-500">
               COORD: <span className="text-sky-500">45.092 / -122.341</span>
             </div>
             <div className="text-[9px] font-mono text-slate-500">
               STATUS: <span className="text-emerald-500">NOMINAL_OP</span>
             </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 flex-1 max-w-[1600px]">
        {/* Navigation / Left Panel */}
        <aside className="w-full lg:w-80 flex flex-col gap-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2">
            <h2 className="text-[10px] font-mono text-slate-600 uppercase px-2 mb-2 tracking-widest">Phase_Registry</h2>
            <div className="space-y-1">
              {PHASES.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase)}
                  className={`w-full text-left px-4 py-3 rounded border transition-all duration-300 relative overflow-hidden group ${
                    selectedPhase.id === phase.id
                      ? 'bg-sky-500/5 border-sky-500/50 text-sky-400'
                      : 'bg-transparent border-slate-800/50 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {selectedPhase.id === phase.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-sky-500 shadow-[0_0_10px_#0ea5e9]"></div>
                  )}
                  <div className="text-[9px] font-mono opacity-60 mb-1">{phase.title.split(':')[0]}</div>
                  <div className="font-bold text-xs uppercase tracking-wider">{phase.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          <SystemTelemetry />

          <div className="flex-1 min-h-[300px]">
            <AIChat currentPhase={selectedPhase} />
          </div>
        </aside>

        {/* Central Dashboard Area */}
        <section className="flex-1 flex flex-col gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[600px]">
            {/* Phase Header */}
            <div className="bg-slate-900/50 p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-sky-500 bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20">{selectedPhase.title}</span>
                <h2 className="text-2xl font-black text-white mt-2 tracking-tight uppercase">{selectedPhase.subtitle}</h2>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-500 mb-1 uppercase">Target Target Platform</div>
                <div className="text-xs font-bold text-slate-300">{selectedPhase.platform}</div>
              </div>
            </div>

            <div className="flex-1 grid md:grid-cols-12 gap-px bg-slate-800">
              {/* Left Column: Details */}
              <div className="md:col-span-5 bg-slate-950 p-6 space-y-6 overflow-y-auto max-h-[700px]">
                <section>
                   <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <span className="w-4 h-[1px] bg-sky-500"></span> Architectural_Context
                   </h3>
                   <p className="text-sm text-slate-400 leading-relaxed font-medium">
                     {selectedPhase.context}
                   </p>
                </section>

                <section>
                   <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <span className="w-4 h-[1px] bg-sky-500"></span> Implementation_Specs
                   </h3>
                   <div className="space-y-4">
                     {selectedPhase.requirements.map((req, idx) => (
                       <div key={idx} className="group">
                         <h4 className="text-xs font-black text-sky-300 uppercase tracking-wide mb-2 group-hover:text-sky-400 transition-colors">{req.title}</h4>
                         <ul className="space-y-2 border-l border-slate-800 pl-4">
                           {req.details.map((detail, dIdx) => (
                             <li key={dIdx} className="text-[11px] text-slate-500 font-mono">
                               <span className="text-sky-700 mr-2">/</span> {detail}
                             </li>
                           ))}
                         </ul>
                       </div>
                     ))}
                   </div>
                </section>
                
                <div className="pt-6 border-t border-slate-800">
                   <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Benchmark_KPIs</h3>
                   <div className="grid grid-cols-1 gap-2">
                     {selectedPhase.kpis.map((kpi, idx) => (
                       <div key={idx} className="flex items-center gap-3 bg-slate-900/40 p-2 rounded border border-slate-800/50">
                         <div className="w-1 h-1 bg-sky-500 rounded-full"></div>
                         <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{kpi}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              {/* Right Column: Code & Visual */}
              <div className="md:col-span-7 bg-[#020617] flex flex-col">
                <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Interactive_Simulation</span>
                  <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                  </div>
                </div>
                
                <div className="p-6">
                  <VoxelVisualizer />
                </div>

                <div className="flex-1 bg-slate-950 p-4 font-mono text-[11px] border-t border-slate-800 overflow-hidden group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sky-600 uppercase text-[9px]">Gist_Artifact // {selectedPhase.codeSnippet.language}</span>
                    <button className="text-slate-600 hover:text-sky-500 transition-colors">COPY_SNIPPET</button>
                  </div>
                  <pre className="text-sky-100/70 p-4 rounded bg-black/40 border border-slate-900 leading-5 overflow-x-auto">
                    <code>{selectedPhase.codeSnippet.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Footer stats bar */}
          <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg flex flex-wrap gap-4 justify-between items-center px-6">
             <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-600 uppercase font-mono">Sync_State</span>
                  <span className="text-[10px] text-emerald-500 font-black uppercase">Active</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-600 uppercase font-mono">Buffer_Capacity</span>
                  <span className="text-[10px] text-slate-300 font-black uppercase">98.2%</span>
                </div>
             </div>
             <div className="text-[9px] font-mono text-slate-600 italic">
               System blueprint authorized for internal use only. Stratum Engine (c) 2025.
             </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
