
import React, { useState } from 'react';
import { QuizData, SocialNetwork, Objective, DailyTime } from '../types';
import { ChevronRight, ChevronLeft, Upload, Link as LinkIcon, FileText, AlertCircle, Zap } from 'lucide-react';

interface QuizStepProps {
  onSubmit: (data: QuizData) => void;
  initialData: QuizData;
  error: string | null;
}

const QuizStep: React.FC<QuizStepProps> = ({ onSubmit, initialData, error }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuizData>(initialData);

  const totalSteps = 4;

  const next = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleInputChange = (field: keyof QuizData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        handleInputChange('cvText', text);
        handleInputChange('cvFileName', file.name);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>

        <div className="mb-8">
          <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Passo {currentStep} de {totalSteps}</span>
        </div>

        <div className="min-h-[300px]">
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Qual seu objetivo principal?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['Autoridade', 'Vendas de Serviço', 'Conseguir Emprego', 'Branding Pessoal', 'Crescimento de Seguidores'] as Objective[]).map((obj) => (
                  <button
                    key={obj}
                    onClick={() => handleInputChange('objective', obj)}
                    className={`p-6 rounded-2xl text-left border-2 transition-all ${
                      formData.objective === obj 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' 
                      : 'border-slate-100 hover:border-indigo-200 text-slate-600'
                    }`}
                  >
                    <span className="font-bold">{obj}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Detalhes da Rede e Nicho</h2>
              <p className="text-slate-500 mb-8">Onde você quer brilhar e para quem quer falar?</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Rede Social Principal</label>
                  <select 
                    value={formData.socialNetwork}
                    onChange={(e) => handleInputChange('socialNetwork', e.target.value as SocialNetwork)}
                    className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-600 focus:outline-none transition-colors bg-white"
                  >
                    {['LinkedIn', 'Instagram', 'TikTok', 'Facebook', 'X (Twitter)', 'Outra'].map(net => (
                      <option key={net} value={net}>{net}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Qual seu Nicho/Área de Atuação?</label>
                  <input 
                    type="text"
                    placeholder="Ex: Marketing Digital, Nutrição, Advocacia..."
                    value={formData.niche}
                    onChange={(e) => handleInputChange('niche', e.target.value)}
                    className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Disponibilidade de Tempo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['30 minutos', '1 hora', '2 horas', 'Mais de 2 horas'] as DailyTime[]).map((time) => (
                  <button
                    key={time}
                    onClick={() => handleInputChange('dailyTime', time)}
                    className={`p-6 rounded-2xl text-left border-2 transition-all ${
                      formData.dailyTime === time 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' 
                      : 'border-slate-100 hover:border-indigo-200 text-slate-600'
                    }`}
                  >
                    <span className="font-bold">{time} por dia</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Dados Adicionais</h2>
              <p className="text-slate-500 mb-8">Ajude a IA a conhecer melhor sua trajetória.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Link do seu Perfil Atual
                  </label>
                  <input 
                    type="url"
                    placeholder="https://facebook.com/seunome"
                    value={formData.profileUrl}
                    onChange={(e) => handleInputChange('profileUrl', e.target.value)}
                    className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Currículo ou Resumo (Opcional)
                  </label>
                  <div className="relative">
                    <input 
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label 
                      htmlFor="cv-upload"
                      className="w-full p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 hover:border-indigo-200 transition-all"
                    >
                      <Upload className="w-8 h-8 text-slate-400" />
                      <div className="text-center">
                        <span className="text-slate-600 font-medium block">
                          {formData.cvFileName || "Clique para fazer upload (PDF, DOC, TXT)"}
                        </span>
                        <span className="text-slate-400 text-sm">Ou cole o texto abaixo</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <textarea 
                    placeholder="Se preferir, descreva suas habilidades e experiências principais aqui..."
                    value={formData.cvText}
                    onChange={(e) => handleInputChange('cvText', e.target.value)}
                    className="w-full p-4 h-32 rounded-xl border-2 border-slate-100 focus:border-indigo-600 focus:outline-none transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
          <button
            onClick={prev}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={next}
              className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Próximo
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => onSubmit(formData)}
              className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
            >
              Gerar meu Plano
              <Zap className="w-5 h-5 fill-current" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizStep;
