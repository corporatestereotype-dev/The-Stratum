
import React, { useEffect, useRef, useState } from 'react';

const AgencySensoriumRenderer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [activeGoal, setActiveGoal] = useState('EQUILIBRIUM_SYNC');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    // Simulation of 3 GOAP Agents
    const agents = [
      { id: 'AG_01', pos: [0, 0, 0], color: '#10b981', target: [40, -20, 30] },
      { id: 'AG_02', pos: [-40, 20, -10], color: '#38bdf8', target: [20, 40, 0] },
      { id: 'AG_03', pos: [30, -40, 20], color: '#f59e0b', target: [-30, 0, -40] }
    ];

    const render = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      angle += 0.002;
      const scale = 3.0;
      const centerX = w / 2;
      const centerY = h / 2;

      const project = (x: number, y: number, z: number) => {
        const rx = x * Math.cos(angle) - z * Math.sin(angle);
        const rz = x * Math.sin(angle) + z * Math.cos(angle);
        const pSize = 450 / (rz + 250);
        return {
          px: centerX + rx * pSize,
          py: centerY + y * pSize,
          ps: pSize * scale,
          z: rz
        };
      };

      // 1. Draw "Ghost Geometry" (The SVDAG Substrate)
      ctx.lineWidth = 0.5;
      const voxelCount = 6;
      const step = 30;
      for (let x = -voxelCount/2; x < voxelCount/2; x++) {
        for (let y = -voxelCount/2; y < voxelCount/2; y++) {
          for (let z = -voxelCount/2; z < voxelCount/2; z++) {
            const noise = Math.sin(x * 0.5) * Math.cos(y * 0.5) + Math.sin(z * 0.5);
            if (noise > 0.6) {
              const p = project(x * step, y * step, z * step);
              const alpha = Math.max(0.02, (p.z + 100) / 400);
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.2})`;
              ctx.beginPath();
              ctx.rect(p.px - p.ps/2, p.py - p.ps/2, p.ps, p.ps);
              ctx.stroke();
            }
          }
        }
      }

      // 2. Draw Agent Minds & Intent Vectors
      agents.forEach((agent, i) => {
        // Move agent toward target
        const dx = agent.target[0] - agent.pos[0];
        const dy = agent.target[1] - agent.pos[1];
        const dz = agent.target[2] - agent.pos[2];
        agent.pos[0] += dx * 0.01;
        agent.pos[1] += dy * 0.01;
        agent.pos[2] += dz * 0.01;

        if (Math.abs(dx) < 1) {
          agent.target = [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100];
        }

        const p = project(agent.pos[0], agent.pos[1], agent.pos[2]);
        const targetP = project(agent.target[0], agent.target[1], agent.target[2]);

        // Draw Pathfinding Ray (Intent Vector)
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = `${agent.color}44`;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(targetP.px, targetP.py);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Search Branches (GOAP Heuristics)
        for (let j = 0; j < 5; j++) {
           const bX = agent.pos[0] + Math.sin(time/200 + j) * 20;
           const bY = agent.pos[1] + Math.cos(time/300 + j) * 20;
           const bZ = agent.pos[2] + Math.sin(time/400 + j) * 20;
           const bp = project(bX, bY, bZ);
           ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
           ctx.beginPath();
           ctx.moveTo(p.px, p.py);
           ctx.lineTo(bp.px, bp.py);
           ctx.stroke();
        }

        // Draw Agent Body (Octahedron style)
        ctx.fillStyle = agent.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = agent.color;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py - p.ps * 2);
        ctx.lineTo(p.px + p.ps, p.py);
        ctx.lineTo(p.px, p.py + p.ps * 2);
        ctx.lineTo(p.px - p.ps, p.py);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = '#fff';
        ctx.font = '8px JetBrains Mono';
        ctx.fillText(agent.id, p.px + p.ps + 5, p.py);
      });

      // HUD Overlays
      ctx.font = 'bold 9px JetBrains Mono';
      ctx.fillStyle = '#10b981';
      ctx.fillText(`AGENCY_LOAD: 3_ACTIVE_PLAN_TREES`, 20, 30);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`HEURISTIC: EUCLIDEAN_DISTANCE + THERMAL_COST`, 20, 42);
      ctx.fillText(`UTILITY_CONVERGENCE: 0.9984_ESTABLISHED`, 20, 54);

      // Render a scanning scanline
      const scanY = (time / 8) % h;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
      ctx.fillRect(0, scanY, w, 3);

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-xl overflow-hidden border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] group">
      <div className="absolute top-4 left-4 z-20 space-y-2">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
           <span className="text-[11px] font-black text-white uppercase tracking-widest">Agency_Sensorium_v3</span>
        </div>
        <div className="bg-black/80 border border-emerald-500/20 px-2 py-1 rounded">
           <span className="text-[9px] font-mono text-emerald-500">GOAP_STATE: </span>
           <span className="text-[9px] font-mono text-emerald-200 font-bold uppercase">{activeGoal}</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded backdrop-blur-md">
          <div className="text-[8px] font-mono text-emerald-400 uppercase mb-1">Execution_Stack</div>
          <div className="text-[9px] font-mono text-slate-300 space-y-1">
            <div className="flex items-center gap-2">
               <div className="w-1 h-1 bg-emerald-500"></div>
               <span>0x0F: SCAN_SVDAG_LEAF</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-1 h-1 bg-emerald-500"></div>
               <span>0x12: CALC_THERMAL_COST</span>
            </div>
            <div className="flex items-center gap-2 animate-pulse">
               <div className="w-1 h-1 bg-emerald-500"></div>
               <span>0x44: RECURSE_GOAL_PLAN</span>
            </div>
          </div>
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="w-full h-full object-cover grayscale-[0.2] contrast-[1.2]"
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[length:40px_40px]"></div>

      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-emerald-500/20"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-emerald-500/20"></div>
    </div>
  );
};

export default AgencySensoriumRenderer;
