import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { MarketTickerItem } from '../types';
import { getMarketTickers } from '../services/api';

export const MarketTicker: React.FC = () => {
  const [tickers, setTickers] = useState<MarketTickerItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const data = await getMarketTickers();
      if (isMounted && data.length > 0) {
        setTickers(data);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    };

    load();
    const interval = setInterval(load, 15000); // 15s refresh
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (tickers.length === 0) return null;

  return (
    <div className="w-full bg-white/95 border-b border-slate-200 backdrop-blur-md text-xs py-2 px-4 select-none overflow-hidden text-slate-700">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold tracking-wide text-[11px] shrink-0 border-r border-slate-200 pr-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>Markets Live</span>
        </div>

        <div className="flex-1 overflow-x-auto scrollbar-none flex items-center gap-5 py-0.5">
          {tickers.map((t) => {
            const isPos = t.change >= 0;
            return (
              <div
                key={t.symbol}
                className="flex items-center gap-2 shrink-0 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-default"
                title={`${t.name} (${t.symbol})`}
              >
                <span className="font-semibold text-slate-800">{t.name}</span>
                <span className="font-mono text-slate-900 font-medium">
                  {t.price > 1000
                    ? t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : t.price.toFixed(t.price < 5 ? 4 : 2)}
                  {t.unit ? ` ${t.unit}` : ''}
                </span>
                <span
                  className={`flex items-center gap-0.5 font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                    isPos ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                  }`}
                >
                  {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isPos ? '+' : ''}
                  {t.changePercent.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-slate-400 text-[11px] shrink-0 border-l border-slate-200 pl-3">
          <span>Synced: {lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};
