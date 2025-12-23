
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const tips = [
  "A IA está analisando seu currículo para extrair seus maiores pontos de autoridade.",
  "Estamos cruzando seus objetivos com as tendências atuais do seu nicho.",
  "Preparando um checklist detalhado para seu perfil brilhar.",
  "Quase lá! Estruturando seu calendário de 4 semanas personalizado.",
  "Sabia que consistência é mais importante que viralização?",
  "Estamos criando sugestões de Bio que realmente convertem visitantes em seguidores."
];

const ProcessingStep: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <div className="relative inline-block mb-12">
        <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-pulse" />
        </div>
      </div>
      
      <h2 className="text-3xl font-extrabold text-slate-900 mb-6 animate-pulse">
        Criando sua estratégia mágica...
      </h2>
      
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm min-h-[140px] flex items-center justify-center transition-all duration-500">
        <p className="text-lg text-slate-600 italic">
          "{tips[tipIndex]}"
        </p>
      </div>

      <div className="mt-12 flex justify-center gap-2">
        {tips.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${i === tipIndex ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingStep;
