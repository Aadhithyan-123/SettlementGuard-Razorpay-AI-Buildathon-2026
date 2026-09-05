import React, { useState } from 'react';
import {
  ShieldAlert,
  Send,
  Building,
  FileText,
  Clock,
  CheckCircle,
  AlertOctagon,
  Copy,
  Check,
  Bot
} from 'lucide-react';
import { BankDispute } from '../types';
import { sendDisputeNegotiation, createDisputeLetter } from '../api/client';

interface BankDisputeChatProps {
  disputes?: BankDispute[];
  onRefreshDisputes: () => void;
}

export const BankDisputeChat: React.FC<BankDisputeChatProps> = ({
  disputes = [],
  onRefreshDisputes,
}) => {
  const safeDisputes = Array.isArray(disputes) ? disputes : [];
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(
    safeDisputes[0]?.id || ''
  );
  const [merchantInput, setMerchantInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  // New dispute modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newBank, setNewBank] = useState('HDFC');
  const [newUtr, setNewUtr] = useState('UTR_HDFC20260825_88301');
  const [newAmount, setNewAmount] = useState('50000');
  const [newReason, setNewReason] = useState('Unauthorized 0.5% MDR rate markup above contractual terms');

  const selectedDispute = safeDisputes.find(d => d.id === selectedDisputeId) || safeDisputes[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantInput.trim() || !selectedDispute) return;
    setIsSending(true);
    try {
      await sendDisputeNegotiation(selectedDispute.id, merchantInput.trim());
      setMerchantInput('');
      onRefreshDisputes();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateNewDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createDisputeLetter({
        settlementId: newUtr,
        bank: newBank,
        amountClaimed: Number(newAmount),
        reason: newReason,
      });
      if (res.dispute) {
        setSelectedDisputeId(res.dispute.id);
      }
      setShowNewModal(false);
      onRefreshDisputes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLetter = () => {
    if (!selectedDispute) return;
    navigator.clipboard.writeText(selectedDispute.disputeLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-semibold text-[10px] rounded-full uppercase tracking-wider">
              Gemini Legal Negotiation Agent
            </span>
            <span className="text-xs text-slate-500">| 7-Day RBI Ombudsman SLA Timer</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Automated Bank Dispute Resolution & Negotiation Bot</h2>
          <p className="text-xs text-slate-500">
            Autonomous drafting of legally grounded bank dispute claims and automated negotiation with bank grievance officers.
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-xs active:scale-95 transition cursor-pointer"
        >
          + Draft New Dispute Letter
        </button>
      </div>

      {/* Main Dispute Interface (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Disputes List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Dispute Filings</h3>
          <div className="space-y-2">
            {safeDisputes.map((disp) => {
              const isSelected = disp.id === selectedDispute?.id;
              return (
                <div
                  key={disp.id}
                  onClick={() => setSelectedDisputeId(disp.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      {disp.bank} Bank
                    </span>
                    <span className="font-bold text-red-600">Rs. {Number(disp?.amountClaimed || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 truncate mb-2">
                    {disp.category}
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Created: {disp.createdDate}</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold">
                      {disp.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Dispute Letter & Live Negotiation Thread */}
        <div className="lg:col-span-2 space-y-4">
          {selectedDispute ? (
            <>
              {/* Formal Legal Demand Letter Accordion */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900">
                      Formal Bank Demand Letter (Ref: {selectedDispute.utr})
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyLetter}
                      className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 text-xs font-medium transition cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                  {selectedDispute.disputeLetter}
                </div>
                <div className="p-3 bg-amber-50 border-t border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>RBI Ombudsman Auto-Escalation Deadline: <strong className="font-bold">{selectedDispute.escalationDeadline}</strong></span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800">
                    SLA: 7 Calendar Days
                  </span>
                </div>
              </div>

              {/* Live Negotiation Thread */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-80">
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-bold text-slate-900">
                      Automated Negotiation Log ({selectedDispute.bank} Settlement Desk)
                    </h4>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    80% Bank Response Rate
                  </span>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                  {selectedDispute.conversationLog.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${msg.sender === 'AI_AGENT' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        <span>{msg.sender === 'AI_AGENT' ? 'SettlementGuard Agent' : `${selectedDispute.bank} Nodal Officer`}</span>
                        <span>•</span>
                        <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</span>
                      </div>
                      <div
                        className={`p-3 rounded-xl max-w-md ${
                          msg.sender === 'AI_AGENT'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Input form */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Instruct AI or reply to bank (e.g., 'Insist on 100% refund citing RBI clause 14')..."
                    value={merchantInput}
                    onChange={(e) => setMerchantInput(e.target.value)}
                    className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !merchantInput.trim()}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSending ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
              Select or draft a dispute to view correspondence.
            </div>
          )}
        </div>
      </div>

      {/* New Dispute Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Draft Bank Dispute Notice</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateNewDispute} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Target Bank</label>
                <select
                  value={newBank}
                  onChange={(e) => setNewBank(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                >
                  <option value="HDFC">HDFC Bank</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="SBI">State Bank of India</option>
                  <option value="Axis">Axis Bank</option>
                  <option value="Kotak">Kotak Mahindra Bank</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Settlement UTR / Sequence Reference</label>
                <input
                  type="text"
                  value={newUtr}
                  onChange={(e) => setNewUtr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Disputed Overcharge Amount (INR)</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Specific Variance / Violation Reason</label>
                <textarea
                  rows={3}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold"
                >
                  Generate & Send via AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
