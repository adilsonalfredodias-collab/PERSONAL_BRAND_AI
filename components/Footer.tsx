
import React from 'react';
import { Linkedin, Facebook, Globe, BookOpen } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: <Globe className="w-4 h-4" />, url: "https://adilson-dias-portfolio.lovable.app/", label: "Portfólio" },
    { icon: <Linkedin className="w-4 h-4" />, url: "https://www.linkedin.com/in/adilson-alfredo-adão-dias-679313252", label: "LinkedIn" },
    { icon: <Facebook className="w-4 h-4" />, url: "https://www.facebook.com/adilson.alfredodias", label: "Facebook" },
    { icon: <BookOpen className="w-4 h-4" />, url: "https://artigosdias.blogspot.com", label: "Blog" },
  ];

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="max-w-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-2">PersonalBrand AI</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Empoderando profissionais através de inteligência estratégica e branding digital de alto impacto.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Conecte-se com o Criador</span>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link, i) => (
                <a 
                  key={i} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl transition-all border border-slate-100 flex items-center gap-2 text-sm font-medium"
                  title={link.label}
                >
                  {link.icon}
                  <span className="hidden sm:inline">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            &copy; {currentYear} PersonalBrand AI • Todos os direitos reservados.
          </div>
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            DESENVOLVIDO POR <span className="text-indigo-600">ADILSON ALFREDO ADÃO DIAS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
