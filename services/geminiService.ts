
import { GoogleGenAI } from "@google/genai";
import { QuizData } from "../types";

export const generateMarketingPlan = async (data: QuizData): Promise<string> => {
  // Instanciação imediata antes do uso para capturar a chave injetada pelo diálogo aistudio
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const systemInstruction = `
      VOCÊ É O ESTRATEGISTA DE MARKETING PESSOAL E BRANDING MAIS EFICAZ DO MUNDO.
      Sua missão é gerar um Plano de Ação Mensal detalhado (4 Semanas) em Markdown.
      Transforme a experiência do CV em conteúdo estratégico.
      IMPORTANTE: No plano de ação semanal, cada tarefa deve começar com um hífen (-) para ser detectada como item de checklist.
    `;

    const prompt = `
      # INFORMAÇÕES DO USUÁRIO
      * Rede Social: ${data.socialNetwork}
      * Objetivo Principal: ${data.objective}
      * Nicho de Mercado: ${data.niche}
      * Disponibilidade Diária: ${data.dailyTime}
      * Dados de Experiência/CV: ${data.cvText}

      Gere o plano seguindo esta estrutura Markdown:
      1. Diagnóstico da Presença Atual
      2. Checklist de Otimização de Perfil (Bio, Foto, Links)
      3. Pilares de Conteúdo Recomendados
      4. Calendário de 4 Semanas (com tarefas diárias claras marcadas com "-")
      5. Dica de Ouro de Branding
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        systemInstruction, 
        temperature: 0.7 
      },
    });
    
    return response.text || "Erro ao gerar conteúdo.";
  } catch (error: any) {
    console.error("Erro Gemini:", error);
    
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      throw new Error("Limite de uso atingido. Tente novamente em um minuto.");
    }
    
    // Repassa o erro de entidade não encontrada para ser tratado no App.tsx
    throw error;
  }
};

export const generatePostDraft = async (task: string, quizData: QuizData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const prompt = `
      Como um expert em Copywriting, escreva uma legenda completa para um post no ${quizData.socialNetwork}.
      Tema: "${task}"
      Nicho: ${quizData.niche}
      Objetivo: ${quizData.objective}
      Base de Conhecimento: ${quizData.cvText.substring(0, 500)}...
      
      A legenda deve ter:
      - Gancho forte (Hook)
      - Valor prático
      - CTA clara
      - Hashtags estratégicas
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.8 }
    });

    return response.text || "Não foi possível gerar a legenda.";
  } catch (error: any) {
    throw error;
  }
};
