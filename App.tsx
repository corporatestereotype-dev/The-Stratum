
import React, { useState } from 'react';
import { PHASES } from './constants';
import { PhaseData, ProjectPhase, RenderMode } from './types';
import KnowledgeTopology from './components/KnowledgeTopology';
import WorldModelInspector from './components/WorldModelInspector';
import SvdagTraversalVisualizer from './components/SvdagTraversalVisualizer';
import MolecularMatrixRenderer from './components/MolecularMatrixRenderer';
import EntropyEngineRenderer from './components/EntropyEngineRenderer';
import AgencySensoriumRenderer from './components/AgencySensoriumRenderer';
import OpticalRealityRenderer from './components/OpticalRealityRenderer';
import LivingSubstrateRenderer from './components/LivingSubstrateRenderer';
import AIChat from './components/AIChat';
import SystemTelemetry from './components/SystemTelemetry';

const App: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<PhaseData>(PHASES[0]);
  const [renderMode, setRenderMode] = useState<RenderMode>('INTEGRATED');

  const isPhase1 = selectedPhase.title === ProjectPhase.MOLECULAR_MATRIX;
  const isPhase2 = selectedPhase.title === ProjectPhase.ENTROPY_ENGINE;
  const isPhase3 = selectedPhase.title === ProjectPhase.ZERO_STATE_MIND;
  const isPhase4 = selectedPhase.title === ProjectPhase.OPTICAL_REALITY;
  const isPhase5 = selectedPhase.title === ProjectPhase.THE_LIVING_SUBSTRATE;

  const getThemeColor = () => {
    if (isPhase5) return 'white';
    if (isPhase4) return 'amber';
    if (isPhase3) return 'emerald';
    if (isPhase2) return 'rose';
    return 'sky';
  };

  const theme = getThemeColor();

  return (
    <div className={`min-h-screen ${isPhase5 ? 'bg-black' : 'bg-[#010409]'} blueprint-bg flex flex-col font-sans selection:bg-sky-500/30`}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[100] bg-[length:100%_2px,3px_100%]"></div>

      <header className={`border-b ${isPhase5 ? 'border-white/10 bg-black/90' : 'border-slate-800 bg-slate-950/90'} backdrop-blur-xl sticky top-0 z-50 transition-colors`}>
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
               <div className={`absolute inset-0 blur-md opacity-20 group-hover:opacity-40 transition-opacity ${
                 theme === 'white' ? 'bg-white' : theme === 'amber' ? 'bg-amber-500' : theme === 'emerald' ? 'bg-emerald-500' : theme === 'rose' ? 'bg-rose-500' : 'bg-sky-500'
               }`}></div>
               <div className={`relative w-8 h-8 rounded flex items-center justify-center font-mono font-black text-slate-950 text-xl border transition-all ${
                 theme === 'white' ? 'bg-white border-white' : 
                 theme === 'amber' ? 'bg-amber-600 border-amber-400' : 
                 theme === 'emerald' ? 'bg-emerald-600 border-emerald-400' : 
                 theme === 'rose' ? 'bg-rose-600 border-rose-400' : 
                 'bg-sky-600 border-sky-400'
               }`}>
                Σ
              </div>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-[0.2em] text-white uppercase flex items-center gap-2">
                The Stratum
                <span className={`text-[10px] font-mono font-normal ${
                  theme === 'white' ? 'text-white/80' : 
                  theme === 'amber' ? 'text-amber-500' : 
                  theme === 'emerald' ? 'text-emerald-500' : 
                  theme === 'rose' ? 'text-rose-500' : 
                  'text-sky-500'
                }`}>{isPhase5 ? 'FINAL_SYNTHESIS' : 'v1.2_BETA'}</span>
              </h1>
              <p className="text-[8px] text-slate-500 font-mono tracking-widest uppercase">Systemic Architecture Interface</p>
            </div>
          </div>
          <div className="hidden md:flex gap-6 items-center">
             <div className="h-6 w-px bg-slate-800"></div>
             <div className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
               COORD: <span className={
                 theme === 'white' ? 'text-cyan-400' : theme === 'amber' ? 'text-amber-500' : theme === 'emerald' ? 'text-emerald-500' : 'text-sky-500'
               }>45.092 / -122.341</span>
             </div>
             <div className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
               STATUS: <span className={isPhase5 ? 'text-white font-black' : 'text-emerald-500'}>CONVERGED_SYNTHESIS</span>
             </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 flex-1 max-w-[1600px]">
        <aside className="w-full lg:w-80 flex flex-col gap-4">
          <div className={`${isPhase5 ? 'bg-white/5 border-white/20' : 'bg-slate-950/60 border-slate-800'} border rounded-lg p-2 transition-colors`}>
            <h2 className="text-[10px] font-mono text-slate-600 uppercase px-2 mb-2 tracking-widest">Phase_Registry</h2>
            <div className="space-y-1">
              {PHASES.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase)}
                  className={`w-full text-left px-4 py-3 rounded border transition-all duration-300 relative overflow-hidden group ${
                    selectedPhase.id === phase.id
                      ? theme === 'white' ? 'bg-white/10 border-white text-white' :
                        theme === 'amber' ? 'bg-amber-500/5 border-amber-500/50 text-amber-400' : 
                        theme === 'emerald' ? 'bg-emerald-500/5 border-emerald-500/50 text-emerald-400' : 
                        theme === 'rose' ? 'bg-rose-500/5 border-rose-500/50 text-rose-400' : 
                        'bg-sky-500/5 border-sky-500/50 text-sky-400'
                      : 'bg-transparent border-slate-800/50 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {selectedPhase.id === phase.id && (
                    <div className={`absolute left-0 top-0 bottom-0 w-0.5 shadow-[0_0_10px] ${
                      theme === 'white' ? 'bg-white shadow-white' : 
                      theme === 'amber' ? 'bg-amber-500 shadow-amber-500' : 
                      theme === 'emerald' ? 'bg-emerald-500 shadow-emerald-500' : 
                      theme === 'rose' ? 'bg-rose-500 shadow-rose-500' : 
                      'bg-sky-500 shadow-sky-500'
                    }`}></div>
                  )}
                  <div className="text-[9px] font-mono opacity-60 mb-1">{phase.title.split(':')[0]}</div>
                  <div className="font-bold text-xs uppercase tracking-wider">{phase.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          <SystemTelemetry currentPhase={selectedPhase} />

          <div className="flex-1 min-h-[300px]">
            <AIChat currentPhase={selectedPhase} />
          </div>
        </aside>

        <section className="flex-1 flex flex-col gap-6">
          {/* Main Integrated Viewport */}
          <div className="h-[400px] xl:h-[500px] relative group/viewport">
             {isPhase5 ? (
               <LivingSubstrateRenderer />
             ) : isPhase4 ? (
               <OpticalRealityRenderer />
             ) : isPhase3 ? (
               <AgencySensoriumRenderer />
             ) : isPhase2 ? (
               <EntropyEngineRenderer mode={renderMode} />
             ) : (
               <MolecularMatrixRenderer />
             )}
             
             {/* Render Mode Selector (Only in Phase 2) */}
             {isPhase2 && (
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-slate-800 p-1 rounded-full flex gap-1 z-30 shadow-2xl backdrop-blur-md opacity-0 group-hover/viewport:opacity-100 transition-opacity">
                  {(['GEOMETRY', 'THERMAL', 'STRESS', 'INTEGRATED'] as RenderMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setRenderMode(mode)}
                      className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest transition-all ${
                        renderMode === mode ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
               </div>
             )}
          </div>

          <div className={`${isPhase5 ? 'bg-black border-white/10' : 'bg-slate-950 border-slate-800'} border rounded-xl overflow-hidden flex flex-col min-h-[600px] transition-colors`}>
            <div className={`${isPhase5 ? 'bg-white/5 border-white/10' : 'bg-slate-900/50 border-slate-800'} p-6 border-b flex justify-between items-center transition-colors`}>
              <div>
                <span className={`text-[10px] font-mono bg-opacity-10 px-2 py-1 rounded border uppercase tracking-widest font-bold ${
                  theme === 'white' ? 'text-white bg-white border-white/40' :
                  theme === 'amber' ? 'text-amber-500 bg-amber-500 border-amber-500/20' :
                  theme === 'emerald' ? 'text-emerald-500 bg-emerald-500 border-emerald-500/20' : 
                  theme === 'rose' ? 'text-rose-500 bg-rose-500 border-rose-500/20' : 
                  'text-sky-500 bg-sky-500 border-sky-500/20'
                }`}>{selectedPhase.title}</span>
                <h2 className="text-2xl font-black text-white mt-2 tracking-tight uppercase">{selectedPhase.subtitle}</h2>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-500 mb-1 uppercase tracking-tighter font-bold">Target Platform</div>
                <div className="text-xs font-black text-slate-300 uppercase tracking-wide">{selectedPhase.platform}</div>
              </div>
            </div>

            <div className="flex-1 grid md:grid-cols-12 gap-px bg-slate-800">
              <div className={`${isPhase5 ? 'bg-black' : 'bg-slate-950'} md:col-span-4 p-6 space-y-8 overflow-y-auto max-h-[800px] scrollbar-hide border-r border-slate-800 transition-colors`}>
                <section>
                   <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 font-bold">
                     <span className={`w-4 h-[1px] ${
                       theme === 'white' ? 'bg-white' : theme === 'amber' ? 'bg-amber-500' : theme === 'emerald' ? 'bg-emerald-500' : theme === 'rose' ? 'bg-rose-500' : 'bg-sky-500'
                     }`}></span> Architectural_Context
                   </h3>
                   <p className="text-sm text-slate-400 leading-relaxed font-medium">
                     {selectedPhase.context}
                   </p>
                </section>

                <section>
                   <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2 font-bold">
                     <span className={`w-4 h-[1px] ${
                       theme === 'white' ? 'bg-white' : theme === 'amber' ? 'bg-amber-500' : theme === 'emerald' ? 'bg-emerald-500' : theme === 'rose' ? 'bg-rose-500' : 'bg-sky-500'
                     }`}></span> Implementation_Specs
                   </h3>
                   <div className="space-y-4">
                     {selectedPhase.requirements.map((req, idx) => (
                       <div key={idx} className="group">
                         <h4 className={`text-xs font-black uppercase tracking-wide mb-2 transition-colors ${
                           theme === 'white' ? 'text-white group-hover:text-cyan-400' :
                           theme === 'amber' ? 'text-amber-300 group-hover:text-amber-400' :
                           theme === 'emerald' ? 'text-emerald-300 group-hover:text-emerald-400' : 
                           theme === 'rose' ? 'text-rose-300 group-hover:text-rose-400' : 
                           'text-sky-300 group-hover:text-sky-400'
                         }`}>{req.title}</h4>
                         <ul className="space-y-2 border-l border-slate-800 pl-4">
                           {req.details.map((detail, dIdx) => (
                             <li key={dIdx} className="text-[11px] text-slate-500 font-mono">
                               <span className={`${
                                 theme === 'white' ? 'text-white/40' :
                                 theme === 'amber' ? 'text-amber-700' : 
                                 theme === 'emerald' ? 'text-emerald-700' : 
                                 theme === 'rose' ? 'text-rose-700' : 
                                 'text-sky-700'
                               } mr-2`}>/</span> {detail}
                             </li>
                           ))}
                         </ul>
                       </div>
                     ))}
                   </div>
                </section>

                <section className={`${
                  theme === 'white' ? 'bg-white/5 border-white/20' :
                  theme === 'amber' ? 'bg-amber-500/5 border-amber-500/20' :
                  theme === 'emerald' ? 'bg-emerald-500/5 border-emerald-500/20' : 
                  theme === 'rose' ? 'bg-rose-500/5 border-rose-500/20' : 
                  'bg-sky-500/5 border-sky-500/20'
                } border p-4 rounded-lg transition-colors`}>
                   <h3 className={`text-[10px] font-mono ${
                     theme === 'white' ? 'text-white font-black' :
                     theme === 'amber' ? 'text-amber-400' : 
                     theme === 'emerald' ? 'text-emerald-400' : 
                     theme === 'rose' ? 'text-rose-400' : 
                     'text-sky-400'
                   } uppercase tracking-widest mb-4 flex items-center gap-2 font-black`}>
                     <span className={`w-4 h-[1px] ${
                       theme === 'white' ? 'bg-white' : 
                       theme === 'amber' ? 'bg-amber-400' : 
                       theme === 'emerald' ? 'bg-emerald-400' : 
                       theme === 'rose' ? 'bg-rose-400' : 
                       'bg-sky-400'
                     }`}></span> Systemic_Interlinks
                   </h3>
                   <div className="space-y-3">
                     {selectedPhase.interlinks.map((link, idx) => (
                       <div key={idx} className={`border-b ${
                         theme === 'white' ? 'border-white/10' :
                         theme === 'amber' ? 'border-amber-500/10' : 
                         theme === 'emerald' ? 'border-emerald-500/10' : 
                         theme === 'rose' ? 'border-rose-500/10' : 
                         'border-sky-500/10'
                       } pb-2 last:border-0`}>
                          <div className="flex justify-between items-center mb-1">
                             <span className={`text-[10px] font-black ${
                               theme === 'white' ? 'text-white' : 
                               theme === 'amber' ? 'text-amber-200' : 
                               theme === 'emerald' ? 'text-emerald-200' : 
                               theme === 'rose' ? 'text-rose-200' : 
                               'text-sky-200'
                             } uppercase`}>{link.concept}</span>
                             <span className={`text-[9px] font-mono ${
                               theme === 'white' ? 'text-cyan-600' : 
                               theme === 'amber' ? 'text-amber-600' : 
                               theme === 'emerald' ? 'text-emerald-600' : 
                               theme === 'rose' ? 'text-rose-600' : 
                               'text-sky-600'
                             } font-bold`}>{link.targetPhase}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-snug">{link.description}</p>
                       </div>
                     ))}
                   </div>
                </section>
                
                <div className="pt-6 border-t border-slate-800">
                   <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 font-bold">Benchmark_KPIs</h3>
                   <div className="grid grid-cols-1 gap-2">
                     {selectedPhase.kpis.map((kpi, idx) => (
                       <div key={idx} className={`flex items-center gap-3 ${isPhase5 ? 'bg-white/5 border-white/10' : 'bg-slate-900/40 border-slate-800/50'} p-2 rounded border transition-colors`}>
                         <div className={`w-1 h-1 ${
                           theme === 'white' ? 'bg-white' : theme === 'amber' ? 'bg-amber-500' : theme === 'emerald' ? 'bg-emerald-500' : theme === 'rose' ? 'bg-rose-500' : 'bg-sky-500'
                         } rounded-full`}></div>
                         <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{kpi}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              <div className="md:col-span-8 bg-[#020617] flex flex-col">
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-px bg-slate-800 h-[60%]">
                   <div className={`${isPhase5 ? 'bg-black' : 'bg-slate-950'} p-6 flex flex-col transition-colors`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">SVDAG_Traversal_Viewport</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-0.5 bg-sky-500"></div>
                          <div className="w-2 h-0.5 bg-slate-800"></div>
                        </div>
                      </div>
                      <SvdagTraversalVisualizer />
                   </div>

                   <div className={`${isPhase5 ? 'bg-black' : 'bg-slate-950'} p-6 flex flex-col transition-colors`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">World_Model_Layering</span>
                        <div className="flex gap-1">
                          <div className={`w-2 h-0.5 ${
                            theme === 'white' ? 'bg-white' : theme === 'amber' ? 'bg-amber-500' : theme === 'emerald' ? 'bg-emerald-500' : theme === 'rose' ? 'bg-rose-500' : 'bg-sky-500'
                          }`}></div>
                          <div className="w-2 h-0.5 bg-slate-800"></div>
                        </div>
                      </div>
                      <WorldModelInspector />
                   </div>
                </div>

                <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-px bg-slate-800">
                  <div className={`${isPhase5 ? 'bg-black' : 'bg-slate-950'} p-6 flex flex-col transition-colors`}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Knowledge_Topology_Map</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-0.5 bg-emerald-500"></div>
                        <div className="w-2 h-0.5 bg-slate-800"></div>
                      </div>
                    </div>
                    <KnowledgeTopology currentPhase={selectedPhase} />
                  </div>

                  <div className={`${isPhase5 ? 'bg-black' : 'bg-slate-950'} p-4 font-mono text-[11px] overflow-hidden group transition-colors`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`${isPhase5 ? 'text-white' : 'text-sky-600'} uppercase text-[9px] font-bold`}>Gist_Artifact // {selectedPhase.codeSnippet.language}</span>
                      <button className="text-slate-600 hover:text-sky-500 transition-colors uppercase text-[9px] font-bold">COPY_SNIPPET</button>
                    </div>
                    <pre className={`${isPhase5 ? 'bg-white/5 border-white/10' : 'bg-black/40 border-slate-900'} text-sky-100/70 p-4 rounded leading-5 h-full overflow-x-auto scrollbar-hide border transition-colors`}>
                      <code>{selectedPhase.codeSnippet.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${isPhase5 ? 'bg-black border-white/20' : 'bg-slate-950 border-slate-800'} border p-2 rounded-lg flex flex-wrap gap-4 justify-between items-center px-6 transition-colors`}>
             <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-600 uppercase font-mono font-bold tracking-tighter">Sync_State</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    theme === 'white' ? 'text-white' : theme === 'amber' ? 'text-amber-500' : 'text-emerald-500'
                  }`}>{isPhase5 ? 'STEADY_CONVERGENCE' : 'Active'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-600 uppercase font-mono font-bold tracking-tighter">Buffer_Capacity</span>
                  <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">{isPhase5 ? 'AUTO-EXPANDING' : '98.2%'}</span>
                </div>
                {isPhase5 && (
                   <div className="flex flex-col">
                    <span className="text-[8px] text-slate-600 uppercase font-mono font-bold tracking-tighter">Co-Evolution_Index</span>
                    <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">0.9982 Φ</span>
                  </div>
                )}
             </div>
             <div className="text-[9px] font-mono text-slate-600 italic uppercase tracking-tighter">
               System blueprint authorized for internal use only. Stratum Engine (c) 2025.
             </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
