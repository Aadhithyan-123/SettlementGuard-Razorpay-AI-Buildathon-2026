import React, { useState, useEffect } from 'react';
import {
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Copy,
  Check,
  Filter,
  RefreshCw,
  BookOpen,
  Info,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { fetchCSVPreview, getCSVExportUrl } from '../api/client';
import { CSVPreviewResult } from '../types';

interface CSVReportGeneratorProps {
  initialFormat?: 'tally' | 'zoho' | 'excel';
  onClose?: () => void;
}

export const CSVReportGenerator: React.FC<CSVReportGeneratorProps> = ({
  initialFormat = 'excel',
  onClose
}) => {
  const [format, setFormat] = useState<'tally' | 'zoho' | 'excel'>(initialFormat);
  const [selectedBank, setSelectedBank] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [preview, setPreview] = useState<CSVPreviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadPreview = async () => {
    setLoading(true);
    try {
      const data = await fetchCSVPreview({
        format,
        bank: selectedBank,
        status: selectedStatus,
      });
      setPreview(data);
    } catch (err) {
      console.error('Failed to load CSV preview', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreview();
  }, [format, selectedBank, selectedStatus]);

  const handleDownload = () => {
    const url = getCSVExportUrl({
      format,
      bank: selectedBank,
      status: selectedStatus,
    });
    window.location.href = url;
  };

  const handleCopy = () => {
    if (!preview) return;
    const headerLine = preview.headers.map(h => `"${h}"`).join(',');
    const rows = preview.sampleRows.map(row => row.map(cell => `"${cell}"`).join(','));
    const fullText = [headerLine, ...rows].join('\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full uppercase tracking-wider">
              Zero-API Offline Compliance
            </span>
            <span className="text-xs text-slate-500 font-medium">| RFC 4180 Format</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Accounting CSV Report Generation Module
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Produce reconciliation vouchers and bank import statements tailored specifically for Tally ERP9 / Prime, Zoho Books Banking, and Microsoft Excel financial models.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="download-csv-action-btn"
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download {format.toUpperCase()} CSV
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              Back
            </button>
          )}
        </div>
      </div>

      {/* Target Format Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tally Card */}
        <div
          onClick={() => setFormat('tally')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            format === 'tally'
              ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-400/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${format === 'tally' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">Tally ERP9 / Prime</span>
            </div>
            {format === 'tally' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Multi-line Double-Entry Journal vouchers. Automatically creates Bank Dr, Payment Gateway MDR Dr, GST ITC Dr, TDS 194-O Dr, and Sales Cr ledger entries.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-700 font-medium">
            <span>Import via: Gateway of Tally &gt; Import &gt; Transactions</span>
          </div>
        </div>

        {/* Zoho Books Card */}
        <div
          onClick={() => setFormat('zoho')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            format === 'zoho'
              ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-400/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${format === 'zoho' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">Zoho Books Banking</span>
            </div>
            {format === 'zoho' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard Bank Statement schema. Maps Date, UTR Reference Number, Gateway Partner, MDR charges, and Section 194-O TDS for 1-click bank feeds reconciliation.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-blue-700 font-medium">
            <span>Import via: Banking &gt; Add Bank &gt; Import Statement</span>
          </div>
        </div>

        {/* Microsoft Excel Card */}
        <div
          onClick={() => setFormat('excel')}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            format === 'excel'
              ? 'bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-400/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${format === 'excel' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">Microsoft Excel Audit</span>
            </div>
            {format === 'excel' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Comprehensive 20-column enterprise reconciliation workbook. Includes UTR, Agreed vs Actual MDR rates, Statutory GST slab, TDS 194-O, and variance notes.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
            <span>Compatible with Excel 2016+, Google Sheets & PowerBI</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter By Bank:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {['ALL', 'HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak'].map(b => (
              <button
                key={b}
                onClick={() => setSelectedBank(b)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  selectedBank === b
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-600 font-semibold">Status:</span>
          <div className="flex items-center gap-1.5">
            {[
              { label: 'All Statuses', val: 'ALL' },
              { label: 'Reconciled / Settled', val: 'settled' },
              { label: 'Delayed', val: 'delayed' },
              { label: 'Disputed', val: 'disputed' }
            ].map(st => (
              <button
                key={st.val}
                onClick={() => setSelectedStatus(st.val)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  selectedStatus === st.val
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
          <button
            onClick={loadPreview}
            disabled={loading}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            title="Refresh Preview"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Aggregate Financial Highlights */}
      {preview && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-medium text-slate-500">Batches Included</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{preview.totalRecords} Batches</div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-medium text-slate-500">Gross Volume</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              Rs. {(preview.totalGrossINR / 100000).toFixed(2)}L
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-medium text-slate-500">Net Settled</span>
            <div className="text-lg font-bold text-emerald-600 mt-0.5">
              Rs. {(preview.totalNetINR / 100000).toFixed(2)}L
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-medium text-slate-500">MDR Deductions</span>
            <div className="text-lg font-bold text-indigo-600 mt-0.5">
              Rs. {Math.round(preview.totalMdrINR || 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-medium text-slate-500">GST on Gateway</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              Rs. {Math.round(preview.totalGstINR || 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-medium text-slate-500">TDS Sec 194-O (1%)</span>
            <div className="text-lg font-bold text-amber-600 mt-0.5">
              Rs. {Math.round(preview.totalTdsINR || 0).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      )}

      {/* Live CSV Preview Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">
              Live Schema Preview ({preview?.format.toUpperCase() || format.toUpperCase()})
            </span>
            <span className="text-[11px] text-slate-500">
              | Showing first {preview?.sampleRows.length || 0} rows formatted for export
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied CSV!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download File
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[380px]">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
              <span>Formatting CSV columns and calculating ledger accounts...</span>
            </div>
          ) : preview ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  {preview.headers.map((h, i) => (
                    <th key={i} className="px-3.5 py-2.5 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {preview.sampleRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/70 transition">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`px-3.5 py-2 whitespace-nowrap ${
                          cell.includes('COMPLIANT')
                            ? 'text-emerald-600 font-semibold'
                            : cell.includes('BREACH') || cell.includes('DISPUTED')
                            ? 'text-amber-600 font-semibold'
                            : 'text-slate-700'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              No data matches the selected filters.
            </div>
          )}
        </div>
      </div>

      {/* Accounting Software Integration Guidance */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900">
            How to Import This Report into Your Accounting Software
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-3.5 bg-white rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Tally ERP9 / Tally Prime:</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-600">
              <li>Open your company in Tally &gt; Go to <strong>Import</strong> &gt; <strong>Bank Transactions</strong>.</li>
              <li>Select file type as <strong>CSV (Comma Delimited)</strong>.</li>
              <li>Map default accounts: <em>Bank Account - [Partner]</em>, <em>Payment Gateway Charges</em>, and <em>GST Input Credit</em>.</li>
              <li>Press <strong>Import</strong> to create verified double-entry receipt vouchers instantly.</li>
            </ol>
          </div>
          <div className="p-3.5 bg-white rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Zoho Books:</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-600">
              <li>Navigate to the <strong>Banking</strong> module &gt; Choose your settlement bank account.</li>
              <li>Click the <strong>Import Statement</strong> button at the top-right.</li>
              <li>Upload the downloaded Zoho CSV file. Match fields (Reference No, Deposit, Fee).</li>
              <li>Click <strong>Import</strong> &gt; Transactions will appear in your statement tab ready to match with invoices.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
