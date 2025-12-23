
import React, { useRef, useState, useMemo } from 'react';
import { ActionPlan, QuizData } from '../types';
import { 
  Download, RefreshCw, CheckCircle2, Layout, Lightbulb, 
  Loader2, Wand2, Copy, Check, ChevronDown, Sparkles, ExternalLink
} from 'lucide-react';
import { generatePostDraft } from '../services/geminiService';

interface ResultDashboardProps {
  plan: ActionPlan;
  quizData: QuizData;
  onRestart: () => void;
}

const ResultDashboard: React.FC<ResultDashboardProps> = ({ plan, quizData, onRestart }) => {
  const contentToPrint = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [generatingDraft, setGeneratingDraft] = useState<string | null>(null);
  const [draftResult, setDraftResult] = useState<{task: string, text: string} | null>(null);
  const [copied, setCopied] = useState(false);

  const allTasks = useMemo(() => {
    return plan.markdown.split('\n')
      .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
      .map(line => line.replace(/^[*|-]\s/, '').trim());
  }, [plan.markdown]);

  const progress = useMemo(() => {
    if (allTasks.length === 0) return 0;
    return Math.round((completedTasks.size / allTasks.length) * 100);
  }, [allTasks, completedTasks]);

  const handleToggleTask = (task: string) => {
    const newSet = new Set(completedTasks);
    if (newSet.has(task)) newSet.delete(task);
    else newSet.add(task);
    setCompletedTasks(newSet);
  };

  const handleGenerateDraft = async (task: string) => {
    setGeneratingDraft(task);
    try {
      const draft = await generatePostDraft(task, quizData);
      setDraftResult({ task, text: draft });
    } catch (e) {
      alert("Erro ao gerar legenda.");
    } finally {
      setGeneratingDraft(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!contentToPrint.current) return;
    setIsExporting(true);
    
    const element = contentToPrint.current;
    const opt = {
      margin: [15, 15, 20, 15],
      filename: `Plano_Marketing_${quizData.socialNetwork}_${quizData.niche.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      // @ts-ignore
      await window.html2pdf().set(opt).from(element).save();
    } finally {
      setIsExporting(false);
    }
  };

  const renderContent = () => {
    const lines = plan.markdown.split('\n');
    let inTable = false;

    return lines.map((line, i) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('|')) {
        inTable = true;
        const cells = trimmed.split('|').filter(c => c.trim() !== '');
        return (
          <div key={i} className="flex border-b border-slate-100 bg-slate-50/30">
            {cells.map((cell, ci) => (
              <div key={ci} className="flex-1 p-2 text-xs font-medium text-slate-600 border-r border-slate-100 last:border-0">
                {cell.trim()}
              </div>
            ))}
          </div>
        );
      }
      
      if (inTable && !trimmed.startsWith('|')) {
        inTable = false;
      }

      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-indigo-700 mt-10 mb-6 border-b-4 border-indigo-100 pb-2">{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-slate-800 mt-8 mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-500 no-print" />{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-slate-800 mt-6 mb-3">{line.replace('### ', '')}</h3>;
      
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const taskText = trimmed.replace(/^[*|-]\s/, '');
        const isDone = completedTasks.has(taskText);
        
        return (
          <div key={i} className={`group flex items-start gap-3 p-3 rounded-xl transition-all mb-1 border border-transparent ${isDone ? 'bg-green-50/30' : 'hover:bg-indigo-50/30'}`}>
            <button 
              onClick={() => handleToggleTask(taskText)}
              className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center no-print ${isDone ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'}`}
            >
              {isDone && <Check className="w-3.5 h-3.5" />}
            </button>
            
            <span className={`flex-grow text-slate-700 text-sm md:text-base transition-all ${isDone ? 'line-through opacity-50' : ''}`}>
              {taskText}
            </span>

            {!isDone && (
              <button 
                onClick={() => handleGenerateDraft(taskText)}
                disabled={generatingDraft === taskText}
                className="no-print opacity-0 group-hover:opacity-100 p-2 text-indigo-600 hover:bg-white rounded-lg shadow-sm transition-all flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter"
              >
                {generatingDraft === taskText ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                Copy IA
              </button>
            )}
          </div>
        );
      }
      
      if (trimmed === '') return <div key={i} className="h-2" />;
      return <p key={i} className="text-slate-600 mb-2 leading-relaxed text-sm md:text-base">{line}</p>;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header & Progress Bar */}
      <div className="mb-10 no-print animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">Estratégia Pronta</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Personal Brand <span className="text-indigo-600">Dashboard</span></h1>
          </div>
          
          <div className="flex gap-3">
            <button onClick={onRestart} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 font-bold shadow-sm hover:shadow-md">
              <RefreshCw className="w-4 h-4" />
              Recomeçar
            </button>
            <button 
              onClick={handleDownloadPDF} 
              disabled={isExporting}
              className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2 font-bold hover:-translate-y-1 active:translate-y-0"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExporting ? 'Gerando PDF...' : 'Baixar Plano PDF'}
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
              <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Execução do Plano</span>
            </div>
            <span className="text-lg font-black text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6 no-print">
          <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-500/20 rounded-full transition-transform group-hover:scale-150 duration-700" />
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
              <Lightbulb className="w-6 h-6 text-amber-400" /> Insight do Consultor
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-xs font-bold text-indigo-300 uppercase mb-2">Foco da Rede</p>
                <p className="font-bold">{quizData.socialNetwork}</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                <p className="text-xs font-bold text-indigo-300 uppercase mb-2">Seu Diferencial</p>
                <p className="text-sm italic">"Use sua experiência em {quizData.niche} para liderar conversas, não apenas participar delas."</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div ref={contentToPrint} className="bg-white rounded-3xl p-8 md:p-16 border border-slate-100 shadow-sm relative overflow-hidden print:shadow-none print:p-0">
            <div className="hidden print:flex items-center gap-2 mb-10 border-b-2 border-slate-100 pb-6">
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                 <Sparkles className="w-5 h-5 text-white" />
               </div>
               <span className="text-2xl font-black text-slate-900">PersonalBrand <span className="text-indigo-600">AI</span></span>
            </div>

            <div className="relative z-10">
              {renderContent()}
            </div>

            <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase">Tecnologia Gemini AI</span>
                <span className="text-[10px] text-indigo-600 font-black tracking-[0.1em] uppercase">Estratégia de Marketing Pessoal</span>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase block mb-1">Autor do Projeto</span>
                <a 
                  href="https://adilson-dias-portfolio.lovable.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-slate-800 font-black uppercase hover:text-indigo-600 transition-colors flex items-center gap-1 group"
                >
                  ADILSON ALFREDO ADÃO DIAS
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform no-print" />
                </a>
                <span className="text-[8px] text-slate-400 block mt-1 no-print">Clique para ver portfólio</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Post Draft Modal */}
      {draftResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/20">
            <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-700 text-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wand2 className="w-4 h-4 text-indigo-200" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Escritor Inteligente</span>
                </div>
                <h3 className="text-xl font-bold leading-tight">Sugestão de Legenda</h3>
              </div>
              <button onClick={() => setDraftResult(null)} className="p-3 hover:bg-white/20 rounded-2xl transition-all">
                <ChevronDown className="w-6 h-6 rotate-180" />
              </button>
            </div>
            
            <div className="p-10 overflow-y-auto flex-grow bg-slate-50">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed shadow-sm font-medium">
                {draftResult.text}
              </div>
            </div>

            <div className="p-8 bg-white border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => copyToClipboard(draftResult.text)}
                className="flex-grow py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:translate-y-0 shadow-xl shadow-indigo-100"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copiado para o Clip!' : 'Copiar para Postar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDashboard;
