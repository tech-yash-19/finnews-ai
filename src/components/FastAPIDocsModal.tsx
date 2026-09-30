import React, { useState, useEffect } from 'react';
import {
  X,
  FileCode2,
  Copy,
  Check,
  Download,
  Terminal,
  Server,
  Layers,
  Cpu,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { getFastApiDocs } from '../services/api';

interface FastAPIDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FastAPIDocsModal: React.FC<FastAPIDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'main' | 'groq' | 'schemas' | 'curl'>('architecture');
  const [copied, setCopied] = useState(false);
  const [apiData, setApiData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && !apiData) {
      getFastApiDocs().then(setApiData).catch(() => {});
    }
  }, [isOpen, apiData]);

  if (!isOpen) return null;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const MAIN_PY = `"""
FinNews AI - FastAPI Real-Time Financial News Simplification Engine
Integrates: Groq API (LLaMA 3.3-70B Versatile), NewsAPI, & Pydantic Validation
"""

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import httpx
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="FinNews AI Engine",
    description="Real-time financial news retrieval, jargon extraction, and AI simplification",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq Client Initialization
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
NEWS_API_KEY = os.environ.get("NEWS_API_KEY")

class SimplificationRequest(BaseModel):
    title: str = Field(..., description="Article headline")
    content: str = Field(..., description="Full text or excerpt of financial news")
    source: Optional[str] = "Financial Press"
    audience_level: Optional[str] = Field("beginner", description="beginner, intermediate, or expert")

class JargonItem(BaseModel):
    term: str
    definition: str
    contextExplanation: str
    simpleExample: str

class MarketImpact(BaseModel):
    sentiment: str = Field(..., description="bullish, bearish, or neutral")
    impactScore: int = Field(..., ge=1, le=10)
    keyDrivers: List[str]
    affectedSectors: List[str]
    winners: List[str]
    losers: List[str]

class SimplificationResponse(BaseModel):
    headline: str
    tldr: List[str]
    eli5: str
    marketImpact: MarketImpact
    jargonGlossary: List[JargonItem]
    audioScript: str
    model_used: str = "llama-3.3-70b-versatile"

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "groq_configured": bool(os.environ.get("GROQ_API_KEY")),
        "newsapi_configured": bool(os.environ.get("NEWS_API_KEY")),
        "model": "llama-3.3-70b-versatile"
    }

@app.post("/api/simplify", response_model=SimplificationResponse)
async def simplify_article(payload: SimplificationRequest):
    prompt = f"""You are FinNews AI, a senior financial intelligence editor.
Simplify this financial story for a {payload.audience_level} audience.
Title: {payload.title}
Source: {payload.source}
Content: {payload.content}
Return strict JSON matching the schema."""

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are FinNews AI, an expert financial news simplifier."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        import json
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
`;

  const GROQ_PY = `"""
Groq API Client & LLaMA 3.3-70B Versatile Integration Service
"""
from groq import Groq
import os

class GroqSimplificationEngine:
    def __init__(self):
        self.client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"

    def simplify_content(self, title: str, text: str, audience: str = "beginner") -> dict:
        system_instruction = (
            "You are FinNews AI, a world-class financial editor. "
            "Convert complex financial jargon into clear, lay-friendly explanations "
            "with actionable insights for retail investors and students."
        )

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": f"Title: {title}\\n\\nText: {text}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=2048
        )
        import json
        return json.loads(response.choices[0].message.content)
`;

  const CURL_CODE = `# 1. Check Backend Health
curl -X GET "http://localhost:3000/api/health"

# 2. Retrieve Live Financial News
curl -X GET "http://localhost:3000/api/news?category=macro&limit=5"

# 3. Simplify Financial Article with Generative AI
curl -X POST "http://localhost:3000/api/simplify" \\
     -H "Content-Type: application/json" \\
     -d '{
       "title": "Federal Reserve Holds Benchmark Rates Steady",
       "content": "The FOMC maintained the federal funds rate at 4.75%-5.00% while continuing Quantitative Tightening balance sheet runoff.",
       "source": "Federal Reserve Wire",
       "audienceLevel": "beginner"
     }'

# 4. Explain Jargon Term On-Demand
curl -X GET "http://localhost:3000/api/explain-term?term=yield%20curve%20inversion"
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-auto flex flex-col max-h-[90vh] text-slate-800">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-white/95 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
              <FileCode2 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  FastAPI & Groq LLaMA 3.3 Architecture
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Python 3.11+
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Complete backend blueprint, Groq prompt engineering, and REST endpoints.
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

        {/* Tab Controls */}
        <div className="px-5 sm:px-6 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'architecture', label: 'System Architecture', icon: Layers },
            { id: 'main', label: 'main.py (FastAPI)', icon: Server },
            { id: 'groq', label: 'groq_engine.py', icon: Cpu },
            { id: 'curl', label: 'cURL & API Testing', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 font-mono text-xs">
          {activeTab === 'architecture' && (
            <div className="font-sans space-y-6 text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    1. Data Retrieval
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Fetches real-time financial articles from NewsAPI endpoints and financial RSS feeds (CNBC, MarketWatch, Bloomberg, SEC).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase mb-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    2. Processing & AI
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    FastAPI / Express passes cleaned article text to Groq LLaMA 3.3-70B Versatile / Gemini 3.8 with strict structured JSON schema extraction.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase mb-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    3. Simplification UI
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Renders instant TL;DR bullets, Layman ELI5 analogies, interactive jargon popups, market impact meters, and audio broadcast briefings.
                  </p>
                </div>
              </div>

              {/* Endpoints Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-semibold text-xs text-slate-800">
                  Active RESTful API Endpoints
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
                        POST
                      </span>
                      <span className="font-mono text-slate-900 font-semibold">/api/simplify</span>
                    </div>
                    <span className="text-slate-500">Generate structured news simplification & jargon breakdown</span>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono text-[10px] font-bold">
                        GET
                      </span>
                      <span className="font-mono text-slate-900 font-semibold">/api/news</span>
                    </div>
                    <span className="text-slate-500">Retrieve filtered & searched financial news feed</span>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono text-[10px] font-bold">
                        GET
                      </span>
                      <span className="font-mono text-slate-900 font-semibold">/api/explain-term</span>
                    </div>
                    <span className="text-slate-500">On-demand financial jargon explainer</span>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-mono text-[10px] font-bold">
                        POST
                      </span>
                      <span className="font-mono text-slate-900 font-semibold">/api/audio-summary</span>
                    </div>
                    <span className="text-slate-500">Neural TTS voice audio broadcast synthesis</span>
                  </div>

                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[10px] font-bold">
                        GET
                      </span>
                      <span className="font-mono text-slate-900 font-semibold">/api/health</span>
                    </div>
                    <span className="text-slate-500">System metrics, uptime, latency, model status</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'main' && (
            <div className="relative">
              <button
                onClick={() => copyCode(MAIN_PY)}
                className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition-colors cursor-pointer shadow-xs z-10"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Python Code'}</span>
              </button>
              <pre className="p-4 bg-slate-950 rounded-xl overflow-x-auto text-emerald-300 leading-relaxed border border-slate-800">
                {MAIN_PY}
              </pre>
            </div>
          )}

          {activeTab === 'groq' && (
            <div className="relative">
              <button
                onClick={() => copyCode(GROQ_PY)}
                className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition-colors cursor-pointer shadow-xs z-10"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <pre className="p-4 bg-slate-950 rounded-xl overflow-x-auto text-indigo-300 leading-relaxed border border-slate-800">
                {GROQ_PY}
              </pre>
            </div>
          )}

          {activeTab === 'curl' && (
            <div className="relative">
              <button
                onClick={() => copyCode(CURL_CODE)}
                className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition-colors cursor-pointer shadow-xs z-10"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy cURL'}</span>
              </button>
              <pre className="p-4 bg-slate-950 rounded-xl overflow-x-auto text-amber-300 leading-relaxed border border-slate-800">
                {CURL_CODE}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-sans">
          <span>Compatible with Uvicorn, Gunicorn, Docker, and Cloud Run</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium transition-colors cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
