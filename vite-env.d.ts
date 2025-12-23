
/* Fix: Removed 'vite/client' reference which was not found by the compiler */

declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}

/* Added types for Gemini AI Studio API key management */
interface Window {
  aistudio: {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  };
}

/* Fix: Removed the redundant 'declare var process' to avoid redeclaration errors with global node types */
