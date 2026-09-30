import React from 'react';
import {
  Sparkles,
  ExternalLink,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
} from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  onSimplify: (article: NewsArticle) => void;
  isSimplifying?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, onSimplify, isSimplifying }) => {
  const getSentimentBadge = (sentiment?: string) => {
    switch (sentiment) {
      case 'bullish':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
            <TrendingUp className="w-3 h-3" /> Bullish
          </span>
        );
      case 'bearish':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
            <TrendingDown className="w-3 h-3" /> Bearish
          </span>
        );
      case 'volatile':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
            <AlertTriangle className="w-3 h-3" /> Volatile
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
            <Minus className="w-3 h-3" /> Neutral
          </span>
        );
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const ms = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(ms / (1000 * 60));
    if (mins < 60) return `${Math.max(1, mins)}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <article className="group bg-white hover:bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md">
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Meta Bar - Clean unboxed metadata per design constitution */}
        <div className="flex items-center justify-between gap-2 text-xs mb-3 text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700">{article.source}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="capitalize font-medium text-slate-600">{article.category}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
          {getSentimentBadge(article.sentimentPreview)}
        </div>

        {/* Headline */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug mb-2.5 font-['Plus_Jakarta_Sans']">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed flex-1">
          {article.description}
        </p>

        {/* Tickers & Reading Time */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500 mb-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {article.tickers && article.tickers.length > 0 ? (
              article.tickers.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/60 font-medium"
                >
                  ${t.replace('^', '').replace('=F', '')}
                </span>
              ))
            ) : (
              <span className="text-slate-400 text-[11px]">Macro Market</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
            <Clock className="w-3 h-3" />
            <span>{article.readingTimeMinutes || 3} min read</span>
          </div>
        </div>
      </div>

      {/* Card Footer / Action */}
      <div className="px-5 sm:px-6 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
          title="View original article source"
        >
          <span>Original Article</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>

        <button
          onClick={() => onSimplify(article)}
          disabled={isSimplifying}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isSimplifying ? 'Simplifying...' : 'Simplify with AI'}</span>
        </button>
      </div>
    </article>
  );
};
