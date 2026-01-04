
import React, { useEffect, useRef, useState } from 'react';
import { RenderMode } from '../types';

interface EntropyEngineRendererProps {
  mode: RenderMode;
}

const EntropyEngineRenderer: React.FC<EntropyEngineRendererProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [fluxDensity, setFluxDensity] = useState(0.85);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    
    // Entropy state simulation
    const voxelCount = 8;
    const grid: number[][][] = Array.from({ length: voxelCount }, () =>
      Array.from({ length: voxelCount }, () => Array(voxelCount).fill(0))
    );

    // Initial "hot spots" for Laplacian diffusion simulation
    grid[4][4][4] = 1.0;
    grid[2][6][3] = 0.8;

    const render = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#010409';
      ctx.fillRect(0, 0, w, h);

      angle += 0.003;
      setRotation(angle);

      // Simulation Step: Thermal Diffusion (Simplified Laplacian)
      const nextGrid = JSON.parse(JSON.stringify(grid));
      const alpha = 0.1; // Diffusion rate
      for (let x = 1; x < voxelCount - 1; x++) {
        for (let y = 1; y < voxelCount - 1; y++) {
          for (let z = 1; z < voxelCount - 1; z++) {
            const laplacian = 
              grid[x+1][y][z] + grid[x-1][y][z] +
              grid[x][y+1][z] + grid[x][y-1][z] +
              grid[x][y][z+1] + grid[x][y][z-1] -
              6 * grid[x][y][z];
            nextGrid[x][y][z] += alpha * laplacian;
            // Constant cooling
            nextGrid[x][y][z] *= 0.99;
            // Inject periodic energy
            if (x === 4 && y === 4 && z === 4) {
              nextGrid[x][y][z] = 0.5 + Math.sin(time / 500) * 0.5;
            }
          }
        }
      }
      for (let i = 0; i < voxelCount; i++)
        for (let j = 0; j < voxelCount; j++)
          for (let k = 0; k < voxelCount; k++)
            grid[i][j][k] = nextGrid[i][j][k];

      const scale = 3.5;
      const centerX = w / 2;
      const centerY = h / 2;
      const stepSize = 25;

      const project = (x: number, y: number, z: number) => {
        const rx = x * Math.cos(angle) - z * Math.sin(angle);
        const rz = x * Math.sin(angle) + z * Math.cos(angle);
        const pSize = 500 / (rz + 300);
        return {
          px: centerX + rx * pSize,
          py: centerY + y * pSize,
          ps: pSize * scale,
          z: rz,
          val: grid[Math.floor(x/stepSize + voxelCount/2)]?.[Math.floor(y/stepSize + voxelCount/2)]?.[Math.floor(z/stepSize + voxelCount/2)] || 0
        };
      };

      // Gather points for depth sorting
      const points: any[] = [];
      for (let x = -voxelCount/2; x < voxelCount/2; x++) {
        for (let y = -voxelCount/2; y < voxelCount/2; y++) {
          for (let z = -voxelCount/2; z < voxelCount/2; z++) {
            const val = grid[x + voxelCount/2][y + voxelCount/2][z + voxelCount/2];
            // Only render if density > threshold or thermal > threshold
            if (val > 0.01 || (Math.sin(x) * Math.cos(y) > 0.4)) {
              points.push({ 
                x: x * stepSize, 
                y: y * stepSize, 
                z: z * stepSize, 
                val 
              });
            }
          }
        }
      }

      points.sort((a, b) => project(b.x, b.y, b.z).z - project(a.x, a.y, a.z).z);

      points.forEach(pt => {
        const proj = project(pt.x, pt.y, pt.z);
        const alpha = Math.max(0.1, (proj.z + 150) / 300);
        
        let color = '';
        let stroke = '';

        if (mode === 'THERMAL') {
          // Heat map (Blackbody simulation)
          const heat = proj.val;
          const r = Math.floor(Math.min(255, heat * 512));
          const g = Math.floor(Math.min(255, heat * 200));
          const b = Math.floor(Math.min(255, heat * 50));
          color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          stroke = `rgba(${r}, ${g}, ${b}, ${alpha + 0.2})`;
        } else if (mode === 'STRESS') {
          // Stress map (Cyan/Magenta gradients)
          const stress = Math.abs(Math.sin(pt.x * 0.1) * pt.val);
          color = `rgba(0, 255, 255, ${stress * alpha})`;
          stroke = `rgba(255, 0, 255, ${stress * alpha})`;
        } else {
          // Integrated view
          const heat = proj.val;
          const r = Math.floor(Math.min(255, heat * 400 + 14));
          const g = Math.floor(Math.min(255, heat * 100 + 165));
          const b = Math.floor(Math.min(255, 233));
          color = `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`;
          stroke = `rgba(56, 189, 248, ${alpha + 0.1})`;
        }

        ctx.fillStyle = color;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(proj.px - proj.ps/2, proj.py - proj.ps/2, proj.ps, proj.ps);
        ctx.fill();
        ctx.stroke();

        // Particle highlights for high entropy
        if (proj.val > 0.6) {
          ctx.fillStyle = '#fff';
          ctx.globalAlpha = proj.val * 0.8;
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      });

      // HUD Overlays
      ctx.font = 'bold 9px JetBrains Mono';
      ctx.fillStyle = '#f43f5e';
      ctx.fillText(`ENTROPY_FLUX: ${(Math.random() * 0.1 + fluxDensity).toFixed(4)} Δ`, 20, 30);
      ctx.fillStyle = '#0ea5e9';
      ctx.fillText(`FIELD_SOLVER: LAPLACIAN_STENCIL_3D`, 20, 42);
      ctx.fillText(`THERMAL_DELTA: ${(grid[4][4][4] - grid[3][4][4]).toFixed(4)}`, 20, 54);

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mode]);

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl group">
      <div className="absolute top-4 left-4 z-20 space-y-2">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-rose-500 rounded-sm animate-pulse"></div>
           <span className="text-[11px] font-black text-white uppercase tracking-widest">Entropy_Engine_Viewport // {mode}</span>
        </div>
        <div className="bg-black/80 border border-slate-800 px-2 py-1 rounded flex items-center gap-2">
           <span className="text-[9px] font-mono text-rose-500">THERMAL_SYNC: </span>
           <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-tighter">0.002ms_LATENCY</span>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1 max-w-[200px]">
        <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Compute_Load_Dist</div>
        <div className="flex gap-0.5 h-1">
          {Array.from({length: 20}).map((_, i) => (
            <div key={i} className="flex-1 bg-slate-800" style={{ height: `${Math.random() * 100}%`, backgroundColor: i > 15 ? '#f43f5e' : '#0ea5e9' }}></div>
          ))}
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="w-full h-full object-cover"
      />

      {/* Viewport Effects */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
      
      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-rose-500/20"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-rose-500/20"></div>
    </div>
  );
};

export default EntropyEngineRenderer;
