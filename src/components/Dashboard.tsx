import React, { useState } from 'react';
import {
  ShieldAlert,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  Download,
  Building2,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { AnomalyReport, SettlementRecord, DashboardMetrics } from '../types';

interface DashboardProps {
  settlements?: SettlementRecord[];
  anomalies?: AnomalyReport[];
  stats?: {
    totalSettled: number;
    totalCount: number;
    totalDisputed: number;
    totalDelayed: number;
    matchedCount: number;
  };
  metrics?: DashboardMetrics;
  onSimulateKafka?: () => void;
  onRunReconciliation?: () => void;
  onNavigateTab?: (tabId: string) => void;
  onApproveAnomaly?: (id: string) => void;
  onTriggerReconcile?: () => void;
  onExportCsv?: (format: 'tally' | 'zoho' | 'excel') => void;
  onDownloadAuditPdf?: () => void;
  onViewAnomalies?: () => void;
  onViewDisputes?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  settlements = [],
  anomalies = [],
  stats,
  metrics,
  onSimulateKafka,
  onRunReconciliation,
  onNavigateTab,
  onApproveAnomaly,
  onTriggerReconcile,
  onExportCsv,
  onDownloadAuditPdf,
  onViewAnomalies,
  onViewDisputes,
}) => {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleKafkaClick = async () => {
    setIsSimulating(true);
    if (onSimulateKafka) {
      await onSimulateKafka();
    }
    setTimeout(() => setIsSimulating(false), 600);
  };

  const handleReconcileClick = () => {
    if (onRunReconciliation) {
      onRunReconciliation();
    } else if (onTriggerReconcile) {
      onTriggerReconcile();
    }
  };

  const handleNavigate = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else if (tab === 'anomalies' && onViewAnomalies) {
      onViewAnomalies();
    } else if (tab === 'bank-disputes' && onViewDisputes) {
      onViewDisputes();
    }
  };

  const safeAnomalies = Array.isArray(anomalies) ? anomalies : [];
  const safeSettlements = Array.isArray(settlements) ? settlements : [];

  const computedStats = stats || {
    totalSettled: metrics?.totalGrossVolumeINR || safeSettlements.reduce((sum, s) => sum + s.grossAmount, 0) || 1231000,
    totalCount: safeSettlements.length || 100,
    totalDisputed: safeSettlements.filter(s => s?.status === 'disputed').length || 3,
    totalDelayed: safeSettlements.filter(s => s?.status === 'delayed').length || 1,
    matchedCount: Math.round(((metrics?.reconciliationMatchRatePct || 95) / 100) * (safeSettlements.length || 100)),
  };

  const pendingAnomalies = safeAnomalies.filter(a => a?.approvalStatus === 'PENDING');
  const criticalCount = safeAnomalies.filter(a => a?.severity === 'CRITICAL').length;

  const chartData = [
    { day: 'Aug 24', settled: 312000, mdrSaved: 14200, delayDays: 0 },
    { day: 'Aug 25', settled: 170000, mdrSaved: 8500, delayDays: 0 },
    { day: 'Aug 26', settled: 312000, mdrSaved: 19400, delayDays: 0 },
    { day: 'Aug 27', settled: 565000, mdrSaved: 32000, delayDays: 2 },
    { day: 'Aug 28', settled: 89000, mdrSaved: 6100, delayDays: 0 },
    { day: 'Aug 29', settled: 140000, mdrSaved: 11000, delayDays: 0 },
    { day: 'Today', settled: 480000, mdrSaved: 24500, delayDays: 0.5 },
  ];

  const bankDistribution = [
    { bank: 'ICICI', volume: 1850000, mdrAvg: '1.75%', share: '45%' },
    { bank: 'HDFC', volume: 1420000, mdrAvg: '2.50% (Spike)', share: '30%' },
    { bank: 'Axis', volume: 920000, mdrAvg: '1.50%', share: '15%' },
    { bank: 'SBI', volume: 650000, mdrAvg: '0.90% (UPI)', share: '10%' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Kafka Status & Quick Actions */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Kafka 3.5 Consumer Stream Active</span>
            <span className="text-xs text-slate-400">| Poll rate: 60s (Test Mode: rzp_test_xxxxx)</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Razorpay Settlement Guard Autonomous Agent</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Active monitoring: 1,420 settlements/hour across HDFC, ICICI, SBI, Axis, Kotak. Real-time PyTorch anomaly detection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="simulate-kafka-btn"
            onClick={handleKafkaClick}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Streaming...' : 'Simulate Kafka Batch'}
          </button>
          <button
            id="run-reconcile-quick-btn"
            onClick={handleReconcileClick}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition shadow-sm active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            Run AI Reconciliation
          </button>
          <a
            id="download-quick-pdf-btn"
            href="/api/reports/export-audit-pdf"
            download
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95"
            title="Download official audit report in PDF format"
          >
            <Download className="w-3.5 h-3.5" />
            Export Audit (PDF)
          </a>
          <a
            id="download-quick-csv-btn"
            href="/api/reports/export-csv?format=excel"
            download
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition border border-slate-700"
            title="Download raw reconciliation ledger in Excel/CSV format"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </a>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Reconciled Inflow */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Settled Vol</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              Rs. {(computedStats.totalSettled / 100000).toFixed(2)}L
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +14.8%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {computedStats.matchedCount} of {computedStats.totalCount} batches fully matched
          </p>
        </div>

        {/* Card 2: PyTorch Anomaly Detector */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">PyTorch Anomalies</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{safeAnomalies.length}</span>
            {criticalCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                {criticalCount} Critical
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {pendingAnomalies.length} awaiting human-in-the-loop approval
          </p>
        </div>

        {/* Card 3: Dynamic MDR RL Optimization */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">RL MDR Savings</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">Rs. 2.50L</span>
            <span className="text-xs font-semibold text-emerald-600">-0.50% MDR</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bandit routed: 65% ICICI, 20% Axis, 15% HDFC
          </p>
        </div>

        {/* Card 4: RBI T+2 Mandate Compliance */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">RBI T+2 Mandate</span>
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">98.2%</span>
            <span className="text-xs font-semibold text-slate-500">SLA Met</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            1 delay flagged for RBI bank holiday exemption
          </p>
        </div>
      </div>

      {/* Human-in-the-Loop Approval Action Banner (Required for >1L impact) */}
      {pendingAnomalies.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-900">
                  Human-in-the-Loop Action Required: {pendingAnomalies.length} High-Impact Alert(s)
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Financial impact exceeds Rs. 1,00,000 threshold. Under merchant safety policy, autonomous dispute filing requires your explicit authorization.
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {pendingAnomalies.map(anom => (
                    <div key={anom.id} className="bg-white p-2.5 rounded-lg border border-amber-200 text-xs shadow-2xs flex items-center gap-3">
                      <div>
                        <span className="font-semibold text-slate-900">{anom.bank}: </span>
                        <span className="text-slate-600">{anom.description.slice(0, 70)}...</span>
                        <span className="ml-1.5 font-bold text-red-600">Rs. {((anom.financialImpact || 0)/1000).toFixed(0)}k impact</span>
                      </div>
                      <button
                        onClick={() => onApproveAnomaly && onApproveAnomaly(anom.id)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium transition cursor-pointer"
                      >
                        Approve Dispute Filing
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('anomalies')}
              className="text-xs text-amber-900 hover:underline font-medium shrink-0"
            >
              View all anomalies &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Daily Inflows & MDR Savings */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Settlement Velocity & MDR Savings Velocity</h3>
              <p className="text-xs text-slate-500">Gross funds settled vs. RL algorithm savings generated daily</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-md">
              Past 7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSettled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(val) => `Rs. ${val/1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`Rs. ${Number(value || 0).toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" dataKey="settled" name="Settlement Inflow" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorSettled)" />
                <Area type="monotone" dataKey="mdrSaved" name="RL MDR Savings" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSaved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Bank Breakdown & Systematic MDR Tracker */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Multi-Bank Gateway Distribution</h3>
              <span className="text-xs font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => handleNavigate('mdr-optimization')}>
                Optimize &rarr;
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time settlement processing volume and effective blended MDR rates.
            </p>

            <div className="space-y-3">
              {bankDistribution.map((item) => (
                <div key={item.bank} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {item.bank} Gateway
                    </div>
                    <span className="font-bold text-slate-900">Rs. {(item.volume/100000).toFixed(1)}L ({item.share})</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Effective Rate:</span>
                    <span className={item.mdrAvg.includes('Spike') ? 'text-red-600 font-bold' : 'text-slate-700 font-medium'}>
                      {item.mdrAvg}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">RL Bandit Target:</span>
            <span className="text-emerald-700 font-semibold">Route 70% ICICI / 30% Axis</span>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => handleNavigate('reconciliation')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <RefreshCw className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Multi-Bank Engine (LLM + RAG)</h4>
          </div>
          <p className="text-xs text-slate-600">
            Reconciles 50+ banks simultaneously. Explains bank-specific T+1 / T+2 clearing rules with direct Tally/Zoho CSV download.
          </p>
        </div>

        <div
          onClick={() => handleNavigate('delay-forecast')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Delay Forecaster (XGBoost)</h4>
          </div>
          <p className="text-xs text-slate-600">
            Forecasts delays 48h in advance with RBI Holiday XML feeds. Alerts cash flow impact before bank bottlenecks occur.
          </p>
        </div>

        <div
          onClick={() => handleNavigate('bank-disputes')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Autonomous Bank Dispute Bot</h4>
          </div>
          <p className="text-xs text-slate-600">
            Auto-generates formal dispute letters citing RBI circulars. Negotiates overcharge refunds with 7-day Ombudsman timer.
          </p>
        </div>
      </div>
    </div>
  );
};
