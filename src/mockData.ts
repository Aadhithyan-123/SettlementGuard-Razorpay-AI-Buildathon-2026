import {
  PaymentRecord,
  SettlementRecord,
  AnomalyReport,
  MDRRoutingStrategy,
  DelayPrediction,
  BankDispute,
  CashFlowForecastDay,
  BenchmarkingMetric,
  MerchantPolicy
} from './types';

export const INITIAL_MERCHANT_POLICY: MerchantPolicy = {
  merchantId: 'merch_razorpay_9921',
  priority: 'BALANCED',
  preferenceSpeedVsCost: 'FASTEST_SETTLEMENT',
  maxAcceptableDelayDays: 2,
  maxAcceptableMdrPct: 2.0,
  autoEscalateDisputes: true,
  approvalThresholdINR: 100000,
  humanApprovalThreshold: 100000,
  autoDisputeUnderThreshold: true,
  notificationChannel: 'WHATSAPP_TEXT',
};

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_001',
    merchantId: 'merch_razorpay_9921',
    orderId: 'order_109281',
    amount: 125000,
    bank: 'HDFC',
    paymentMethod: 'Credit Card',
    category: 'Electronics',
    status: 'captured',
    capturedAt: '2026-08-23T10:15:00Z',
    expectedSettlementDate: '2026-08-25',
    settledAt: '2026-08-25T14:30:00Z',
    settlementId: 'setl_hdfc_801',
  },
  {
    id: 'pay_002',
    merchantId: 'merch_razorpay_9921',
    orderId: 'order_109282',
    amount: 45000,
    bank: 'ICICI',
    paymentMethod: 'Debit Card',
    category: 'Groceries',
    status: 'captured',
    capturedAt: '2026-08-23T11:42:00Z',
    expectedSettlementDate: '2026-08-25',
    settledAt: '2026-08-27T18:10:00Z',
    settlementId: 'setl_icici_802',
  },
  {
    id: 'pay_003',
    merchantId: 'merch_razorpay_9921',
    orderId: 'order_109283',
    amount: 280000,
    bank: 'HDFC',
    paymentMethod: 'Credit Card',
    category: 'Digital Goods',
    status: 'captured',
    capturedAt: '2026-08-24T09:20:00Z',
    expectedSettlementDate: '2026-08-26',
    settledAt: '2026-08-26T16:00:00Z',
    settlementId: 'setl_hdfc_803',
  },
  {
    id: 'pay_004',
    merchantId: 'merch_razorpay_9921',
    orderId: 'order_109284',
    amount: 32000,
    bank: 'SBI',
    paymentMethod: 'UPI',
    category: 'Groceries',
    status: 'captured',
    capturedAt: '2026-08-24T14:12:00Z',
    expectedSettlementDate: '2026-08-26',
    settledAt: '2026-08-26T17:30:00Z',
    settlementId: 'setl_sbi_804',
  },
  {
    id: 'pay_005',
    merchantId: 'merch_razorpay_9921',
    orderId: 'order_109285',
    amount: 185000,
    bank: 'ICICI',
    paymentMethod: 'Credit Card',
    category: 'Electronics',
    status: 'captured',
    capturedAt: '2026-08-25T08:05:00Z',
    expectedSettlementDate: '2026-08-27',
    settledAt: undefined, // Missing / Delayed settlement!
    settlementId: undefined,
  },
  {
    id: 'pay_006',
    merchantId: 'merch_razorpay_9921',
    orderId: 'order_109286',
    amount: 520000,
    bank: 'HDFC',
    paymentMethod: 'Credit Card',
    category: 'Electronics',
    status: 'captured',
    capturedAt: '2026-08-25T13:30:00Z',
    expectedSettlementDate: '2026-08-27',
    settledAt: '2026-08-27T15:20:00Z',
    settlementId: 'setl_hdfc_805',
  },
  {
    id: 'pay_007',
    merchantId: 'merch_razorpay_9921',
    orderId: 'order_109287',
    amount: 89000,
    bank: 'Axis',
    paymentMethod: 'Netbanking',
    category: 'Services',
    status: 'captured',
    capturedAt: '2026-08-26T11:00:00Z',
    expectedSettlementDate: '2026-08-28',
    settledAt: '2026-08-28T12:45:00Z',
    settlementId: 'setl_axis_806',
  },
  {
    id: 'pay_008',
    merchantId: 'merch_razorpay_9921',
    orderId: 'order_109288',
    amount: 140000,
    bank: 'Kotak',
    paymentMethod: 'UPI',
    category: 'Digital Goods',
    status: 'captured',
    capturedAt: '2026-08-27T16:15:00Z',
    expectedSettlementDate: '2026-08-29',
    settledAt: '2026-08-29T10:00:00Z',
    settlementId: 'setl_kotak_807',
  }
];

