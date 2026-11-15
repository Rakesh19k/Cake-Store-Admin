import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ORDER_FLOW_DATA } from '../../data/seedData';
import { useAppSelector } from '../../store';

type RangeKey = '7d' | '30d' | '90d';
type ChartType = 'bar' | 'area';

export const OrderFlowChart: React.FC = () => {
  const [range, setRange] = useState<RangeKey>('7d');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const themeMode = useAppSelector((s) => s.theme.mode);

  const data = ORDER_FLOW_DATA[range];
  const isDark = themeMode === 'dark';

  const primaryColor = isDark ? '#5cc2f2' : '#0f5a8a';
  const secondaryColor = isDark ? 'rgba(92, 194, 242, 0.30)' : 'rgba(15, 90, 138, 0.24)';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 90, 138, 0.08)';
  const axisColor = isDark ? '#b8cadc' : '#41566c';

  return (
    <div className="liquid-glass rounded-2xl p-6 sm:p-8 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-[#0f1f30] dark:text-[#eff6fc]">
            Order Flow
          </h3>
          <p className="text-sm text-[#41566c] dark:text-[#b8cadc]">
            Capacity vs. Demand across kitchen decks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex p-1 rounded-xl bg-white/45 dark:bg-black/25 border border-[#0f5a8a]/15 dark:border-white/10"
            role="group"
            aria-label="Chart view toggle"
          >
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                chartType === 'bar'
                  ? 'bg-[#0f5a8a] text-white shadow-sm'
                  : 'text-[#41566c] dark:text-[#b8cadc] hover:text-[#0f1f30] dark:hover:text-white'
              }`}
            >
              Volume
            </button>
            <button
              type="button"
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                chartType === 'area'
                  ? 'bg-[#0f5a8a] text-white shadow-sm'
                  : 'text-[#41566c] dark:text-[#b8cadc] hover:text-[#0f1f30] dark:hover:text-white'
              }`}
            >
              Revenue
            </button>
          </div>

          <select
            aria-label="Select date range"
            value={range}
            onChange={(e) => setRange(e.target.value as RangeKey)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/50 dark:bg-black/30 text-[#0f1f30] dark:text-[#eff6fc] border border-[#0f5a8a]/15 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40 cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="w-full h-56 sm:h-64 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,90,138,0.06)' }}
                contentStyle={{
                  backgroundColor: isDark ? 'rgba(12, 24, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '14px',
                  border: isDark ? '1px solid rgba(125,211,252,0.22)' : '1px solid rgba(15,90,138,0.18)',
                  color: isDark ? '#eff6fc' : '#0f1f30',
                  fontSize: '12px',
                  boxShadow: '0 12px 32px rgba(15,31,48,0.14)',
                }}
              />
              <Bar
                dataKey="completed"
                name="Completed"
                fill={primaryColor}
                radius={[8, 8, 2, 2]}
                maxBarSize={34}
              />
              <Bar
                dataKey="inProgress"
                name="In Progress"
                fill={secondaryColor}
                radius={[8, 8, 2, 2]}
                maxBarSize={34}
              />
            </BarChart>
          ) : (
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryColor} stopOpacity={0.45} />
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 11 }}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                formatter={(value, name) => [`$${Number(value ?? 0).toLocaleString()}`, String(name ?? '')]}
                contentStyle={{
                  backgroundColor: isDark ? 'rgba(12, 24, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '14px',
                  border: isDark ? '1px solid rgba(125,211,252,0.22)' : '1px solid rgba(15,90,138,0.18)',
                  color: isDark ? '#eff6fc' : '#0f1f30',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke={primaryColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueFill)"
              />
              <Area
                type="monotone"
                dataKey="target"
                name="Target"
                stroke={axisColor}
                strokeDasharray="4 4"
                strokeWidth={1.5}
                fill="transparent"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-6 text-xs text-[#41566c] dark:text-[#b8cadc]">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
          <span className="font-medium">
            {chartType === 'bar' ? 'Completed Orders' : 'Actual Revenue'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor:
                chartType === 'bar' ? secondaryColor : axisColor,
            }}
          />
          <span className="font-medium">
            {chartType === 'bar' ? 'In Progress' : 'Projected Target'}
          </span>
        </div>
      </div>
    </div>
  );
};
