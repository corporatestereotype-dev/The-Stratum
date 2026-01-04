
import React, { useEffect, useRef, useState } from 'react';

const MolecularMatrixRenderer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isSyncing, setIsSyncing] = useState(true);
  // Use a ref for isSyncing to avoid stale closures in the animation loop
  const syncRef = useRef(isSyncing);

  // Keep ref in sync with state
  useEffect(() => {
    syncRef.current = isSyncing;
  }, [isSyncing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    // Local variable to track current angle for the canvas loop
    let angleValue = 0;

    const render = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#010409';
      ctx.fillRect(0, 0, w, h);

      // Only increment if syncing is active
      if (syncRef.current) {
        angleValue += 0.005;
        // Update state to trigger re-render for the compass overlay
        setRotation(angleValue);
      }
      
      const currentAngle = angleValue;
      const scale = 2.5;
      const centerX = w / 2;
      const centerY = h / 2;

      // Simple pseudo-3D voxel generation
      // This represents the "Molecular Matrix" derived from the SVDAG
      const voxelCount = 8;
      const step = 20;

      const project = (x: number, y: number, z: number) => {
        // Rotation around Y
        const rx = x * Math.cos(currentAngle) - z * Math.sin(currentAngle);
        const rz = x * Math.sin(currentAngle) + z * Math.cos(currentAngle);
        
        // Perspective projection
        const pSize = 400 / (rz + 200);
        return {
          px: centerX + rx * pSize,
          py: centerY + y * pSize,
          ps: pSize * scale,
          z: rz
        };
      };

      const drawVoxel = (x: number, y: number, z: number, type: 'GEO' | 'THERMAL' | 'PATH') => {
        const p = project(x, y, z);
        
        // Distance-based fading
        const alpha = Math.max(0.1, (p.z + 100) / 200);
        
        ctx.fillStyle = type === 'THERMAL' ? `rgba(244, 63, 94, ${alpha})` : 
                        type === 'PATH' ? `rgba(16, 185, 129, ${alpha})` :
                        `rgba(14, 165, 233, ${alpha * 0.6})`;
        
        ctx.strokeStyle = type === 'THERMAL' ? `rgba(244, 63, 94, ${alpha + 0.2})` : 
                          `rgba(56, 189, 248, ${alpha + 0.1})`;
        
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(p.px - p.ps/2, p.py - p.ps/2, p.ps, p.ps);
        ctx.fill();
        ctx.stroke();

        // Add a "core" highlight for Molecular level
        if (p.ps > 4) {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(p.px, p.py, p.ps * 0.1, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      // Render a "chunk" of SVDAG data
      const points: any[] = [];
      for (let x = -voxelCount/2; x < voxelCount/2; x++) {
        for (let y = -voxelCount/2; y < voxelCount/2; y++) {
          for (let z = -voxelCount/2; z < voxelCount/2; z++) {
            // Generate a sparse, "carved" voxel world (The Stratum style)
            const noise = Math.sin(x * 0.5) * Math.cos(y * 0.5) + Math.sin(z * 0.5);
            if (noise > 0.5) {
              points.push({ x: x * step, y: y * step, z: z * step, type: 'GEO' });
            }
            // Add some thermal entropy nodes
            else if (noise < -1.4) {
              points.push({ x: x * step, y: y * step, z: z * step, type: 'THERMAL' });
            }
          }
        }
      }

      // Depth sorting
      points.sort((a, b) => project(b.x, b.y, b.z).z - project(a.x, a.y, a.z).z);
      points.forEach(p => drawVoxel(p.x, p.y, p.z, p.type));

      // HUD Overlay
      ctx.font = '9px JetBrains Mono';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`ROT_Y: ${((currentAngle % (Math.PI * 2)) * (180/Math.PI)).toFixed(1)}°`, 20, 30);
      ctx.fillText(`ACTIVE_VOXELS: ${points.length.toLocaleString()}`, 20, 42);
      ctx.fillText(`POINTER_JUMPS: 12,402 / FRAME`, 20, 54);
      
      // Draw a scanning scanline
      const scanY = (time / 10) % h;
      ctx.fillStyle = 'rgba(14, 165, 233, 0.03)';
      ctx.fillRect(0, scanY, w, 2);

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl group">
      <div className="absolute top-4 left-4 z-20 space-y-2">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-emerald-500 rounded-sm animate-pulse"></div>
           <span className="text-[11px] font-black text-white uppercase tracking-widest">Molecular_Matrix_Live_Render</span>
        </div>
        <div className="bg-black/80 border border-slate-800 px-2 py-1 rounded">
           <span className="text-[9px] font-mono text-sky-500">ENGINE_SYNC: </span>
           <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">NOMINAL</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button 
          onClick={() => setIsSyncing(!isSyncing)}
          className={`px-3 py-1 rounded border text-[9px] font-mono font-bold transition-all ${
            isSyncing ? 'bg-sky-500/10 border-sky-500/50 text-sky-400' : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
        >
          {isSyncing ? 'SYNC_ACTIVE' : 'SYNC_PAUSED'}
        </button>
      </div>

      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
      />

      {/* Viewport Corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-sky-500/20"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-sky-500/20"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-sky-500/20"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-sky-500/20"></div>

      {/* Navigation Compass Overlay */}
      <div className="absolute bottom-6 right-6 w-16 h-16 border border-slate-800 rounded-full flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity">
        <div className="text-[8px] font-mono text-slate-600 absolute top-1">N</div>
        <div className="text-[8px] font-mono text-slate-600 absolute bottom-1">S</div>
        <div className="w-px h-full bg-slate-800 absolute"></div>
        <div className="h-px w-full bg-slate-800 absolute"></div>
        {/* Fixed error: using rotation state instead of local angle variable */}
        <div className="w-10 h-0.5 bg-sky-500" style={{ transform: `rotate(${rotation * (180/Math.PI)}deg)` }}></div>
      </div>
    </div>
  );
};

export default MolecularMatrixRenderer;
