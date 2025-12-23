
import React from 'react';
import { Rocket } from 'lucide-react';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={onLogoClick}
            className="flex items-center gap-2 group transition-all"
          >
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              PersonalBrand AI
            </span>
          </button>
          
          <nav className="hidden md:flex space-x-8">
            <span className="text-sm font-medium text-slate-500">Transforme sua influência digital hoje</span>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
