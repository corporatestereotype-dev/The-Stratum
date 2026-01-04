
import React, { useEffect, useRef, useState } from 'react';

const OpticalRealityRenderer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [morphDelta, setMorphDelta] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    // Simulation of 4 Morphic Nodes (Collective Intelligence)
    const morphicNodes = [
      { id: 'MN_A', pos: [30, 30, 0], utility: 0.8, color: '#fcd34d' },
      { id: 'MN_B', pos: [-30, -30, 0], utility: 0.4, color: '#c084fc' },
      { id: 'MN_C', pos: [0, -40, 30], utility: 0.9, color: '#fbbf24' },
      { id: 'MN_D', pos: [0, 40, -30], utility: 0.2, color: '#a855f7' }
    ];

    const render = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      
      // Gradient background for "Optical Reality"
      const bgGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      angle += 0.0015;
      const scale = 4.0;
      const centerX = w / 2;
      const centerY = h / 2;

      const project = (x: number, y: number, z: number) => {
        const rx = x * Math.cos(angle) - z * Math.sin(angle);
        const rz = x * Math.sin(angle) + z * Math.cos(angle);
        const pSize = 600 / (rz + 300);
        return {
          px: centerX + rx * pSize,
          py: centerY + y * pSize,
          ps: pSize * scale,
          z: rz
        };
      };

      // 1. Draw The Living SVDAG (Morphing Geometry)
      const voxelCount = 10;
      const step = 25;
      
      for (let x = -voxelCount/2; x < voxelCount/2; x++) {
        for (let y = -voxelCount/2; y < voxelCount/2; y++) {
          for (let z = -voxelCount/2; z < voxelCount/2; z++) {
            // Morphing logic: Geometry reacts to Time + Collective Utility
            const wave = Math.sin(x * 0.4 + time/1000) * Math.cos(y * 0.4 + time/800);
            const noise = wave + Math.sin(z * 0.3 + time/1200);
            
            // "Autopoiesis" - Threshold changes based on global phase
            if (noise > 1.2 - Math.sin(time/5000) * 0.2) {
              const p = project(x * step, y * step, z * step);
              const alpha = Math.max(0.1, (p.z + 150) / 450);
              
              // Shading based on "State Tensors"
              const isExcavating = noise > 1.8;
              ctx.fillStyle = isExcavating ? `rgba(251, 191, 36, ${alpha * 0.8})` : `rgba(139, 92, 246, ${alpha * 0.3})`;
              ctx.strokeStyle = isExcavating ? `rgba(255, 255, 255, ${alpha})` : `rgba(167, 139, 250, ${alpha * 0.2})`;
              
              ctx.beginPath();
              // Organic Morphing Shape (SDF Simulation)
              const morphRadius = p.ps * (1 + Math.sin(time/500 + x) * 0.2);
              ctx.arc(p.px, p.py, morphRadius/2, 0, Math.PI * 2);
              ctx.fill();
              if (isExcavating) ctx.stroke();
            }
          }
        }
      }

      // 2. Inference Rays (Neural-SDF Mapping)
      morphicNodes.forEach(node => {
        const p = project(node.pos[0], node.pos[1], node.pos[2]);
        
        // Draw Light Beams to "affected" voxels
        ctx.shadowBlur = 20;
        ctx.shadowColor = node.color;
        ctx.strokeStyle = `${node.color}22`;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(centerX, centerY); // Core anchor
        ctx.stroke();

        // Draw Morphic Anchor
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.ps * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
      });

      // 3. HUD Data
      ctx.font = 'bold 10px JetBrains Mono';
      ctx.fillStyle = '#fcd34d';
      ctx.fillText(`MORPH_DELTA: ${(Math.sin(time/1000)*0.5 + 1.2).toFixed(4)} μ-topo`, 30, 40);
      ctx.fillStyle = '#c084fc';
      ctx.fillText(`LATENT_SPACE: 1024_SDF_COEFFS`, 30, 54);
      ctx.fillText(`SYNTHESIS_MODE: AUTOPOIETIC_GROWTH`, 30, 68);

      // Scanning Flare
      const flareY = (time / 5) % h;
      const flareGrad = ctx.createLinearGradient(0, flareY, 0, flareY + 100);
      flareGrad.addColorStop(0, 'transparent');
      flareGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.05)');
      flareGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, flareY, w, 100);

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-xl overflow-hidden border border-amber-500/20 shadow-[0_0_50px_rgba(251,191,36,0.1)] group">
      <div className="absolute top-6 left-6 z-20 space-y-3">
        <div className="flex items-center gap-3">
           <div className="w-4 h-4 bg-amber-500 rounded-full animate-pulse shadow-[0_0_15px_#fbbf24]"></div>
           <span className="text-sm font-black text-white uppercase tracking-[0.3em]">Phase_4: Optical_Reality</span>
        </div>
        <div className="bg-black/60 border border-amber-500/30 px-3 py-1.5 rounded-md backdrop-blur-xl">
           <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest">Morphological_Intelligence: </span>
           <span className="text-[10px] font-mono text-amber-200 font-bold uppercase">SYNTHESIZING_TOPOLOGY</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-2">
         <div className="text-[9px] font-mono text-amber-500/60 uppercase font-black mb-1">Neural_Inference_Stream</div>
         <div className="flex gap-1">
            {Array.from({length: 12}).map((_, i) => (
              <div 
                key={i} 
                className="w-1.5 bg-amber-500/20 rounded-full overflow-hidden h-12 relative"
              >
                <div 
                  className="absolute bottom-0 w-full bg-amber-400 animate-bounce" 
                  style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 100}ms` }}
                ></div>
              </div>
            ))}
         </div>
      </div>

      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="w-full h-full object-cover grayscale-[0.1] brightness-[1.1]"
      />

      {/* Decorative Overlays */}
      <div className="absolute inset-0 pointer-events-none border-[20px] border-amber-500/5"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]"></div>
      
      <div className="absolute top-0 left-0 w-24 h-px bg-gradient-to-r from-amber-500/50 to-transparent"></div>
      <div className="absolute top-0 left-0 w-px h-24 bg-gradient-to-b from-amber-500/50 to-transparent"></div>
    </div>
  );
};

export default OpticalRealityRenderer;
