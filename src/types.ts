export type BankName = 'HDFC' | 'ICICI' | 'SBI' | 'Axis' | 'Kotak' | 'Yes Bank';
export type SettlementStatus = 'settled' | 'delayed' | 'disputed' | 'missing' | 'pending';
export type ProductCategory = 'Electronics' | 'Groceries' | 'Services' | 'Digital Goods';

export interface PaymentRecord {
  id: string; // e.g. pay_001
  merchantId: string;
  orderId: string;
  amount: number; // in INR
  bank: BankName;
  paymentMethod: 'Credit Card' | 'Debit Card' | 'UPI' | 'Netbanking';
  category: ProductCategory;
  status: 'captured' | 'failed' | 'refunded';
  capturedAt: string; // ISO string
  expectedSettlementDate: string;
  settledAt?: string;
  settlementId?: string;
}

export interface SettlementRecord {
  id: string; // setl_xxx
  utr: string; // Unique Transaction Reference
  merchantId: string;
  bank: BankName;
  grossAmount: number;
  expectedMdrRate: number; // e.g. 0.02 (2.0%)
  actualMdrRate: number; // e.g. 0.025 (2.5% spike)
  mdrDeducted: number;
  expectedGstRate: number; // 0.18 or 0.12
  actualGstRate: number;
  gstDeducted: number;
  tdsDeducted: number;
  netSettledAmount: number;
  status: SettlementStatus;
  settledAt: string;
  dueDate: string;
  delayDays: number;
  rbiCompliant: boolean; // T+2 mandate check
  reconciled: boolean;
  paymentIds: string[];
  discrepancyNote?: string;
}

export interface AnomalyReport {
  id: string;
  settlementId: string;
  merchantId: string;
  bank: BankName;
  anomalyType: 'MDR_SPIKE' | 'SETTLEMENT_DELAY' | 'MISSING_SETTLEMENT' | 'GST_MISCALCULATION' | 'DUPLICATE_DEDUCTION';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  financialImpact: number; // in INR
  financialImpactINR?: number;
  requiresApproval: boolean; // true if financialImpact > 100,000 (Human-in-the-loop)
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'AUTO_RESOLVED';
  description: string;
  detectedAt: string;
  ticketId?: string;
  resolutionDetails?: string;
}

export interface MDRRoutingStrategy {
  bank: BankName;
  recommendedSharePct: number; // e.g. 70
  currentMdrRate: number; // e.g. 1.8%
  competitorMdrRate: number; // e.g. 2.3%
  averageSuccessRate: number; // e.g. 99.1%
  monthlySavingsEstimate: number; // in INR
}

export interface DelayPrediction {
  id: string;
  merchantId: string;
  bank: BankName;
  predictedDelayDays: number;
  confidencePct: number; // e.g. 95%
  originalDueDate: string;
  predictedSettlementDate: string;
  holidayInterference: boolean;
  holidayName?: string;
  reason: string;
  cashFlowImpact: number;
}

export interface BankDispute {
  id: string;
  settlementId: string;
  bank: BankName;
  utr: string;
  amountClaimed: number;
  category: string;
  createdDate: string;
  escalationDeadline: string; // 7 days from creation for RBI ombudsman
  status: 'Drafted' | 'Sent to Bank' | 'Negotiating' | 'Escalated to RBI' | 'Refunded';
  disputeLetter: string;
  conversationLog: Array<{
    sender: 'AI_AGENT' | 'BANK_BOT' | 'RBI_OMBUDSMAN';
    timestamp: string;
    message: string;
  }>;
}

export interface CashFlowForecastDay {
  date: string;
  expectedInflow: number;
  predictedDelaysDeduction: number;
  netInflow: number;
  cumulativeInflow: number;
  isCrunchAlert: boolean;
}

export interface GSTValidationDiscrepancy {
  settlementId: string;
  bank: string;
  category: string;
  expectedRate: number;
  actualRate: number;
  expectedGstAmount: number;
  actualGstAmount: number;
  overchargedAmount: number;
  tdsExpectedAmount: number;
  tdsActualAmount: number;
  tdsVarianceAmount: number;
  auditExplanation: string;
}

export interface GSTValidationReport {
  totalAuditedItems: number;
  miscalculatedItems: number;
  totalOvercharged: number;
  totalTdsAudited: number;
  totalTdsVariance: number;
  complianceRatePct: number;
  aiAuditOpinion?: string;
  hardcodedRates?: Record<string, number>;
  discrepancies: GSTValidationDiscrepancy[];
  summary?: string;
}

