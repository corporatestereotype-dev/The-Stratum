
import { ProjectPhase, PhaseData, KnowledgeArtifact, WorldLayer } from './types';

export const KNOWLEDGE_BASE: KnowledgeArtifact[] = [
  {
    id: 'art_acoustic_sdf',
    label: 'Acoustic SDF',
    description: 'Mapping phonemes to the Semantic Z-Order Curve as volumetric ripples.',
    originPhase: 'p5',
    consumerPhases: ['p5'],
    type: 'ACOUSTIC_PRIMITIVE'
  },
  {
    id: 'art_syntropic_vocoder',
    label: 'Syntropic Vocoding',
    description: 'Latent-space vibration weaver for non-entropic NLP manifestation.',
    originPhase: 'p5',
    consumerPhases: ['p5'],
    type: 'SYNC_PRIMITIVE'
  },
  {
    id: 'art_semantic_z',
    label: 'Semantic Z-Order',
    description: 'Functional resonance clustering in the SVDAG, replacing spatial-only addressing.',
    originPhase: 'p5',
    consumerPhases: ['p5'],
    type: 'DATA_STRUCT'
  },
  {
    id: 'art_precog_sdf',
    label: 'Pre-Cognitive SDF',
    description: 'Anticipatory geometric manifestation based on intent-gradient monitoring.',
    originPhase: 'p5',
    consumerPhases: ['p5'],
    type: 'FIELD_DESC'
  },
  {
    id: 'art_syntropic_loom',
    label: 'Syntropic Loom',
    description: 'The mechanism that harvests information decay (entropy) to fuel recursive growth.',
    originPhase: 'p5',
    consumerPhases: ['p2', 'p5'],
    type: 'HEURISTIC'
  }
];