export const INITIAL_SETTLEMENTS: SettlementRecord[] = [
  {
    id: 'setl_hdfc_801',
    utr: 'UTR_HDFC20260825_88301',
    merchantId: 'merch_razorpay_9921',
    bank: 'HDFC',
    grossAmount: 125000,
    expectedMdrRate: 0.02, // 2.0%
    actualMdrRate: 0.025, // 2.5% SPIKE! (0.5% extra deducted)
    mdrDeducted: 3125, // expected 2500 -> diff 625 INR
    expectedGstRate: 0.18,
    actualGstRate: 0.18,
    gstDeducted: 562.5,
    tdsDeducted: 125,
    netSettledAmount: 121187.5,
    status: 'disputed',
    settledAt: '2026-08-25T14:30:00Z',
    dueDate: '2026-08-25',
    delayDays: 0,
    rbiCompliant: true,
    reconciled: false,
    paymentIds: ['pay_001'],
    discrepancyNote: 'PyTorch Anomaly Flag: HDFC charged 2.5% MDR instead of agreed 2.0%. Excess MDR of Rs. 625 deducted.',
  },
  {
    id: 'setl_icici_802',
    utr: 'UTR_ICIC20260827_44192',
    merchantId: 'merch_razorpay_9921',
    bank: 'ICICI',
    grossAmount: 45000,
    expectedMdrRate: 0.018,
    actualMdrRate: 0.018,
    mdrDeducted: 810,
    expectedGstRate: 0.12, // Groceries category hardcoded to 12%
    actualGstRate: 0.18, // Miscalculated at 18%!
    gstDeducted: 145.8, // should be 97.2 -> diff 48.6 INR
    tdsDeducted: 45,
    netSettledAmount: 43999.2,
    status: 'delayed',
    settledAt: '2026-08-27T18:10:00Z',
    dueDate: '2026-08-25',
    delayDays: 2,
    rbiCompliant: false, // T+2 mandate violated (took T+4)
    reconciled: false,
    paymentIds: ['pay_002'],
    discrepancyNote: 'GST Validator Flag: Category is Groceries (prescribed rate 12%). Settled at 18% GST. Delay of 2 business days.',
  },
  {
    id: 'setl_hdfc_803',
    utr: 'UTR_HDFC20260826_99201',
    merchantId: 'merch_razorpay_9921',
    bank: 'HDFC',
    grossAmount: 280000,
    expectedMdrRate: 0.02,
    actualMdrRate: 0.025, // Ongoing systematic HDFC spike
    mdrDeducted: 7000, // expected 5600 -> diff 1400 INR
    expectedGstRate: 0.18,
    actualGstRate: 0.18,
    gstDeducted: 1260,
    tdsDeducted: 280,
    netSettledAmount: 271460,
    status: 'disputed',
    settledAt: '2026-08-26T16:00:00Z',
    dueDate: '2026-08-26',
    delayDays: 0,
    rbiCompliant: true,
    reconciled: false,
    paymentIds: ['pay_003'],
    discrepancyNote: 'Systematic MDR Spike: Additional Rs. 1,400 deducted by HDFC.',
  },
  {
    id: 'setl_sbi_804',
    utr: 'UTR_SBIN20260826_11094',
    merchantId: 'merch_razorpay_9921',
    bank: 'SBI',
    grossAmount: 32000,
    expectedMdrRate: 0.009, // 0.9% for UPI
    actualMdrRate: 0.009,
    mdrDeducted: 288,
    expectedGstRate: 0.12,
    actualGstRate: 0.12,
    gstDeducted: 34.56,
    tdsDeducted: 32,
    netSettledAmount: 31645.44,
    status: 'settled',
    settledAt: '2026-08-26T17:30:00Z',
    dueDate: '2026-08-26',
    delayDays: 0,
    rbiCompliant: true,
    reconciled: true,
    paymentIds: ['pay_004'],
  },
  {
    id: 'setl_hdfc_805',
    utr: 'UTR_HDFC20260827_77401',
    merchantId: 'merch_razorpay_9921',
    bank: 'HDFC',
    grossAmount: 520000,
    expectedMdrRate: 0.02,
    actualMdrRate: 0.025, // Critical > 1L impact pool
    mdrDeducted: 13000, // expected 10400 -> diff 2600 INR
    expectedGstRate: 0.18,
    actualGstRate: 0.18,
    gstDeducted: 2340,
    tdsDeducted: 520,
    netSettledAmount: 504140,
    status: 'disputed',
    settledAt: '2026-08-27T15:20:00Z',
    dueDate: '2026-08-27',
    delayDays: 0,
    rbiCompliant: true,
    reconciled: false,
    paymentIds: ['pay_006'],
    discrepancyNote: 'Large-Volume Settlement: Rs. 2,600 extra MDR. Alert impact requires merchant approval.',
  },
  {
    id: 'setl_axis_806',
    utr: 'UTR_UTIB20260828_33100',
    merchantId: 'merch_razorpay_9921',
    bank: 'Axis',
    grossAmount: 89000,
    expectedMdrRate: 0.015,
    actualMdrRate: 0.015,
    mdrDeducted: 1335,
    expectedGstRate: 0.18,
    actualGstRate: 0.18,
    gstDeducted: 240.3,
    tdsDeducted: 89,
    netSettledAmount: 87335.7,
    status: 'settled',
    settledAt: '2026-08-28T12:45:00Z',
    dueDate: '2026-08-28',
    delayDays: 0,
    rbiCompliant: true,
    reconciled: true,
    paymentIds: ['pay_007'],
  },
  {
    id: 'setl_kotak_807',
    utr: 'UTR_KKBK20260829_55219',
    merchantId: 'merch_razorpay_9921',
    bank: 'Kotak',
    grossAmount: 140000,
    expectedMdrRate: 0.012,
    actualMdrRate: 0.012,
    mdrDeducted: 1680,
    expectedGstRate: 0.18,
    actualGstRate: 0.18,
    gstDeducted: 302.4,
    tdsDeducted: 140,
    netSettledAmount: 137877.6,
    status: 'settled',
    settledAt: '2026-08-29T10:00:00Z',
    dueDate: '2026-08-29',
    delayDays: 0,
    rbiCompliant: true,
    reconciled: true,
    paymentIds: ['pay_008'],
  }
];

