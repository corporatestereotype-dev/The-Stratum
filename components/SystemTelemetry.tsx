
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  YAxis, 
  XAxis, 
  Tooltip, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  RadialBarChart, 
  RadialBar,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { PhaseData, ProjectPhase } from '../types';

interface TelemetryPoint {
  time: string;
  load: number;
  depth: number;
  completionRate: number;
  heap: number;
  temp: number;
  resonance: number;
}

interface Agent {
  id: string;
  designation: string;
  class: 'SCOUT' | 'ENGINEER' | 'SENTINEL';
  currentTask: string;
  taskProgress: number;
  taskETC: number; 
  taskThreadAffinity: number;
  load: number;
  memory: number;
  efficiency: number;
  efficiencyHistory: number[];
}

interface WorkerJob {
  id: string;
  name: string;
  agentId: string;
  thread: number;
  progress: number;
  duration: number; 
  cpuUsage: number;
  memUsage: number;
  priority: 'HIGH' | 'MED' | 'LOW';
}

interface SystemTelemetryProps {
  currentPhase: PhaseData;
}

const StatTooltip: React.FC<{ label: string; description: string; children: React.ReactNode }> = ({ label, description, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div 
      className="relative group cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute z-[100] bottom-full left-0 mb-2 w-48 bg-slate-900 border border-white/50 p-2 rounded shadow-2xl backdrop-blur-md pointer-events-none text-left">
          <div className="text-[10px] font-bold text-white mb-1 uppercase tracking-tighter">{label}</div>
          <div className="text-[9px] text-slate-300 leading-tight">{description}</div>
          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-900 border-r border-b border-white/50 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

const SystemTelemetry: React.FC<SystemTelemetryProps> = ({ currentPhase }) => {
  const isPhase5 = currentPhase.title === ProjectPhase.THE_LIVING_SUBSTRATE;

  const [stats, setStats] = useState({
    wasmHeap: 124.5,
    rayDepth: 64,
    activeTasks: 12,
    cpuLoad: 24,
    taskCompletionRate: 99.4,
    gpuTemp: 52,
    resonance: 0.88
  });

  const [isJobsOverlayOpen, setIsJobsOverlayOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'JOBS' | 'AGENTS' | 'ANALYTICS'>('JOBS');
  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [jobs, setJobs] = useState<WorkerJob[]>([]);
  const [history, setHistory] = useState<TelemetryPoint[]>(
    Array.from({ length: 60 }, (_, i) => ({ 
      time: `${i}`, 
      load: 20 + Math.random() * 10, 
      depth: 40 + Math.random() * 20,
      completionRate: 98 + Math.random() * 2,
      heap: 124 + Math.random() * 2,
      temp: 45 + Math.random() * 5,
      resonance: 0.8 + Math.random() * 0.1
    }))
  );

  useEffect(() => {
    const getPhaseJobs = () => {
      switch (currentPhase.title) {
        case ProjectPhase.MOLECULAR_MATRIX: return ['SVDAG_COMPACT', 'WASM_GC', 'BIT_PACKING'];
        case ProjectPhase.ENTROPY_ENGINE: return ['HEAT_DIFFUSE', 'VOXEL_COLLAPSE', 'THERMO_TICK'];
        case ProjectPhase.ZERO_STATE_MIND: return ['GOAP_PATH', 'AI_BEHAVIOR_TICK', 'HEURISTIC_SEARCH'];
        case ProjectPhase.OPTICAL_REALITY: return ['PBR_PRECOMP', 'VBO_UPDATE', 'SHADER_RECOMPILE'];
        case ProjectPhase.THE_LIVING_SUBSTRATE: return ['SEMANTIC_Z_CLUSTER', 'PRECOG_SDF_SYNC', 'SYNTRONIC_HARVEST'];
        default: return ['IDLE_PROCESS'];
      }
    };

    const interval = setInterval(() => {
      const nextDepth = Math.max(32, Math.min(128, stats.rayDepth + (Math.random() - 0.5) * 15));
      const contentionFactor = (nextDepth / 128) * 40;
      const nextLoad = Math.floor(contentionFactor + Math.random() * 20 + 10);
      const nextCompletion = isPhase5 ? 99.8 + Math.random() * 0.2 : Math.min(100, Math.max(70, 98 - (nextLoad / 5) - (nextDepth / 20)));
      const nextHeap = Math.max(120, stats.wasmHeap + (Math.random() - 0.5) * 1.5);
      const nextTemp = Math.floor(48 + (nextLoad / 6) + Math.random() * 4);
      const nextResonance = Math.min(1.0, 0.9 + (Math.sin(Date.now() / 1000) * 0.1));
      
      setStats({
        wasmHeap: nextHeap,
        rayDepth: nextDepth,
        activeTasks: (currentPhase.title === ProjectPhase.ZERO_STATE_MIND ? 15 : 8) + Math.floor(Math.random() * 8),
        cpuLoad: nextLoad,
        taskCompletionRate: nextCompletion,
        gpuTemp: nextTemp,
        resonance: nextResonance
      });

      setHistory(prev => {
        const newPoint = { 
          time: new Date().toLocaleTimeString(), 
          load: nextLoad, 
          depth: nextDepth,
          completionRate: nextCompletion,
          heap: nextHeap,
          temp: nextTemp,
          resonance: nextResonance
        };
        return [...prev.slice(1), newPoint];
      });

      const phaseSpecificJobs = getPhaseJobs();
      const agentNames = isPhase5 ? ['Phenotype-A', 'Phenotype-B', 'Phenotype-C', 'Phenotype-D', 'Phenotype-E'] : ['Alpha-9', 'Beta-4', 'Gamma-1', 'Sigma-0', 'Zeta-7'];
      const agentEfficiencyPenalty = isPhase5 ? 0 : (nextLoad / 100) * 15 + (nextDepth / 128) * 10;
      
      setAgents(prevAgents => {
        return agentNames.map((name, i) => {
          const id = `AG_0${i}`;
          const currentEfficiency = isPhase5 ? 99.9 : Math.max(40, (70 + Math.random() * 30) - agentEfficiencyPenalty);
          const prevAgent = prevAgents.find(a => a.id === id);
          const hist = prevAgent?.efficiencyHistory || Array(60).fill(currentEfficiency);
          const updatedHistory = [...hist.slice(1), currentEfficiency];

          return {
            id,
            designation: name,
            class: i % 3 === 0 ? 'SENTINEL' : (i % 3 === 1 ? 'ENGINEER' : 'SCOUT'),
            currentTask: phaseSpecificJobs[Math.floor(Math.random() * phaseSpecificJobs.length)],
            taskProgress: Math.random() * 100,
            taskETC: (Math.random() * 5000 + 500) * (1 + nextLoad / 100),
            taskThreadAffinity: i % 8,
            load: 5 + Math.random() * (nextLoad / 5),
            memory: 2 + Math.random() * 8,
            efficiency: currentEfficiency,
            efficiencyHistory: updatedHistory
          };
        });
      });

      setJobs(Array.from({ length: 12 }, (_, i) => ({
        id: `0x${(Math.random() * 0xFFF).toString(16).toUpperCase().padStart(3, '0')}`,
        name: phaseSpecificJobs[Math.floor(Math.random() * phaseSpecificJobs.length)],
        agentId: `AG_0${Math.floor(Math.random() * 5)}`,
        thread: i % 8,
        progress: Math.floor(Math.random() * 100),
        duration: (150 + Math.random() * 3000) * (1 + nextLoad / 200),
        cpuUsage: 2 + Math.random() * 12,
        memUsage: 0.2 + Math.random() * 2,
        priority: Math.random() > 0.8 ? 'HIGH' : (Math.random() > 0.5 ? 'MED' : 'LOW')
      })));

    }, 1000);
    return () => clearInterval(interval);
  }, [stats.rayDepth, stats.wasmHeap, currentPhase.title, isPhase5]);

  const completionGaugeData = useMemo(() => [
    { name: 'Completion', value: stats.taskCompletionRate, fill: isPhase5 ? '#ffffff' : '#10b981' }
  ], [stats.taskCompletionRate, isPhase5]);

  const resourceDistribution = useMemo(() => {
    return agents.map(a => ({
      name: a.designation,
      load: a.load,
      mem: a.memory
    }));
  }, [agents]);

  return (
    <div className={`border rounded-lg p-3 font-mono text-[10px] space-y-4 shadow-2xl backdrop-blur-sm relative overflow-hidden min-h-[420px] transition-colors ${isPhase5 ? 'bg-black/90 border-white/20' : 'bg-slate-950/90 border-slate-800'}`}>
      
      {isJobsOverlayOpen && (
        <div className={`absolute inset-0 z-50 backdrop-blur-md flex flex-col p-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ${isPhase5 ? 'bg-black/95' : 'bg-slate-950/95'}`}>
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-3">
              <span className={`font-bold uppercase tracking-widest text-[11px] ${isPhase5 ? 'text-white' : 'text-sky-400'}`}>{isPhase5 ? 'Ontological_Scope' : 'System_Analyzer_v2'}</span>
              <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800">
                {(['JOBS', 'AGENTS', 'ANALYTICS'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2 py-0.5 rounded text-[8px] transition-all ${
                      activeTab === tab ? (isPhase5 ? 'bg-white text-black font-bold' : 'bg-sky-500 text-slate-950 font-bold') : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setIsJobsOverlayOpen(false)}
              className="text-slate-500 hover:text-white transition-colors uppercase text-[9px] border border-slate-800 px-2 py-0.5 rounded bg-slate-900"
            >
              Exit_Interface [ESC]
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide space-y-3">
            {activeTab === 'JOBS' && (
              <div className="space-y-2">
                <div className="flex justify-between text-[8px] text-slate-500 mb-2 border-b border-slate-900 pb-1">
                  <span>MANIFEST_FOCUS: {currentPhase.subtitle}</span>
                  <span>MODE: {isPhase5 ? 'RECURSIVE_SYNTHESIS' : 'PRIORITY_DRIVEN'}</span>
                </div>
                {jobs.map(job => (
                  <div key={job.id} className="bg-slate-900/50 border border-slate-800/50 p-2.5 rounded flex flex-col gap-2 hover:border-white/30 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className={`px-1 rounded text-[7px] font-bold ${
                          job.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-500' : 
                          job.priority === 'MED' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-500/20 text-slate-500'
                        }`}>
                          {job.priority}
                        </span>
                        <span className={`${isPhase5 ? 'text-white' : 'text-sky-500'} font-bold`}>[{job.id}] <span className="text-slate-300">{job.name}</span></span>
                      </div>
                      <span className="text-[8px] text-slate-600 uppercase tracking-tighter">{isPhase5 ? 'RESONANCE_CH' : 'CORE_'}{job.thread}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 bg-black/30 p-1.5 rounded text-[8px]">
                      <div className="flex flex-col">
                        <span className="text-slate-600 uppercase mb-0.5">{isPhase5 ? 'SYNTROPY' : 'CPU_LOAD'}</span>
                        <span className={`${isPhase5 ? 'text-white' : 'text-sky-400'} font-black`}>{job.cpuUsage.toFixed(1)}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-600 uppercase mb-0.5">{isPhase5 ? 'LATENT_MEM' : 'MEM_USE'}</span>
                        <span className={`${isPhase5 ? 'text-white' : 'text-sky-400'} font-black`}>{job.memUsage.toFixed(2)}MB</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-600 uppercase mb-0.5">LIFESPAN</span>
                        <span className={`${isPhase5 ? 'text-white' : 'text-sky-400'} font-black`}>{Math.floor(job.duration)}ms</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${isPhase5 ? 'bg-white/40 group-hover:bg-white/60' : 'bg-sky-500/40 group-hover:bg-sky-500/60'}`} style={{ width: `${job.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'AGENTS' && (
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between text-[8px] text-slate-500 px-1">
                   <span>RESONANCE_GAIN: {isPhase5 ? '+1.42 Φ' : (stats.cpuLoad / 10).toFixed(1) + '%'}</span>
                   <span>PHENOTYPE_CHANNELS: 5_ACTIVE</span>
                </div>
                {agents.map(agent => (
                  <div key={agent.id} className="bg-slate-900/50 border border-slate-800/50 p-3 rounded flex flex-col gap-3 hover:border-white/40 transition-all group/agent">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isPhase5 ? 'bg-white' : (agent.efficiency > 80 ? 'bg-emerald-500' : 'bg-amber-500')} animate-pulse`}></div>
                        <span className={`${isPhase5 ? 'text-white' : 'text-sky-400'} font-black text-xs group-hover/agent:text-white`}>{agent.designation}</span>
                        <span className="text-[7px] text-slate-600 bg-slate-950 px-1 rounded border border-slate-800 uppercase tracking-tighter">{isPhase5 ? 'MANIFEST' : agent.class}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-12 h-4 opacity-60">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={agent.efficiencyHistory.map((val, idx) => ({ val, idx }))}>
                                <Line 
                                  type="monotone" 
                                  dataKey="val" 
                                  stroke={isPhase5 ? '#ffffff' : (agent.efficiency > 80 ? '#10b981' : '#f59e0b')} 
                                  strokeWidth={1} 
                                  dot={false} 
                                  isAnimationActive={false} 
                                />
                              </LineChart>
                            </ResponsiveContainer>
                         </div>
                         <span className={`${isPhase5 ? 'text-white' : (agent.efficiency > 80 ? 'text-emerald-500' : 'text-amber-500')} font-black font-mono`}>{agent.efficiency.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/30 space-y-2">
                       <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                             <span className="text-[7px] text-slate-600 uppercase tracking-widest font-bold">Phenotype_Task</span>
                             <span className="text-white font-black uppercase text-[9px] group-hover/agent:text-cyan-200 transition-colors">{agent.currentTask}</span>
                          </div>
                          <div className="text-right">
                             <span className="text-[7px] text-slate-600 uppercase font-bold">Convergence_Window</span>
                             <div className="text-white font-mono text-[9px] italic">EST: {Math.floor(agent.taskETC)}ms</div>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <div className="flex justify-between text-[7px] uppercase">
                                <span className="text-slate-500">Resonance_Footprint</span>
                                <span className="text-white font-bold">R:{stats.resonance.toFixed(2)} / L:{agent.load.toFixed(1)}%</span>
                             </div>
                             <div className="h-0.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-white/50" style={{ width: `${(agent.load / 30) * 100}%` }}></div>
                             </div>
                          </div>
                          <div className="space-y-1 text-right">
                             <span className="text-[7px] text-slate-500 uppercase block">Affinity_Mask</span>
                             <span className="text-white font-mono text-[9px]">SEMANTIC_ID: {agent.taskThreadAffinity}</span>
                          </div>
                       </div>

                       <div className="space-y-1 pt-1">
                          <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden relative shadow-inner">
                             <div className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-1000" style={{ width: `${agent.taskProgress}%` }}></div>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'ANALYTICS' && (
              <div className="space-y-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded p-2">
                  <div className="text-[9px] text-slate-500 mb-2 uppercase tracking-widest">{isPhase5 ? 'Semantic Convergence Map' : 'Load Distribution'}</div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={resourceDistribution}>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Bar dataKey="load" radius={[2, 2, 0, 0]}>
                          {resourceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={isPhase5 ? '#ffffff' : (index % 2 === 0 ? '#0ea5e9' : '#10b981')} fillOpacity={0.6} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                   <div className="bg-slate-900/50 border border-slate-800 rounded p-2 flex flex-col items-center">
                      <div className="text-[8px] text-slate-500 mb-1 font-bold">COHERENCE_RATE</div>
                      <div className="h-16 w-16">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart innerRadius="70%" outerRadius="100%" data={completionGaugeData} startAngle={90} endAngle={450}>
                              <RadialBar dataKey="value" background fill={isPhase5 ? '#ffffff' : '#10b981'} />
                            </RadialBarChart>
                         </ResponsiveContainer>
                      </div>
                      <div className={`text-[10px] font-black mt-1 ${isPhase5 ? 'text-white' : 'text-emerald-500'}`}>{stats.taskCompletionRate.toFixed(1)}%</div>
                   </div>
                   <div className="bg-slate-900/50 border border-slate-800 rounded p-2 flex flex-col justify-center gap-1">
                      <div className="text-[8px] text-slate-500 mb-1 uppercase tracking-tighter font-bold">{isPhase5 ? 'Ontological Sync' : 'Resource Contention'}</div>
                      <div className={`text-[9px] flex justify-between font-mono ${isPhase5 ? 'text-white' : 'text-sky-400'}`}>
                        <span>{isPhase5 ? 'PRECOG_LEAD:' : 'STALL_RATE:'}</span>
                        <span>{isPhase5 ? '12.4ms' : (stats.rayDepth / 200).toFixed(2) + '%'}</span>
                      </div>
                      <div className={`text-[9px] flex justify-between font-mono ${isPhase5 ? 'text-white' : 'text-sky-400'}`}>
                        <span>{isPhase5 ? 'FIELD_POTENTIAL:' : 'CPU_THROTTLE:'}</span>
                        <span>{isPhase5 ? '0.992 Φ' : (stats.cpuLoad > 40 ? 'ACTIVE' : 'OFF')}</span>
                      </div>
                      <div className={`text-[9px] flex justify-between font-mono ${isPhase5 ? 'text-white' : 'text-sky-400'}`}>
                        <span>{isPhase5 ? 'MORPH_SYNC:' : 'BUS_LATENCY:'}</span>
                        <span>{isPhase5 ? 'NOMINAL' : (stats.cpuLoad / 50).toFixed(2) + 'ms'}</span>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-2 border-t border-slate-900 text-[8px] text-slate-600 flex justify-between uppercase tracking-tighter">
            <span>ONTOLOGICAL_PROBE_v5.0.1</span>
            <span>DATA_STREAMS: {isPhase5 ? 'MANIFESTING' : '12_SYNC'}</span>
          </div>
        </div>
      )}

      {/* Main UI Header */}
      <div className={`flex justify-between items-center border-b pb-2 ${isPhase5 ? 'border-white/10' : 'border-slate-800'}`}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className={`w-2 h-2 rounded-full animate-ping absolute opacity-75 ${isPhase5 ? 'bg-white' : 'bg-sky-500'}`}></div>
            <div className={`w-2 h-2 rounded-full relative shadow-[0_0_8px_#ffffff] ${isPhase5 ? 'bg-white' : 'bg-sky-500 shadow-sky-500'}`}></div>
          </div>
          <span className={`font-black uppercase tracking-widest text-[11px] ${isPhase5 ? 'text-white' : 'text-slate-400'}`}>{isPhase5 ? 'Ontological Coherence' : 'Engine Live Telemetry'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-600 uppercase tracking-tighter">{isPhase5 ? 'REALTIME_MANIFEST' : '60s_RETAIN'}</span>
          <span className={`text-[9px] font-bold border px-1 rounded uppercase tracking-widest ${isPhase5 ? 'text-white border-white/30 bg-white/5' : 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'}`}>{isPhase5 ? 'MANIFEST' : 'STABLE'}</span>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatTooltip label={isPhase5 ? 'Semantic Load' : 'Heap Allocation'} description={isPhase5 ? 'Functional resonance clustering in the SVDAG.' : 'Current Wasm memory usage for voxel storage.'}>
          <div className={`p-2 rounded border flex justify-between items-center overflow-hidden ${isPhase5 ? 'bg-white/5 border-white/20' : 'bg-slate-900/40 border-slate-800/50'}`}>
            <div>
              <div className="text-slate-600 text-[8px] uppercase mb-0.5 font-bold">{isPhase5 ? 'Semantic_Flux' : 'Heap_Alloc'}</div>
              <div className={`${isPhase5 ? 'text-white' : 'text-sky-400'} font-black text-xs tracking-tighter`}>{isPhase5 ? stats.resonance.toFixed(3) + ' Φ' : stats.wasmHeap.toFixed(2) + ' MB'}</div>
            </div>
            <div className="w-8 h-8 flex items-center justify-center opacity-30">
               <svg className={`w-5 h-5 ${isPhase5 ? 'text-white' : 'text-sky-500'} animate-[pulse_3s_infinite]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </StatTooltip>

        <StatTooltip label={isPhase5 ? 'Pre-Cognitive Lead' : 'Ray Depth'} description={isPhase5 ? 'Geometric manifest anticipation time.' : 'Voxel ray-marching step count.'}>
          <div className={`p-2 rounded border flex justify-between items-center overflow-hidden ${isPhase5 ? 'bg-white/5 border-white/20' : 'bg-slate-900/40 border-slate-800/50'}`}>
            <div>
              <div className="text-slate-600 text-[8px] uppercase mb-0.5 font-bold">{isPhase5 ? 'Intent_Lead' : 'Ray_Depth'}</div>
              <div className={`${isPhase5 ? 'text-white' : 'text-sky-400'} font-black text-xs tracking-tighter`}>{isPhase5 ? '12.4ms' : Math.round(stats.rayDepth) + ' STEPS'}</div>
            </div>
            <div className="w-8 h-8 flex items-center justify-center opacity-30">
              <svg className={`w-5 h-5 ${isPhase5 ? 'text-white' : 'text-sky-500'} animate-[bounce_2s_infinite]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </StatTooltip>

        <StatTooltip label={isPhase5 ? 'Ontological Analyzer' : 'Task Intelligence'} description={isPhase5 ? 'Tracking negentropic synthesis yield.' : 'Tracking GOAP agents and scheduler metrics.'}>
          <div 
            onClick={() => setIsJobsOverlayOpen(true)}
            className={`p-2 rounded border flex justify-between items-center overflow-hidden cursor-pointer transition-all active:scale-95 group ${isPhase5 ? 'bg-white/5 border-white/20 hover:border-white/50 hover:bg-white/10' : 'bg-slate-900/40 border-slate-800/50 hover:border-sky-500/50 hover:bg-slate-900/60'}`}
          >
            <div>
              <div className={`text-slate-600 text-[8px] uppercase mb-0.5 group-hover:${isPhase5 ? 'text-white' : 'text-sky-500'} font-bold`}>{isPhase5 ? 'Ontology' : 'Analyzer'}</div>
              <div className={`${isPhase5 ? 'text-white' : 'text-sky-400'} font-black text-xs tracking-tighter`}>{stats.activeTasks} PHENOTYPES</div>
            </div>
            <div className="w-8 h-8 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity">
              <svg className={`w-5 h-5 ${isPhase5 ? 'text-white' : 'text-sky-500'} animate-[spin_4s_linear_infinite]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </StatTooltip>

        <StatTooltip label={isPhase5 ? 'Syntropic Yield' : 'Success Rate'} description={isPhase5 ? 'Negentropic growth efficiency.' : 'Current GOAP planner efficiency.'}>
          <div className={`p-2 rounded border flex gap-2 items-center overflow-hidden ${isPhase5 ? 'bg-white/5 border-white/20' : 'bg-slate-900/40 border-slate-800/50'}`}>
             <div className="flex-1">
                <div className="text-slate-600 text-[8px] uppercase mb-0.5 font-bold">{isPhase5 ? 'Syntropy' : 'Success'}</div>
                <div className={`${isPhase5 ? 'text-white' : 'text-emerald-400'} font-black text-xs tracking-tighter`}>{Math.round(stats.taskCompletionRate)}%</div>
             </div>
             <div className="w-10 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="60%" outerRadius="100%" data={completionGaugeData} startAngle={90} endAngle={450}>
                    <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#1e293b' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </StatTooltip>
      </div>

      <div className={`space-y-1.5 pt-2 border-t ${isPhase5 ? 'border-white/10' : 'border-slate-900'}`}>
        <div className="flex justify-between items-center text-[9px] mb-1">
          <span className="text-slate-500 uppercase tracking-tight font-bold">{isPhase5 ? 'Syntropic Loom: Signal vs Noise' : 'Correlation: Depth x CPU'}</span>
          <span className={`${isPhase5 ? 'text-white bg-white/10' : 'text-sky-700 bg-sky-950'} px-1 rounded uppercase tracking-tighter font-bold`}>YIELD: +1.42Φ</span>
        </div>
        <div className={`h-28 w-full rounded border p-1 ${isPhase5 ? 'bg-white/5 border-white/10' : 'bg-black/40 border-slate-900'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <XAxis type="number" dataKey="depth" hide domain={[0, 150]} />
              <YAxis type="number" dataKey="load" hide domain={[0, 100]} />
              <ZAxis type="number" range={[20, 20]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className={`border px-2 py-1 text-[8px] font-mono shadow-xl uppercase ${isPhase5 ? 'bg-black border-white text-white' : 'bg-slate-950 border-sky-500/30 text-sky-400'}`}>
                      Σ: {payload[0].value} | Φ: {payload[1].value}%
                    </div>
                  );
                }
                return null;
              }} />
              <Scatter name="Manifest" data={history} fill={isPhase5 ? '#ffffff' : '#0ea5e9'} fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-end text-[9px]">
          <span className="text-slate-500 uppercase tracking-tight font-bold">{isPhase5 ? 'Semantic_Resonance' : 'Load_Oscillation'}</span>
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 opacity-50">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={history.slice(-10)}>
                   <Line type="monotone" dataKey="resonance" stroke={isPhase5 ? '#ffffff' : '#0ea5e9'} strokeWidth={1} dot={false} isAnimationActive={false} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
            <span className={`${isPhase5 ? 'text-white' : 'text-sky-500'} font-bold font-mono tracking-tighter`}>{isPhase5 ? stats.resonance.toFixed(3) : stats.cpuLoad + '%'}</span>
          </div>
        </div>
        <div className={`h-14 w-full rounded border overflow-hidden pt-1 ${isPhase5 ? 'bg-white/5 border-white/10' : 'bg-slate-950 border-slate-900'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <YAxis domain={isPhase5 ? [0.8, 1.0] : [0, 100]} hide />
              <XAxis dataKey="time" hide />
              <Line type="step" dataKey={isPhase5 ? "resonance" : "load"} stroke={isPhase5 ? '#ffffff' : '#0ea5e9'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`space-y-1.5 pt-2 border-t ${isPhase5 ? 'border-white/10' : 'border-slate-900/50'}`}>
        <div className="flex justify-between text-[9px]">
          <span className="text-slate-500 uppercase tracking-tight font-bold">Syntropic_Loom_History</span>
          <span className={`${isPhase5 ? 'text-white' : 'text-emerald-500'} font-black font-mono tracking-tighter`}>CONVERGED</span>
        </div>
        <div className={`h-14 w-full rounded border overflow-hidden pt-1 ${isPhase5 ? 'bg-white/5 border-white/10' : 'bg-slate-950 border-slate-900'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
              <XAxis dataKey="time" hide />
              <Line type="monotone" dataKey="heap" stroke={isPhase5 ? '#ffffff' : '#10b981'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${isPhase5 ? 'text-white' : 'text-slate-700'} text-[8px] flex justify-between pt-1 border-t border-slate-900/50 uppercase tracking-widest`}>
        <span>ONTOLOGY_PROBE_ACTIVE</span>
        <span className="font-bold">EXISTENCE_TIME: 00:05:41:22</span>
      </div>
    </div>
  );
};

export default SystemTelemetry;
