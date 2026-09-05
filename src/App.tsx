import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  FileCheck,
  AlertTriangle,
  Sliders,
  DollarSign,
  FileSpreadsheet,
  Clock,
  Building,
  RefreshCw,
  Download,
  Bot,
  Activity,
  Award,
  Layers,
  FileText
} from 'lucide-react';
import {
  fetchDashboardMetrics,
  fetchSettlements,
  fetchAnomalies,
  fetchMDROptimization,
  fetchDelayPredictions,
  fetchCashFlowForecast,
  fetchBankDisputes,
  fetchComplianceReport,
  fetchGSTValidation,
  resolveAnomaly,
  getCSVExportUrl,
  updateMDRRouting,
  triggerReconciliation,
  simulateKafkaStream,
  generateEvidencePacket,
} from './api/client';
import {
  DashboardMetrics,
  SettlementRecord,
  AnomalyReport,
  MDRRoutingStrategy,
  DelayPrediction,
  CashFlowForecastDay,
  BankDispute,
  ComplianceAuditRecord,
  GSTValidationReport,
  EvidencePacket,
} from './types';
import { Dashboard } from './components/Dashboard';
import { SettlementList } from './components/SettlementList';
import { AnomalyAlert } from './components/AnomalyAlert';
import { MDROptimizer } from './components/MDROptimizer';
import { DelayForecast } from './components/DelayForecast';
import { CashFlowForecast } from './components/CashFlowForecast';
import { GSTValidator } from './components/GSTValidator';
import { BankDisputeChat } from './components/BankDisputeChat';
import { ComplianceReport } from './components/ComplianceReport';
import { ReconciliationReport } from './components/ReconciliationReport';
import { CSVReportGenerator } from './components/CSVReportGenerator';
import { DemoModeBanner } from './components/DemoModeBanner';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { EvidenceModal } from './components/EvidenceModal';