export const INITIAL_ANOMALIES: AnomalyReport[] = [
  {
    id: 'anom_001',
    settlementId: 'setl_hdfc_801',
    merchantId: 'merch_razorpay_9921',
    bank: 'HDFC',
    anomalyType: 'MDR_SPIKE',
    severity: 'HIGH',
    financialImpact: 50000, // Monthly projected impact
    requiresApproval: false,
    approvalStatus: 'AUTO_RESOLVED',
    description: 'HDFC deducting extra 0.5% MDR (2.5% vs 2.0% contract). Estimated Rs. 50,000 extra charged this month across aggregate transactions.',
    detectedAt: '2026-08-25T14:32:00Z',
    ticketId: 'RZP_TCKT_44091',
    resolutionDetails: 'Razorpay Support Ticket #44091 submitted to HDFC nodal desk for MDR correction & refund.'
  },
  {
    id: 'anom_002',
    settlementId: 'setl_hdfc_805',
    merchantId: 'merch_razorpay_9921',
    bank: 'HDFC',
    anomalyType: 'MDR_SPIKE',
    severity: 'CRITICAL',
    financialImpact: 135000, // > 1L requires human approval!
    requiresApproval: true,
    approvalStatus: 'PENDING',
    description: 'High-Value Anomaly: HDFC bulk batch settlement for high-value orders charged at 2.5%. Aggregate impact Rs. 1,35,000 exceeds Rs. 1,00,000 approval threshold.',
    detectedAt: '2026-08-27T15:25:00Z',
  },
  {
    id: 'anom_003',
    settlementId: 'setl_icici_802',
    merchantId: 'merch_razorpay_9921',
    bank: 'ICICI',
    anomalyType: 'GST_MISCALCULATION',
    severity: 'MEDIUM',
    financialImpact: 15400,
    requiresApproval: false,
    approvalStatus: 'APPROVED',
    description: 'GST calculated at 18% but product category is Groceries (mandated 12%). Cumulative overcharge Rs. 15,400 across 318 line-items.',
    detectedAt: '2026-08-27T18:15:00Z',
    ticketId: 'RZP_TCKT_44095'
  },
  {
    id: 'anom_004',
    settlementId: 'pay_005',
    merchantId: 'merch_razorpay_9921',
    bank: 'ICICI',
    anomalyType: 'MISSING_SETTLEMENT',
    severity: 'HIGH',
    financialImpact: 185000,
    requiresApproval: true,
    approvalStatus: 'PENDING',
    description: 'Payment pay_005 (Rs. 1,85,000) captured on Aug 25, 2026. T+2 settlement expected Aug 27, but no settlement UTR logged after 4+ days.',
    detectedAt: '2026-08-29T09:00:00Z'
  }
];

