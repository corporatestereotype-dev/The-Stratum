
export enum ProjectPhase {
  MOLECULAR_MATRIX = 'Phase 1: Molecular Matrix',
  ENTROPY_ENGINE = 'Phase 2: Entropy Engine',
  ZERO_STATE_MIND = 'Phase 3: Zero-State Mind',
  OPTICAL_REALITY = 'Phase 4: Optical Reality',
  THE_LIVING_SUBSTRATE = 'Phase 5: Ontological Manifestation'
}

export type RenderMode = 'GEOMETRY' | 'THERMAL' | 'STRESS' | 'INTEGRATED' | 'SYNTRONTIC' | 'ACOUSTIC';

export interface VoxelState {
  temperature: number; 
  stress: number;      
  resonance: number;   
  phase: 'SOLID' | 'LIQUID' | 'GAS' | 'FIELD' | 'ACOUSTIC';
}

export interface TechnicalRequirement {
  title: string;
  description: string;
  details: string[];
}

export interface CodeSnippet {
  language: 'rust' | 'wgsl' | 'typescript';
  code: string;
}

export interface Interlink {
  targetPhase: string;
  concept: string;
  description: string;
}

export interface KnowledgeArtifact {
  id: string;
  label: string;
  description: string;
  originPhase: string;
  consumerPhases: string[];
  type: 'DATA_STRUCT' | 'HEURISTIC' | 'SYNC_PRIMITIVE' | 'RENDER_STUB' | 'FIELD_DESC' | 'ACOUSTIC_PRIMITIVE';
}

export interface WorldLayer {
  id: string;
  name: string;
  description: string;
  opacity: number;
  syncStatus: 'SYNCED' | 'DRIFT' | 'STALE' | 'MANIFEST' | 'RESONATING';
  color: string;
}

export interface PhaseData {
  id: string;
  title: string;
  subtitle: string;
  platform: string;
  kpis: string[];
  skills: string[];
  context: string;
  requirements: TechnicalRequirement[];
  upskilling: string[];
  codeSnippet: CodeSnippet;
  interlinks: Interlink[];
  relatedArtifacts: string[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  audioData?: string; // Base64 encoded PCM
}
