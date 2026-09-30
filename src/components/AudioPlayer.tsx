import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Radio,
  FileText,
  Sparkles,
} from 'lucide-react';
import { getAudioSummary } from '../services/api';

interface AudioPlayerProps {
  script: string;
  title: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ script, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [provider, setProvider] = useState<'gemini-tts' | 'speech-synthesis'>('gemini-tts');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showScript, setShowScript] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load audio on demand or setup speech synthesis
  const handleTogglePlay = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    // If we already have audio element ready
    if (audioRef.current && audioUrl) {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    // Fetch AI Voice from server
    setIsLoadingAudio(true);
    try {
      const res = await getAudioSummary(script);
      if (res.audioUrl) {
        setAudioUrl(res.audioUrl);
        setProvider('gemini-tts');
        const audio = new Audio(res.audioUrl);
        audioRef.current = audio;
        audio.playbackRate = playbackSpeed;

        audio.ontimeupdate = () => {
          if (audio.duration) {
            setProgress((audio.currentTime / audio.duration) * 100);
          }
        };

        audio.onended = () => {
          setIsPlaying(false);
          setProgress(0);
        };

        await audio.play();
        setIsPlaying(true);
      } else {
        // Fallback to Web Speech API
        playViaSpeechSynthesis();
      }
    } catch (err) {
      console.warn('Using speech synthesis fallback:', err);
      playViaSpeechSynthesis();
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const playViaSpeechSynthesis = () => {
    if (!('speechSynthesis' in window)) {
      alert('Audio playback is not supported by your browser.');
      return;
    }

    window.speechSynthesis.cancel();
    setProvider('speech-synthesis');

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    synthUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    if (isPlaying && provider === 'speech-synthesis') {
      window.speechSynthesis.cancel();
      playViaSpeechSynthesis();
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else if (provider === 'speech-synthesis') {
      playViaSpeechSynthesis();
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-wide text-slate-900">
              AI Market Audio Briefing
            </h4>
            <p className="text-[11px] text-slate-500">
              {provider === 'gemini-tts' ? 'Neural Voice Broadcast (Kore)' : 'Speech Synthesis'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowScript(!showScript)}
            className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs cursor-pointer font-medium"
          >
            <FileText className="w-3 h-3 text-slate-400" />
            <span>{showScript ? 'Hide Script' : 'View Script'}</span>
          </button>
        </div>
      </div>

      {/* Waveform / Visualizer Bar */}
      <div className="h-10 bg-slate-200/60 rounded-lg p-2 flex items-center gap-1 mb-3 overflow-hidden">
        {Array.from({ length: 32 }).map((_, i) => {
          const heightPercent = isPlaying
            ? Math.max(15, Math.sin(i * 0.4 + Date.now() * 0.005) * 40 + 50)
            : 20;
          return (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-150 ${
                isPlaying ? 'bg-emerald-600' : 'bg-slate-400'
              }`}
              style={{ height: `${heightPercent}%` }}
            />
          );
        })}
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            disabled={isLoadingAudio}
            className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs disabled:opacity-50 cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play Briefing'}
          >
            {isLoadingAudio ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Restart from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px] font-mono shadow-2xs">
            {[1, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  playbackSpeed === speed
                    ? 'bg-slate-100 text-emerald-700 font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-mono text-[11px]">
            ~{Math.round(script.split(' ').length / 2.5)}s duration
          </span>
        </div>
      </div>

      {/* Script Drawer */}
      {showScript && (
        <div className="mt-3 p-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed font-sans shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1 text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Radio Anchor Script</span>
          </div>
          <p className="italic text-slate-800">{script}</p>
        </div>
      )}
    </div>
  );
};
