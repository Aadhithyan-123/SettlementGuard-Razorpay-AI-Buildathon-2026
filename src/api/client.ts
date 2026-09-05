async function safeFetchJson<T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Expected JSON response but received ${contentType || 'non-JSON'} (status ${res.status}): ${text.slice(0, 100)}`);
  }
  return res.json();
}

export async function fetchDashboardMetrics() {
  return safeFetchJson('/api/dashboard/metrics');
}

export async function fetchSettlements(params?: { bank?: string; status?: string; search?: string }) {
  const query = new URLSearchParams();
  if (params?.bank) query.set('bank', params.bank);
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  return safeFetchJson(`/api/settlements?${query.toString()}`);
}

export async function simulateKafkaStream() {
  return safeFetchJson('/api/settlements/simulate-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function triggerReconciliation() {
  return safeFetchJson('/api/settlements/reconcile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function fetchAnomalies() {
  return safeFetchJson('/api/anomalies');
}

export async function actOnAnomaly(anomalyId: string, action: 'APPROVE' | 'REJECT' | 'DISPUTE') {
  return safeFetchJson('/api/anomalies/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ anomalyId, action }),
  });
}

export const resolveAnomaly = actOnAnomaly;

export async function fetchMdrOptimization() {
  return safeFetchJson('/api/mdr/optimization');
}

export const fetchMDROptimization = fetchMdrOptimization;

export async function updateMdrRouting(shares: { iciciShare: number; axisShare: number; hdfcShare: number }) {
  return safeFetchJson('/api/mdr/simulate-routing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(shares),
  });
}

export const updateMDRRouting = updateMdrRouting;

export async function fetchDelayForecast() {
  return safeFetchJson('/api/delays/forecast');
}

export const fetchDelayPredictions = fetchDelayForecast;

export async function fetchGstValidation() {
  return safeFetchJson('/api/gst/validate');
}

export const fetchGSTValidation = fetchGstValidation;

export async function fetchCashFlowForecast() {
  return safeFetchJson('/api/cash-flow/forecast');
}

export async function fetchDisputes() {
  return safeFetchJson('/api/disputes');
}

export const fetchBankDisputes = fetchDisputes;

export async function createDisputeLetter(payload: { settlementId: string; bank: string; amountClaimed: number; reason: string }) {
  return safeFetchJson('/api/disputes/generate-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function sendDisputeNegotiation(disputeId: string, merchantMessage: string) {
  return safeFetchJson('/api/disputes/negotiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ disputeId, merchantMessage }),
  });
}

export async function fetchComplianceAudit() {
  return safeFetchJson('/api/compliance/audit');
}

export const fetchComplianceReport = fetchComplianceAudit;

export async function fetchBenchmarking() {
  return safeFetchJson('/api/benchmarking');
}

export async function askMerchantQnA(question: string) {
  return safeFetchJson('/api/qna', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
}

export async function fetchMerchantPolicy() {
  return safeFetchJson('/api/merchant/policy');
}

export async function updateMerchantPolicy(policy: any) {
  return safeFetchJson('/api/merchant/policy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(policy),
  });
}

export async function fetchCSVPreview(params: { format: string; bank?: string; status?: string }) {
  const query = new URLSearchParams();
  query.set('format', params.format);
  if (params.bank) query.set('bank', params.bank);
  if (params.status) query.set('status', params.status);
  return safeFetchJson(`/api/reports/preview-csv?${query.toString()}`);
}

export function getCSVExportUrl(params: { format: string; bank?: string; status?: string }) {
  const query = new URLSearchParams();
  query.set('format', params.format);
  if (params.bank) query.set('bank', params.bank);
  if (params.status) query.set('status', params.status);
  return `/api/reports/export-csv?${query.toString()}`;
}

export async function simulateDelayPrediction(payload: { surgeVolumeINR: number; targetBank: string; dayOfWeek: string }) {
  return safeFetchJson('/api/delays/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function getGstComplianceReportUrl() {
  return '/api/gst/export-compliance-report';
}

export async function fetchMdrSavingsReport() {
  return safeFetchJson('/api/mdr/savings-report');
}

export async function syncRazorpayRouting(rules?: any[], apiKey?: string) {
  return safeFetchJson('/api/mdr/razorpay-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rules, apiKey }),
  });
}

export async function fetchDemoModeStatus() {
  return safeFetchJson('/api/demo-mode/status');
}

export async function sendVoiceAIQuery(query: string, voiceContext?: string) {
  return safeFetchJson('/api/voice-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, voiceContext }),
  });
}

export async function generateEvidencePacket(settlementId: string, anomalyId?: string) {
  return safeFetchJson('/api/evidence/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ settlementId, anomalyId }),
  });
}

