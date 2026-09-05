import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowDownRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { CashFlowForecastDay } from '../types';

interface CashFlowForecastProps {
  forecast: CashFlowForecastDay[];
  next7DaysInflow: number;
  next30DaysEstimate: number;
  crunchAlert: boolean;
  alertMessage: string;
}

export const CashFlowForecast: React.FC<CashFlowForecastProps> = ({
  forecast,
  next7DaysInflow,
  next30DaysEstimate,
  crunchAlert,
  alertMessage,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-semibold text-[10px] rounded-full uppercase tracking-wider">
              Gemini + Prophet Time Series
            </span>
            <span className="text-xs text-slate-500">| 30-Day Working Capital Modeling</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Merchant Cash Flow Forecasting Engine</h2>
          <p className="text-xs text-slate-500">
            Synthesizes historical payment velocity, seasonal patterns, and predicted banking clearing holds to forecast liquidity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl text-right">
            <div className="text-[11px] text-blue-800 font-semibold uppercase tracking-wider">30-Day Inflow Estimate</div>
            <div className="text-lg font-bold text-blue-900">Rs. {(next30DaysEstimate/10000000).toFixed(2)} Crore</div>
          </div>
        </div>
      </div>

      {/* Cash Crunch Alert if Active */}
      {crunchAlert && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
              Predictive Cash Crunch Alert
            </h4>
            <p className="text-xs text-rose-900 font-medium leading-relaxed">
              {alertMessage}
            </p>
            <div className="text-[11px] text-rose-800 pt-1">
              Next 7 Days Expected Inflow: <span className="font-bold">Rs. {(next7DaysInflow/100000).toFixed(2)} Lakhs</span> (Below standard Rs. 25L weekly vendor obligation)
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Next 7-Day Net Clearing</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">Rs. {(next7DaysInflow/100000).toFixed(2)}L</div>
          <p className="text-xs text-slate-500 mt-1">Net of bank deductions and weekend holds</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Cumulative Float Under Hold</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">Rs. 4.60L</div>
          <p className="text-xs text-amber-700 mt-1">ICICI weekend + 2nd Saturday batch shift</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Forecast Horizon</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">30 Days</div>
          <p className="text-xs text-emerald-600 mt-1">Recalibrated hourly with live Kafka feeds</p>
        </div>
      </div>

      {/* Cash Flow Projection Chart */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Projected Daily Liquidity & Settlement Inflow</h3>
            <p className="text-xs text-slate-500">Gross expected vs. Net settled after predicted bank clearing delay adjustments</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
            Daily Forecast
          </span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecast} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" tickFormatter={(v) => `Rs. ${v/1000}k`} />
              <Tooltip
                formatter={(value: any) => [`Rs. ${Number(value || 0).toLocaleString('en-IN')}`, '']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="expectedInflow" name="Gross Payment Capture" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="netInflow" name="Net Inflow to Bank" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
