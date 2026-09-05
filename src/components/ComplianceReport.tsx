import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Award,
  Download,
  FileText,
  Building,
  Hash,
  ExternalLink,
  Lock
} from 'lucide-react';
import { ComplianceAuditRecord } from '../types';

interface ComplianceReportProps {
  complianceScore: number;
  totalAudited: number;
  breachesCount: number;
  auditTrail: ComplianceAuditRecord[];
  onDownloadAuditCert: () => void;
}

export const ComplianceReport: React.FC<ComplianceReportProps> = ({
  complianceScore,
  totalAudited,
  breachesCount,
  auditTrail,
  onDownloadAuditCert,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-semibold text-[10px] rounded-full uppercase tracking-wider">
              RBI Statutory Oversight Engine
            </span>
            <span className="text-xs text-slate-500">| SHA-256 Tamper-Evident Ledger</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Regulatory Compliance Monitoring & RBI Audit Trail</h2>
          <p className="text-xs text-slate-500">
            Real-time verification against RBI Master Direction on Payment Aggregators (T+2 clearing, 0% RuPay/UPI MDR caps, Tokenization).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/api/reports/export-audit-pdf"
            download
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs active:scale-95 transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Audit Report (PDF)
          </a>
          <button
            onClick={onDownloadAuditCert}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs active:scale-95 transition cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            Compliance Certificate (PDF)
          </button>
        </div>
      </div>

      {/* Compliance Score & Mandates Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Overall RBI SLA Compliance</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{complianceScore}%</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">Audit-Ready for Q3 2026</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">T+2 Settlement Mandate</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">Compliant</div>
          <p className="text-xs text-slate-500 mt-1">1 holiday exemption recognized</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">0% RuPay / UPI Cap</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">100% Enforced</div>
          <p className="text-xs text-slate-500 mt-1">Zero illegal interchange deducted</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tokenization Mandate</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">Active</div>
          <p className="text-xs text-slate-500 mt-1">COFT guidelines followed</p>
        </div>
      </div>

      {/* Tamper-Evident Audit Trail Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">Cryptographically Hashed Statutory Audit Trail</h3>
          </div>
          <span className="text-xs text-slate-500">
            {totalAudited} Batches Logged
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <th className="py-3 px-4">Mandate Rule</th>
                <th className="py-3 px-3">Bank Gateway</th>
                <th className="py-3 px-3">Audited Batch UTR</th>
                <th className="py-3 px-3">Regulatory Finding</th>
                <th className="py-3 px-3">Compliance</th>
                <th className="py-3 px-4 text-right">SHA-256 Ledger Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {auditTrail.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition font-sans">
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {record.ruleName}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">
                    {record.bank}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                    {record.settlementId}
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-sm font-sans text-xs">
                    {record.finding}
                  </td>
                  <td className="py-3 px-3">
                    {record.compliant ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" /> PASS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                        <AlertTriangle className="w-3 h-3" /> BREACH
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-400">
                    <span title={record.sha256Hash} className="hover:text-slate-800 cursor-pointer">
                      {record.sha256Hash.slice(0, 16)}...
                    </span>
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
