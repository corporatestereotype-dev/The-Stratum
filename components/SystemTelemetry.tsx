
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
  RadialBar 
} from 'recharts';

interface TelemetryPoint {
  time: string;
  load: number;
  depth: number;
  completionRate: number;
}

interface WorkerJob {
  id: string;
  name: string;
  thread: number;
  progress: number;
  priority: 'HIGH' | 'MED' | 'LOW';
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
        <div className="absolute z-[100] bottom-full left-0 mb-2 w-48 bg-slate-900 border border-sky-500/50 p-2 rounded shadow-2xl backdrop-blur-md">
          <div className="text-[10px] font-bold text-sky-400 mb-1 uppercase tracking-tighter">{label}</div>
          <div className="text-[9px] text-slate-300 leading-tight">{description}</div>
          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-900 border-r border-b border-sky-500/50 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

const SystemTelemetry: React.FC = () => {
  const [stats, setStats] = useState({
    wasmHeap: 124.5,
    rayDepth: 64,
    activeTasks: 12,
    cpuLoad: 24,
    taskCompletionRate: 85
  });

  const [isJobsOverlayOpen, setIsJobsOverlayOpen] = useState(false);
  const [jobs, setJobs] = useState<WorkerJob[]>([]);

  // History for the last 60 seconds
  const [history, setHistory] = useState<TelemetryPoint[]>(
    Array.from({ length: 60 }, (_, i) => ({ 
      time: `${i}`, 
      load: 20 + Math.random() * 10, 
      depth: 40 + Math.random() * 20,
      completionRate: 80 + Math.random() * 10
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const nextLoad = Math.floor(Math.random() * 45) + 15;
      const nextDepth = Math.max(32, Math.min(128, stats.rayDepth + (Math.random() - 0.5) * 15));
      const nextCompletion = Math.min(100, Math.max(60, 95 - (nextLoad / 5) + (Math.random() * 5)));
      
      setStats(prev => ({
        wasmHeap: Math.max(120, prev.wasmHeap + (Math.random() - 0.5) * 1.5),
        rayDepth: nextDepth,
        activeTasks: Math.floor(Math.random() * 8) + 8,
        cpuLoad: nextLoad,
        taskCompletionRate: nextCompletion
      }));

      setHistory(prev => {
        const newPoint = { 
          time: new Date().toLocaleTimeString(), 
          load: nextLoad, 
          depth: nextDepth,
          completionRate: nextCompletion
        };
        return [...prev.slice(1), newPoint];
      });

      // Update mock jobs
      const jobNames = ['SVDAG_COMPACT', 'HEAT_DIFFUSE', 'GOAP_PATH', 'WASM_GC', 'VBO_UPDATE', 'PBR_PRECOMP'];
      setJobs(Array.from({ length: 8 }, (_, i) => ({
        id: `0x${(Math.random() * 0xFFF).toString(16).toUpperCase().padStart(3, '0')}`,
        name: jobNames[Math.floor(Math.random() * jobNames.length)],
        thread: i % 4,
        progress: Math.floor(Math.random() * 100),
        priority: Math.random() > 0.7 ? 'HIGH' : (Math.random() > 0.4 ? 'MED' : 'LOW')
      })));

    }, 1000);
    return () => clearInterval(interval);
  }, [stats.rayDepth]);

  const gaugeData = useMemo(() => [
    { name: 'Completion', value: stats.taskCompletionRate, fill: '#10b981' }
  ], [stats.taskCompletionRate]);

  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-3 font-mono text-[10px] space-y-4 shadow-2xl backdrop-blur-sm relative overflow-hidden min-h-[400px]">
      {/* Jobs Overlay */}
      {isJobsOverlayOpen && (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col p-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
            <span className="text-sky-400 font-bold uppercase tracking-widest text-[11px]">Worker_Job_Registry</span>
            <button 
              onClick={() => setIsJobsOverlayOpen(false)}
              className="text-slate-500 hover:text-white transition-colors uppercase text-[9px] border border-slate-800 px-2 py-0.5 rounded bg-slate-900"
            >
              Close_Terminal [X]
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
            {jobs.map(job => (
              <div key={job.id} className="bg-slate-900 border border-slate-800 p-2 rounded flex flex-col gap-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-sky-500 font-bold">[{job.id}] <span className="text-slate-300">{job.name}</span></span>
                  <span className={`text-[8px] px-1 rounded ${
                    job.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : 
                    job.priority === 'MED' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/50 text-slate-400'
                  }`}>
                    {job.priority}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[8px]">
                  <span className="text-slate-500">THREAD_0{job.thread}</span>
                  <span className="text-sky-600">{job.progress}%</span>
                </div>
                <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-600 transition-all duration-1000" 
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-slate-900 text-[8px] text-slate-600 italic">
            TOTAL_ACTIVE_HANDLES: {stats.activeTasks} // SCHEDULER: FAIR_ROUND_ROBIN
          </div>
        </div>
      )}

      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-sky-500 rounded-full animate-ping absolute opacity-75"></div>
            <div className="w-2 h-2 bg-sky-500 rounded-full relative shadow-[0_0_8px_#0ea5e9]"></div>
          </div>
          <span className="text-slate-400 font-black uppercase tracking-widest text-[11px]">Engine Live Telemetry</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-600">60s_RETAIN</span>
          <span className="text-[9px] text-emerald-500 font-bold border border-emerald-500/30 px-1 rounded bg-emerald-500/5">STABLE</span>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatTooltip label="Heap Allocation" description="Current Wasm memory usage for voxel storage and SVDAG buffers. Fluctuates during garbage compaction.">
          <div className="bg-slate-900/40 p-2 rounded border border-slate-800/50 flex justify-between items-center overflow-hidden">
            <div>
              <div className="text-slate-600 text-[8px] uppercase mb-0.5">Heap_Alloc</div>
              <div className="text-sky-400 font-black text-xs">{stats.wasmHeap.toFixed(2)} MB</div>
            </div>
            <div className="w-8 h-8 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-sky-500 animate-[pulse_3s_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </StatTooltip>

        <StatTooltip label="Ray Depth" description="Maximum step count for the ray-marching volume shader. Higher depth improves geometric precision at the cost of throughput.">
          <div className="bg-slate-900/40 p-2 rounded border border-slate-800/50 flex justify-between items-center overflow-hidden">
            <div>
              <div className="text-slate-600 text-[8px] uppercase mb-0.5">Ray_Depth</div>
              <div className="text-sky-400 font-black text-xs">{Math.round(stats.rayDepth)} STEPS</div>
            </div>
            <div className="w-8 h-8 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-sky-500 animate-[bounce_2s_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </StatTooltip>

        <StatTooltip label="Active Tasks" description="Number of parallel WebWorker tasks currently processing SVDAG nodes or cellular automata updates. Click to view detailed job list.">
          <div 
            onClick={() => setIsJobsOverlayOpen(true)}
            className="bg-slate-900/40 p-2 rounded border border-slate-800/50 flex justify-between items-center overflow-hidden cursor-pointer hover:border-sky-500/50 hover:bg-slate-900/60 transition-all active:scale-95 group"
          >
            <div>
              <div className="text-slate-600 text-[8px] uppercase mb-0.5 group-hover:text-sky-500">Worker_Jobs</div>
              <div className="text-sky-400 font-black text-xs">{stats.activeTasks} ACTIVE</div>
            </div>
            <div className="w-8 h-8 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-sky-500 animate-[spin_4s_linear_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </StatTooltip>

        <StatTooltip label="Task Completion" description="Real-time efficiency ratio of completed jobs vs assigned worker throughput. Values below 70% indicate threading bottlenecks.">
          <div className="bg-slate-900/40 p-2 rounded border border-slate-800/50 flex gap-2 items-center overflow-hidden">
             <div className="flex-1">
                <div className="text-slate-600 text-[8px] uppercase mb-0.5">Completion</div>
                <div className="text-emerald-400 font-black text-xs">{Math.round(stats.taskCompletionRate)}%</div>
             </div>
             <div className="w-10 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    innerRadius="60%" 
                    outerRadius="100%" 
                    data={gaugeData} 
                    startAngle={90} 
                    endAngle={450}
                  >
                    <RadialBar 
                      dataKey="value" 
                      cornerRadius={10} 
                      background={{ fill: '#1e293b' }} 
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </StatTooltip>
      </div>

      {/* Load/Depth Correlation (Scatter Chart) */}
      <div className="space-y-1.5 pt-2 border-t border-slate-900">
        <div className="flex justify-between items-center text-[9px] mb-1">
          <span className="text-slate-500 uppercase tracking-tight">Correlation: Ray_Depth x CPU_Load</span>
          <span className="text-sky-700 bg-sky-950 px-1 rounded">R-COEFF: 0.84</span>
        </div>
        <div className="h-28 w-full bg-black/40 rounded border border-slate-900 p-1">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <XAxis 
                type="number" 
                dataKey="depth" 
                name="depth" 
                unit="px" 
                hide 
                domain={[0, 150]} 
              />
              <YAxis 
                type="number" 
                dataKey="load" 
                name="load" 
                unit="%" 
                hide 
                domain={[0, 100]} 
              />
              <ZAxis type="number" range={[20, 20]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-950 border border-sky-500/30 px-2 py-1 text-[8px] text-sky-400 font-mono shadow-xl">
                        DEPTH: {payload[0].value}px<br/>
                        LOAD: {payload[1].value}%
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                name="Telemetry" 
                data={history} 
                fill="#0ea5e9" 
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traditional Load Graph */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[9px]">
          <span className="text-slate-500 uppercase">Load_Oscillation (60s)</span>
          <span className="text-sky-500 font-bold">{stats.cpuLoad}%</span>
        </div>
        <div className="h-16 w-full bg-slate-950 rounded border border-slate-900 overflow-hidden pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <YAxis domain={[0, 100]} hide />
              <XAxis dataKey="time" hide />
              <Line 
                type="step" 
                dataKey="load" 
                stroke="#0ea5e9" 
                strokeWidth={1.5} 
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-[8px] text-slate-700 flex justify-between pt-1 border-t border-slate-900/50">
        <span>INTERFACE_SENSORS_OK</span>
        <span className="font-bold">UPTIME: 00:04:22:12</span>
      </div>
    </div>
  );
};

export default SystemTelemetry;
