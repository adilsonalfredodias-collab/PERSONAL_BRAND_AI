
/* Fix: Removed 'vite/client' reference which was not found by the compiler */

declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}

/* Added types for Gemini AI Studio API key management - matching the global AIStudio type and modifiers to resolve redeclaration conflicts */
interface Window {
  readonly aistudio: AIStudio;
}

/* Fix: Removed the redundant 'declare var process' to avoid redeclaration errors with global node types */
