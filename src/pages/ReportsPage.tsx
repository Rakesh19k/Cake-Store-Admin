import React from 'react';
import { Download, TrendingUp } from 'lucide-react';
import { AnalyticsCharts } from '../components/charts/AnalyticsCharts';
import { useAppDispatch, useAppSelector } from '../store';
import { addToast } from '../store/slices/uiSlice';

export const ReportsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((s) => s.orders.items);
  const products = useAppSelector((s) => s.inventory.items);

  const avgOrderValue = useMemoAvg(orders);

  const handleDownloadAnalytics = () => {
    const lines = [
      'SKU,Product,Category,Price,Stock,WeeklySold',
      ...products.map(
        (p) =>
          `"${p.sku}","${p.name}","${p.category}",${p.price},${p.stock},${p.soldThisWeek}`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sonali-cakes-analytics.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    dispatch(
      addToast({
        title: 'Analytics CSV Downloaded',
        description: 'Exported inventory & sales telemetry.',
        variant: 'success',
      })
    );
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0f1f30] dark:text-[#eff6fc]">
            Analytics &amp; Reports
          </h2>
          <p className="text-sm text-[#41566c] dark:text-[#b8cadc] mt-1">
            Interactive revenue, confectionery mix, and kitchen deck capacity insights.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadAnalytics}
          className="liquid-glass px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] flex items-center gap-2 min-h-[44px] whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="liquid-glass rounded-2xl p-6">
          <p className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc]">
            Avg Order Value
          </p>
          <p className="font-serif text-3xl text-[#0f5a8a] dark:text-[#7dd3fc] mt-2 tabular-nums">
            ${avgOrderValue.toFixed(2)}
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +8.4% vs prior period
          </p>
        </div>

        <div className="liquid-glass rounded-2xl p-6">
          <p className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc]">
            Weekly Units Sold
          </p>
          <p className="font-serif text-3xl text-[#0f1f30] dark:text-[#eff6fc] mt-2 tabular-nums">
            {products.reduce((s, p) => s + p.soldThisWeek, 0)}
          </p>
          <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-1">
            Across {products.length} curated SKUs
          </p>
        </div>

        <div className="liquid-glass rounded-2xl p-6">
          <p className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc]">
            On-Time Courier Rate
          </p>
          <p className="font-serif text-3xl text-[#0f1f30] dark:text-[#eff6fc] mt-2 tabular-nums">
            98.6%
          </p>
          <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-1">
            Chilled VVIP fleet SLA
          </p>
        </div>
      </section>

      <AnalyticsCharts />
    </div>
  );
};

function useMemoAvg(orders: { total: number; status: string }[]) {
  const valid = orders.filter((o) => o.status !== 'rejected');
  if (valid.length === 0) return 0;
  return valid.reduce((s, o) => s + o.total, 0) / valid.length;
}
