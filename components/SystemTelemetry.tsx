
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
}

interface Agent {
  id: string;
  designation: string;
  class: 'SCOUT' | 'ENGINEER' | 'SENTINEL';
  currentTask: string;
  taskProgress: number;
  taskETC: number; // ms
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
  duration: number; // in ms
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
        <div className="absolute z-[100] bottom-full left-0 mb-2 w-48 bg-slate-900 border border-sky-500/50 p-2 rounded shadow-2xl backdrop-blur-md pointer-events-none">
          <div className="text-[10px] font-bold text-sky-400 mb-1 uppercase tracking-tighter">{label}</div>
          <div className="text-[9px] text-slate-300 leading-tight">{description}</div>
          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-900 border-r border-b border-sky-500/50 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

const SystemTelemetry: React.FC<SystemTelemetryProps> = ({ currentPhase }) => {
  const [stats, setStats] = useState({
    wasmHeap: 124.5,
    rayDepth: 64,
    activeTasks: 12,
    cpuLoad: 24,
    taskCompletionRate: 88,
    gpuTemp: 52
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
      completionRate: 85 + Math.random() * 5,
      heap: 124 + Math.random() * 2,
      temp: 45 + Math.random() * 5
    }))
  );

  useEffect(() => {
    // 1. Contextual Job Names based on Phase
    const getPhaseJobs = () => {
      switch (currentPhase.title) {
        case ProjectPhase.MOLECULAR_MATRIX: return ['SVDAG_COMPACT', 'WASM_GC', 'BIT_PACKING'];
        case ProjectPhase.ENTROPY_ENGINE: return ['HEAT_DIFFUSE', 'VOXEL_COLLAPSE', 'THERMO_TICK'];
        case ProjectPhase.ZERO_STATE_MIND: return ['GOAP_PATH', 'AI_BEHAVIOR_TICK', 'HEURISTIC_SEARCH'];
        case ProjectPhase.OPTICAL_REALITY: return ['PBR_PRECOMP', 'VBO_UPDATE', 'SHADER_RECOMPILE'];
        case ProjectPhase.SYSTEMIC_HARDENING: return ['THREAD_SYNC', 'SIMD_PROCESS', 'CACHE_FLUSH'];
        default: return ['IDLE_PROCESS'];
      }
    };

    const interval = setInterval(() => {
      // 2. Resource Contention Logic: Ray Depth influences CPU Load and completion rate
      const nextDepth = Math.max(32, Math.min(128, stats.rayDepth + (Math.random() - 0.5) * 15));
      const contentionFactor = (nextDepth / 128) * 40; // High depth = higher base load
      const nextLoad = Math.floor(contentionFactor + Math.random() * 20 + 10);
      
      // Completion rate drops as contention increases
      const nextCompletion = Math.min(100, Math.max(70, 98 - (nextLoad / 5) - (nextDepth / 20)));
      const nextHeap = Math.max(120, stats.wasmHeap + (Math.random() - 0.5) * 1.5);
      const nextTemp = Math.floor(48 + (nextLoad / 6) + Math.random() * 4);
      
      setStats({
        wasmHeap: nextHeap,
        rayDepth: nextDepth,
        activeTasks: (currentPhase.title === ProjectPhase.ZERO_STATE_MIND ? 15 : 8) + Math.floor(Math.random() * 8),
        cpuLoad: nextLoad,
        taskCompletionRate: nextCompletion,
        gpuTemp: nextTemp
      });

      setHistory(prev => {
        const newPoint = { 
          time: new Date().toLocaleTimeString(), 
          load: nextLoad, 
          depth: nextDepth,
          completionRate: nextCompletion,
          heap: nextHeap,
          temp: nextTemp
        };
        return [...prev.slice(1), newPoint];
      });

      const phaseSpecificJobs = getPhaseJobs();
      const agentNames = ['Alpha-9', 'Beta-4', 'Gamma-1', 'Sigma-0', 'Zeta-7'];
      
      // 3. Agent Efficiency Contention: Higher Depth & Load reduces Agent Efficiency
      const agentEfficiencyPenalty = (nextLoad / 100) * 15 + (nextDepth / 128) * 10;
      
      setAgents(prevAgents => {
        return agentNames.map((name, i) => {
          const id = `AG_0${i}`;
          const currentEfficiency = Math.max(40, (70 + Math.random() * 30) - agentEfficiencyPenalty);
          const prevAgent = prevAgents.find(a => a.id === id);
          
          // Persist history up to 60 points
          const history = prevAgent?.efficiencyHistory || Array(60).fill(currentEfficiency);
          const updatedHistory = [...history.slice(1), currentEfficiency];

          return {
            id,
            designation: name,
            class: i % 3 === 0 ? 'SENTINEL' : (i % 3 === 1 ? 'ENGINEER' : 'SCOUT'),
            currentTask: phaseSpecificJobs[Math.floor(Math.random() * phaseSpecificJobs.length)],
            taskProgress: Math.random() * 100,
            taskETC: (Math.random() * 5000 + 500) * (1 + nextLoad / 100),
            taskThreadAffinity: i % 8,
            load: Math.random() * 20 + (nextLoad * 0.5),
            memory: Math.random() * 15 + 5,
            efficiency: currentEfficiency,
            efficiencyHistory: updatedHistory
          };
        });
      });

      // Update mock Jobs with phase-specific naming
      setJobs(Array.from({ length: 10 }, (_, i) => ({
        id: `0x${(Math.random() * 0xFFF).toString(16).toUpperCase().padStart(3, '0')}`,
        name: phaseSpecificJobs[Math.floor(Math.random() * phaseSpecificJobs.length)],
        agentId: `AG_0${Math.floor(Math.random() * 5)}`,
        thread: i % 8,
        progress: Math.floor(Math.random() * 100),
        duration: (150 + Math.random() * 3000) * (1 + nextLoad / 200),
        cpuUsage: 5 + Math.random() * (nextLoad / 4),
        memUsage: 0.5 + Math.random() * 4,
        priority: Math.random() > 0.8 ? 'HIGH' : (Math.random() > 0.5 ? 'MED' : 'LOW')
      })));

    }, 1000);
    return () => clearInterval(interval);
  }, [stats.rayDepth, stats.wasmHeap, currentPhase.title]);

  const completionGaugeData = useMemo(() => [
    { name: 'Completion', value: stats.taskCompletionRate, fill: '#10b981' }
  ], [stats.taskCompletionRate]);

  const resourceDistribution = useMemo(() => {
    return agents.map(a => ({
      name: a.designation,
      load: a.load,
      mem: a.memory
    }));
  }, [agents]);

  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-3 font-mono text-[10px] space-y-4 shadow-2xl backdrop-blur-sm relative overflow-hidden min-h-[420px]">
      
      {/* Deep Analytical Overlay */}
      {isJobsOverlayOpen && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col p-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-sky-400 font-bold uppercase tracking-widest text-[11px]">System_Analyzer_v2</span>
              <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800">
                {(['JOBS', 'AGENTS', 'ANALYTICS'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2 py-0.5 rounded text-[8px] transition-all ${
                      activeTab === tab ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-300'
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
                  <span>PHASE_FOCUS: {currentPhase.subtitle}</span>
                  <span>SYNC_MODE: ATOMIC</span>
                </div>
                {jobs.map(job => (
                  <div key={job.id} className="bg-slate-900/50 border border-slate-800/50 p-2 rounded flex flex-col gap-1.5 hover:border-sky-500/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="text-sky-500 font-bold">[{job.id}] <span className="text-slate-300">{job.name}</span></span>
                      <span className="text-[8px] text-slate-500 uppercase tracking-tighter">AGENT_{job.agentId.split('_')[1]}</span>
                    </div>
                    <div className="flex justify-between items-center text-[7px] text-slate-400">
                      <span>CPU: {job.cpuUsage.toFixed(1)}% | MEM: {job.memUsage.toFixed(1)}MB</span>
                      <span className="text-sky-600">RUNTIME: {Math.floor(job.duration)}ms</span>
                    </div>
                    <div className="h-0.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500/50" style={{ width: `${job.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'AGENTS' && (
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between text-[8px] text-slate-500 px-1">
                   <span>CONTENTION_PENALTY: {(stats.cpuLoad / 10).toFixed(1)}%</span>
                   <span>SCHEDULER: FAIR_WEIGHTED</span>
                </div>
                {agents.map(agent => (
                  <div key={agent.id} className="bg-slate-900/50 border border-slate-800/50 p-3 rounded flex flex-col gap-3 hover:border-sky-500/40 transition-all group/agent">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${agent.efficiency > 80 ? 'bg-emerald-500' : (agent.efficiency > 60 ? 'bg-amber-500' : 'bg-red-500')} animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]`}></div>
                        <span className="text-sky-400 font-black text-xs group-hover/agent:text-sky-300">{agent.designation}</span>
                        <span className="text-[7px] text-slate-600 bg-slate-950 px-1 rounded border border-slate-800 uppercase tracking-tighter">{agent.class}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[8px] text-slate-500 uppercase">Efficiency:</span>
                         <div className="flex items-center gap-2">
                           {/* Efficiency Sparkline */}
                           <div className="w-12 h-4 opacity-60">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={agent.efficiencyHistory.map((val, idx) => ({ val, idx }))}>
                                  <Line 
                                    type="monotone" 
                                    dataKey="val" 
                                    stroke={agent.efficiency > 80 ? '#10b981' : (agent.efficiency > 60 ? '#f59e0b' : '#ef4444')} 
                                    strokeWidth={1} 
                                    dot={false} 
                                    isAnimationActive={false} 
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                           </div>
                           <span className={`${agent.efficiency > 80 ? 'text-emerald-500' : 'text-amber-500'} font-black font-mono`}>{agent.efficiency.toFixed(1)}%</span>
                         </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[8px] bg-black/40 p-2 rounded border border-slate-800/30">
                      <div className="flex flex-col">
                        <span className="text-slate-600 uppercase mb-0.5">CPU_LOAD</span>
                        <span className="text-sky-500 font-bold">{agent.load.toFixed(1)}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-600 uppercase mb-0.5">MEM_POOL</span>
                        <span className="text-sky-500 font-bold">{agent.memory.toFixed(1)}MB</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-600 uppercase mb-0.5">AFFINITY</span>
                        <span className="text-sky-500 font-bold">CORE_{agent.taskThreadAffinity}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                       <div className="flex justify-between items-end text-[8px]">
                          <span className="text-slate-400 font-bold uppercase tracking-tight">{agent.currentTask}</span>
                          <span className="text-sky-600 font-mono italic">ETC: {Math.floor(agent.taskETC)}ms</span>
                       </div>
                       <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden relative">
                          <div className="h-full bg-sky-500/60 shadow-[0_0_8px_rgba(14,165,233,0.5)] transition-all duration-1000" style={{ width: `${agent.taskProgress}%` }}></div>
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'ANALYTICS' && (
              <div className="space-y-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded p-2">
                  <div className="text-[9px] text-slate-500 mb-2 uppercase">Load Distribution: {currentPhase.subtitle}</div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={resourceDistribution}>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Bar dataKey="load" radius={[2, 2, 0, 0]}>
                          {resourceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0ea5e9' : '#10b981'} fillOpacity={0.6} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                   <div className="bg-slate-900/50 border border-slate-800 rounded p-2 flex flex-col items-center">
                      <div className="text-[8px] text-slate-500 mb-1">TASK_SUCCESS_RATE</div>
                      <div className="h-16 w-16">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                              innerRadius="70%" outerRadius="100%" 
                              data={completionGaugeData} 
                              startAngle={90} endAngle={450}
                            >
                              <RadialBar dataKey="value" background fill="#10b981" />
                            </RadialBarChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="text-[10px] font-black text-emerald-500 mt-1">{stats.taskCompletionRate.toFixed(1)}%</div>
                   </div>
                   <div className="bg-slate-900/50 border border-slate-800 rounded p-2 flex flex-col justify-center gap-1">
                      <div className="text-[8px] text-slate-500 mb-1 uppercase tracking-tighter">Resource Contention</div>
                      <div className="text-[9px] text-sky-400 flex justify-between">
                        <span>STALL_RATE:</span>
                        <span>{(stats.rayDepth / 200).toFixed(2)}%</span>
                      </div>
                      <div className="text-[9px] text-sky-400 flex justify-between">
                        <span>CPU_THROTTLE:</span>
                        <span>{stats.cpuLoad > 40 ? 'ACTIVE' : 'OFF'}</span>
                      </div>
                      <div className="text-[9px] text-sky-400 flex justify-between">
                        <span>BUS_LATENCY:</span>
                        <span>{(stats.cpuLoad / 50).toFixed(2)}ms</span>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-2 border-t border-slate-900 text-[8px] text-slate-600 flex justify-between uppercase tracking-tighter">
            <span>DIAGNOSTIC_MODE_v4.2.1</span>
            <span>DATA_STREAMS: 12_SYNC</span>
          </div>
        </div>
      )}

      {/* Main UI Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-sky-500 rounded-full animate-ping absolute opacity-75"></div>
            <div className="w-2 h-2 bg-sky-500 rounded-full relative shadow-[0_0_8px_#0ea5e9]"></div>
          </div>
          <span className="text-slate-400 font-black uppercase tracking-widest text-[11px]">Engine Live Telemetry</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-600 uppercase tracking-tighter">60s_RETAIN</span>
          <span className="text-[9px] text-emerald-500 font-bold border border-emerald-500/30 px-1 rounded bg-emerald-500/5 uppercase tracking-widest">STABLE</span>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatTooltip label="Heap Allocation" description="Current Wasm memory usage for voxel storage. Throttles at 512MB limit.">
          <div className="bg-slate-900/40 p-2 rounded border border-slate-800/50 flex justify-between items-center overflow-hidden">
            <div>
              <div className="text-slate-600 text-[8px] uppercase mb-0.5">Heap_Alloc</div>
              <div className="text-sky-400 font-black text-xs tracking-tighter">{stats.wasmHeap.toFixed(2)} MB</div>
            </div>
            <div className="w-8 h-8 flex items-center justify-center opacity-30">
              <svg className="w-5 h-5 text-sky-500 animate-[pulse_3s_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </StatTooltip>

        <StatTooltip label="Ray Depth" description="Voxel ray-marching step count. Higher depth = better fidelity, but increased thread contention for agents.">
          <div className="bg-slate-900/40 p-2 rounded border border-slate-800/50 flex justify-between items-center overflow-hidden">
            <div>
              <div className="text-slate-600 text-[8px] uppercase mb-0.5">Ray_Depth</div>
              <div className="text-sky-400 font-black text-xs tracking-tighter">{Math.round(stats.rayDepth)} STEPS</div>
            </div>
            <div className="w-8 h-8 flex items-center justify-center opacity-30">
              <svg className="w-5 h-5 text-sky-500 animate-[bounce_2s_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </StatTooltip>

        <StatTooltip label="Task Intelligence" description="Deep tracking of GOAP agents and scheduler metrics. Efficiency is throttled by engine-wide load.">
          <div 
            onClick={() => setIsJobsOverlayOpen(true)}
            className="bg-slate-900/40 p-2 rounded border border-slate-800/50 flex justify-between items-center overflow-hidden cursor-pointer hover:border-sky-500/50 hover:bg-slate-900/60 transition-all active:scale-95 group"
          >
            <div>
              <div className="text-slate-600 text-[8px] uppercase mb-0.5 group-hover:text-sky-500">Analyzer</div>
              <div className="text-sky-400 font-black text-xs tracking-tighter">{stats.activeTasks} PROCESSES</div>
            </div>
            <div className="w-8 h-8 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-sky-500 animate-[spin_4s_linear_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </StatTooltip>

        <StatTooltip label="Success Rate" description="Current GOAP planner efficiency. Drops as thread affinity collisions increase.">
          <div className="bg-slate-900/40 p-2 rounded border border-slate-800/50 flex gap-2 items-center overflow-hidden">
             <div className="flex-1">
                <div className="text-slate-600 text-[8px] uppercase mb-0.5">Success</div>
                <div className="text-emerald-400 font-black text-xs tracking-tighter">{Math.round(stats.taskCompletionRate)}%</div>
             </div>
             <div className="w-10 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    innerRadius="60%" 
                    outerRadius="100%" 
                    data={completionGaugeData} 
                    startAngle={90} 
                    endAngle={450}
                  >
                    <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#1e293b' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </StatTooltip>
      </div>

      {/* Load/Depth Correlation (Scatter Chart) */}
      <div className="space-y-1.5 pt-2 border-t border-slate-900">
        <div className="flex justify-between items-center text-[9px] mb-1">
          <span className="text-slate-500 uppercase tracking-tight">Correlation: Depth x CPU</span>
          <span className="text-sky-700 bg-sky-950 px-1 rounded uppercase tracking-tighter">R-COEFF: 0.84</span>
        </div>
        <div className="h-28 w-full bg-black/40 rounded border border-slate-900 p-1">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <XAxis type="number" dataKey="depth" hide domain={[0, 150]} />
              <YAxis type="number" dataKey="load" hide domain={[0, 100]} />
              <ZAxis type="number" range={[20, 20]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-950 border border-sky-500/30 px-2 py-1 text-[8px] text-sky-400 font-mono shadow-xl uppercase">
                        D: {payload[0].value}px | L: {payload[1].value}%
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Telemetry" data={history} fill="#0ea5e9" fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traditional Load Graph with Sparkline Header */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-end text-[9px]">
          <span className="text-slate-500 uppercase tracking-tight">Load_Oscillation</span>
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 opacity-50">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={history.slice(-10)}>
                   <Line type="monotone" dataKey="load" stroke="#0ea5e9" strokeWidth={1} dot={false} isAnimationActive={false} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
            <span className="text-sky-500 font-bold font-mono tracking-tighter">{stats.cpuLoad}%</span>
          </div>
        </div>
        <div className="h-14 w-full bg-slate-950 rounded border border-slate-900 overflow-hidden pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <YAxis domain={[0, 100]} hide />
              <XAxis dataKey="time" hide />
              <Line type="step" dataKey="load" stroke="#0ea5e9" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Wasm Heap History Graph */}
      <div className="space-y-1.5 pt-2 border-t border-slate-900/50">
        <div className="flex justify-between text-[9px]">
          <span className="text-slate-500 uppercase tracking-tight">Wasm_Heap_History</span>
          <span className="text-emerald-500 font-bold font-mono tracking-tighter">{stats.wasmHeap.toFixed(1)}MB</span>
        </div>
        <div className="h-14 w-full bg-slate-950 rounded border border-slate-900 overflow-hidden pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
              <XAxis dataKey="time" hide />
              <Line type="monotone" dataKey="heap" stroke="#10b981" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GPU Thermal History Graph */}
      <div className="space-y-1.5 pt-2 border-t border-slate-900/50">
        <div className="flex justify-between text-[9px]">
          <span className="text-slate-500 uppercase tracking-tight">GPU_Thermal_History</span>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${stats.gpuTemp > 65 ? 'bg-rose-500 animate-ping' : (stats.gpuTemp > 55 ? 'bg-orange-500' : 'bg-emerald-500')}`}></div>
            <span className={`font-bold font-mono tracking-tighter ${stats.gpuTemp > 65 ? 'text-rose-500' : (stats.gpuTemp > 55 ? 'text-orange-500' : 'text-slate-300')}`}>
              {stats.gpuTemp}°C
            </span>
          </div>
        </div>
        <div className="h-14 w-full bg-slate-950 rounded border border-slate-900 overflow-hidden pt-1 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <YAxis domain={[40, 80]} hide />
              <XAxis dataKey="time" hide />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke={stats.gpuTemp > 65 ? '#f43f5e' : (stats.gpuTemp > 55 ? '#f97316' : '#64748b')} 
                strokeWidth={1.5} 
                dot={false} 
                isAnimationActive={false} 
              />
            </LineChart>
          </ResponsiveContainer>
          {stats.gpuTemp > 68 && (
            <div className="absolute inset-0 bg-rose-500/10 pointer-events-none flex items-center justify-center">
              <span className="text-[7px] text-rose-500 font-black animate-pulse uppercase tracking-[0.3em]">Thermal Throttling Active</span>
            </div>
          )}
        </div>
      </div>

      <div className="text-[8px] text-slate-700 flex justify-between pt-1 border-t border-slate-900/50 uppercase tracking-widest">
        <span>INTERFACE_SENSORS_OK</span>
        <span className="font-bold">UPTIME: 00:05:41:22</span>
      </div>
    </div>
  );
};

export default SystemTelemetry;
