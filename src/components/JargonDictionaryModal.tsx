import React, { useState } from 'react';
import { X, Search, BookOpen, Sparkles, HelpCircle, ChevronRight, Zap } from 'lucide-react';
import { JargonItem } from '../types';
import { explainFinancialTerm } from '../services/api';

interface JargonDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string;
}

const STATIC_GLOSSARY: JargonItem[] = [
  {
    term: 'Basis Points (bps)',
    definition: 'A unit of measure equal to 1/100th of 1% (0.01%). 100 basis points equals 1.00%.',
    contextExplanation: 'Central bankers and bond traders use basis points to avoid confusion when discussing decimal rate changes.',
    simpleExample: 'If a mortgage rate moves from 6.25% to 6.50%, it increased by 25 basis points.',
  },
  {
    term: 'Quantitative Tightening (QT)',
    definition: 'A monetary policy where a central bank shrinks its balance sheet by allowing government bonds to mature without reinvesting.',
    contextExplanation: 'QT removes cash liquidity from the banking system to temper inflation pressures, making overall credit tighter.',
    simpleExample: 'Releasing air slowly from a giant inflatable party balloon to prevent it from popping.',
  },
  {
    term: 'Yield Curve Inversion',
    definition: 'A market phenomenon where short-term government debt pays higher interest than long-term government debt.',
    contextExplanation: 'Signals that investors expect economic cooling or central bank rate cuts in the future. Historically precedes recessions.',
    simpleExample: 'A 1-year bank certificate of deposit paying 5%, while a 10-year lockup only pays 3.8%.',
  },
  {
    term: 'EBITDA',
    definition: 'Earnings Before Interest, Taxes, Depreciation, and Amortization.',
    contextExplanation: 'A gauge of operational profitability that strips away capital structure, debt leverage, and non-cash accounting adjustments.',
    simpleExample: 'How much cash a lemonade stand generates purely from selling lemonade and paying for lemons and sugar.',
  },
  {
    term: 'Hawkish vs. Dovish',
    definition: 'Terminology characterizing central bank policy bias. Hawkish favors higher rates to fight inflation; Dovish favors lower rates to stimulate jobs.',
    contextExplanation: 'Monitored obsessively in Federal Reserve and ECB speeches to forecast policy rate directions.',
    simpleExample: 'Hawks want to tap the brakes to stop speeding; Doves want to step on the gas to keep rolling smoothly.',
  },
  {
    term: 'Currency Carry Trade',
    definition: 'Borrowing money in a low-interest rate currency (like the Japanese Yen) and investing it in higher-yielding assets abroad.',
    contextExplanation: 'Generates steady profits in calm markets, but causes violent market drops when the low-rate currency abruptly strengthens.',
    simpleExample: 'Taking out a loan at 0.5% in Tokyo, converting to dollars to earn 5% in US Treasuries, and pocketing the 4.5% difference.',
  },
  {
    term: 'Deposit Beta',
    definition: 'The percentage of a central bank rate hike that commercial banks pass through to their depositors in savings account yields.',
    contextExplanation: 'Banks with low deposit beta make bigger profits (net interest margins) during rate hiking cycles.',
    simpleExample: 'The Fed hikes rates by 1.00%, but your bank only raises your checking interest by 0.20% (a 20% beta).',
  },
  {
    term: 'P/E Ratio (Price-to-Earnings)',
    definition: 'The ratio of a company\'s current share price to its annual per-share earnings.',
    contextExplanation: 'Helps investors gauge whether a stock is cheap or expensive compared to its underlying profit generation.',
    simpleExample: 'Paying $20 to buy a business that puts $1 of profit into your pocket every year.',
  },
  {
    term: 'Liquidity Trap',
    definition: 'An economic situation where low interest rates and high monetary supply fail to stimulate consumer spending or investment.',
    contextExplanation: 'Consumers and institutions hoard cash because they fear recession or deflation.',
    simpleExample: 'Flooding a dry sponge with water until it cannot absorb any more, yet people still refuse to spend.',
  },
  {
    term: 'Free Cash Flow (FCF)',
    definition: 'The cash a company generates after accounting for cash outflows to support operations and maintain capital assets.',
    contextExplanation: 'Regarded by value investors as the purest measure of a company\'s financial freedom to pay dividends, repurchase shares, or innovate.',
    simpleExample: 'Your leftover paycheck savings at the end of the month after paying all rent, groceries, and car repairs.',
  },
];

export const JargonDictionaryModal: React.FC<JargonDictionaryModalProps> = ({
  isOpen,
  onClose,
  initialTerm = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialTerm);
  const [selectedTerm, setSelectedTerm] = useState<JargonItem | null>(STATIC_GLOSSARY[0]);
  const [customTermInput, setCustomTermInput] = useState('');
  const [isExplainingCustom, setIsExplainingCustom] = useState(false);

  if (!isOpen) return null;

  const filteredGlossary = STATIC_GLOSSARY.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.term.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q) ||
      item.contextExplanation.toLowerCase().includes(q)
    );
  });

  const handleAskCustomTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTermInput.trim()) return;
    setIsExplainingCustom(true);
    try {
      const result = await explainFinancialTerm(customTermInput.trim());
      setSelectedTerm(result);
      setCustomTermInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsExplainingCustom(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-auto flex flex-col max-h-[88vh] text-slate-800">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-white/95 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Financial Jargon Buster & Glossary
              </h2>
              <p className="text-xs text-slate-500">
                Decode Wall Street slang, central bank terminology, and corporate finance metrics.
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

        {/* AI Explain Custom Term Bar */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50 border-b border-slate-200">
          <form onSubmit={handleAskCustomTerm} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Sparkles className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
              <input
                type="text"
                value={customTermInput}
                onChange={(e) => setCustomTermInput(e.target.value)}
                placeholder="Ask AI to simplify any term (e.g. Reverse Repo, Gamma Squeeze, Stagflation, Delta)..."
                className="w-full bg-white border border-slate-200 focus:border-emerald-600 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isExplainingCustom || !customTermInput.trim()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isExplainingCustom ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Zap className="w-3.5 h-3.5 fill-current" />
              )}
              <span>Explain</span>
            </button>
          </form>
        </div>

        {/* Search & Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden min-h-[350px]">
          {/* Left Column: Term List */}
          <div className="md:col-span-5 border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-3 border-b border-slate-200">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter glossary..."
                  className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-200">
              {filteredGlossary.map((item) => {
                const isSelected = selectedTerm?.term === item.term;
                return (
                  <button
                    key={item.term}
                    onClick={() => setSelectedTerm(item)}
                    className={`w-full text-left p-3 flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-900 font-semibold border-l-2 border-indigo-600'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.term}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                );
              })}
              {filteredGlossary.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  No preset term found. Try asking AI with the bar above!
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Deep-Dive Card */}
          <div className="md:col-span-7 p-6 overflow-y-auto bg-white flex flex-col justify-between">
            {selectedTerm ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Financial Definition
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  {selectedTerm.term}
                </h3>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    What It Means (Plain English)
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {selectedTerm.definition}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Why Wall Street & Central Banks Care
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedTerm.contextExplanation}
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Everyday Real-Life Analogy
                  </h4>
                  <p className="text-xs text-emerald-950 leading-relaxed italic">
                    "{selectedTerm.simpleExample}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                Select a term to view explanation
              </div>
            )}

            <div className="mt-6 pt-3 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
              <span>FinNews AI Jargon Intelligence Engine</span>
              <span>Updated in real-time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
