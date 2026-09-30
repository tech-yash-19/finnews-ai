import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Cpu,
  Key,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Radio,
  RefreshCw,
} from 'lucide-react';
import { ModelSettings, HealthStatus } from '../types';
import { getHealthStatus } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ModelSettings;
  onSaveSettings: (settings: ModelSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<ModelSettings>(settings);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isTestingHealth, setIsTestingHealth] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
    if (isOpen) {
      checkHealth();
    }
  }, [isOpen, settings]);

  const checkHealth = async () => {
    setIsTestingHealth(true);
    try {
      const data = await getHealthStatus();
      setHealth(data);
    } catch {
      // Ignored
    } finally {
      setIsTestingHealth(false);
    }
  };

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-auto flex flex-col text-slate-800">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-white/95 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Settings className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                AI Engine & Provider Settings
              </h2>
              <p className="text-xs text-slate-500">
                Configure LLM inference provider, audience complexity, and API keys.
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

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Engine Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              Primary AI Simplification Model
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, provider: 'gemini', model: 'gemini-3.8-flash' })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  localSettings.provider === 'gemini'
                    ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900">Gemini 3.8 Flash</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    Built-in
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Zero configuration required. Lightning fast structured reasoning and neural audio generation.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, provider: 'groq', model: 'llama-3.3-70b-versatile' })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  localSettings.provider === 'groq'
                    ? 'bg-amber-50/70 border-amber-500 ring-1 ring-amber-500 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900">Groq LLaMA 3.3-70B</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                    Groq LPUs
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  High-speed inference using Meta's flagship LLaMA 3.3 70B parameter architecture.
                </p>
              </button>
            </div>
          </div>

          {/* Groq Key Input if Groq is selected */}
          {localSettings.provider === 'groq' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Groq API Key (Optional if configured on server)</span>
                <span className="text-[10px] text-slate-400">Stored in local session</span>
              </label>
              <input
                type="password"
                value={localSettings.groqApiKey || ''}
                onChange={(e) => setLocalSettings({ ...localSettings, groqApiKey: e.target.value })}
                placeholder="gsk_..."
                className="w-full bg-white border border-slate-200 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono placeholder-slate-400 outline-none"
              />
              <p className="text-[11px] text-slate-500">
                If omitted, the server will use its environment configuration or fall back to Gemini automatically.
              </p>
            </div>
          )}

          {/* Audience Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              Default Audience Simplification Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'beginner', label: 'Beginner', desc: 'ELI5 metaphors & everyday analogies' },
                { id: 'intermediate', label: 'Investor', desc: 'Actionable stock & sector implications' },
                { id: 'expert', label: 'Analyst', desc: 'Deep macro & corporate metrics' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, audienceLevel: lvl.id as any })}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    localSettings.audienceLevel === lvl.id
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs font-bold mb-0.5">{lvl.label}</span>
                  <span className="block text-[10px] text-slate-500 leading-snug">{lvl.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Audio TTS Toggle */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Neural Voice Audio Briefings</h4>
                <p className="text-[11px] text-slate-500">
                  Generate studio-quality voice audio broadcasts using Gemini TTS.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={localSettings.enableAudioTTS}
              onChange={(e) => setLocalSettings({ ...localSettings, enableAudioTTS: e.target.checked })}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          {/* System Health Status */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Backend Service Diagnostics
              </span>
              <button
                type="button"
                onClick={checkHealth}
                disabled={isTestingHealth}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isTestingHealth ? 'animate-spin' : ''}`} />
                <span>Test Status</span>
              </button>
            </div>

            {health ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-1">
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="block text-[10px] text-slate-400">Status</span>
                  <span className="font-bold text-emerald-600 uppercase">{health.status}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="block text-[10px] text-slate-400">Cached News</span>
                  <span className="font-bold font-mono text-slate-900">{health.cachedArticlesCount} articles</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="block text-[10px] text-slate-400">Gemini Engine</span>
                  <span className="font-bold text-emerald-600">
                    {health.geminiConfigured ? 'Connected' : 'Active'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="block text-[10px] text-slate-400">Uptime</span>
                  <span className="font-bold font-mono text-slate-900">{health.uptimeSeconds}s</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500">Loading system metrics...</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
