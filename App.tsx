
import React, { useState, useCallback, useEffect } from 'react';
import { QuizData, AppState, ActionPlan } from './types';
import { generateMarketingPlan } from './services/geminiService';
import LandingPage from './components/LandingPage';
import QuizStep from './components/QuizStep';
import ProcessingStep from './components/ProcessingStep';
import ResultDashboard from './components/ResultDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import { Rocket } from 'lucide-react';

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

  // Track if a paid API key has been selected for Gemini 3 Pro usage
  const [keySelected, setKeySelected] = useState<boolean | null>(null);

  useEffect(() => {
    // Verify API key selection status on initialization
    const verifyKeyStatus = async () => {
      if (typeof window !== 'undefined' && window.aistudio) {
        try {
          const isSelected = await window.aistudio.hasSelectedApiKey();
          setKeySelected(isSelected);
        } catch (e) {
          setKeySelected(true); // Fallback
        }
      } else {
        setKeySelected(true);
      }
    };
    verifyKeyStatus();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success to prevent race conditions during UI updates
      setKeySelected(true);
    }
  };

  const startQuiz = () => setState(prev => ({ ...prev, step: 'quiz' }));

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
      // Re-prompt for API key selection if the requested project is not found
      if (err.message && err.message.includes("Requested entity was not found.")) {
        setKeySelected(false);
        setState(prev => ({ 
          ...prev, 
          step: 'quiz', 
          error: "Chave de API inválida ou projeto não encontrado. Por favor, selecione novamente." 
        }));
      } else {
        setState(prev => ({ ...prev, step: 'quiz', error: err.message }));
      }
    }
  };

  const restart = () => setState(prev => ({ ...prev, step: 'landing', result: null, error: null }));

  // Show mandatory API key selection screen before app access
  if (keySelected === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 text-center">
          <div className="bg-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-200">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Configuração Necessária</h2>
          <p className="text-slate-600 mb-10 leading-relaxed">
            Para utilizar o <strong>Gemini 3 Pro</strong>, você deve selecionar uma chave de API de um projeto com faturamento ativo.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleOpenKeySelector}
              className="w-full bg-indigo-600 text-white px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
            >
              Selecionar Chave de API
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-xs text-slate-400 font-bold uppercase tracking-tighter hover:text-indigo-600 transition-colors"
            >
              Ver Requisitos de Faturamento
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
