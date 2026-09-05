import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  ArrowRight,
  Bot,
  Send,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { sendVoiceAIQuery } from '../api/client';
import { VoiceAIResponse } from '../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onTriggerReconcile?: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onTriggerReconcile,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [lastResponse, setLastResponse] = useState<VoiceAIResponse | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English locale

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTextInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Could not initialize SpeechRecognition:', err);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleStartListening = () => {
    if (!recognitionRef.current) return;
    try {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        setTextInput('');
        recognitionRef.current.start();
      }
    } catch (err) {
      console.error('Failed to start speech recognition', err);
      setIsListening(false);
    }
  };

  // Text-to-speech using browser Web Speech Synthesis
  const speakText = (text: string) => {
    if (voiceMuted || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Web Speech Synthesis error:', err);
      setIsSpeaking(false);
    }
  };

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);

    try {
      const response: VoiceAIResponse = await sendVoiceAIQuery(queryText);
      setLastResponse(response);

      if (response.spokenText) {
        speakText(response.spokenText);
      }
    } catch (err) {
      console.error('Voice AI query error:', err);
      const fallback: VoiceAIResponse = {
        transcript: queryText,
        spokenText:
          'SettlementGuard Voice Assistant active. All 5 partner bank gateways are synchronized. 4 anomalies detected for review.',
        action: 'NAVIGATE_TAB',
        targetTab: 'overview',
        summary: 'System operational in zero-config offline mode.',
        mode: 'demo',
        timestamp: new Date().toISOString(),
      };
      setLastResponse(fallback);
      speakText(fallback.spokenText);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetPrompt = (prompt: string) => {
    setTextInput(prompt);
    handleSendQuery(prompt);
  };

  const handleExecuteAction = () => {
    if (!lastResponse) return;
    if (lastResponse.action === 'TRIGGER_RECONCILIATION' && onTriggerReconcile) {
      onTriggerReconcile();
    }
    if (lastResponse.targetTab) {
      onNavigateTab(lastResponse.targetTab);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Voice AI Settlement Assistant</h2>
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                  Dual-Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Voice-guided multi-bank reconciliation, dispute filing, and MDR audit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (isSpeaking && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }
                setVoiceMuted(!voiceMuted);
              }}
              title={voiceMuted ? 'Unmute voice output' : 'Mute voice output'}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                voiceMuted
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Voice Mic Controls & Wave Animation */}
          <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-b from-blue-50/50 to-slate-50 rounded-2xl border border-blue-100/60 text-center relative overflow-hidden">
            <div className="relative mb-3">
              {isListening && (
                <div className="absolute -inset-2 rounded-full bg-blue-400/30 animate-ping" />
              )}
              {isSpeaking && (
                <div className="absolute -inset-2 rounded-full bg-emerald-400/30 animate-pulse" />
              )}
              <button
                id="voice-ai-mic-btn"
                onClick={handleStartListening}
                disabled={!speechSupported}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 cursor-pointer relative z-10 ${
                  isListening
                    ? 'bg-rose-600 text-white ring-4 ring-rose-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white ring-4 ring-blue-100'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 animate-pulse" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
            </div>

            <span className="text-xs font-bold text-slate-800">
              {isListening
                ? 'Listening to your voice...'
                : isSpeaking
                ? 'SettlementGuard is speaking...'
                : 'Click microphone to speak or pick a prompt below'}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">
              {!speechSupported
                ? 'Microphone API unavailable in this browser; type query or click sample prompts'
                : 'Supports English queries for MDR, disputes, RBI rules & forecasts'}
            </span>
          </div>

          {/* Quick Preset Voice Prompts */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Sample Voice Queries
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handlePresetPrompt('What is our MDR rate spike on HDFC?')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition cursor-pointer text-left"
              >
                "What is our MDR spike on HDFC?"
              </button>
              <button
                onClick={() => handlePresetPrompt('Why is batch setl_icici_802 delayed?')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition cursor-pointer text-left"
              >
                "Why is setl_icici_802 delayed?"
              </button>
              <button
                onClick={() => handlePresetPrompt('Generate a dispute letter for HDFC Bank')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition cursor-pointer text-left"
              >
                "Generate a dispute letter for HDFC"
              </button>
              <button
                onClick={() => handlePresetPrompt('Are we compliant with RBI T+2 settlement rules?')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition cursor-pointer text-left"
              >
                "Check RBI T+2 compliance"
              </button>
              <button
                onClick={() => handlePresetPrompt('Run autonomous reconciliation')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition cursor-pointer text-left"
              >
                "Run reconciliation"
              </button>
            </div>
          </div>

          {/* Response Container */}
          {lastResponse && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-200/60 pb-1.5">
                <span className="font-semibold text-slate-700">Query: "{lastResponse.transcript}"</span>
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                  {lastResponse.mode === 'live' ? 'Live Gemini' : 'Zero-Config AI'}
                </span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {lastResponse.spokenText}
              </p>

              {lastResponse.summary && (
                <div className="flex items-center gap-1.5 text-[11px] text-blue-700 bg-blue-50/70 p-2 rounded-lg border border-blue-100">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{lastResponse.summary}</span>
                </div>
              )}

              {lastResponse.targetTab && (
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={handleExecuteAction}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <span>View in {lastResponse.targetTab.replace('_', ' ').toUpperCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Text input fallback form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery(textInput);
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Ask anything about settlements, MDR, disputes..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !textInput.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Ask
            </button>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Runs 100% offline in Zero-Config Demo Mode with Web Speech API
          </span>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="px-3 py-1 text-slate-600 hover:text-slate-900 font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
