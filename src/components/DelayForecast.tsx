import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  AlertTriangle,
  Building,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  Sliders,
  Check
} from 'lucide-react';
import { DelayPrediction, BankName, DelaySimulationResult } from '../types';
import { simulateDelayPrediction } from '../api/client';

interface DelayForecastProps {
  predictions: DelayPrediction[];
  upcomingHolidays: Array<{ date: string; name: string; type: string }>;
  modelAccuracy: string;
}

export const DelayForecast: React.FC<DelayForecastProps> = ({
  predictions,
  upcomingHolidays,
  modelAccuracy,
}) => {
  // Simulator State
  const [simVolume, setSimVolume] = useState<number>(5000000); // 50 Lakhs
  const [simBank, setSimBank] = useState<BankName>('ICICI');
  const [simDay, setSimDay] = useState<string>('Friday');
  const [simLoading, setSimLoading] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<DelaySimulationResult | null>({
    predictedDelayDays: 2.8,
    confidenceScorePct: 95.4,
    rbiT2BreachProbabilityPct: 88,
    projectedSettlementDate: '2026-09-08',
    cashFloatImpactINR: 37333,
    riskLevel: 'HIGH',
    recommendation: 'XGBoost Warning: Volume surge of Rs. 50.0L on Friday via ICICI has 88% chance of exceeding RBI T+2 mandate due to weekend RTGS hold. Recommend routing 40% to Axis Gateway.'
  });

  const handleRunSimulation = async () => {
    setSimLoading(true);
    try {
      const res = await simulateDelayPrediction({
        surgeVolumeINR: simVolume,
        targetBank: simBank,
        dayOfWeek: simDay,
      });
      setSimResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSimLoading(false);
    }
  };

  const prophetSeasonality = [
    { day: 'Mon', fullDay: 'Monday', avgDelay: 1.1, window: 'T+1 Normal (RTGS Open)', barPct: 34 },
    { day: 'Tue', fullDay: 'Tuesday', avgDelay: 1.0, window: 'T+1 Peak Velocity', barPct: 31 },
    { day: 'Wed', fullDay: 'Wednesday', avgDelay: 1.2, window: 'T+1 Standard', barPct: 37 },
    { day: 'Thu', fullDay: 'Thursday', avgDelay: 1.4, window: 'T+2 Standard Batch', barPct: 43 },
    { day: 'Fri', fullDay: 'Friday', avgDelay: 3.2, window: 'Weekend Hold (Clears Tue)', barPct: 100 },
    { day: 'Sat', fullDay: 'Saturday', avgDelay: 2.8, window: 'RBI 2nd/4th Sat Freeze', barPct: 87 },
    { day: 'Sun', fullDay: 'Sunday', avgDelay: 2.2, window: 'Clearing Resume Mon 09:00', barPct: 68 },
  ];

  const xgboostFeatures = [
    { feature: 'Payment Volume Quantile', weight: 38.5, desc: 'Large flash sale volume queues up bank RTGS settlement buffers' },
    { feature: 'Bank Clearing House Backlog', weight: 26.2, desc: 'Real-time internal queue depth at partner bank clearing switch' },
    { feature: 'RBI Bank Holiday Proximity (<48h)', weight: 18.7, desc: 'Gazetted and state bank holiday XML calendar halt clearing cycles' },
    { feature: 'Weekend Capture Proximity', weight: 10.9, desc: 'Friday evening captures rollover past T+2 window to Tuesday' },
    { feature: 'Gateway Infrastructure Uptime', weight: 5.7, desc: 'Acquiring switch network latency and health check status' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 font-bold text-[10px] rounded-full uppercase tracking-wider">
              XGBoost + Prophet Dual Model
            </span>
            <span className="text-xs text-slate-500 font-medium">| RBI Holiday API Grounded</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Predictive Settlement Delay Forecasting Engine</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Analyzes historical bank clearance turnaround times, holiday calendars, and incoming volume surges to forecast delays with 95%+ confidence.
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 px-4 py-2.5 rounded-xl text-right">
          <div className="text-[10px] text-purple-800 font-bold uppercase tracking-wider">Dual Model Accuracy</div>
          <div className="text-sm font-bold text-purple-900">{modelAccuracy}</div>
        </div>
      </div>

      {/* Proactive Warning Alert Banner */}
      <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              High Confidence Proactive Delay Warning (95% Probability)
            </span>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              <strong>ICICI Bank settlement delayed by 2 days:</strong> Incoming batch of Rs. 3,40,000 scheduled for Sep 06 will clear on Sep 08 due to RBI 2nd Saturday closure hold.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 bg-amber-600 text-white text-[11px] font-bold rounded-lg shadow-2xs">
            Action: Defer Vendor Payout #9812
          </span>
        </div>
      </div>

      {/* Active Delay Predictions Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          <span>Active 48-Hour Bank Clearance Predictions</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictions.map((pred) => (
            <div
              key={pred.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg font-bold text-xs">
                      {pred.bank}
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      +{pred.predictedDelayDays} Business Days Delay
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    {pred.confidencePct}% Confidence
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-3">
                  {pred.reason}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Contracted Due Date</span>
                    <span className="font-semibold text-slate-800">{pred.originalDueDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Predicted Inflow Date</span>
                    <span className="font-bold text-amber-700">{pred.predictedSettlementDate}</span>
                  </div>
                  <div className="col-span-2 pt-1.5 border-t border-slate-200 mt-1 flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">Working Capital Float:</span>
                    <span className="font-bold text-red-600">Rs. {Number(pred?.cashFlowImpact || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Autonomous Safeguard:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cash Crunch Alert Triggered
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prophet Day-of-Week Seasonality + XGBoost Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prophet Seasonality Decomposition */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Prophet Model: Weekly Settlement Velocity Cycle
              </h3>
            </div>
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              Additive Seasonality
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Decomposed day-of-week clearing turnaround times across 1.4M historical settlements. Friday captures suffer peak hold.
          </p>
          <div className="space-y-2.5">
            {prophetSeasonality.map((s) => (
              <div key={s.day} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 w-8">{s.day}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{s.window}</span>
                  </div>
                  <span className={`font-bold ${s.avgDelay >= 2.5 ? 'text-amber-700' : 'text-slate-700'}`}>
                    {s.avgDelay} Days
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      s.avgDelay >= 2.5 ? 'bg-amber-500' : 'bg-purple-600'
                    }`}
                    style={{ width: `${s.barPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* XGBoost Feature Importance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                XGBoost Feature Importance Weights
              </h3>
            </div>
            <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
              Gain Metric Ranking
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Top mathematical predictors determining whether a settlement batch will violate the RBI T+2 mandate.
          </p>
          <div className="space-y-3">
            {xgboostFeatures.map((feat) => (
              <div key={feat.feature} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{feat.feature}</span>
                  <span className="font-extrabold text-indigo-600">{feat.weight}%</span>
                </div>
                <p className="text-[11px] text-slate-500">{feat.desc}</p>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${feat.weight * 2.2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Volume Surge Delay Simulator */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
                What-If Machine Learning Lab
              </span>
              <span className="text-xs text-slate-400 font-medium">| Flash Sale Load Testing</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Interactive Volume Surge Delay Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate flash sale volume spikes or festival dates to see how XGBoost predicts bank clearing queue congestion.
            </p>
          </div>
          <button
            onClick={handleRunSimulation}
            disabled={simLoading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition cursor-pointer active:scale-95"
          >
            <Sparkles className={`w-4 h-4 ${simLoading ? 'animate-spin' : ''}`} />
            {simLoading ? 'Scoring Features...' : 'Run ML Forecast'}
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Volume Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Surge Transaction Volume:</span>
              <span className="text-purple-400 font-bold">Rs. {(simVolume / 100000).toFixed(1)} Lakhs</span>
            </div>
            <input
              type="range"
              min={500000}
              max={30000000}
              step={500000}
              value={simVolume}
              onChange={(e) => setSimVolume(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Rs. 5 Lakhs</span>
              <span>Rs. 1.5 Crore</span>
              <span>Rs. 3.0 Crore</span>
            </div>
          </div>

          {/* Bank Partner Selector */}
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-semibold block">Acquiring Partner Bank:</label>
            <div className="grid grid-cols-2 gap-2">
              {(['ICICI', 'HDFC', 'SBI', 'Axis'] as BankName[]).map((b) => (
                <button
                  key={b}
                  onClick={() => setSimBank(b)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    simBank === b
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Day of Capture */}
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-semibold block">Capture Day of Week:</label>
            <select
              value={simDay}
              onChange={(e) => setSimDay(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Monday">Monday (Normal Velocity)</option>
              <option value="Tuesday">Tuesday (Peak Velocity)</option>
              <option value="Wednesday">Wednesday (Standard)</option>
              <option value="Thursday">Thursday (Standard)</option>
              <option value="Friday">Friday (Weekend Hold Risk)</option>
              <option value="Saturday">Saturday (RBI 2nd/4th Freeze)</option>
              <option value="Sunday">Sunday (Batch Rollover)</option>
            </select>
          </div>
        </div>

        {/* Simulation Output Card */}
        {simResult && (
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Predicted Clearance Delay</span>
              <div className="text-2xl font-bold text-amber-400 mt-0.5">
                +{simResult.predictedDelayDays} Days
              </div>
              <span className="text-[10px] text-slate-400">Confidence: {simResult.confidenceScorePct}%</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">RBI T+2 Breach Risk</span>
              <div className={`text-xl font-bold mt-0.5 ${simResult.rbiT2BreachProbabilityPct > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                {simResult.rbiT2BreachProbabilityPct}% Risk
              </div>
              <span className="text-[10px] text-slate-400">Projected: {simResult.projectedSettlementDate}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Working Capital Float Cost</span>
              <div className="text-xl font-bold text-white mt-0.5">
                Rs. {Number(simResult?.cashFloatImpactINR || 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400">Short-term opportunity cost</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700/60 text-xs">
              <span className="font-bold text-purple-300 block mb-1">Autonomous Recommendation:</span>
              <p className="text-[11px] text-slate-300 leading-snug">
                {simResult.recommendation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* RBI Holiday Calendar Free XML Integration */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">RBI Official Bank Holiday Radar (Free XML Integration)</h3>
          </div>
          <a
            href="https://rbidocs.rbi.org.in/content/contentxml/AnnualCalendar.xml"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
          >
            RBI XML Feed <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-xs text-slate-500">
          Syncs without commercial API subscriptions directly with the Reserve Bank of India’s official holiday XML schedule.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {upcomingHolidays.map((holiday) => (
            <div
              key={holiday.name}
              className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1"
            >
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full inline-block">
                {holiday.type}
              </span>
              <div className="text-xs font-bold text-slate-900">{holiday.name}</div>
              <div className="text-[11px] text-slate-500">{holiday.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
