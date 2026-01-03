
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { PhaseData, KnowledgeArtifact } from '../types';
import { KNOWLEDGE_BASE } from '../constants';

interface TopologyProps {
  currentPhase: PhaseData;
}

const KnowledgeTopology: React.FC<TopologyProps> = ({ currentPhase }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredArtifact, setHoveredArtifact] = useState<KnowledgeArtifact | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 450;
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.selectAll("*").remove();

    // Definitions for glows
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "blur");
    const merge = filter.append("feMerge");
    merge.append("feMergeNode").attr("in", "blur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    // Construct graph data
    // Nodes: Current Phase Hub + Related Artifacts
    const nodes: any[] = [
      { id: currentPhase.id, label: currentPhase.subtitle, type: 'HUB', group: 0 }
    ];

    KNOWLEDGE_BASE.forEach(art => {
      if (art.originPhase === currentPhase.id || art.consumerPhases.includes(currentPhase.id)) {
        nodes.push({ ...art, type: 'ARTIFACT', group: 1 });
      }
    });

    const links: any[] = nodes.filter(n => n.type === 'ARTIFACT').map(n => ({
      source: currentPhase.id,
      target: n.id,
      value: 1
    }));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#0ea5e9")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "4,4");

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "cursor-pointer")
      .on("mouseenter", (event, d: any) => {
        if (d.type === 'ARTIFACT') setHoveredArtifact(d);
        d3.select(event.currentTarget).select("circle").attr("stroke-width", 3).attr("stroke", "#38bdf8");
      })
      .on("mouseleave", (event) => {
        setHoveredArtifact(null);
        d3.select(event.currentTarget).select("circle").attr("stroke-width", 2).attr("stroke", d => (d as any).type === 'HUB' ? '#38bdf8' : '#1e293b');
      });

    node.append("circle")
      .attr("r", d => d.type === 'HUB' ? 30 : 12)
      .attr("fill", d => d.type === 'HUB' ? '#0f172a' : '#0ea5e9')
      .attr("stroke", d => d.type === 'HUB' ? '#38bdf8' : '#1e293b')
      .attr("stroke-width", 2)
      .attr("filter", "url(#glow)");

    node.append("text")
      .attr("dy", d => d.type === 'HUB' ? 45 : 25)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "10px")
      .attr("font-family", "JetBrains Mono")
      .attr("font-weight", "bold")
      .text(d => d.label);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x}, ${d.y})`);
    });

    return () => simulation.stop();
  }, [currentPhase]);

  return (
    <div className="relative border border-slate-800 rounded-lg overflow-hidden bg-slate-950 shadow-2xl glow-border aspect-square group">
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        <div className="bg-sky-500/10 border border-sky-500/30 px-2 py-1 rounded text-[10px] font-mono text-sky-400 font-bold">
          KNOWLEDGE_TOPOLOGY_LAYER // {currentPhase.id.toUpperCase()}
        </div>
        <div className="text-[8px] text-slate-600 font-mono uppercase tracking-widest pl-1">
          Visualizing systemic data fusion
        </div>
      </div>

      <svg ref={svgRef} className="w-full h-full" />

      {hoveredArtifact && (
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 border border-sky-500/50 p-3 rounded backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <div className="text-[10px] font-black text-sky-400 uppercase mb-1 tracking-tighter">
            Artifact: {hoveredArtifact.label}
          </div>
          <div className="text-[9px] text-slate-300 leading-tight mb-2">
            {hoveredArtifact.description}
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
             <span className="text-[8px] text-slate-500 uppercase">Origin: {hoveredArtifact.originPhase}</span>
             <span className="text-[8px] text-sky-600 font-bold uppercase">Consum: {hoveredArtifact.consumerPhases.join(', ')}</span>
          </div>
        </div>
      )}

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-sky-500/30"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-sky-500/30"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-sky-500/30"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-sky-500/30"></div>
    </div>
  );
};

export default KnowledgeTopology;
