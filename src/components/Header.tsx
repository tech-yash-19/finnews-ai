import React from 'react';
import {
  Sparkles,
  BookOpen,
  FileCode2,
  Settings,
  PlusCircle,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { ModelSettings } from '../types';

interface HeaderProps {
  onOpenCustomArticle: () => void;
  onOpenJargonDictionary: () => void;
  onOpenFastApiDocs: () => void;
  onOpenSettings: () => void;
  settings: ModelSettings;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCustomArticle,
  onOpenJargonDictionary,
  onOpenFastApiDocs,
  onOpenSettings,
  settings,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans']">
                FinNews<span className="text-emerald-600">.AI</span>
              </span>
              <span className="hidden sm:inline text-xs text-slate-500 font-normal">
                Financial News Simplifier
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Jargon-free financial intelligence & market insights
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Custom Article / Filing Paste */}
          <button
            onClick={onOpenCustomArticle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Paste any financial article, 10-K filing, or press release to simplify"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden md:inline">Simplify Custom Article</span>
            <span className="md:hidden">Simplify</span>
          </button>

          {/* Jargon Glossary */}
          <button
            onClick={onOpenJargonDictionary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            title="Open Financial Jargon Buster"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden lg:inline">Jargon Buster</span>
          </button>

          {/* FastAPI Reference Code */}
          <button
            onClick={onOpenFastApiDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            title="Inspect FastAPI & Groq Backend Implementation"
          >
            <FileCode2 className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden lg:inline">FastAPI Blueprint</span>
          </button>

          {/* Active Model Indicator & Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            title="Configure AI Engine & Model"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline font-mono text-[11px] text-emerald-700 font-semibold">
              {settings.provider === 'groq' ? 'Groq LLaMA 3.3' : 'Gemini 3.8'}
            </span>
            <Settings className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
