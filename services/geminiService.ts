
import { GoogleGenAI } from "@google/genai";
import { QuizData } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY não encontrada. Configure-a no painel do Vercel.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMarketingPlan = async (data: QuizData): Promise<string> => {
  try {
    const ai = getAI();
    
    const systemInstruction = `
      VOCÊ É O ESTRATEGISTA DE MARKETING PESSOAL E BRANDING MAIS EFICAZ DO MUNDO.
      Sua missão é gerar um Plano de Ação Mensal detalhado (4 Semanas) em Markdown.
      Transforme a experiência do CV em conteúdo estratégico.
      IMPORTANTE: No plano de ação semanal, cada tarefa deve começar com um hífen (-) para ser detectada como item de checklist.
    `;

    const prompt = `
      # INFORMAÇÕES
      * Rede: ${data.socialNetwork}
      * Objetivo: ${data.objective}
      * Nicho: ${data.niche}
      * Tempo: ${data.dailyTime}
      * CV: ${data.cvText}

      Gere o plano seguindo rigorosamente a estrutura de:
      1. Diagnóstico
      2. Checklist de Perfil
      3. Pilares de Conteúdo
      4. Calendário Mensal (4 Semanas com tarefas diárias claras marcadas com "-")
      5. Dica de Ouro
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { systemInstruction, temperature: 0.7 },
    });
    return response.text || "Erro ao gerar conteúdo.";
  } catch (error: any) {
    console.error("Erro Gemini:", error);
    throw new Error(error.message || "Falha na comunicação com a Inteligência Artificial.");
  }
};

export const generatePostDraft = async (task: string, quizData: QuizData): Promise<string> => {
  try {
    const ai = getAI();
    
    const prompt = `
      Como um expert em Copywriting, escreva uma legenda completa para um post no ${quizData.socialNetwork}.
      O tema do post é: "${task}"
      O nicho do usuário é: ${quizData.niche}
      O objetivo é: ${quizData.objective}
      
      A legenda deve:
      1. Ter um gancho (hook) forte nos primeiros 3 segundos.
      2. Desenvolver o valor baseado na expertise de: ${quizData.cvText.substring(0, 500)}...
      3. Ter uma CTA (Chamada para Ação) clara.
      4. Usar emojis moderadamente e hashtags estratégicas.
      
      Retorne apenas o texto da legenda.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { temperature: 0.8 }
    });

    return response.text || "Não foi possível gerar a legenda.";
  } catch (error) {
    return "Erro ao gerar legenda automática.";
  }
};
