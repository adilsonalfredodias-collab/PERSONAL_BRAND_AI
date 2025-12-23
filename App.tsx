
import React, { useState, useCallback } from 'react';
import { QuizData, AppState, ActionPlan } from './types';
import { generateMarketingPlan } from './services/geminiService';
import LandingPage from './components/LandingPage';
import QuizStep from './components/QuizStep';
import ProcessingStep from './components/ProcessingStep';
import ResultDashboard from './components/ResultDashboard';
import Header from './components/Header';
import Footer from './components/Footer';

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
      setState(prev => ({ ...prev, step: 'quiz', error: err.message }));
    }
  };

  const restart = () => setState(prev => ({ ...prev, step: 'landing', result: null, error: null }));

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
