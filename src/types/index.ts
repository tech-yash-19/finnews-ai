export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  source: string;
  author?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  category: 'markets' | 'macro' | 'tech' | 'earnings' | 'crypto' | 'commodities' | 'banking';
  tickers?: string[];
  readingTimeMinutes?: number;
  sentimentPreview?: 'bullish' | 'bearish' | 'neutral' | 'volatile';
}

export interface JargonItem {
  term: string;
  definition: string;
  contextExplanation: string;
  simpleExample: string;
}

export interface PersonaTakeaway {
  retailInvestor: string;
  student: string;
  generalPublic: string;
}

export interface SimplifiedNews {
  id: string;
  articleId?: string;
  headline: string;
  tldr: string[];
  eli5: string;
  marketImpact: {
    sentiment: 'bullish' | 'bearish' | 'neutral' | 'mixed';
    impactScore: number; // 1 to 10
    keyDrivers: string[];
    affectedSectors: string[];
    winners: string[];
    losers: string[];
  };
  keyMetrics: Array<{
    label: string;
    value: string;
    significance: string;
  }>;
  jargonGlossary: JargonItem[];
  personaTakeaways: PersonaTakeaway;
  audioScript: string;
  modelUsed: string;
  provider: 'gemini' | 'groq';
  processingTimeMs: number;
  createdAt: string;
}

export interface MarketTickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  category: 'index' | 'crypto' | 'commodity' | 'forex' | 'rate';
  unit?: string;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptimeSeconds: number;
  geminiConfigured: boolean;
  groqConfigured: boolean;
  newsApiConfigured: boolean;
  cachedArticlesCount: number;
  activeModel: string;
  timestamp: string;
  apiLatencyMs: number;
}

export interface ModelSettings {
  provider: 'gemini' | 'groq';
  model: string;
  audienceLevel: 'beginner' | 'intermediate' | 'expert';
  groqApiKey?: string;
  newsApiKey?: string;
  enableAudioTTS: boolean;
}
