
import React from 'react';
import { ArrowRight, Sparkles, Target, Zap, TrendingUp, Code2, ExternalLink } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-indigo-100/50 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Marketing Pessoal Potencializado por IA</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
            Construa uma <span className="text-indigo-600">Autoridade Inabalável</span> nas Redes Sociais.
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Obtenha um plano de ação mensal personalizado em menos de 2 minutos. Transforme seu currículo e perfil em uma máquina de branding pessoal.
          </p>
          
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200"
          >
            Começar meu Plano Agora
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Target className="w-6 h-6 text-indigo-600" />}
              title="Diagnóstico Preciso"
              description="Analisamos seus objetivos, nicho e presença atual para traçar a melhor rota."
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
              title="Estratégia de Conteúdo"
              description="Pilares de conteúdo baseados na sua expertise real extraída do seu currículo."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-500" />}
              title="Plano Acionável"
              description="Um calendário de 4 semanas com tarefas diárias para você executar sem pensar."
            />
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-6">
            <Code2 className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-6">Conheça o Criador</h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            O <strong>PersonalBrand AI</strong> foi idealizado e desenvolvido por <strong>Adilson Alfredo Adão Dias</strong>, 
            um desenvolvedor e estrategista focado em criar soluções que unem tecnologia de ponta e resultados reais no mundo digital.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://adilson-dias-portfolio.lovable.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all group"
            >
              Ver Portfólio
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
            <a 
              href="https://artigosdias.blogspot.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all group"
            >
              Visitar Blog
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all group">
    <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4 text-slate-900">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
