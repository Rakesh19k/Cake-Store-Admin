import React, { useMemo, useState } from 'react';
import {
  BellRing,
  ChevronRight,
  Clock,
  Download,
  MoreVertical,
  Plus,
  Search,
  ShoppingBasket,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OrderFlowChart } from '../components/charts/OrderFlowChart';
import { ArtisanalImage } from '../components/common/ArtisanalImage';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAppDispatch, useAppSelector } from '../store';
import { simulateIncomingOrder } from '../store/slices/ordersSlice';
import {
  addToast,
  setNewOrderModalOpen,
  setPriorityModalOpen,
} from '../store/slices/uiSlice';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const orders = useAppSelector((s) => s.orders.items);
  const products = useAppSelector((s) => s.inventory.items);
  const user = useAppSelector((s) => s.auth.user);

  const [searchTerm, setSearchTerm] = useState('');

  const priorityOrder = orders.find(
    (o) => o.isPriority && o.status === 'pending'
  );

  const totalRevenue = useMemo(
    () => orders.reduce((acc, o) => (o.status !== 'rejected' ? acc + o.total : acc), 0),
    [orders]
  );

  const inOvenCount = useMemo(
    () => orders.filter((o) => o.status === 'baking').length + 16,
    [orders]
  );

  const popularTreats = useMemo(
    () =>
      [...products]
        .sort((a, b) => b.soldThisWeek - a.soldThisWeek)
        .slice(0, 3),
    [products]
  );

  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return orders.slice(0, 5);
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.summaryItem.toLowerCase().includes(q)
    );
  }, [orders, searchTerm]);

  const handleExportCsv = () => {
    const headers = ['Order ID,Customer,Item,Date,Status,Total'];
    const rows = orders.map(
      (o) =>
        `"${o.id}","${o.customerName}","${o.summaryItem}","${o.dateDisplay}","${o.status}",${o.total}`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sonali-cakes-dashboard-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    dispatch(
      addToast({
        title: 'Report Exported',
        description: 'Downloaded sonali-cakes-dashboard-report.csv',
        variant: 'success',
      })
    );
  };

  const firstName = user.name.split(' ')[0] || 'Sonali';

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#0f1f30] dark:text-[#eff6fc] leading-tight text-balance">
            Morning, {firstName}
          </h2>
          <p className="text-sm sm:text-base text-[#41566c] dark:text-[#b8cadc] mt-2">
            Your kitchen is bustling today. Here is the latest overview of your bakery&apos;s performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => dispatch(simulateIncomingOrder())}
            className="liquid-glass px-4 py-3 rounded-xl text-sm font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] flex items-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all min-h-[44px] whitespace-nowrap"
          >
            <BellRing className="w-4 h-4" />
            Simulate Order
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="liquid-glass px-5 py-3 rounded-xl text-sm font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] flex items-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all min-h-[44px] whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            type="button"
            onClick={() => dispatch(setNewOrderModalOpen(true))}
            className="liquid-glass-accent text-white px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all min-h-[44px] whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Order
          </button>
        </div>
      </header>

      {/* Priority Incoming Order Banner */}
      {priorityOrder && (
        <div className="liquid-glass rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[#0f5a8a]/25 dark:border-[#7dd3fc]/25">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-sky-200/75 dark:bg-sky-500/25 flex items-center justify-center shrink-0 text-[#0f5a8a] dark:text-[#7dd3fc]">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0f1f30] dark:text-[#eff6fc]">
                Priority Order Awaiting Approval · {priorityOrder.id}
              </p>
              <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-0.5 tabular-nums">
                {priorityOrder.customerName} · {priorityOrder.summaryItem} · $
                {priorityOrder.total.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(setPriorityModalOpen(true))}
            className="liquid-glass-accent text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 min-h-[40px]"
          >
            Review Priority Order
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 KPI Bento Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="liquid-glass rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#41566c] dark:text-[#b8cadc]">
              Total Orders
            </span>
            <ShoppingBasket className="w-5 h-5 text-[#0f5a8a] dark:text-[#7dd3fc]" />
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-[#0f1f30] dark:text-[#eff6fc] tabular-nums">
              {133 + orders.length}
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +12% vs last week
            </p>
          </div>
        </div>

        <div className="liquid-glass-accent text-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-bold text-sky-100">
              Revenue
            </span>
            <span className="text-xs font-semibold text-sky-100">USD</span>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-serif font-bold tabular-nums">
              ${(1200 + totalRevenue).toLocaleString()}
            </p>
            <p className="text-xs text-sky-100/90 mt-1">Updated live</p>
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#41566c] dark:text-[#b8cadc]">
              Customer Love
            </span>
            <Star className="w-5 h-5 text-[#0f5a8a] dark:text-[#7dd3fc] fill-current" />
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-[#0f1f30] dark:text-[#eff6fc] tabular-nums">
              4.9
            </p>
            <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-1">
              328 verified reviews
            </p>
          </div>
        </div>

        <div className="liquid-glass-soft rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#41566c] dark:text-[#b8cadc]">
              In Oven
            </span>
            <Clock className="w-5 h-5 text-[#0f5a8a] dark:text-[#7dd3fc]" />
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-[#0f1f30] dark:text-[#eff6fc] tabular-nums">
              {inOvenCount}
            </p>
            <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-1">
              Active prep items
            </p>
          </div>
        </div>
      </section>

      {/* Popular Treats & Interactive Order Flow Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4 liquid-glass rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl sm:text-2xl text-[#0f1f30] dark:text-[#eff6fc]">
                Popular Treats
              </h3>
              <button
                type="button"
                onClick={() => navigate('/inventory')}
                className="text-xs font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] hover:underline"
              >
                Full Menu
              </button>
            </div>

            <div className="space-y-5">
              {popularTreats.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate('/inventory')}
                  className="w-full text-left flex items-center gap-4 p-2 -mx-2 rounded-2xl hover:bg-white/45 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/60 dark:border-white/10">
                    <ArtisanalImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-[#0f1f30] dark:text-[#eff6fc] truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-0.5 tabular-nums">
                      {item.soldThisWeek} sold this week
                    </p>
                  </div>
                  <span className="font-bold text-sm text-[#0f5a8a] dark:text-[#7dd3fc] tabular-nums shrink-0">
                    ${item.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#0f5a8a]/10 dark:border-white/10 flex items-center justify-between text-xs text-[#41566c] dark:text-[#b8cadc]">
            <span>Weekly best sellers</span>
            <span className="font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] tabular-nums">
              {popularTreats.reduce((s, p) => s + p.soldThisWeek, 0)} units
            </span>
          </div>
        </div>

        <div className="lg:col-span-8">
          <OrderFlowChart />
        </div>
      </section>

      {/* Recent Orders */}
      <section className="liquid-glass rounded-3xl overflow-hidden">
        <div className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0f5a8a]/10 dark:border-white/10">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#0f1f30] dark:text-[#eff6fc]">
              Recent Orders
            </h3>
            <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-0.5">
              Tap any order to inspect timeline and update kitchen status
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#41566c] dark:text-[#b8cadc]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Find an order..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/50 dark:bg-black/30 border border-[#0f5a8a]/15 dark:border-white/10 text-sm text-[#0f1f30] dark:text-[#eff6fc] placeholder:text-[#41566c]/60 dark:placeholder:text-[#b8cadc]/50 focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/35 dark:bg-black/20 text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc]">
                <th className="px-7 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-7 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0f5a8a]/10 dark:divide-white/10">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() =>
                    navigate(`/orders/${encodeURIComponent(order.id)}`)
                  }
                  className="hover:bg-white/45 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="px-7 py-4 font-mono text-xs font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] tabular-nums">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-200/80 dark:bg-sky-500/30 flex items-center justify-center text-xs font-bold text-[#0f4c75] dark:text-[#bae6fd] shrink-0">
                        {order.customerInitials}
                      </div>
                      <span className="font-semibold text-sm text-[#0f1f30] dark:text-[#eff6fc]">
                        {order.customerName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#41566c] dark:text-[#b8cadc]">
                    {order.summaryItem}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} compact />
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-sm text-[#0f1f30] dark:text-[#eff6fc] tabular-nums">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-7 py-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orders/${encodeURIComponent(order.id)}`);
                      }}
                      aria-label={`View details for ${order.id}`}
                      className="p-2 rounded-xl text-[#41566c] dark:text-[#b8cadc] hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-[#0f5a8a]/10 dark:divide-white/10">
          {filteredOrders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() =>
                navigate(`/orders/${encodeURIComponent(order.id)}`)
              }
              className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-[#0f5a8a] dark:text-[#7dd3fc]">
                    {order.id}
                  </span>
                  <span className="text-[#41566c] dark:text-[#b8cadc]">·</span>
                  <span className="font-semibold text-[#0f1f30] dark:text-[#eff6fc] truncate">
                    {order.customerName}
                  </span>
                </div>
                <p className="text-xs text-[#41566c] dark:text-[#b8cadc] truncate">
                  {order.summaryItem}
                </p>
                <StatusBadge status={order.status} compact />
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm text-[#0f1f30] dark:text-[#eff6fc] tabular-nums">
                  ${order.total.toFixed(2)}
                </p>
                <ChevronRight className="w-4 h-4 ml-auto mt-1 text-[#41566c] dark:text-[#b8cadc]" />
              </div>
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-10 text-center text-sm text-[#41566c] dark:text-[#b8cadc]">
            No matching orders found for &ldquo;{searchTerm}&rdquo;.
          </div>
        )}

        <div className="p-5 bg-white/35 dark:bg-black/20 flex justify-center border-t border-[#0f5a8a]/10 dark:border-white/10">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="text-sm font-bold text-[#0f5a8a] dark:text-[#7dd3fc] hover:underline"
          >
            View All {orders.length} Active Orders
          </button>
        </div>
      </section>
    </div>
  );
};
