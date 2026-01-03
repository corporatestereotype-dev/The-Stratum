
import { ProjectPhase, PhaseData } from './types';

export const PHASES: PhaseData[] = [
  {
    id: 'p1',
    title: ProjectPhase.MOLECULAR_MATRIX,
    subtitle: 'Sparse Voxel DAG Architecture',
    platform: 'PC Web (WebAssembly/Rust)',
    kpis: ['Memory usage < 100MB per chunk', 'Access time < 10ns'],
    skills: ['Graph Theory', 'Bit-packing', 'Morton Codes'],
    context: "SVDAG allows us to treat the entire world as a single compressed graph where identical sub-volumes are shared pointers rather than duplicated data.",
    requirements: [
      {
        title: 'SVDAG Data Structure',
        description: 'Packed 64-bit integer nodes with child mask bitfields.',
        details: ['Z-Order Curves (Morton Coding)', 'Child Pointers optimization', 'MemoryArena allocator']
      }
    ],
    upskilling: ['Graph Theory', 'Combinatorial Optimization'],
    codeSnippet: {
      language: 'rust',
      code: `struct SvdagNode {
    child_mask: u8,
    child_pointers: Vec<u32>,
}

impl SvdagNode {
    fn traverse(&self, morton_idx: u64) -> Option<u32> {
        let bit = 1 << (morton_idx & 7);
        if self.child_mask & bit != 0 {
            let offset = (self.child_mask & (bit - 1)).count_ones();
            Some(self.child_pointers[offset as usize])
        } else {
            None
        }
    }
}`
    }
  },
  {
    id: 'p2',
    title: ProjectPhase.ENTROPY_ENGINE,
    subtitle: 'Structural Integrity & Thermodynamics',
    platform: 'WebGPU / WebAssembly',
    kpis: ['100,000 active cells < 8ms', 'Collapse logic < 16ms'],
    skills: ['Linear Algebra', 'PDEs', 'Cellular Automata'],
    context: "A voxel-based physics engine where heat and structural load are calculated as propagation across a 3D grid using GPU kernels.",
    requirements: [
      {
        title: 'Structural Propagation',
        description: 'BFS starting from bedrock to calculate load capacity.',
        details: ['Stress Calculation', 'Cascading Failure', 'Asynchronous Processing']
      }
    ],
    upskilling: ['Partial Differential Equations', 'Parallel Computing'],
    codeSnippet: {
      language: 'wgsl',
      code: `@compute @workgroup_size(8, 8, 8)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
    let current_heat = textureLoad(heat_tex, id.xy, 0).r;
    let neighbor_sum = get_neighbors(id.xy);
    let laplacian = neighbor_sum - 4.0 * current_heat;
    
    let next_heat = current_heat + alpha * dt * laplacian;
    textureStore(next_heat_tex, id.xy, vec4<f32>(next_heat, 0.0, 0.0, 1.0));
}`
    }
  },
  {
    id: 'p3',
    title: ProjectPhase.ZERO_STATE_MIND,
    subtitle: 'GOAP & Ecosystem Intelligence',
    platform: 'PC Web (Web Workers)',
    kpis: ['100 active agents', 'Planning < 2ms/agent'],
    skills: ['A* Search', 'Heuristics', 'Markov Chains'],
    context: "Agents plan their own survival by evaluating environmental state changes in real-time without hard-coded state machines.",
    requirements: [
      {
        title: 'GOAP Planner',
        description: 'Regressive planner searching backwards from Goal to Current State.',
        details: ['Cost = Distance + Danger', 'Atomic command units']
      }
    ],
    upskilling: ['A* Algorithms', 'Probabilistic Models'],
    codeSnippet: {
      language: 'typescript',
      code: `class GoapPlanner {
  plan(goal: Goal, state: WorldState, actions: Action[]) {
    const leafNodes = actions.filter(a => a.effects.has(goal));
    return leafNodes.map(node => {
      const remainingGoals = node.preconditions.diff(state);
      return this.recurse(remainingGoals, state, actions);
    }).sort((a, b) => a.cost - b.cost)[0];
  }
}`
    }
  },
  {
    id: 'p4',
    title: ProjectPhase.OPTICAL_REALITY,
    subtitle: 'Nanite-Scale WebGPU Rendering',
    platform: 'WebGPU',
    kpis: ['10M effective voxels @ 60fps'],
    skills: ['Ray-Marching', 'SDFs', 'PBR'],
    context: "Visualizing the SVDAG directly via ray-marching, skipping the overhead of traditional mesh rasterization.",
    requirements: [
      {
        title: 'Hybrid Pipeline',
        description: 'Casting rays through SVDAG volume.',
        details: ['DDA Traversal', 'Triplanar Mapping']
      }
    ],
    upskilling: ['Linear Algebra', 'PBR Equations'],
    codeSnippet: {
      language: 'wgsl',
      code: `fn rayMarch(ro: vec3f, rd: vec3f) -> f32 {
    var t = 0.0;
    for (var i = 0; i < 128; i++) {
        let p = ro + rd * t;
        let d = map_svdag(p);
        if (d < 0.001 || t > 100.0) { break; }
        t += d;
    }
    return t;
}`
    }
  },
  {
    id: 'p5',
    title: ProjectPhase.SYSTEMIC_HARDENING,
    subtitle: 'Wasm, Threading & Memory Safety',
    platform: 'PC Web (Rust/Wasm)',
    kpis: ['Main thread < 5ms', 'Zero GC pauses'],
    skills: ['Parallel Computation', 'SIMD', 'Cache Locality'],
    context: "Ensuring the engine scales to 16+ cores using SharedArrayBuffer and low-latency synchronization primitives.",
    requirements: [
      {
        title: 'Wasm Architecture',
        description: 'SharedArrayBuffer for zero-copy data sharing.',
        details: ['Job System', 'Atomics']
      }
    ],
    upskilling: ['Cache optimization', 'Concurrent Programming'],
    codeSnippet: {
      language: 'rust',
      code: `#[wasm_bindgen]
pub fn process_parallel(data: &mut [f32]) {
    data.par_iter_mut().for_each(|val| {
        let x = *val;
        *val = x.sqrt() * 0.5;
    });
}

// Memory sharing via Atomics
// let status = Atomics.wait(sharedBuffer, 0, 0);`
    }
  }
];
