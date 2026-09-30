import React, { useState } from 'react';
import { X, Sparkles, FileText, Send, Zap, BookMarked } from 'lucide-react';
import { ModelSettings } from '../types';

interface CustomArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string, source: string, audienceLevel: 'beginner' | 'intermediate' | 'expert') => void;
  isLoading: boolean;
  settings: ModelSettings;
}

const PRESET_SAMPLES = [
  {
    name: 'Fed Rate Decision & Balance Sheet (FOMC)',
    title: 'FOMC Statement on Monetary Policy Normalization & Balance Sheet Runoff',
    source: 'Federal Reserve Press Release',
    content: `The Federal Open Market Committee decided today to maintain the target range for the federal funds rate at 4.75 to 5.00 percent. In considering any adjustments to the target range, the Committee will carefully assess incoming data, the evolving outlook, and the balance of risks.

The Committee does not expect it will be appropriate to reduce the target range until it has gained greater confidence that inflation is moving sustainably toward 2 percent. In addition, the Committee will continue reducing its holdings of Treasury securities and agency debt and agency mortgage-backed securities, as described in the Plans for Reducing the Size of the Federal Reserve's Balance Sheet.

Recent indicators suggest that economic activity has continued to expand at a solid pace. Job gains have moderated, and the unemployment rate has moved up but remains low. Inflation has eased over the past year but remains somewhat elevated. The Committee is strongly committed to supporting maximum employment and returning inflation to its 2 percent objective.`,
  },
  {
    name: 'SEC 10-Q Filing: Semiconductor Revenue',
    title: 'Item 2. Management\'s Discussion and Analysis of Financial Condition - Gross Margin Dilution',
    source: 'SEC Form 10-Q',
    content: `Compute & Networking revenue for the third quarter of fiscal 2026 was $35.1 billion, up 112% from a year ago, primarily reflecting growth in our Blackwell architecture computing platform. Data Center revenue growth was driven by cloud service providers who represented approximately 50% of Data Center revenue.

GAAP gross margin was 74.6% and non-GAAP gross margin was 75.1%, compared to 74.0% and 75.0%, respectively, in the prior quarter. For the full year, we expect gross margins to be in the mid-70% range. As new architectures transition to high-volume manufacturing, initial ramp yield curves may generate temporary gross margin compression before scale economies materialize. Cash and cash equivalents and marketable securities were $34.8 billion, compared to $26.0 billion a year ago.`,
  },
  {
    name: 'Currency Carry Trade Unwinding',
    title: 'Bank of Japan Monetary Policy Normalization Sparks FX Carry Trade Liquidation',
    source: 'Tokyo Macro Dispatch',
    content: `The unexpected 25 basis point tightening by the Bank of Japan triggered a cascading short-squeeze across global FX markets. For more than two decades, institutional investors and global macro hedge funds utilized the ultra-low yielding Japanese Yen as a primary funding currency to acquire high-beta assets including US tech equities, Mexican Peso sovereign debt, and European corporate credit.

As the USD/JPY cross-rate depreciated precipitously from 161.00 toward 142.00, algorithmic margin calls mandated rapid collateral posting, compelling systematic funds to liquidate long equity risk assets to service yen borrowing liabilities. The volatility spillover drove the CBOE VIX index to its highest intraday surge since March 2020.`,
  },
];

export const CustomArticleModal: React.FC<CustomArticleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  settings,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('Custom Analysis');
  const [audienceLevel, setAudienceLevel] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');

  if (!isOpen) return null;

  const handleApplyPreset = (sample: typeof PRESET_SAMPLES[0]) => {
    setTitle(sample.title);
    setContent(sample.content);
    setSource(sample.source);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(
      title.trim() || 'Custom Financial Document Analysis',
      content.trim(),
      source.trim() || 'Custom Input',
      audienceLevel
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-auto flex flex-col text-slate-800">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-white/95 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Simplify Custom Article or SEC Filing
              </h2>
              <p className="text-xs text-slate-500">
                Paste any financial news, 10-K report, earnings release, or market commentary.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Strip */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <BookMarked className="w-3.5 h-3.5 text-indigo-500" />
            Try Preset:
          </span>
          {PRESET_SAMPLES.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyPreset(sample)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs whitespace-nowrap transition-colors cursor-pointer"
            >
              {sample.name}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headline / Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q3 Earnings Call Transcript or Fed Speech"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Source Attribution
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. SEC Filing, Bloomberg"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Financial Article Content / Excerpt <span className="text-emerald-600">*</span>
            </label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste dense financial text, earnings statements, macroeconomic metrics, or Wall Street reports here..."
              required
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-lg p-3 text-xs text-slate-800 placeholder-slate-400 outline-none font-mono leading-relaxed transition-colors"
            />
          </div>

          {/* Audience Level Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1">
                Audience Explanation Level:
              </span>
              <div className="flex items-center gap-2">
                {[
                  { id: 'beginner', label: 'Beginner (ELI5)' },
                  { id: 'intermediate', label: 'Investor (Balanced)' },
                  { id: 'expert', label: 'Pro (Deep Context)' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setAudienceLevel(lvl.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      audienceLevel === lvl.id
                        ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !content.trim()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Simplifying...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Simplify with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
