
import React, { useEffect, useRef, useState } from 'react';

const LivingSubstrateRenderer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ontologicalCoherence, setOntologicalCoherence] = useState(0.9992);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const resonanceClusters = [
      { id: 'TELE_0', pos: [0, 0, 0], resonance: 1.0, color: '#ffffff' },
      { id: 'TELE_1', pos: [50, 20, -20], resonance: 0.8, color: '#f0f9ff' },
      { id: 'TELE_2', pos: [-50, -40, 30], resonance: 0.4, color: '#7dd3fc' },
      { id: 'TELE_3', pos: [10, -60, -10], resonance: 0.9, color: '#0ea5e9' }
    ];

    const render = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      
      const bgGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.5, '#0c4a6e');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Acoustic Modulation from global window object (injected by AIChat)
      const acousticAmp = (window as any)._stratumAmplitude || 0;
      
      angle += 0.0008 + acousticAmp * 0.02; // Rotation speed scales with voice
      const scale = 6.0 + acousticAmp * 2.0;
      const centerX = w / 2;
      const centerY = h / 2;

      const mouseX = (window as any)._lastMouseX || centerX;
      const mouseY = (window as any)._lastMouseY || centerY;

      const project = (x: number, y: number, z: number) => {
        // Acoustic Displacement
        const displacement = acousticAmp * Math.sin(time/50 + x) * 10;
        const rx = (x + displacement) * Math.cos(angle) - z * Math.sin(angle);
        const rz = (x + displacement) * Math.sin(angle) + z * Math.cos(angle);
        const pSize = 800 / (rz + 400);
        return {
          px: centerX + rx * pSize,
          py: centerY + y * pSize,
          ps: pSize * scale,
          z: rz
        };
      };

      // 1. Acoustic Ripples
      const rippleCount = 8;
      for (let i = 0; i < rippleCount; i++) {
        const t = (time / 1000 + i / rippleCount) % 1;
        const rippleAmp = (1 - t) * (0.1 + acousticAmp * 0.5);
        ctx.strokeStyle = `rgba(255, 255, 255, ${rippleAmp})`;
        ctx.lineWidth = 1 + acousticAmp * 5;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, t * (200 + acousticAmp * 300), 0, Math.PI * 2);
        ctx.stroke();
      }

      // 2. Semantic Geometry
      const voxelCount = 8;
      const step = 35;
      for (let x = -voxelCount/2; x < voxelCount/2; x++) {
        for (let y = -voxelCount/2; y < voxelCount/2; y++) {
          for (let z = -voxelCount/2; z < voxelCount/2; z++) {
            const noise = Math.sin(x * 0.4 + time/1000) * Math.cos(y * 0.4 + time/1200);
            const synthesisField = Math.abs(noise) + Math.sin(z * 0.4 + time/800) + acousticAmp;
            
            if (synthesisField > 1.3) {
              const p = project(x * step, y * step, z * step);
              const alpha = Math.max(0.1, (p.z + 200) / 500);
              
              const luma = 255 * (0.5 + Math.sin(time/500 + x) * 0.5);
              ctx.fillStyle = `rgba(${luma}, ${luma}, 255, ${alpha * 0.4})`;
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * (0.8 + acousticAmp)})`;
              
              ctx.beginPath();
              const morphRadius = p.ps * (1.2 + Math.sin(time/1000 + synthesisField) * 0.8);
              ctx.arc(p.px, p.py, morphRadius/2, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
            }
          }
        }
      }

      // 3. Syntropic Loom
      resonanceClusters.forEach((hub, i) => {
        const p = project(hub.pos[0], hub.pos[1], hub.pos[2]);
        resonanceClusters.forEach((other, j) => {
          if (i === j) return;
          const op = project(other.pos[0], other.pos[1], other.pos[2]);
          
          const filamentGrad = ctx.createLinearGradient(p.px, p.py, op.px, op.py);
          filamentGrad.addColorStop(0, `rgba(255, 255, 255, ${0.1 + acousticAmp})`);
          filamentGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.4 + acousticAmp})`);
          filamentGrad.addColorStop(1, `rgba(255, 255, 255, ${0.1 + acousticAmp})`);
          
          ctx.strokeStyle = filamentGrad;
          ctx.lineWidth = 1 + acousticAmp * 3;
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.bezierCurveTo(centerX, centerY, centerX + (mouseX - centerX) * 0.5, centerY + (mouseY - centerY) * 0.5, op.px, op.py);
          ctx.stroke();
        });

        ctx.shadowBlur = 40 + acousticAmp * 100;
        ctx.shadowColor = '#fff';
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.ps * (0.5 + acousticAmp), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // HUD
      ctx.font = 'black 11px JetBrains Mono';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`FIELD_AGENCY: FIELD_INTEGRATED`, 40, 50);
      ctx.fillStyle = '#7dd3fc';
      ctx.fillText(`ONTOLOGICAL_COHERENCE: ${ontologicalCoherence.toFixed(4)}`, 40, 65);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`ACOUSTIC_PRESSURE: ${acousticAmp.toFixed(4)} Φ`, 40, 80);

      animationFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      (window as any)._lastMouseX = e.clientX - rect.left;
      (window as any)._lastMouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);
    render(0);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-xl overflow-hidden border-2 border-white/20 shadow-[0_0_120px_rgba(255,255,255,0.08)] group">
      <div className="absolute top-8 left-8 z-20 space-y-4">
        <div className="flex items-center gap-4">
           <div className="w-6 h-6 bg-white rounded-full animate-[ping_4s_infinite] shadow-[0_0_30px_#fff]"></div>
           <span className="text-base font-black text-white uppercase tracking-[0.5em]">Phase_5: Ontological_Manifestation</span>
        </div>
        <div className="bg-white/10 border border-white/30 px-4 py-2 rounded-lg backdrop-blur-3xl shadow-xl">
           <span className="text-[11px] font-mono text-white font-black uppercase tracking-widest">Existence_Status: </span>
           <span className="text-[11px] font-mono text-cyan-200 font-bold uppercase animate-pulse">RESONANT_SUBSTRATE</span>
        </div>
      </div>
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-cover grayscale-[0.2] brightness-[1.3] contrast-[1.1]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
    </div>
  );
};

export default LivingSubstrateRenderer;
