import React from 'react';
import {
  ShieldCheck,
  X,
  Download,
  FileCheck2,
  Lock,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { EvidencePacket } from '../types';

interface EvidenceModalProps {
  evidence: EvidencePacket | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ evidence, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!evidence) return null;

  const copyHash = () => {
    navigator.clipboard?.writeText(evidence.auditTrailHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Statutory Banking Evidence Packet</h2>
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                  {evidence.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Tamper-proof forensic documentation for RBI Ombudsman &amp; Nodal Dispute Desk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Key Reference Data */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-medium">Batch ID</span>
              <span className="font-mono font-bold text-slate-800 text-xs">{evidence.settlementId}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-medium">Acquiring Bank</span>
              <span className="font-bold text-slate-800 text-xs">{evidence.bank} Bank</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-medium">Clearing UTR</span>
              <span className="font-mono font-bold text-slate-800 text-xs truncate block">{evidence.utr}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-medium">Timestamp</span>
              <span className="font-semibold text-slate-800 text-xs">
                {new Date(evidence.generatedAt).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* SHA-256 Audit Trail Hash */}
          <div className="p-3 bg-slate-900 text-slate-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block">Cryptographic SHA-256 Audit Seal</span>
                <span className="font-mono text-xs text-emerald-300 truncate block">
                  {evidence.auditTrailHash}
                </span>
              </div>
            </div>
            <button
              onClick={copyHash}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-medium flex items-center gap-1 shrink-0 transition cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Variance Breakdown */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
            <h3 className="font-bold text-slate-900 text-xs">Financial Variance Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Gross Batch Volume</span>
                <span className="font-bold text-slate-900">
                  ₹{evidence.financialMetrics.grossAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                <span className="text-[10px] text-emerald-700 block">Contracted MDR</span>
                <span className="font-bold text-emerald-800">
                  {(evidence.financialMetrics.contractualMdrRate * 100).toFixed(2)}%
                </span>
              </div>
              <div className="p-2 bg-rose-50 rounded-lg border border-rose-100">
                <span className="text-[10px] text-rose-700 block">Bank Billed MDR</span>
                <span className="font-bold text-rose-800">
                  {(evidence.financialMetrics.billedMdrRate * 100).toFixed(2)}%
                </span>
              </div>
            </div>
            {evidence.financialMetrics.excessDeductionINR > 0 && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-xs">
                <span className="font-medium text-rose-800">Excess Fee Withheld by Bank:</span>
                <span className="font-bold text-rose-900 text-sm">
                  ₹{evidence.financialMetrics.excessDeductionINR.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* Forensic Proof Points */}
          <div>
            <h3 className="font-bold text-slate-900 text-xs mb-2">Forensic Ledgers &amp; Proof Chain</h3>
            <div className="space-y-1.5 bg-slate-50 border border-slate-200 p-3 rounded-xl">
              {evidence.forensicProof.map((proof, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-700">
                  <FileCheck2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{proof}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Citation */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-200/70 rounded-xl text-indigo-950">
            <span className="font-bold text-[11px] block mb-0.5">Statutory RBI Master Direction Authority</span>
            <p className="text-[11px] text-indigo-900 leading-relaxed">
              {evidence.rbiRegulatoryReference}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-500">
            Valid legal evidence document under Information Technology Act, 2000 (Section 65B)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Close Packet
          </button>
        </div>
      </div>
    </div>
  );
};