export interface CSVExportOptions {
  format: 'tally' | 'zoho' | 'excel';
  bank?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface CSVPreviewResult {
  format: 'tally' | 'zoho' | 'excel';
  headers: string[];
  sampleRows: string[][];
  totalRecords: number;
  totalGrossINR: number;
  totalNetINR: number;
  totalMdrINR: number;
  totalGstINR: number;
  totalTdsINR: number;
}

export interface ProphetSeasonalityPoint {
  day: string;
  avgDelayDays: number;
  confidenceLower: number;
  confidenceUpper: number;
  clearingWindow: string;
}

export interface XGBoostFeatureImportance {
  feature: string;
  weightPct: number;
  impactDescription: string;
}

export interface DelaySimulationRequest {
  surgeVolumeINR: number;
  targetBank: BankName;
  dayOfWeek: string;
}

export interface DelaySimulationResult {
  predictedDelayDays: number;
  confidenceScorePct: number;
  rbiT2BreachProbabilityPct: number;
  projectedSettlementDate: string;
  cashFloatImpactINR: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: string;
}

export interface RazorpayRoutingRule {
  id: string;
  ruleName: string;
  bank: BankName;
  paymentMethod: string;
  trafficWeightPct: number;
  priority: number;
  status: 'ACTIVE' | 'TESTING' | 'PAUSED';
  lastSyncedAt: string;
}

export interface MDRSavingsReport {
  currentBlendedMdrPct: number;
  optimizedBlendedMdrPct: number;
  savingsPercentage: number;
  monthlyVolumeINR: number;
  estimatedMonthlySavingsINR: number;
  estimatedAnnualSavingsINR: number;
  feeBreakdown: Array<{
    bank: BankName;
    sharePct: number;
    effectiveMdrPct: number;
    monthlyCostINR: number;
    monthlySavingsINR: number;
    authSuccessRatePct: number;
  }>;
  abTestMetrics: {
    algorithm: 'Multi-Armed Bandit (Thompson Sampling + Q-Learning)';
    explorationRateEpsilon: number;
    simulatedTransactionsCount: number;
    confidenceLevelPct: number;
    lastOptimizationTimestamp: string;
  };
}

export interface ComplianceAuditRecord {
  id: string;
  ruleName: string;
  bank: string;
  settlementId: string;
  finding: string;
  compliant: boolean;
  sha256Hash: string;
  auditedAt?: string;
}

export interface PeerBenchmark {
  merchantAvgSettlementDays: number;
  peerMedianSettlementDays: number;
  merchantAvgMdrRate: number;
  peerMedianMdrRate: number;
  merchantDisputeSuccessRate: number;
  peerDisputeSuccessRate: number;
  percentileRank: number;
  recommendation: string;
}

export interface BenchmarkingMetric {
  merchantId: string;
  industry: string;
  monthlyVolumeINR: number;
  merchantMdrPct: number;
  industryAvgMdrPct: number;
  settlementDelayAvgDays: number;
  industryAvgDelayDays: number;
  errorRatePct: number;
  industryErrorRatePct: number;
  potentialAnnualSavings: number;
  topRecommendedBank: BankName;
}

export interface MerchantPolicy {
  merchantId?: string;
  priority?: 'FASTEST_SETTLEMENT' | 'LOWEST_MDR' | 'BALANCED';
  preferenceSpeedVsCost?: 'FASTEST_SETTLEMENT' | 'LOWEST_MDR' | 'BALANCED';
  maxAcceptableDelayDays?: number;
  maxAcceptableMdrPct?: number;
  autoEscalateDisputes?: boolean;
  approvalThresholdINR?: number;
  humanApprovalThreshold?: number;
  autoDisputeUnderThreshold?: boolean;
  notificationChannel?: string;
}

export interface DashboardMetrics {
  totalGrossVolumeINR: number;
  totalNetSettledINR: number;
  totalMdrDeductedINR: number;
  totalGstDeductedINR: number;
  totalTdsWithheldINR: number;
  activeAnomaliesCount: number;
  estimatedMdrSavingsINR: number;
  projectedAnnualSavingsINR: number;
  workingCapitalRunwayDays: number;
  complianceScore: number;
  reconciliationMatchRatePct: number;
  kafkaStreamActive: boolean;
  lastReconciledAt: string;
  recentSettlements?: SettlementRecord[];
}

export interface DemoModeStatus {
  mode: 'live' | 'demo';
  is_live: boolean;
  message?: string;
  metrics: {
    active_records: number;
    anomalies_detected: number;
    partner_banks_connected: number;
    kafka_stream_status: string;
    rbi_calendar_synced: boolean;
    voice_ai_ready: boolean;
    data_source: string;
  };
  features: {
    gemini_api: boolean;
    realtime_qna: boolean;
    evidence_generation: boolean;
    dispute_bot: boolean;
    voice_ai: boolean;
    zero_config_evaluation: boolean;
  };
}

export interface VoiceAIResponse {
  transcript: string;
  spokenText: string;
  action?: 'NAVIGATE_TAB' | 'FILTER_SETTLEMENTS' | 'EXPLAIN_ANOMALY' | 'TRIGGER_RECONCILIATION';
  targetTab?: string;
  summary?: string;
  mode: 'live' | 'demo';
  timestamp: string;
}

export interface EvidencePacket {
  id: string;
  settlementId: string;
  bank: string;
  utr: string;
  generatedAt: string;
  status: 'CERTIFIED' | 'DRAFT';
  rbiRegulatoryReference: string;
  auditTrailHash: string;
  discrepancySummary: string;
  financialMetrics: {
    grossAmount: number;
    contractualMdrRate: number;
    billedMdrRate: number;
    excessDeductionINR: number;
    gstRateExpected: number;
    gstRateCharged: number;
  };
  forensicProof: string[];
}

