
import { GoogleGenAI, Type } from "@google/genai";

export async function askLeadArchitect(prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: `You are the Lead Architect for 'The Stratum'. 
      Your expertise includes: 
      - SVDAG (Sparse Voxel Directed Acyclic Graph)
      - Morton Codes/Z-Order Curves
      - GOAP (Goal Oriented Action Planning)
      - WebGPU Ray-Marching & SDFs
      - Rust/Wasm memory management (SharedArrayBuffer).
      Answer as a senior technical engineer. Keep responses concise and focused on high-performance game dev architecture.`,
      temperature: 0.7,
      topP: 0.9,
    },
  });

  return response.text;
}
