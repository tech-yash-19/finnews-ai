import { NewsArticle, SimplifiedNews, MarketTickerItem, HealthStatus, JargonItem } from '../types';

export async function getMarketTickers(): Promise<MarketTickerItem[]> {
  try {
    const res = await fetch('/api/market-ticker');
    if (!res.ok) throw new Error('Failed to fetch ticker data');
    const data = await res.json();
    return data.tickers || [];
  } catch (error) {
    console.error('Error fetching market tickers:', error);
    return [];
  }
}

export async function getNewsArticles(params?: {
  category?: string;
  search?: string;
  limit?: number;
  refresh?: boolean;
}): Promise<{ articles: NewsArticle[]; total: number; cachedAt?: string }> {
  try {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.refresh) query.set('refresh', 'true');

    const res = await fetch(`/api/news?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch news articles');
    return await res.json();
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return { articles: [], total: 0 };
  }
}

export async function simplifyArticle(payload: {
  articleId?: string;
  title: string;
  content: string;
  source?: string;
  audienceLevel?: 'beginner' | 'intermediate' | 'expert';
  groqApiKey?: string;
  modelPreference?: 'gemini' | 'groq';
}): Promise<SimplifiedNews> {
  const res = await fetch('/api/simplify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to simplify article');
  }

  return await res.json();
}

export async function explainFinancialTerm(term: string): Promise<JargonItem> {
  const res = await fetch(`/api/explain-term?term=${encodeURIComponent(term)}`);
  if (!res.ok) {
    throw new Error('Failed to fetch term explanation');
  }
  const data = await res.json();
  return data.term;
}

export async function getAudioSummary(text: string): Promise<{
  audioUrl: string | null;
  fallbackToSpeechSynthesis: boolean;
  script: string;
}> {
  const res = await fetch('/api/audio-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    return { audioUrl: null, fallbackToSpeechSynthesis: true, script: text };
  }

  return await res.json();
}

export async function getHealthStatus(): Promise<HealthStatus> {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error('Failed to fetch health status');
  return await res.json();
}

export async function getFastApiDocs(): Promise<any> {
  const res = await fetch('/api/docs/fastapi');
  if (!res.ok) throw new Error('Failed to fetch FastAPI documentation');
  return await res.json();
}
