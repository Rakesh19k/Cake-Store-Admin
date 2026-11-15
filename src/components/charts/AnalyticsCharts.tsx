import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppSelector } from '../../store';

const MONTHLY_REVENUE = [
  { month: 'May', revenue: 21400, orders: 264 },
  { month: 'Jun', revenue: 28900, orders: 312 },
  { month: 'Jul', revenue: 25600, orders: 290 },
  { month: 'Aug', revenue: 31200, orders: 348 },
  { month: 'Sep', revenue: 34850, orders: 382 },
  { month: 'Oct', revenue: 39420, orders: 424 },
];

const PEAK_HOURS = [
  { hour: '7 AM', batch: 14 },
  { hour: '9 AM', batch: 28 },
  { hour: '11 AM', batch: 36 },
  { hour: '1 PM', batch: 24 },
  { hour: '3 PM', batch: 31 },
  { hour: '5 PM', batch: 18 },
];

export const AnalyticsCharts: React.FC = () => {
  const themeMode = useAppSelector((s) => s.theme.mode);
  const products = useAppSelector((s) => s.inventory.items);
  const isDark = themeMode === 'dark';

  const cakeValue = products
    .filter((p) => p.category === 'Cakes')
    .reduce((sum, p) => sum + p.price * Math.max(p.soldThisWeek, 1), 0);
  const bouquetValue = products
    .filter((p) => p.category === 'Bouquets')
    .reduce((sum, p) => sum + p.price * Math.max(p.soldThisWeek, 1), 0);

  const categoryMix = [
    { name: 'Artisanal Cakes', value: Math.round(cakeValue) },
    { name: 'Floral Bouquets', value: Math.round(bouquetValue) },
  ];

  const primary = isDark ? '#5cc2f2' : '#0f5a8a';
  const secondary = isDark ? '#2dd4bf' : '#0d9488';
  const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,90,138,0.08)';
  const axisColor = isDark ? '#b8cadc' : '#41566c';

  const tooltipStyle = {
    backgroundColor: isDark ? 'rgba(12, 24, 42, 0.94)' : 'rgba(255, 255, 255, 0.94)',
    backdropFilter: 'blur(16px)',
    borderRadius: '14px',
    border: isDark ? '1px solid rgba(125,211,252,0.22)' : '1px solid rgba(15,90,138,0.18)',
    color: isDark ? '#eff6fc' : '#0f1f30',
    fontSize: '12px',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 liquid-glass rounded-2xl p-6">
        <div className="mb-5">
          <h3 className="font-serif text-xl text-[#0f1f30] dark:text-[#eff6fc]">
            6-Month Revenue Trajectory
          </h3>
          <p className="text-xs text-[#41566c] dark:text-[#b8cadc]">
            Monthly gross confectionery & floral sales (USD)
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_REVENUE} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
              <defs>
                <linearGradient id="monthlyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primary} stopOpacity={0.45} />
                  <stop offset="95%" stopColor={primary} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 11 }}
                tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
              />
              <Tooltip
                formatter={(val) => [`$${Number(val ?? 0).toLocaleString()}`, 'Revenue']}
                contentStyle={tooltipStyle}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={primary}
                strokeWidth={2.5}
                fill="url(#monthlyGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-5 liquid-glass rounded-2xl p-6 flex flex-col">
        <div className="mb-3">
          <h3 className="font-serif text-xl text-[#0f1f30] dark:text-[#eff6fc]">
            Weekly Sales Mix
          </h3>
          <p className="text-xs text-[#41566c] dark:text-[#b8cadc]">
            Cakes vs. Floral Bouquet share
          </p>
        </div>
        <div className="h-52 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryMix}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                <Cell fill={primary} />
                <Cell fill={secondary} />
              </Pie>
              <Tooltip
                formatter={(val, name) => [`$${Number(val ?? 0).toLocaleString()}`, String(name ?? '')]}
                contentStyle={tooltipStyle}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-[#41566c] dark:text-[#b8cadc]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: primary }} />
            <span className="font-medium">Cakes (${categoryMix[0].value.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: secondary }} />
            <span className="font-medium">Bouquets (${categoryMix[1].value.toLocaleString()})</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-12 liquid-glass rounded-2xl p-6">
        <div className="mb-4">
          <h3 className="font-serif text-xl text-[#0f1f30] dark:text-[#eff6fc]">
            Peak Kitchen Baking Windows
          </h3>
          <p className="text-xs text-[#41566c] dark:text-[#b8cadc]">
            Average trays & arrangements dispatched by hour
          </p>
        </div>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PEAK_HOURS} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }} />
              <Tooltip
                formatter={(val) => [`${val ?? 0} batches`, 'Output']}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="batch" fill={primary} radius={[8, 8, 2, 2]} maxBarSize={42} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
