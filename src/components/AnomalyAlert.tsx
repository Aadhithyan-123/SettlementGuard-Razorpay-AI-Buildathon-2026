import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Clock,
  HelpCircle,
  Send,
  Ticket
} from 'lucide-react';
import { AnomalyReport } from '../types';
import { ShieldCheck } from 'lucide-react';

interface AnomalyAlertProps {
  anomalies?: AnomalyReport[];
  onAction: (anomalyId: string, action: 'APPROVE' | 'REJECT' | 'DISPUTE') => void;
  onInitiateDispute: (bank: string, amount: number, reason: string) => void;
  onGenerateEvidence?: (settlementId: string, anomalyId?: string) => void;
}

export const AnomalyAlert: React.FC<AnomalyAlertProps> = ({
  anomalies = [],
  onAction,
  onInitiateDispute,
  onGenerateEvidence,
}) => {
  const safeAnomalies = Array.isArray(anomalies) ? anomalies : [];
  const pending = safeAnomalies.filter(a => a?.approvalStatus === 'PENDING');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-semibold text-[10px] rounded-full uppercase tracking-wider">
              PyTorch Anomaly Model
            </span>
            <span className="text-xs text-slate-500">| Statistical Isolation Forest & Autoencoder</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Settlement Anomaly & MDR Spike Detector</h2>
          <p className="text-xs text-slate-500">
            Real-time heuristic & neural detection of systematic bank rate hikes, delayed deposits, and missing transaction settlements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">Pending Approvals (&gt; 1L)</div>
            <div className="text-lg font-bold text-amber-600">{pending.length} Action Items</div>
          </div>
        </div>
      </div>

      {/* Human-in-the-Loop Pending Approvals Section */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>High-Impact Anomalies Requiring Merchant Authorization</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {pending.map(anom => (
              <div
                key={anom.id}
                className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-md">
                      {anom.severity}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{anom.bank} Bank: {anom.anomalyType.replace(/_/g, ' ')}</span>
                    <span className="text-xs text-slate-500">| Detected {anom.detectedAt ? new Date(anom.detectedAt).toLocaleTimeString() : 'Recently'}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {anom.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs pt-1">
                    <span className="font-semibold text-red-600">
                      Projected Financial Impact: Rs. {Number(anom.financialImpact || 0).toLocaleString('en-IN')}
                    </span>
                    <span className="text-slate-500">| Human-in-the-Loop Threshold: &gt; 1,00,000</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onAction(anom.id, 'APPROVE')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                  >
                    Approve Support Escalation
                  </button>
                  <button
                    onClick={() => onInitiateDispute(anom.bank, anom.financialImpact, anom.description)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Draft Bank Dispute
                  </button>
                  <button
                    onClick={() => onAction(anom.id, 'REJECT')}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Historical & Resolved Anomalies Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Audit Trail of Flagged Discrepancies</h3>
          <span className="text-xs text-slate-500">Total Flagged: {safeAnomalies.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <th className="py-3 px-4">Type & Bank</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Impact (INR)</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Resolution / Ticket</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeAnomalies.map((anom) => (
                <tr key={anom.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{anom.bank}</span>
                    <span className="text-[10px] text-slate-500">{anom.anomalyType.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 max-w-md">
                    {anom.description}
                  </td>
                  <td className="py-3 px-3 font-bold text-red-600">
                    Rs. {Number(anom.financialImpact || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      anom.severity === 'CRITICAL'
                        ? 'bg-red-100 text-red-700'
                        : anom.severity === 'HIGH'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {anom.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {anom.ticketId ? (
                      <span className="inline-flex items-center gap-1 font-mono font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        <Ticket className="w-3 h-3" /> {anom.ticketId}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {anom.approvalStatus === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    )}
                    {anom.approvalStatus === 'AUTO_RESOLVED' && (
                      <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Filed
                      </span>
                    )}
                    {anom.approvalStatus === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                        <Clock className="w-3.5 h-3.5" /> Awaiting Review
                      </span>
                    )}
                    {anom.approvalStatus === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 text-slate-500 font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> Dismissed
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {onGenerateEvidence && (
                      <button
                        onClick={() => onGenerateEvidence(anom.settlementId, anom.id)}
                        className="text-emerald-700 hover:text-emerald-900 font-medium text-xs hover:underline cursor-pointer inline-flex items-center gap-1"
                        title="Generate Certified Forensic Evidence Packet"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Evidence
                      </button>
                    )}
                    <button
                      onClick={() => onInitiateDispute(anom.bank, anom.financialImpact, anom.description)}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
                    >
                      Dispute &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
