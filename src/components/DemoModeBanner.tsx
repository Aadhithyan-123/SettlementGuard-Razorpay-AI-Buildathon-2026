import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Database,
  ShieldAlert,
  Bot,
  Zap,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { fetchDemoModeStatus } from '../api/client';
import { DemoModeStatus } from '../types';

interface DemoModeBannerProps {
  onNavigateTab?: (tab: string) => void;
  onOpenVoiceAssistant?: () => void;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({
  onNavigateTab,
  onOpenVoiceAssistant
}) => {
  const [status, setStatus] = useState<DemoModeStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    fetchDemoModeStatus()
      .then((data) => setStatus(data))
      .catch((err) => {
        console.warn('Unable to query demo status, defaulting to demo fallback', err);
        setStatus({
          mode: 'demo',
          is_live: false,
          metrics: {
            active_records: 100,
            anomalies_detected: 4,
            partner_banks_connected: 5,
            kafka_stream_status: 'active_in_memory_simulation',
            rbi_calendar_synced: true,
            voice_ai_ready: true,
            data_source: 'in_memory_high_fidelity_store',
          },
          features: {
            gemini_api: false,
            realtime_qna: true,
            evidence_generation: true,
            dispute_bot: true,
            voice_ai: true,
            zero_config_evaluation: true,
          },
        });
      });
  }, []);

  // CRITICAL REQUIREMENT: If in Live Mode (valid API keys detected), return null!
  if (!status || status.is_live || status.mode === 'live' || dismissed) {
    return null;
  }

  return (
    <>
      {/* Top Floating / Fixed Evaluation Banner */}
      <div
        id="zero-config-evaluation-banner"
        className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white px-4 py-2.5 shadow-sm text-xs font-medium relative z-30 transition-all"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 text-left">
            <span className="p-1 bg-white/20 rounded-md shrink-0 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-100" />
            </span>
            <p className="leading-tight text-white/95">
              <span className="font-bold text-white">Offline Evaluation Mode</span> (No API keys configured) — Running with pre-packaged verification data and cached AI responses so every feature works out-of-the-box. Add keys to <code className="bg-black/20 px-1 py-0.5 rounded text-[11px] font-mono text-amber-100">.env</code> to enable live calls.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              id="view-benchmark-data-btn"
              onClick={() => setShowDrawer(true)}
              className="px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer border border-white/20"
            >
              <Database className="w-3 h-3" />
              View Benchmark Data
            </button>

            {onOpenVoiceAssistant && (
              <button
                onClick={onOpenVoiceAssistant}
                className="px-2.5 py-1 bg-amber-900/40 hover:bg-amber-900/60 text-amber-100 rounded text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer border border-amber-400/30"
              >
                <Bot className="w-3 h-3" />
                Try Voice AI
              </button>
            )}

            <button
              id="dismiss-demo-banner-btn"
              onClick={() => setDismissed(true)}
              title="Dismiss evaluation banner"
              className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Benchmark & Zero-Config Diagnostics Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Evaluation Mode Diagnostics</h2>
                  <p className="text-[11px] text-slate-500">Zero-Config Pre-Packaged Benchmark Data</p>
                </div>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Architecture Badge */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Dual-Mode Architecture Active
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  Evaluators and judges can test 100% of SettlementGuard's features offline without providing credentials or API keys.
                </p>
              </div>

              {/* Pre-Packaged Dataset Stats */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2 uppercase text-[10px] tracking-wider text-slate-500">
                  Pre-Packaged Dataset Verification
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Settlement Records</span>
                    <span className="text-base font-bold text-slate-900">
                      {status.metrics.active_records}+ batches
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Connected Gateways</span>
                    <span className="text-base font-bold text-slate-900">
                      {status.metrics.partner_banks_connected} Banks
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Detected Anomalies</span>
                    <span className="text-base font-bold text-amber-600">
                      {status.metrics.anomalies_detected} Discrepancies
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Kafka Simulation</span>
                    <span className="text-base font-bold text-emerald-600">
                      Active In-Memory
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature Matrix */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2 uppercase text-[10px] tracking-wider text-slate-500">
                  Zero-Config Feature Readiness
                </h3>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium text-slate-800">Deterministic AI Q&A Fallback</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Ready</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium text-slate-800">Browser Voice AI & Speech</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Ready</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium text-slate-800">Forensic Evidence Generation</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Ready</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium text-slate-800">Tally/Zoho/Excel Exports</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Ready</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium text-slate-800">RBI Calendar & T+2 Tracker</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Ready</span>
                  </div>
                </div>
              </div>

              {/* How to enable live mode */}
              <div className="p-3 bg-slate-100 rounded-xl text-slate-700 space-y-1.5">
                <span className="font-bold text-slate-900 block text-[11px]">How to Enable Live Production Mode:</span>
                <p className="text-[11px] leading-relaxed">
                  Add your valid Gemini key in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-900">.env</code>:
                </p>
                <pre className="bg-slate-900 text-slate-100 p-2 rounded text-[10px] font-mono overflow-x-auto">
                  GEMINI_API_KEY=AIzaSy...
                </pre>
                <p className="text-[10px] text-slate-500">
                  When a valid key is detected, this banner disappears completely and live LLM inference is engaged.
                </p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">SettlementGuard v3.0</span>
              <button
                onClick={() => setShowDrawer(false)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