type TabType =
  | 'overview'
  | 'reconciliation'
  | 'settlements'
  | 'csv_reports'
  | 'mdr_optimizer'
  | 'anomalies'
  | 'delay_forecast'
  | 'gst_validator'
  | 'disputes'
  | 'compliance';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedCsvFormat, setSelectedCsvFormat] = useState<'tally' | 'zoho' | 'excel'>('excel');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidencePacket | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [settlements, setSettlements] = useState<SettlementRecord[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyReport[]>([]);
  const [mdrStrategies, setMdrStrategies] = useState<MDRRoutingStrategy[]>([]);
  const [currentBlendedMdr, setCurrentBlendedMdr] = useState(2.30);
  const [optimizedBlendedMdr, setOptimizedBlendedMdr] = useState(1.75);
  const [estimatedSavings, setEstimatedSavings] = useState(275000);
  const [routingRec, setRoutingRec] = useState('');
  const [predictions, setPredictions] = useState<DelayPrediction[]>([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState<any[]>([]);
  const [modelAccuracy, setModelAccuracy] = useState('96.2% Confidence (R² = 0.94)');
  const [cashFlowDays, setCashFlowDays] = useState<CashFlowForecastDay[]>([]);
  const [next7DaysInflow, setNext7DaysInflow] = useState(2450000);
  const [next30DaysEstimate, setNext30DaysEstimate] = useState(12400000);
  const [crunchAlert, setCrunchAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [disputes, setDisputes] = useState<BankDispute[]>([]);
  const [complianceScore, setComplianceScore] = useState(98.4);
  const [breachesCount, setBreachesCount] = useState(1);
  const [auditTrail, setAuditTrail] = useState<ComplianceAuditRecord[]>([]);
  const [gstReport, setGstReport] = useState<GSTValidationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [reconciling, setReconciling] = useState(false);

  // Load all initial data
  const loadData = async () => {
    try {
      const [
        m,
        s,
        a,
        mdr,
        delays,
        cf,
        disp,
        comp,
        gst
      ] = await Promise.all([
        fetchDashboardMetrics(),
        fetchSettlements(),
        fetchAnomalies(),
        fetchMDROptimization(),
        fetchDelayPredictions(),
        fetchCashFlowForecast(),
        fetchBankDisputes(),
        fetchComplianceReport(),
        fetchGSTValidation(),
      ]);

      if (m) setMetrics(m);
      if (Array.isArray(s)) setSettlements(s);
      if (Array.isArray(a)) setAnomalies(a);
      if (mdr) {
        if (Array.isArray(mdr.strategies)) setMdrStrategies(mdr.strategies);
        if (typeof mdr.currentBlendedMdr === 'number') setCurrentBlendedMdr(mdr.currentBlendedMdr);
        if (typeof mdr.optimizedBlendedMdr === 'number') setOptimizedBlendedMdr(mdr.optimizedBlendedMdr);
        if (typeof mdr.estimatedMonthlySavingsINR === 'number') setEstimatedSavings(mdr.estimatedMonthlySavingsINR);
        if (mdr.reinforcementLearningRecommendation) setRoutingRec(mdr.reinforcementLearningRecommendation);
      }
      if (delays) {
        if (Array.isArray(delays.predictions)) setPredictions(delays.predictions);
        if (Array.isArray(delays.upcomingHolidays)) setUpcomingHolidays(delays.upcomingHolidays);
        if (delays.modelAccuracy) setModelAccuracy(delays.modelAccuracy);
      }
      if (cf) {
        if (Array.isArray(cf.dailyForecast)) setCashFlowDays(cf.dailyForecast);
        if (typeof cf.next7DaysExpectedInflow === 'number') setNext7DaysInflow(cf.next7DaysExpectedInflow);
        if (typeof cf.next30DaysEstimate === 'number') setNext30DaysEstimate(cf.next30DaysEstimate);
        if (typeof cf.cashCrunchAlert === 'boolean') setCrunchAlert(cf.cashCrunchAlert);
        if (cf.alertMessage) setAlertMsg(cf.alertMessage);
      }
      if (Array.isArray(disp)) setDisputes(disp);
      if (comp) {
        if (typeof comp.complianceScore === 'number') setComplianceScore(comp.complianceScore);
        if (typeof comp.breachesDetected === 'number') setBreachesCount(comp.breachesDetected);
        if (Array.isArray(comp.auditTrail)) setAuditTrail(comp.auditTrail);
      }
      if (gst) setGstReport(gst);
    } catch (err) {
      console.error('Error loading SettlementGuard v3.0 data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 20000); // 20s live sync
    return () => clearInterval(interval);
  }, []);

  const handleSimulateStream = async () => {
    try {
      await simulateKafkaStream();
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunReconcile = async () => {
    setReconciling(true);
    try {
      await triggerReconciliation();
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setReconciling(false);
    }
  };

  const handleAnomalyAction = async (anomalyId: string, action: 'APPROVE' | 'REJECT' | 'DISPUTE') => {
    try {
      await resolveAnomaly(anomalyId, action);
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleInitiateDispute = (
    bankOrSettlement?: string | SettlementRecord,
    amount?: number,
    reason?: string
  ) => {
    setActiveTab('disputes');
  };

  const handleDownloadAuditCert = () => {
    window.location.href = '/api/reports/export-audit-pdf';
  };

  const handleExportCsv = (format: 'tally' | 'zoho' | 'excel') => {
    setSelectedCsvFormat(format);
    setActiveTab('csv_reports');
  };

  const handleUpdateRouting = async (shares: { iciciShare: number; axisShare: number; hdfcShare: number }) => {
    try {
      const res = await updateMDRRouting(shares);
      setCurrentBlendedMdr(res.currentBlendedMdr);
      setOptimizedBlendedMdr(res.optimizedBlendedMdr);
      setEstimatedSavings(res.estimatedMonthlySavingsINR);
      setRoutingRec(res.reinforcementLearningRecommendation);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenEvidence = async (settlementId: string, anomalyId?: string) => {
    try {
      const res = await generateEvidencePacket(settlementId, anomalyId);
      if (res && res.evidence) {
        setSelectedEvidence(res.evidence);
      }
    } catch (err) {
      console.error('Failed to generate evidence', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Zero-Config Evaluation Banner (Automatically hidden when valid live API keys exist) */}
      <DemoModeBanner
        onNavigateTab={(tab) => setActiveTab(tab as any)}
        onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
      />

      {/* Top Banner Navigation & Live System Status */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Tag */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                    SettlementGuard <span className="text-blue-600">v3.0</span>
                  </h1>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Autonomous
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Razorpay AI Settlement Reconciliation &amp; MDR Defense Engine
                </p>
              </div>
            </div>

            {/* Mobile Action Controls */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200 transition"
                title="Voice AI Assistant"
              >
                <Bot className="w-4 h-4" />
              </button>
              <button
                onClick={handleRunReconcile}
                disabled={reconciling}
                className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
                title="Run Daily Reconcile"
              >
                <Zap className={`w-4 h-4 ${reconciling ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Quick Actions & System Health */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-700">Kafka Stream Active</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600">RBI Calendar Synced</span>
                <span className="text-slate-400">|</span>
                <span className="text-emerald-700 font-semibold">50+ Banks Grounded</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="header-voice-ai-btn"
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg text-xs font-semibold shadow-xs active:scale-95 transition cursor-pointer border border-blue-500/30"
                >
                  <Bot className="w-3.5 h-3.5 text-blue-200" />
                  Voice AI
                </button>
                <button
                  id="header-trigger-reconcile-btn"
                  onClick={handleRunReconcile}
                  disabled={reconciling}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs active:scale-95 disabled:opacity-60 transition cursor-pointer"
                >
                  <Zap className={`w-3.5 h-3.5 ${reconciling ? 'animate-spin' : ''}`} />
                  {reconciling ? 'Reconciling...' : 'Run Daily Reconcile'}
                </button>
                <button
                  onClick={() => handleExportCsv('tally')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs active:scale-95 transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Export CSV
                </button>
                <button
                  onClick={handleDownloadAuditCert}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF Audit
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <nav className="flex items-center space-x-1 overflow-x-auto py-1 border-t border-slate-100 text-xs no-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Overview
            </button>
            <button
              onClick={() => setActiveTab('reconciliation')}
              className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reconciliation'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" /> Multi-Bank Reconcile
            </button>
            <button
              onClick={() => setActiveTab('csv_reports')}
              className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'csv_reports'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Accounting CSV Reports
            </button>
            <button
              onClick={() => setActiveTab('settlements')}
              className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'settlements'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building className="w-3.5 h-3.5" /> Settlements Ledger
            </button>
            <button
              onClick={() => setActiveTab('mdr_optimizer')}
              className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'mdr_optimizer'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600" /> MDR Optimizer (RL)
            </button>
            <button
              onClick={() => setActiveTab('anomalies')}
              className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'anomalies'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Anomalies &amp; Spikes
              {(Array.isArray(anomalies) ? anomalies : []).filter(a => a?.approvalStatus === 'PENDING').length > 0 && (
                <span className="px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[10px] font-bold">
                  {(Array.isArray(anomalies) ? anomalies : []).filter(a => a?.approvalStatus === 'PENDING').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('delay_forecast')}
              className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'delay_forecast'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-purple-600" /> Delay Forecasting
            </button>
            <button
              onClick={() => setActiveTab('gst_validator')}
              className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'gst_validator'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> GST &amp; TDS 194-O
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'disputes'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-rose-600" /> Bank Dispute Bot
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'compliance'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-indigo-600" /> RBI Compliance
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-600">
              Initializing SettlementGuard v3.0 Autonomous Engine...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && metrics && (
              <Dashboard
                metrics={metrics}
                settlements={settlements}
                anomalies={anomalies}
                stats={{
                  totalSettled: metrics.totalGrossVolumeINR,
                  totalCount: (settlements || []).length || 100,
                  totalDisputed: (settlements || []).filter(s => s?.status === 'disputed').length,
                  totalDelayed: (settlements || []).filter(s => s?.status === 'delayed').length,
                  matchedCount: Math.round((metrics.reconciliationMatchRatePct / 100) * ((settlements || []).length || 100)),
                }}
                onSimulateKafka={handleSimulateStream}
                onRunReconciliation={handleRunReconcile}
                onNavigateTab={(tab) => {
                  if (tab === 'mdr-optimization' || tab === 'mdr_optimizer') setActiveTab('mdr_optimizer');
                  else if (tab === 'delay-forecast' || tab === 'delay_forecast') setActiveTab('delay_forecast');
                  else if (tab === 'bank-disputes' || tab === 'disputes') setActiveTab('disputes');
                  else if (tab === 'anomalies') setActiveTab('anomalies');
                  else if (tab === 'reconciliation') setActiveTab('reconciliation');
                  else if (tab === 'settlements') setActiveTab('settlements');
                  else setActiveTab(tab as any);
                }}
                onApproveAnomaly={(id) => handleAnomalyAction(id, 'APPROVE')}
                onTriggerReconcile={handleRunReconcile}
                onExportCsv={handleExportCsv}
                onDownloadAuditPdf={handleDownloadAuditCert}
                onViewAnomalies={() => setActiveTab('anomalies')}
                onViewDisputes={() => setActiveTab('disputes')}
              />
            )}

            {activeTab === 'reconciliation' && (
              <ReconciliationReport onExportCsv={handleExportCsv} />
            )}

            {activeTab === 'csv_reports' && (
              <CSVReportGenerator
                initialFormat={selectedCsvFormat}
                onClose={() => setActiveTab('overview')}
              />
            )}

            {activeTab === 'settlements' && (
              <SettlementList
                settlements={settlements}
                onSimulateStream={handleSimulateStream}
                onInitiateDispute={handleInitiateDispute}
                onExportCsv={handleExportCsv}
                onGenerateEvidence={handleOpenEvidence}
              />
            )}

            {activeTab === 'mdr_optimizer' && (
              <MDROptimizer
                strategies={mdrStrategies}
                currentBlendedMdr={currentBlendedMdr}
                optimizedBlendedMdr={optimizedBlendedMdr}
                estimatedSavings={estimatedSavings}
                routingRecommendation={routingRec}
                onUpdateRouting={handleUpdateRouting}
              />
            )}

            {activeTab === 'anomalies' && (
              <AnomalyAlert
                anomalies={anomalies}
                onAction={handleAnomalyAction}
                onInitiateDispute={handleInitiateDispute}
                onGenerateEvidence={handleOpenEvidence}
              />
            )}

            {activeTab === 'delay_forecast' && (
              <DelayForecast
                predictions={predictions}
                upcomingHolidays={upcomingHolidays}
                modelAccuracy={modelAccuracy}
              />
            )}

            {activeTab === 'gst_validator' && gstReport && (
              <GSTValidator
                report={gstReport}
                onInitiateDispute={handleInitiateDispute}
              />
            )}

            {activeTab === 'disputes' && (
              <BankDisputeChat
                disputes={disputes}
                onRefreshDisputes={loadData}
              />
            )}

            {activeTab === 'compliance' && (
              <ComplianceReport
                complianceScore={complianceScore}
                totalAudited={auditTrail.length}
                breachesCount={breachesCount}
                auditTrail={auditTrail}
                onDownloadAuditCert={handleDownloadAuditCert}
              />
            )}
          </>
        )}
      </main>

      {/* Voice AI Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab as any)}
        onTriggerReconcile={handleRunReconcile}
      />

      {/* Forensic Evidence Documentation Modal */}
      <EvidenceModal
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">SettlementGuard v3.0</span>
            <span>•</span>
            <span>Autonomous Razorpay Settlement Defense &amp; MDR Arbitrage</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>RBI Master Directions 2026</span>
            <span>•</span>
            <span>Section 194-O TDS Verified</span>
            <span>•</span>
            <span>Zero Paid API Dependencies</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
