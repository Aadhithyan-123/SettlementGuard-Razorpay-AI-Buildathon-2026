import React, { useState } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Building2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { SettlementRecord, BankName } from '../types';
import { ShieldCheck } from 'lucide-react';

interface SettlementListProps {
  settlements?: SettlementRecord[];
  onSimulateStream?: () => void;
  onInitiateDispute: (settlement: SettlementRecord) => void;
  onExportCsv?: (format: 'tally' | 'zoho' | 'excel') => void;
  onGenerateEvidence?: (settlementId: string) => void;
}

export const SettlementList: React.FC<SettlementListProps> = ({
  settlements = [],
  onSimulateStream,
  onInitiateDispute,
  onExportCsv,
  onGenerateEvidence,
}) => {
  const [search, setSearch] = useState('');
  const [bankFilter, setBankFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<SettlementRecord | null>(null);

  const safeSettlements = Array.isArray(settlements) ? settlements : [];

  const filtered = safeSettlements.filter(s => {
    const matchesSearch =
      s.utr?.toLowerCase().includes(search.toLowerCase()) ||
      s.id?.toLowerCase().includes(search.toLowerCase()) ||
      s.bank?.toLowerCase().includes(search.toLowerCase());
    const matchesBank = bankFilter === 'ALL' || s.bank === bankFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesBank && matchesStatus;
  });

  const handleStreamClick = async () => {
    setIsStreaming(true);
    if (onSimulateStream) {
      await onSimulateStream();
    }
    setTimeout(() => setIsStreaming(false), 500);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by UTR, ID, or Bank..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Bank Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Banks</option>
              <option value="HDFC">HDFC Bank</option>
              <option value="ICICI">ICICI Bank</option>
              <option value="SBI">State Bank of India</option>
              <option value="Axis">Axis Bank</option>
              <option value="Kotak">Kotak Mahindra</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="settled">Settled</option>
            <option value="delayed">Delayed</option>
            <option value="disputed">Disputed / Spiked</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleStreamClick}
            disabled={isStreaming}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isStreaming ? 'animate-spin' : ''}`} />
            {isStreaming ? 'Consuming...' : 'Simulate Kafka Inflow'}
          </button>
          <a
            href="/api/reports/export-audit-pdf"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95"
            title="Download audit report in PDF format"
          >
            <Download className="w-3.5 h-3.5" />
            Audit (PDF)
          </a>
          <a
            href="/api/reports/export-csv?format=excel"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition border border-slate-200"
            title="Download settlement batch ledger in CSV format"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </a>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Settlement UTR / ID</th>
                <th className="py-3 px-3">Bank Gateway</th>
                <th className="py-3 px-3">Gross Inflow</th>
                <th className="py-3 px-3">MDR (Agreed vs Actual)</th>
                <th className="py-3 px-3">GST (18% / 12%)</th>
                <th className="py-3 px-3">Net Deposited</th>
                <th className="py-3 px-3">RBI T+2 SLA</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => {
                const isSpike = s.actualMdrRate > s.expectedMdrRate;
                const extraCharged = s.grossAmount * (s.actualMdrRate - s.expectedMdrRate);

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{s.utr}</span>
                        <span className="text-[10px] text-slate-400 font-sans">{s.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.bank}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      Rs. {Number(s?.grossAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className={isSpike ? 'text-red-600 font-bold' : 'text-slate-800 font-medium'}>
                            {(s.actualMdrRate * 100).toFixed(2)}%
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            (Agreed: {(s.expectedMdrRate * 100).toFixed(2)}%)
                          </span>
                        </div>
                        {isSpike && (
                          <span className="text-[10px] text-red-600 font-semibold">
                            +Rs. {extraCharged.toFixed(0)} overcharged
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-700 font-medium">Rs. {(s.gstDeducted || 0).toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400 block">
                        {(s.actualGstRate * 100).toFixed(0)}% GST
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      Rs. {Number(s?.netSettledAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                    </td>
                    <td className="py-3 px-3">
                      {s.rbiCompliant ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Met T+2
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                          <Clock className="w-3 h-3" /> +{s.delayDays}d Breach
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {s.status === 'disputed' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 text-amber-800">
                          Disputed
                        </span>
                      )}
                      {s.status === 'delayed' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-100 text-purple-800">
                          Delayed
                        </span>
                      )}
                      {s.status === 'settled' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          Reconciled
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {s.status === 'disputed' || s.actualMdrRate > s.expectedMdrRate ? (
                        <button
                          onClick={() => onInitiateDispute(s)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-medium transition cursor-pointer"
                        >
                          Dispute Bank
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedSettlement(s)}
                          className="text-slate-500 hover:text-slate-900 font-medium text-[11px] cursor-pointer"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No settlement records found matching your filters.
          </div>
        )}
      </div>

      {/* Discrepancy Note Modal if selected */}
      {selectedSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Settlement Batch Details</h3>
              <button
                onClick={() => setSelectedSettlement(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">UTR:</span>
                <span className="font-mono font-semibold">{selectedSettlement.utr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank:</span>
                <span className="font-semibold">{selectedSettlement.bank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Amount:</span>
                <span className="font-semibold">Rs. {Number(selectedSettlement?.grossAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">MDR Deducted:</span>
                <span className="font-semibold">Rs. {(selectedSettlement?.mdrDeducted || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GST Deducted:</span>
                <span className="font-semibold">Rs. {(selectedSettlement?.gstDeducted || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Net Amount:</span>
                <span className="font-bold text-emerald-700">Rs. {Number(selectedSettlement?.netSettledAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              {selectedSettlement.discrepancyNote && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs mt-2">
                  <span className="font-bold block mb-0.5">Audit Note:</span>
                  {selectedSettlement.discrepancyNote}
                </div>
              )}
            </div>
            <div className="pt-2 flex justify-end gap-2">
              {onGenerateEvidence && (
                <button
                  onClick={() => {
                    onGenerateEvidence(selectedSettlement.id);
                    setSelectedSettlement(null);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Forensic Evidence
                </button>
              )}
              <button
                onClick={() => setSelectedSettlement(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
