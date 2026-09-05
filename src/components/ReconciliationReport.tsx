import React, { useState } from 'react';
import {
  FileCheck,
  Download,
  Zap,
  CheckCircle,
  AlertCircle,
  Building,
  HelpCircle,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { triggerReconciliation } from '../api/client';

interface ReconciliationReportProps {
  onExportCsv: (format: 'tally' | 'zoho' | 'excel') => void;
}

export const ReconciliationReport: React.FC<ReconciliationReportProps> = ({ onExportCsv }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [reportData, setReportData] = useState<{
    reconciledCount: number;
    exceptionsCount: number;
    totalPayments: number;
    aiExplanation: string;
    bankRules: Array<{ bank: string; rule: string }>;
  } | null>(null);

  const handleRunReconcile = async () => {
    setIsRunning(true);
    try {
      const res = await triggerReconciliation();
      setReportData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Trigger Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-semibold text-[10px] rounded-full uppercase tracking-wider">
              LLM + RAG Engine (Gemini 3.8 Flash)
            </span>
            <span className="text-xs text-slate-500">| 50+ Banks Knowledge Base</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Multi-Bank Daily Reconciliation Engine</h2>
          <p className="text-xs text-slate-500">
            Autonomous matching of captured payment records against bank clearing UTRs, fee calculations, and RBI settlement cycles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="run-reconcile-main-btn"
            onClick={handleRunReconcile}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs active:scale-95 disabled:opacity-60 transition cursor-pointer"
          >
            <Zap className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Analyzing via RAG...' : 'Execute Daily Reconciliation'}
          </button>
        </div>
      </div>

      {/* Reconciliation Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Payment Batches Matched</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {reportData ? `${reportData.reconciledCount}` : '95'} / 100
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">95.0% Automatic Match Rate</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Exceptions / Variances</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {reportData ? `${reportData.exceptionsCount}` : '5'} Exceptions
          </div>
          <p className="text-xs text-slate-500 mt-1">3 HDFC MDR Spikes, 1 ICICI GST, 1 Delayed</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Daily 6 PM Cron Status</span>
            <FileCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg font-bold text-slate-900">Automated Run Ready</div>
          <p className="text-xs text-slate-500 mt-1">Next scheduled trigger: Today at 18:00 IST</p>
        </div>
      </div>

      {/* AI Explanation & Bank Rules Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gemini RAG Brief */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">AI Reconciliation Synthesis & Root-Cause Audit</h3>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Gemini-Pro Reasoning
            </span>
          </div>
          <div className="prose prose-slate max-w-none text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-lg border border-slate-200">
            {reportData ? reportData.aiExplanation : (
              `Executive Reconciliation Brief | August 2026:

1. Matching Velocity:
- Matched 95/100 payment sequences across 5 partner banking gateways (HDFC, ICICI, SBI, Axis, Kotak).
- Total Reconciled Value: Rs. 1.24 Crore. Zero missing transactions outside flagged exceptions.

2. Exceptions Breakdown:
- HDFC Bank (3 batches): Unauthorized 0.5% MDR rate markup (applied 2.50% vs contracted 2.00%). Systematic discrepancy accumulating Rs. 50,000 variance this cycle.
- ICICI Bank (1 batch): Prescribed GST rate for Groceries (12%) was processed at standard 18%, causing an overcharge of Rs. 15,400 across 318 line-items.
- ICICI Bank (1 batch): Payment pay_005 (Rs. 1,85,000) captured on Aug 25 delayed past T+2 window due to weekend clearing congestion.

3. Actionable Next Steps:
- Auto-escalate Razorpay Support Ticket #44091 for HDFC MDR refund.
- Download Tally/Zoho compliant CSV below to sync ledger entries.`
            )}
          </div>
        </div>

        {/* Bank Specific Reconciliation Rules */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">Bank-Specific Settlement Rules</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">HDFC Bank:</span>
              <p className="text-slate-600">
                Settles on T+1 business day at 14:30 IST. Deducts 2.00% standard MDR. Intermittent weekend settlement roll-overs.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">ICICI Bank:</span>
              <p className="text-slate-600">
                Settles on T+2 at 18:00 IST. Implements category-based GST splitting (12% Groceries, 18% Others).
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">State Bank of India:</span>
              <p className="text-slate-600">
                T+2 batch RTGS clearing. Weekend clearing suspended on 2nd and 4th Saturdays per RBI mandate.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">Axis Bank:</span>
              <p className="text-slate-600">
                T+1 settlement for UPI and Netbanking with immediate NEFT posting. Lowest MDR error frequency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSV Downloads for Accounting Software */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold">Download Accounting-Compatible Reconciliation Reports</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Zero API dependencies on Tally or Zoho. Direct 1-click ledger-mapped CSV export.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onExportCsv('tally')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Tally ERP9 / Prime CSV
          </button>
          <button
            onClick={() => onExportCsv('zoho')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Zoho Books CSV
          </button>
          <button
            onClick={() => onExportCsv('excel')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Full Excel Audit Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
