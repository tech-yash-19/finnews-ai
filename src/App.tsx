import React, { useState, useEffect } from 'react';
import {
  Search,
  RefreshCw,
  Sparkles,
  LayoutGrid,
  List,
  Filter,
  TrendingUp,
  AlertCircle,
  Clock,
  Building2,
  Cpu,
  Layers,
  HelpCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { NewsArticle, SimplifiedNews, ModelSettings } from './types';
import { getNewsArticles, simplifyArticle } from './services/api';
import { MarketTicker } from './components/MarketTicker';
import { Header } from './components/Header';
import { NewsCard } from './components/NewsCard';
import { SimplificationModal } from './components/SimplificationModal';
import { CustomArticleModal } from './components/CustomArticleModal';
import { JargonDictionaryModal } from './components/JargonDictionaryModal';
import { FastAPIDocsModal } from './components/FastAPIDocsModal';
import { SettingsModal } from './components/SettingsModal';

const CATEGORIES = [
  { id: 'all', label: 'All Stories' },
  { id: 'markets', label: 'US Markets' },
  { id: 'macro', label: 'Macro & Fed' },
  { id: 'tech', label: 'Big Tech & AI' },
  { id: 'earnings', label: 'Earnings' },
  { id: 'crypto', label: 'Crypto & Assets' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'banking', label: 'Banking & Credit' },
];

const QUICK_TAGS = ['#FOMC', '#Nvidia', '#Bitcoin', '#Oil', '#Rates', '#Earnings', '#CPI'];

export default function App() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simplification State
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [simplifiedResult, setSimplifiedResult] = useState<SimplifiedNews | null>(null);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [simplifyingArticleId, setSimplifyingArticleId] = useState<string | null>(null);
  const [simplificationStep, setSimplificationStep] = useState(0);

  // Modals
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isJargonModalOpen, setIsJargonModalOpen] = useState(false);
  const [isFastApiModalOpen, setIsFastApiModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedJargonTerm, setSelectedJargonTerm] = useState('');

  // Model & App Settings
  const [settings, setSettings] = useState<ModelSettings>({
    provider: 'gemini',
    model: 'gemini-3.8-flash',
    audienceLevel: 'beginner',
    enableAudioTTS: true,
  });

  // Fetch News Feed
  const loadNews = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoadingNews(true);

    try {
      const data = await getNewsArticles({
        category: selectedCategory,
        search: searchQuery,
        limit: 30,
        refresh,
      });
      setArticles(data.articles || []);
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setIsLoadingNews(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadNews();
  };

  const handleQuickTagClick = (tag: string) => {
    const cleanTag = tag.replace('#', '');
    setSearchQuery(cleanTag);
    // Instant search filter
  };

  // Simplification Execution
  const handleSimplifyArticle = async (article: NewsArticle) => {
    setActiveArticle(article);
    setSimplifyingArticleId(article.id);
    setIsSimplifying(true);
    setSimplificationStep(1);

    const stepInterval = setInterval(() => {
      setSimplificationStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 450);

    try {
      const result = await simplifyArticle({
        articleId: article.id,
        title: article.title,
        content: article.content || article.description,
        source: article.source,
        audienceLevel: settings.audienceLevel,
        groqApiKey: settings.groqApiKey,
        modelPreference: settings.provider,
      });
      clearInterval(stepInterval);
      setSimplifiedResult(result);
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Simplification failed:', err);
    } finally {
      setIsSimplifying(false);
      setSimplifyingArticleId(null);
    }
  };

  // Custom User Input Simplification
  const handleCustomSimplify = async (
    title: string,
    content: string,
    source: string,
    audienceLevel: 'beginner' | 'intermediate' | 'expert'
  ) => {
    setIsCustomModalOpen(false);
    const mockArticle: NewsArticle = {
      id: `custom-${Date.now()}`,
      title,
      description: content.slice(0, 180) + '...',
      content,
      source,
      publishedAt: new Date().toISOString(),
      category: 'markets',
      readingTimeMinutes: Math.max(1, Math.round(content.split(' ').length / 180)),
      url: '#',
    };

    setActiveArticle(mockArticle);
    setIsSimplifying(true);
    setSimplificationStep(1);

    const stepInterval = setInterval(() => {
      setSimplificationStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 450);

    try {
      const result = await simplifyArticle({
        title,
        content,
        source,
        audienceLevel,
        groqApiKey: settings.groqApiKey,
        modelPreference: settings.provider,
      });
      clearInterval(stepInterval);
      setSimplifiedResult(result);
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Custom simplification failed:', err);
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleOpenJargonWithTerm = (term: string) => {
    setSelectedJargonTerm(term);
    setIsJargonModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Real-Time Market Ticker Ribbon */}
      <MarketTicker />

      {/* 2. Primary Navigation Header */}
      <Header
        onOpenCustomArticle={() => setIsCustomModalOpen(true)}
        onOpenJargonDictionary={() => {
          setSelectedJargonTerm('');
          setIsJargonModalOpen(true);
        }}
        onOpenFastApiDocs={() => setIsFastApiModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        settings={settings}
      />

      {/* 3. Hero & Intelligence Control Station */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-slate-50 border-b border-slate-200/80 pt-8 pb-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Next-Gen Financial Intelligence Engine</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Understand Complex Financial News.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">
                  Zero Jargon.
                </span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                Transform dense Wall Street reports, Federal Reserve policy statements, SEC filings, and market
                fluctuations into crystal-clear executive summaries and intuitive analogies.
              </p>
            </div>

            {/* Quick Stats or Model Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                    Inference Engine
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {settings.provider === 'groq' ? 'LLaMA 3.3-70B Versatile' : 'Gemini 3.8 Flash'}
                  </span>
                </div>
              </div>

              <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                    Live Wire Feeds
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {articles.length} Breaking Stories
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar & Quick Ticker Tags */}
          <div className="space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search market news, companies (NVDA, AAPL), or economic events (CPI, Fed, Rate Cuts)..."
                  className="w-full bg-white border border-slate-200 focus:border-emerald-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none shadow-xs transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      loadNews();
                    }}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-800 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Search
              </button>

              <button
                type="button"
                onClick={() => loadNews(true)}
                disabled={isRefreshing}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
                title="Refresh news wire"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            </form>

            {/* Quick Tag Pills */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mr-1">
                Trending:
              </span>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTagClick(tag)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-emerald-700 border border-slate-200 font-mono text-[11px] transition-colors shadow-2xs cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Category Filter Bar & View Mode Toggle */}
      <section className="bg-white/95 border-b border-slate-200 sticky top-16 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded cursor-pointer transition-colors ${
                viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded cursor-pointer transition-colors ${
                viewMode === 'list' ? 'bg-white text-emerald-700 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Main Content: Financial News Wire */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoadingNews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs animate-pulse space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-24 h-4 bg-slate-100 rounded" />
                  <div className="w-16 h-4 bg-slate-100 rounded" />
                </div>
                <div className="w-full h-6 bg-slate-100 rounded" />
                <div className="space-y-2">
                  <div className="w-full h-3 bg-slate-100 rounded" />
                  <div className="w-5/6 h-3 bg-slate-100 rounded" />
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="w-20 h-4 bg-slate-100 rounded" />
                  <div className="w-28 h-8 bg-slate-100 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                : 'space-y-4 max-w-4xl mx-auto'
            }
          >
            {articles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onSimplify={handleSimplifyArticle}
                isSimplifying={isSimplifying && simplifyingArticleId === article.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 max-w-lg mx-auto shadow-2xs">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No News Articles Found</h3>
            <p className="text-xs text-slate-500 mb-4">
              We couldn't find any financial stories matching your search filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                loadNews();
              }}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* 6. Active Simplification Loading Overlay */}
      {isSimplifying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl text-center space-y-5 text-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
              <Sparkles className="w-7 h-7 animate-spin text-emerald-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Simplifying Financial News
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
                "{activeArticle?.title}"
              </p>
            </div>

            {/* Stepper Progress */}
            <div className="space-y-2.5 text-left text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              {[
                'Analyzing market context & numerical metrics...',
                'Detecting Wall Street jargon & central bank terms...',
                'Constructing ELI5 layman analogies...',
                `Synthesizing reader-friendly report with ${
                  settings.provider === 'groq' ? 'LLaMA 3.3-70B' : 'Gemini 3.8'
                }...`,
              ].map((stepText, idx) => {
                const isDone = simplificationStep > idx + 1;
                const isCurrent = simplificationStep === idx + 1;
                return (
                  <div key={idx} className="flex items-center gap-2.5">
                    {isDone ? (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        ✓
                      </span>
                    ) : isCurrent ? (
                      <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                    )}
                    <span
                      className={`${
                        isCurrent
                          ? 'text-emerald-700 font-semibold'
                          : isDone
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {stepText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal: Full AI Simplification Intelligence Report */}
      <SimplificationModal
        article={activeArticle}
        simplified={simplifiedResult}
        isOpen={!!simplifiedResult && !isSimplifying}
        onClose={() => setSimplifiedResult(null)}
        onSelectJargonTerm={handleOpenJargonWithTerm}
      />

      {/* 8. Modal: Custom Article / SEC Filing Simplifier */}
      <CustomArticleModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={handleCustomSimplify}
        isLoading={isSimplifying}
        settings={settings}
      />

      {/* 9. Modal: Financial Jargon Buster Dictionary */}
      <JargonDictionaryModal
        isOpen={isJargonModalOpen}
        onClose={() => setIsJargonModalOpen(false)}
        initialTerm={selectedJargonTerm}
      />

      {/* 10. Modal: FastAPI & Groq Backend Blueprint */}
      <FastAPIDocsModal
        isOpen={isFastApiModalOpen}
        onClose={() => setIsFastApiModalOpen(false)}
      />

      {/* 11. Modal: Settings & Provider Configuration */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
      />

      {/* 12. Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">FinNews.AI</span>
            <span>•</span>
            <span>Real-Time Generative Financial Simplification</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setIsFastApiModalOpen(true)}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              FastAPI Spec
            </button>
            <span>•</span>
            <button
              onClick={() => setIsJargonModalOpen(true)}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Jargon Glossary
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Model Settings
            </button>
          </div>

          <p className="text-[11px] text-slate-500 text-center md:text-right">
            For educational & informational purposes. Does not constitute investment advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