export const INITIAL_MDR_STRATEGIES: MDRRoutingStrategy[] = [
  {
    bank: 'ICICI',
    recommendedSharePct: 65,
    currentMdrRate: 0.0175, // 1.75%
    competitorMdrRate: 0.025, // 2.50% (HDFC)
    averageSuccessRate: 99.2,
    monthlySavingsEstimate: 162500,
  },
  {
    bank: 'Axis',
    recommendedSharePct: 20,
    currentMdrRate: 0.0150, // 1.50%
    competitorMdrRate: 0.020,
    averageSuccessRate: 98.8,
    monthlySavingsEstimate: 54000,
  },
  {
    bank: 'HDFC',
    recommendedSharePct: 15,
    currentMdrRate: 0.0250, // Flagged
    competitorMdrRate: 0.0175,
    averageSuccessRate: 99.4,
    monthlySavingsEstimate: 33500,
  }
];

export const INITIAL_DELAY_PREDICTIONS: DelayPrediction[] = [
  {
    id: 'pred_001',
    merchantId: 'merch_razorpay_9921',
    bank: 'ICICI',
    predictedDelayDays: 2,
    confidencePct: 95,
    originalDueDate: '2026-09-06',
    predictedSettlementDate: '2026-09-08',
    holidayInterference: true,
    holidayName: '2nd Saturday & Sunday Banking Holiday + Janmashtami Clearing Backlog',
    reason: 'RBI Annual Calendar flags 2nd Saturday settlement hold. Historical batch congestion triggers +48h clearing cycle.',
    cashFlowImpact: 340000
  },
  {
    id: 'pred_002',
    merchantId: 'merch_razorpay_9921',
    bank: 'SBI',
    predictedDelayDays: 1,
    confidencePct: 88,
    originalDueDate: '2026-09-07',
    predictedSettlementDate: '2026-09-08',
    holidayInterference: false,
    reason: 'SBI core banking batch upgrade window creates intermittent RTGS batch deferral.',
    cashFlowImpact: 120000
  }
];

export const INITIAL_DISPUTES: BankDispute[] = [
  {
    id: 'disp_hdfc_01',
    settlementId: 'setl_hdfc_801',
    bank: 'HDFC',
    utr: 'UTR_HDFC20260825_88301',
    amountClaimed: 50000,
    category: 'Systematic MDR Overcharge',
    createdDate: '2026-08-25',
    escalationDeadline: '2026-09-01',
    status: 'Negotiating',
    disputeLetter: `To: Nodal Dispute Operations, HDFC Bank Ltd.
Subject: Formal Dispute & Refund Notice: Unauthorized 0.5% MDR Overcharge (Ref: Merchant merch_razorpay_9921)

Dear Settlement Team,

Pursuant to the Merchant Agreement and Razorpay Master Gateway Terms, the contracted MDR rate for credit card volume is 2.00%. Our automated reconciliation agent SettlementGuard v3.0 has verified that on settlement batch UTR_HDFC20260825_88301 and linked sequences, HDFC Bank applied 2.50% MDR.

Cumulative Unauthorized Deduction: Rs. 50,000.00 INR.

In accordance with RBI Master Direction on Digital Payment Settlement timelines, we formally demand credit of the excess Rs. 50,000 within 7 business days (by September 1, 2026). In the event of non-settlement, this dispute will be escalated directly to the RBI Banking Ombudsman (CMS Portal).

Yours faithfully,
SettlementGuard Autonomous Reconciliation System
On behalf of NexStore Retail Pvt Ltd`,
    conversationLog: [
      {
        sender: 'AI_AGENT',
        timestamp: '2026-08-25T15:00:00Z',
        message: 'Dispute letter dispatched via Razorpay Support Gateway with full UTR audit trail. Notice period: 7 calendar days.'
      },
      {
        sender: 'BANK_BOT',
        timestamp: '2026-08-26T10:15:00Z',
        message: 'HDFC Operations: Acknowledging ticket #44091. We are reviewing billing tier parameters. Counter-proposal: 50% credit (Rs. 25,000) under provisional review.'
      },
      {
        sender: 'AI_AGENT',
        timestamp: '2026-08-26T11:00:00Z',
        message: 'Counter-proposal rejected based on Merchant Policy (Strict Compliance). Full contracted variance of Rs. 50,000 must be credited within 5 days remaining to avoid RBI escalation.'
      }
    ]
  }
];