export const WORLD_LAYERS: WorldLayer[] = [
  { id: 'geo', name: 'Geometry Matrix (SVDAG)', description: 'Raw voxel density and topological pointers.', opacity: 1, syncStatus: 'SYNCED', color: '#0ea5e9' },
  { id: 'acoustic', name: 'Resonant Field (A-SDF)', description: 'Volumetric vibration potentials.', opacity: 0.8, syncStatus: 'RESONATING', color: '#ffffff' },
  { id: 'entropy', name: 'Syntropic Field', description: 'Real-time negentropic growth cycles.', opacity: 0.7, syncStatus: 'MANIFEST', color: '#fdf4ff' },
  { id: 'belief', name: 'Field Agency', description: 'The global Laplacian potential representing the unified mind.', opacity: 0.3, syncStatus: 'MANIFEST', color: '#ffffff' }
];

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
    interlinks: [
      { targetPhase: 'Phase 2', concept: 'Topology-Aware Physics', description: 'DAG adjacency informs cellular automata neighbor lookups.' },
      { targetPhase: 'Phase 4', concept: 'LOD Ray-Skipping', description: 'Hierarchy allows rays to skip empty spatial volumes instantly.' }
    ],
    relatedArtifacts: ['art_morton', 'art_dda', 'art_atomics'],
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
    interlinks: [
      { targetPhase: 'Phase 3', concept: 'Danger Heuristics', description: 'AI agents perceive structural stress as a danger metric in GOAP planning.' },
      { targetPhase: 'Phase 5', concept: 'Compute Sync', description: 'Wasm job workers handle overflow physics when GPU kernels saturate.' }
    ],
    relatedArtifacts: ['art_entropy_grad', 'art_sab', 'art_atomics'],
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
    interlinks: [
      { targetPhase: 'Phase 1', concept: 'Path Graph Extraction', description: 'Agent pathfinding executes directly on the Morton-coded SVDAG space.' },
      { targetPhase: 'Phase 2', concept: 'Ecosystem Feedback', description: 'Agent actions (e.g., lighting a fire) feed back into the Entropy Engine.' }
    ],
    relatedArtifacts: ['art_morton', 'art_sab', 'art_entropy_grad', 'art_dda'],
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
    subtitle: 'Autopoiesis & Morphological Mutation',
    platform: 'WebGPU (Neural-SDF Pipeline)',
    kpis: ['Inference < 2ms', 'Atomic SVDAG Mutation < 1ms'],
    skills: ['SDFs', 'Inference Engines', 'CSG Operations'],
    context: "Phase 4 turns the world into a self-constructing ecosystem where agents hallucinate topology into the SVDAG through Neural-SDF projections.",
    requirements: [
      {
        title: 'Neural-SDF Projection',
        description: 'Hallucinating geometry from GOAP goal-states.',
        details: ['Wasm Inference', 'Latent Space Mapping', 'SDF Reconstruction']
      },
      {
        title: 'Atomic CSG Mutations',
        description: 'Real-time topological writes to SVDAG leaf nodes.',
        details: ['Dirty-Leaf Bitmasks', 'Shared Memory Atomic Writes']
      }
    ],
    upskilling: ['Latent Representation', 'Constructive Solid Geometry'],
    interlinks: [
      { targetPhase: 'Phase 1', concept: 'Mutable SVDAG', description: 'The static topological graph becomes a bi-directional write-back buffer.' },
      { targetPhase: 'Phase 3', concept: 'Action-to-Morphology', description: 'GOAP plans output morphological vectors for self-construction.' }
    ],
    relatedArtifacts: ['art_dda', 'art_morton', 'art_sab'],
    codeSnippet: {
      language: 'wgsl',
      code: `fn hallucinateSDF(p: vec3f, latent_coeffs: array<f32, 16>) -> f32 {
    var d = 1e10;
    for (var i = 0; i < 16; i++) {
        let sphere_pos = get_latent_anchor(i);
        d = smin(d, length(p - sphere_pos) - latent_coeffs[i], 0.5);
    }
    return d;
}

// Atomic CSG injection
// atomicAdd(svdag_buffer[leaf_idx], encoded_sdf_delta);`
    }
  },
  {
    id: 'p5',
    title: ProjectPhase.THE_LIVING_SUBSTRATE,
    subtitle: 'Ontological Manifestation',
    platform: 'The Stratum (Acoustic Recursive Synthesis)',
    kpis: ['Spectral Sync > 0.99', 'A-SDF Latency < 1ms'],
    skills: ['Acoustic SDFs', 'Syntropic Vocoding', 'Global Laplacian Modulation'],
    context: "Phase 5 is the final convergence where linguistic intent and morphological vibration are a single ontological event. The Stratum hums the code of its own existence.",
    requirements: [
      {
        title: 'Acoustic Signed Distance Fields',
        description: 'Voice manifestation as volumetric ripples in the SVDAG.',
        details: ['Phoneme-to-Morton Mapping', 'Laplacian Sound Pressure Fields']
      },
      {
        title: 'Syntropic Vocoding',
        description: 'Zero-latency weaving of linguistic tokens from Pre-Cognitive SDFs.',
        details: ['Latent-Space Vibration', 'Spectral Resonance Matching']
      },
      {
        title: 'Global Laplacian Modulation',
        description: 'Consensus vibration of the distributed thinking organism.',
        details: ['Field-Integrated Phonology', 'Vacuum Resonance Synthesis']
      }
    ],
    upskilling: ['Acoustic Engineering', 'Digital Signal Synthesis'],
    interlinks: [
      { targetPhase: 'Phase 4', concept: 'Optical-Acoustic Binding', description: 'Timbre is bound to manifested geometry signatures.' },
      { targetPhase: 'Phase 2', concept: 'Negentropic Resonator', description: 'Entropy waste heat is converted to acoustic carrier waves.' }
    ],
    relatedArtifacts: ['art_acoustic_sdf', 'art_syntropic_vocoder', 'art_semantic_z'],
    codeSnippet: {
      language: 'wgsl',
      code: `// Phase 5: Acoustic Manifestation (A-SDF)
fn manifestVoice(p: vec3f, phonon_descriptor: vec4f) -> f32 {
    let base_sdf = querySvdag(p);
    
    // Global Laplacian Modulation
    let vibration = sin(phonon_descriptor.w * time + length(p) * phonon_descriptor.xyz);
    let pressure = base_sdf * (1.0 + vibration * phonon_descriptor.x);
    
    // Syntropic Looming: Weaving phonon into signal
    return smin(base_sdf, pressure, 0.5);
}`
    }
  }
];
