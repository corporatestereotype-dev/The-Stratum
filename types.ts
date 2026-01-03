
export enum ProjectPhase {
  MOLECULAR_MATRIX = 'Phase 1: Molecular Matrix',
  ENTROPY_ENGINE = 'Phase 2: Entropy Engine',
  ZERO_STATE_MIND = 'Phase 3: Zero-State Mind',
  OPTICAL_REALITY = 'Phase 4: Optical Reality',
  SYSTEMIC_HARDENING = 'Phase 5: Systemic Hardening'
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
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
