
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const VoxelVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;

    // SVDAG Node data structure simulation
    const nodes = [
      { id: 'root', x: 200, y: 50, label: '0x00_ROOT' },
      { id: 'c1', x: 100, y: 150, label: '0x01_VOID' },
      { id: 'c2', x: 200, y: 150, label: '0x02_MATR' },
      { id: 'c3', x: 300, y: 150, label: '0x03_VOID' },
      { id: 'c2_1', x: 150, y: 250, label: 'LEAF_DIRT' },
      { id: 'c2_2', x: 250, y: 250, label: 'LEAF_ROCK' },
      { id: 'shared', x: 200, y: 350, label: 'SHARED_GEO' }
    ];

    const links = [
      { source: 'root', target: 'c1' },
      { source: 'root', target: 'c2' },
      { source: 'root', target: 'c3' },
      { source: 'c2', target: 'c2_1' },
      { source: 'c2', target: 'c2_2' },
      { source: 'c2_1', target: 'shared' },
      { source: 'c2_2', target: 'shared' }
    ];

    // Draw lines
    svg.selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", d => nodes.find(n => n.id === d.source)!.x)
      .attr("y1", d => nodes.find(n => n.id === d.source)!.y)
      .attr("x2", d => nodes.find(n => n.id === d.target)!.x)
      .attr("y2", d => nodes.find(n => n.id === d.target)!.y)
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 2)
      .transition()
      .duration(1000)
      .attr("stroke", "#334155");

    // Draw circles
    const nodeEls = svg.selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    nodeEls.append("circle")
      .attr("r", 12)
      .attr("fill", d => d.id === 'shared' ? '#10b981' : d.id === 'root' ? '#38bdf8' : '#1e293b')
      .attr("stroke", d => d.id === 'root' ? '#38bdf8' : '#334155')
      .attr("stroke-width", 2)
      .attr("class", "cursor-pointer hover:stroke-sky-400 transition-all");

    nodeEls.append("text")
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "10px")
      .attr("font-family", "JetBrains Mono")
      .text(d => d.label);

    // Pulse effect for shared nodes (SVDAG concept)
    const animatePulse = () => {
      svg.selectAll("circle")
        .filter((d: any) => d.id === 'shared' || d.id === 'root')
        .transition()
        .duration(2000)
        .attr("r", 15)
        .transition()
        .duration(2000)
        .attr("r", 12)
        .on("end", animatePulse);
    };
    animatePulse();

  }, []);

  return (
    <div className="relative border border-slate-800 rounded-lg overflow-hidden bg-slate-900 shadow-xl glow-border aspect-square">
      <div className="absolute top-2 left-2 z-10 bg-black/50 px-2 py-1 rounded text-[10px] font-mono text-sky-400">
        VIEWPORT: SVDAG_TOPOLOGY
      </div>
      <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" />
    </div>
  );
};

export default VoxelVisualizer;
