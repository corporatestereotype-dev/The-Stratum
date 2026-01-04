
import React, { useEffect, useRef, useState } from 'react';

const SvdagTraversalVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Simulation constants
      const centerX = w / 2;
      const centerY = h / 2;
      const cubeSize = 140;

      // Isometric projection
      const iso = (x: number, y: number, z: number) => {
        return {
          px: centerX + (x - y) * Math.cos(Math.PI / 6),
          py: centerY + (x + y) * Math.sin(Math.PI / 6) - z
        };
      };

      // Draw Base Grid (Morton Z-Order Representation)
      ctx.strokeStyle = '#1e293b';
      ctx.setLineDash([2, 4]);
      for(let i = -2; i <= 2; i++) {
        const start1 = iso(i * 40, -80, 0);
        const end1 = iso(i * 40, 80, 0);
        ctx.beginPath();
        ctx.moveTo(start1.px, start1.py);
        ctx.lineTo(end1.px, end1.py);
        ctx.stroke();

        const start2 = iso(-80, i * 40, 0);
        const end2 = iso(80, i * 40, 0);
        ctx.beginPath();
        ctx.moveTo(start2.px, start2.py);
        ctx.lineTo(end2.px, end2.py);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Simulate Ray-Marching
      const rayProgress = (time / 2000) % 1;
      const rayX = -120 + 240 * rayProgress;
      const rayY = -40;
      const rayZ = 40;

      // Draw Ray
      const rayStart = iso(-120, -40, 40);
      const rayCurrent = iso(rayX, rayY, rayZ);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0ea5e9';
      ctx.beginPath();
      ctx.moveTo(rayStart.px, rayStart.py);
      ctx.lineTo(rayCurrent.px, rayCurrent.py);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Octree Nodes (Simulated Traversal)
      const drawNode = (x: number, y: number, z: number, size: number, mask: number, depth: number) => {
        const p = iso(x, y, z);
        
        // If ray is near this node, highlight it
        const dist = Math.sqrt((rayX - x)**2 + (rayY - y)**2 + (rayZ - z)**2);
        const isHit = dist < size * 1.5;

        ctx.strokeStyle = isHit ? '#0ea5e9' : '#1e293b';
        ctx.lineWidth = isHit ? 1.5 : 0.5;
        
        // Draw pseudo-cube
        const p1 = iso(x - size, y - size, z - size);
        const p2 = iso(x + size, y - size, z - size);
        const p3 = iso(x + size, y + size, z - size);
        const p4 = iso(x - size, y + size, z - size);
        const p5 = iso(x - size, y - size, z + size);
        const p6 = iso(x + size, y - size, z + size);
        const p7 = iso(x + size, y + size, z + size);
        const p8 = iso(x - size, y + size, z + size);

        const edges = [[p1,p2],[p2,p3],[p3,p4],[p4,p1],[p5,p6],[p6,p7],[p7,p8],[p8,p5],[p1,p5],[p2,p6],[p3,p7],[p4,p8]];
        edges.forEach(e => {
          ctx.beginPath();
          ctx.moveTo(e[0].px, e[0].py);
          ctx.lineTo(e[1].px, e[1].py);
          ctx.stroke();
        });

        if (isHit && depth < 2) {
          // Recurse into octants
          for(let i = 0; i < 8; i++) {
            if (mask & (1 << i)) {
              const off = size / 2;
              const ox = x + (i & 1 ? off : -off);
              const oy = y + (i & 2 ? off : -off);
              const oz = z + (i & 4 ? off : -off);
              drawNode(ox, oy, oz, size / 2, mask, depth + 1);
            }
          }
        }
      };

      drawNode(0, 0, 0, 60, 0b10110011, 0);

      // HUD Text
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 10px JetBrains Mono';
      ctx.fillText(`RAY_POS: [${rayX.toFixed(0)}, ${rayY.toFixed(0)}, ${rayZ.toFixed(0)}]`, 20, 30);
      ctx.fillText(`TRAVERSAL_STACK: ${isHitNear(rayX, 0) ? 'DEPTH_2' : 'DEPTH_1'}`, 20, 45);
      ctx.fillText(`INTERROGATION: POPCOUNT(MASK & (1 << BIT))`, 20, 60);

      animationFrameId = requestAnimationFrame(render);
    };

    const isHitNear = (val: number, target: number) => Math.abs(val - target) < 40;

    render(0);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative bg-black/40 border border-slate-800 rounded-lg overflow-hidden h-full group">
      <div className="absolute top-4 left-4 z-10 space-y-1">
        <div className="bg-sky-500/10 border border-sky-500/40 px-2 py-1 rounded text-[9px] font-mono text-sky-400 font-black uppercase">
          Render_Kernel: SVDAG_Marcher_v0.1
        </div>
        <div className="text-[8px] text-slate-500 font-mono uppercase tracking-[0.2em] pl-1">
          Stackless Octree Interrogation
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        width={500} 
        height={400} 
        className="w-full h-full cursor-crosshair"
      />

      {/* Traversal Log */}
      <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 border border-slate-800 p-2 rounded backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="text-[8px] font-mono text-sky-600 mb-1 font-bold">SYSLOG // TRAVERSAL_TRACE</div>
         <div className="flex flex-col gap-0.5">
            <div className="flex justify-between text-[7px] text-slate-500">
               <span>ENTER_NODE: 0x00_ROOT</span>
               <span className="text-emerald-500">HIT</span>
            </div>
            <div className="flex justify-between text-[7px] text-slate-500">
               <span>BITMASK_TEST: 0b10110011 & (1 &lt;&lt; 4)</span>
               <span className="text-rose-500">SKIP</span>
            </div>
            <div className="flex justify-between text-[7px] text-slate-500">
               <span>POINTER_JUMP: 0x02_MATR</span>
               <span className="text-sky-500">ACTIVE</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SvdagTraversalVisualizer;
