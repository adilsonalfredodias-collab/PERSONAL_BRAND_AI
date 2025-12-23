
import React, { useState, useCallback, useEffect } from 'react';
import { QuizData, AppState, ActionPlan } from './types';
import { generateMarketingPlan } from './services/geminiService';
import LandingPage from './components/LandingPage';
import QuizStep from './components/QuizStep';
import ProcessingStep from './components/ProcessingStep';
import ResultDashboard from './components/ResultDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import { Rocket, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'landing',
    quizData: {
      objective: 'Autoridade',
      socialNetwork: 'LinkedIn',
      dailyTime: '1 hora',
      niche: '',
      profileUrl: '',
      cvText: '',
    },
    result: null,
    error: null,
  });

  const [keySelected, setKeySelected] = useState<boolean | null>(null);

  const checkKey = useCallback(async () => {
    if (typeof window !== 'undefined' && window.aistudio) {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setKeySelected(hasKey);
      } catch (e) {
        setKeySelected(false);
      }
    } else {
      // Se não houver aistudio no window, assume que está em ambiente dev normal
      setKeySelected(true);
    }
  }, []);

  useEffect(() => {
    checkKey();
  }, [checkKey]);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume sucesso após abertura para mitigar race conditions
      setKeySelected(true);
    }
  };

  // Fix: Implemented startQuiz to change the app state and move to the quiz step
  const startQuiz = () => {
    setState(prev => ({ ...prev, step: 'quiz' }));
  };

  const handleQuizSubmit = async (data: QuizData) => {
    setState(prev => ({ ...prev, quizData: data, step: 'processing', error: null }));
    
    try {
      const planMarkdown = await generateMarketingPlan(data);
      setState(prev => ({
        ...prev,
        step: 'result',
        result: { markdown: planMarkdown }
      }));
    } catch (err: any) {
      console.error("Erro na execução:", err);
      let errorMessage = "Ocorreu um erro ao gerar seu plano.";

      // Verificação específica solicitada nas diretrizes para resetar chave de API
      if (err.message && (
          err.message.includes("Requested entity was not found") || 
          err.message.includes("API_KEY_INVALID") ||
          err.message.includes("401") ||
          err.message.includes("403")
      )) {
        setKeySelected(false);
        errorMessage = "Sua chave de API expirou ou é inválida. Por favor, selecione uma chave de um projeto com faturamento ativo.";
      } else {
        errorMessage = err.message || "Falha na comunicação com a IA.";
      }

      setState(prev => ({ 
        ...prev, 
        step: 'quiz', 
        error: errorMessage 
      }));
    }
  };

  const restart = () => setState(prev => ({ ...prev, step: 'landing', result: null, error: null }));

  if (keySelected === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
          <div className="bg-amber-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-amber-50">
            <ShieldAlert className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Ação Necessária</h2>
          <p className="text-slate-600 mb-10 leading-relaxed text-sm">
            Para utilizar os modelos <strong>Gemini 3</strong>, você precisa selecionar uma chave de API de um projeto Google Cloud válido.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleOpenKeySelector}
              className="w-full bg-indigo-600 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95"
            >
              Conectar Chave de API
            </button>
            <p className="text-[10px] text-slate-400 font-medium px-4">
              Nota: Projetos gratuitos podem ter restrições. Recomenda-se um projeto com faturamento configurado.
            </p>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-[10px] text-indigo-600 font-bold uppercase tracking-tighter hover:underline"
            >
              Documentação de Faturamento
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100">
      <Header onLogoClick={restart} />
      
      <main className="flex-grow">
        {state.step === 'landing' && <LandingPage onStart={startQuiz} />}
        {state.step === 'quiz' && (
          <QuizStep 
            onSubmit={handleQuizSubmit} 
            initialData={state.quizData} 
            error={state.error}
          />
        )}
        {state.step === 'processing' && <ProcessingStep />}
        {state.step === 'result' && state.result && (
          <ResultDashboard 
            plan={state.result} 
            quizData={state.quizData} 
            onRestart={restart} 
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