export const INITIAL_CASH_FLOW: CashFlowForecastDay[] = [
  { date: '2026-09-04', expectedInflow: 480000, predictedDelaysDeduction: 0, netInflow: 480000, cumulativeInflow: 480000, isCrunchAlert: false },
  { date: '2026-09-05', expectedInflow: 520000, predictedDelaysDeduction: 0, netInflow: 520000, cumulativeInflow: 1000000, isCrunchAlert: false },
  { date: '2026-09-06', expectedInflow: 340000, predictedDelaysDeduction: 340000, netInflow: 0, cumulativeInflow: 1000000, isCrunchAlert: true },
  { date: '2026-09-07', expectedInflow: 120000, predictedDelaysDeduction: 120000, netInflow: 0, cumulativeInflow: 1000000, isCrunchAlert: true },
  { date: '2026-09-08', expectedInflow: 860000, predictedDelaysDeduction: 0, netInflow: 860000, cumulativeInflow: 1860000, isCrunchAlert: false },
  { date: '2026-09-09', expectedInflow: 640000, predictedDelaysDeduction: 0, netInflow: 640000, cumulativeInflow: 2500000, isCrunchAlert: false },
  { date: '2026-09-10', expectedInflow: 720000, predictedDelaysDeduction: 0, netInflow: 720000, cumulativeInflow: 3220000, isCrunchAlert: false },
  { date: '2026-09-11', expectedInflow: 590000, predictedDelaysDeduction: 0, netInflow: 590000, cumulativeInflow: 3810000, isCrunchAlert: false },
  { date: '2026-09-12', expectedInflow: 410000, predictedDelaysDeduction: 200000, netInflow: 210000, cumulativeInflow: 4020000, isCrunchAlert: false },
  { date: '2026-09-13', expectedInflow: 350000, predictedDelaysDeduction: 350000, netInflow: 0, cumulativeInflow: 4020000, isCrunchAlert: false },
  { date: '2026-09-14', expectedInflow: 980000, predictedDelaysDeduction: 0, netInflow: 980000, cumulativeInflow: 5000000, isCrunchAlert: false },
];

export const INITIAL_BENCHMARKING: BenchmarkingMetric = {
  merchantId: 'merch_razorpay_9921',
  industry: 'D2C Electronics & Lifestyle',
  monthlyVolumeINR: 50000000, // 5 Crore monthly volume
  merchantMdrPct: 2.30,
  industryAvgMdrPct: 1.80,
  settlementDelayAvgDays: 2.4,
  industryAvgDelayDays: 1.2,
  errorRatePct: 4.8,
  industryErrorRatePct: 1.1,
  potentialAnnualSavings: 3000000, // Rs. 30 Lakhs / year savings!
  topRecommendedBank: 'ICICI'
};

export const RBI_HOLIDAY_CALENDAR = [
  { date: '2026-01-26', name: 'Republic Day', type: 'National Holiday' },
  { date: '2026-03-04', name: 'Holi', type: 'Gazetted Holiday' },
  { date: '2026-08-15', name: 'Independence Day', type: 'National Holiday' },
  { date: '2026-09-06', name: '2nd Saturday Bank Closure', type: 'Mandated Bank Closure' },
  { date: '2026-10-02', name: 'Mahatma Gandhi Jayanti', type: 'National Holiday' },
  { date: '2026-10-20', name: 'Dussehra', type: 'Gazetted Holiday' },
  { date: '2026-11-09', name: 'Diwali (Laxmi Pujan)', type: 'National Holiday' },
];

export const HARDCODED_GST_RATES: Record<string, number> = {
  'Electronics': 0.18,
  'Groceries': 0.12,
  'Services': 0.18,
  'Digital Goods': 0.18,
};
