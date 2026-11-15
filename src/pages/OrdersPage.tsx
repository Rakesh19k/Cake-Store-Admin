import React, { useMemo, useState } from 'react';
import {
  BellRing,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Filter,
  Flame,
  MapPin,
  Plus,
  Save,
  Search,
  Sparkles,
  Truck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ACTIVE_DRIVER_ROUTES, IMAGES } from '../data/seedData';
import { ArtisanalImage } from '../components/common/ArtisanalImage';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setOrderSearch,
  setOrderStatusFilter,
  simulateIncomingOrder,
  updateBakersNote,
  updateOrderStatus,
} from '../store/slices/ordersSlice';
import { addToast, setNewOrderModalOpen } from '../store/slices/uiSlice';
import { OrderStatus } from '../types';

const STATUS_TABS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'baking', label: 'Baking' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'completed', label: 'Completed' },
];

const PAGE_SIZE = 5;

export const OrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const orders = useAppSelector((s) => s.orders.items);
  const searchQuery = useAppSelector((s) => s.orders.searchQuery);
  const statusFilter = useAppSelector((s) => s.orders.statusFilter);
  const bakersNote = useAppSelector((s) => s.orders.bakersNote);

  const [page, setPage] = useState(1);
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(bakersNote);
  const [selectedDriverId, setSelectedDriverId] = useState(
    ACTIVE_DRIVER_ROUTES[0].id
  );
  const [showFilters, setShowFilters] = useState(true);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;
      const matchesQuery =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.summaryItem.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [orders, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const bakingCount = orders.filter((o) => o.status === 'baking').length;
  const deliveryCount = orders.filter(
    (o) => o.status === 'out_for_delivery'
  ).length;
  const revenueToday = orders
    .filter((o) => o.status !== 'rejected')
    .reduce((sum, o) => sum + o.total, 0);

  const activeDriver =
    ACTIVE_DRIVER_ROUTES.find((d) => d.id === selectedDriverId) ||
    ACTIVE_DRIVER_ROUTES[0];

  const handleSaveNote = () => {
    dispatch(updateBakersNote(noteDraft));
    setEditingNote(false);
    dispatch(
      addToast({
        title: "Baker's Note Updated",
        description: 'Kitchen prep advisory synced across stations.',
        variant: 'success',
      })
    );
  };

  const handleAdvanceStatus = (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    e.stopPropagation();
    const nextStatus = e.target.value as OrderStatus;
    dispatch(updateOrderStatus({ id, status: nextStatus }));
    dispatch(
      addToast({
        title: `Order ${id} Updated`,
        description: `Status changed to ${nextStatus.replaceAll('_', ' ')}.`,
        variant: 'info',
      })
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0f5a8a] dark:text-[#7dd3fc] tracking-tight">
            Order Management
          </h2>
          <p className="text-sm text-[#41566c] dark:text-[#b8cadc] mt-1.5 max-w-md">
            Oversee artisanal cake creations and floral arrangements in progress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => dispatch(simulateIncomingOrder())}
            className="liquid-glass px-4 py-2.5 rounded-xl text-sm font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] flex items-center gap-2 min-h-[44px] whitespace-nowrap hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <BellRing className="w-4 h-4" />
            Simulate Incoming Order
          </button>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="liquid-glass px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] flex items-center gap-2 min-h-[44px] whitespace-nowrap"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            type="button"
            onClick={() => dispatch(setNewOrderModalOpen(true))}
            className="liquid-glass-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all min-h-[44px] whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Order
          </button>
        </div>
      </header>

      {/* Metrics Bento Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="liquid-glass-soft rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-32">
          <span className="text-[11px] uppercase tracking-widest text-[#41566c] dark:text-[#b8cadc] font-semibold">
            Total Orders Today
          </span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-serif text-[#0f1f30] dark:text-[#eff6fc] tabular-nums">
              {15 + orders.length}
            </span>
            <span className="text-xs font-bold text-[#0f5a8a] dark:text-[#7dd3fc]">
              +12% ↑
            </span>
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-32 bg-sky-200/35 dark:bg-sky-600/20">
          <span className="text-[11px] uppercase tracking-widest text-[#41566c] dark:text-[#b8cadc] font-semibold">
            Baking Now
          </span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-serif text-[#0f1f30] dark:text-[#eff6fc] tabular-nums">
              0{bakingCount}
            </span>
            <Flame className="w-5 h-5 text-[#0f5a8a] dark:text-[#7dd3fc]" />
          </div>
        </div>

        <div className="liquid-glass-soft rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-32">
          <span className="text-[11px] uppercase tracking-widest text-[#41566c] dark:text-[#b8cadc] font-semibold">
            Awaiting Delivery
          </span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-serif text-[#0f1f30] dark:text-[#eff6fc] tabular-nums">
              0{deliveryCount}
            </span>
            <Truck className="w-5 h-5 text-[#41566c] dark:text-[#b8cadc]" />
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-32 bg-teal-200/35 dark:bg-teal-700/25">
          <span className="text-[11px] uppercase tracking-widest text-[#41566c] dark:text-[#b8cadc] font-semibold">
            Revenue Total
          </span>
          <div className="flex items-end justify-between">
            <span className="text-2xl sm:text-3xl font-serif text-[#0f1f30] dark:text-[#eff6fc] tabular-nums">
              ${revenueToday.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-[#0d9488] dark:text-[#5eead4]">
              Peak
            </span>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      {showFilters && (
        <section className="liquid-glass rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  dispatch(setOrderStatusFilter(tab.key));
                  setPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 min-h-[38px] ${
                  statusFilter === tab.key
                    ? 'liquid-glass-accent text-white'
                    : 'text-[#41566c] dark:text-[#b8cadc] hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#41566c] dark:text-[#b8cadc]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                dispatch(setOrderSearch(e.target.value));
                setPage(1);
              }}
              placeholder="Search order ID or customer..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/50 dark:bg-black/30 border border-[#0f5a8a]/15 dark:border-white/10 text-sm text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
            />
          </div>
        </section>
      )}

      {/* Orders Table & Mobile List */}
      <section className="liquid-glass rounded-3xl overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/35 dark:bg-black/20 text-[11px] uppercase tracking-[0.12em] font-bold text-[#41566c] dark:text-[#b8cadc]">
                <th className="px-7 py-5">Order ID</th>
                <th className="px-5 py-5">Customer</th>
                <th className="px-5 py-5">Date &amp; Time</th>
                <th className="px-5 py-5">Total</th>
                <th className="px-5 py-5">Status</th>
                <th className="px-7 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0f5a8a]/10 dark:divide-white/10">
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() =>
                    navigate(`/orders/${encodeURIComponent(order.id)}`)
                  }
                  className="hover:bg-white/45 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="px-7 py-5 font-mono text-xs font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] tabular-nums">
                    {order.id}
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-sky-200/80 dark:bg-sky-500/30 flex items-center justify-center text-xs font-bold text-[#0f4c75] dark:text-[#bae6fd] shrink-0">
                        {order.customerInitials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0f1f30] dark:text-[#eff6fc]">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-[#41566c] dark:text-[#b8cadc]">
                          {order.summaryItem}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-sm text-[#41566c] dark:text-[#b8cadc]">
                    {order.dateDisplay}
                  </td>
                  <td className="px-5 py-5 text-sm font-bold text-[#0f1f30] dark:text-[#eff6fc] tabular-nums">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-5 py-5">
                    <StatusBadge status={order.status} compact />
                  </td>
                  <td
                    className="px-7 py-5 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="inline-flex items-center gap-2">
                      <select
                        aria-label={`Change status for ${order.id}`}
                        value={order.status}
                        onChange={(e) => handleAdvanceStatus(e, order.id)}
                        className="text-xs font-semibold rounded-xl px-2.5 py-1.5 bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-[#0f1f30] dark:text-[#eff6fc] cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="baking">Baking</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/orders/${encodeURIComponent(order.id)}`)
                        }
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#0f5a8a] dark:text-[#7dd3fc] hover:bg-[#0f5a8a]/10 transition-colors"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Touch Cards */}
        <div className="md:hidden divide-y divide-[#0f5a8a]/10 dark:divide-white/10">
          {paginatedOrders.map((order) => (
            <div
              key={order.id}
              onClick={() =>
                navigate(`/orders/${encodeURIComponent(order.id)}`)
              }
              className="p-4 space-y-3 active:bg-white/40 dark:active:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-[#0f5a8a] dark:text-[#7dd3fc]">
                    {order.id}
                  </span>
                  <p className="font-bold text-sm text-[#0f1f30] dark:text-[#eff6fc] mt-0.5">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-[#41566c] dark:text-[#b8cadc]">
                    {order.summaryItem} · {order.dateDisplay}
                  </p>
                </div>
                <span className="font-bold text-sm text-[#0f1f30] dark:text-[#eff6fc] tabular-nums">
                  ${order.total.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <StatusBadge status={order.status} compact />
                <span className="text-xs font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] flex items-center gap-1">
                  Open Details <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {paginatedOrders.length === 0 && (
          <div className="p-12 text-center text-sm text-[#41566c] dark:text-[#b8cadc]">
            No orders match the current filter.
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 sm:px-8 py-5 bg-white/35 dark:bg-black/20 flex items-center justify-between border-t border-[#0f5a8a]/10 dark:border-white/10">
          <p className="text-xs text-[#41566c] dark:text-[#b8cadc] font-medium tabular-nums">
            Showing {paginatedOrders.length} of {filteredOrders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
              className="w-10 h-10 rounded-xl liquid-glass-soft flex items-center justify-center disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold tabular-nums transition-all ${
                    pageNum === safePage
                      ? 'liquid-glass-accent text-white'
                      : 'liquid-glass-soft text-[#41566c] dark:text-[#b8cadc]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
              className="w-10 h-10 rounded-xl liquid-glass-soft flex items-center justify-center disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Bento: Baker's Note & Delivery Map */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="liquid-glass-soft rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-xl text-[#0f5a8a] dark:text-[#7dd3fc] flex items-center gap-2.5">
                <Sparkles className="w-5 h-5" />
                Baker&apos;s Note
              </h3>
              {!editingNote ? (
                <button
                  type="button"
                  onClick={() => {
                    setNoteDraft(bakersNote);
                    setEditingNote(true);
                  }}
                  className="text-xs font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] flex items-center gap-1 hover:underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Note
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="liquid-glass-accent text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
              )}
            </div>

            {editingNote ? (
              <textarea
                rows={4}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white/55 dark:bg-black/35 border border-[#0f5a8a]/20 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
              />
            ) : (
              <div className="liquid-glass rounded-2xl p-5 italic text-sm text-[#41566c] dark:text-[#b8cadc] leading-relaxed">
                &ldquo;{bakersNote}&rdquo;
              </div>
            )}
          </div>
          <p className="text-xs text-[#41566c]/80 dark:text-[#b8cadc]/75 mt-4">
            Pinned by Head Pastry Chef · Visible across morning prep stations
          </p>
        </div>

        <div className="liquid-glass-ink rounded-3xl p-6 sm:p-8 text-[#eff6fc] relative overflow-hidden">
          <div className="relative z-10 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl">Delivery Map</h3>
                <p className="text-xs text-sky-100/75 mt-1">
                  Live status of active driver routes across the city.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#0f5a8a] text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                {ACTIVE_DRIVER_ROUTES.length} Drivers Active
              </span>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden border border-white/15 relative">
              <ArtisanalImage
                src={IMAGES.deliveryCityMap}
                alt="City delivery route map"
                className="w-full h-full object-cover opacity-55"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08192b]/90 via-transparent to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-200">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>
                    {activeDriver.driverName} · {activeDriver.zone} (ETA{' '}
                    {activeDriver.etaMinutes}m)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {ACTIVE_DRIVER_ROUTES.map((drv) => (
                <button
                  key={drv.id}
                  type="button"
                  onClick={() => setSelectedDriverId(drv.id)}
                  className={`p-2.5 rounded-xl text-left text-xs transition-all border ${
                    selectedDriverId === drv.id
                      ? 'bg-[#0f5a8a] border-sky-300/40 text-white'
                      : 'bg-white/10 border-white/10 text-sky-100/80 hover:bg-white/15'
                  }`}
                >
                  <p className="font-bold truncate">{drv.driverName.split(' ')[0]}</p>
                  <p className="text-[10px] opacity-80 truncate">{drv.orderId}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
