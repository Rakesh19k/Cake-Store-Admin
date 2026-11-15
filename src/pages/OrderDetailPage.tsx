import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BellRing,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  MapPin,
  Navigation,
  PartyPopper,
  Phone,
  PhoneCall,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { IMAGES } from '../data/seedData';
import { ArtisanalImage } from '../components/common/ArtisanalImage';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAppDispatch, useAppSelector } from '../store';
import {
  saveOrderNote,
  updateOrderStatus,
} from '../store/slices/ordersSlice';
import {
  addToast,
  setAssistanceModalOpen,
} from '../store/slices/uiSlice';
import { OrderStatus } from '../types';

const WORKFLOW_STEPS: {
  status: OrderStatus;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { status: 'pending', label: 'Pending', Icon: Clock },
  { status: 'baking', label: 'Baking', Icon: Flame },
  { status: 'out_for_delivery', label: 'Out for Delivery', Icon: Truck },
  { status: 'completed', label: 'Completed', Icon: PartyPopper },
];

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const orders = useAppSelector((s) => s.orders.items);
  const decodedId = orderId ? decodeURIComponent(orderId) : '#SC-8291';
  const order =
    orders.find((o) => o.id === decodedId) ||
    orders.find((o) => o.id === '#SC-8291') ||
    orders[0];

  const [noteText, setNoteText] = useState(order?.internalNote || '');

  useEffect(() => {
    if (order) {
      setNoteText(order.internalNote);
    }
  }, [order?.id, order?.internalNote]);

  if (!order) {
    return (
      <div className="liquid-glass rounded-3xl p-10 text-center">
        <p className="font-serif text-2xl">Order not found</p>
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="mt-4 liquid-glass-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const handleStatusChange = (nextStatus: OrderStatus) => {
    dispatch(updateOrderStatus({ id: order.id, status: nextStatus }));
    dispatch(
      addToast({
        title: `Order ${order.id} Updated`,
        description: `Status set to ${nextStatus.replaceAll('_', ' ')}.`,
        variant: nextStatus === 'rejected' ? 'warning' : 'success',
      })
    );
  };

  const handleSaveNote = () => {
    dispatch(saveOrderNote({ id: order.id, note: noteText }));
    dispatch(
      addToast({
        title: 'Internal Note Saved',
        description: `Kitchen note updated for ${order.id}.`,
        variant: 'success',
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            aria-label="Back to orders"
            className="liquid-glass-soft w-10 h-10 rounded-xl flex items-center justify-center text-[#0f5a8a] dark:text-[#7dd3fc] hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#0f5a8a] dark:text-[#7dd3fc]">
                Order Details
              </h2>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-sky-200/80 dark:bg-sky-500/30 text-[#0f4c75] dark:text-[#bae6fd] tabular-nums">
                {order.id}
              </span>
            </div>
          </div>
        </div>

        <StatusBadge status={order.status} />
      </div>

      {/* Main 12-Col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Order Collection & Items */}
          <section className="liquid-glass rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#0f1f30] dark:text-[#eff6fc]">
                  {order.collectionTitle}
                </h3>
                <p className="text-sm text-[#41566c] dark:text-[#b8cadc] mt-1">
                  Scheduled for Delivery: {order.scheduledDelivery}
                </p>
              </div>
              <div className="sm:text-right">
                <span className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc] block mb-0.5">
                  Total Amount
                </span>
                <span className="text-3xl font-bold font-serif text-[#0f5a8a] dark:text-[#7dd3fc] tabular-nums">
                  ${order.total.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-3 -mx-3 rounded-2xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-white/60 dark:border-white/10">
                    <ArtisanalImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-serif text-lg sm:text-xl text-[#0f1f30] dark:text-[#eff6fc]">
                          {item.name}
                        </h4>
                        <p className="text-sm text-[#41566c] dark:text-[#b8cadc] mt-0.5">
                          {item.description}
                        </p>
                      </div>
                      <span className="font-bold text-base text-[#0f1f30] dark:text-[#eff6fc] tabular-nums shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-2">
                      Qty {item.quantity} · {item.tags.join(' · ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Customer & Delivery Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="liquid-glass-soft rounded-2xl p-6 relative overflow-hidden">
              <User className="w-14 h-14 absolute top-4 right-4 text-[#0f5a8a]/10 dark:text-[#7dd3fc]/10" />
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc] mb-3">
                Customer Details
              </h4>
              <p className="font-serif text-2xl text-[#0f1f30] dark:text-[#eff6fc]">
                {order.customerName}
              </p>
              <p className="text-sm text-[#41566c] dark:text-[#b8cadc] mt-1 mb-4">
                {order.customerEmail}
              </p>
              <a
                href={`tel:${order.customerPhone}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] hover:underline"
              >
                <Phone className="w-4 h-4" />
                {order.customerPhone}
              </a>
            </div>

            <div className="liquid-glass-soft rounded-2xl p-6 relative overflow-hidden">
              <Truck className="w-14 h-14 absolute top-4 right-4 text-[#0f5a8a]/10 dark:text-[#7dd3fc]/10" />
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc] mb-3">
                Delivery Address
              </h4>
              <p className="font-serif text-2xl text-[#0f1f30] dark:text-[#eff6fc]">
                {order.deliveryVenue}
              </p>
              <address className="not-italic text-sm text-[#41566c] dark:text-[#b8cadc] leading-relaxed mt-1">
                {order.deliveryAddress}
              </address>
            </div>
          </div>

          {/* Activity Timeline */}
          <section className="liquid-glass rounded-3xl p-6 sm:p-8">
            <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc] mb-7">
              Activity Timeline
            </h4>
            <div className="space-y-7 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-300/60 dark:bg-white/15" />
              {order.timeline.map((step) => (
                <div
                  key={step.id}
                  className={`flex gap-5 relative ${
                    !step.completed && !step.active ? 'opacity-45' : ''
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 ${
                      step.completed
                        ? 'bg-[#0f5a8a] text-white'
                        : step.active
                        ? 'bg-[#0e7490] dark:bg-[#7dd3fc] ring-4 ring-sky-200/70 dark:ring-sky-500/35'
                        : 'bg-slate-300 dark:bg-white/20'
                    }`}
                  >
                    {step.completed && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#0f1f30] dark:text-[#eff6fc]">
                      {step.title}
                    </p>
                    <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-0.5">
                      {step.timestamp}
                    </p>
                    <p className="text-sm text-[#41566c] dark:text-[#b8cadc] mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right 4 Columns */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Action Required (Pending) OR Status Workflow */}
          <section className="liquid-glass rounded-3xl p-6">
            {order.status === 'pending' ? (
              <div className="space-y-5">
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc]">
                  Action Required
                </h4>
                <div className="liquid-glass-soft rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-200/75 dark:bg-sky-500/25 flex items-center justify-center shrink-0">
                      <BellRing className="w-5 h-5 text-[#0f5a8a] dark:text-[#7dd3fc]" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#0f1f30] dark:text-[#eff6fc]">
                        New Order Pending
                      </p>
                      <p className="text-xs text-[#41566c] dark:text-[#b8cadc] italic">
                        Review details before confirming.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleStatusChange('baking')}
                      className="w-full liquid-glass-accent text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all min-h-[44px]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Accept Order
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange('rejected')}
                      className="w-full py-2.5 rounded-xl font-semibold text-sm border border-slate-400/35 text-slate-700 dark:text-slate-300 hover:bg-slate-500/10 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Order
                    </button>
                  </div>
                </div>
              </div>
            ) : order.status === 'rejected' ? (
              <div className="space-y-4">
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc]">
                  Order Status
                </h4>
                <div className="rounded-2xl p-4 bg-slate-500/15 border border-slate-500/25 flex items-center gap-3 text-slate-700 dark:text-slate-200 font-bold text-sm">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <span>Order Rejected</span>
                </div>
                <p className="text-xs text-[#41566c] dark:text-[#b8cadc] leading-relaxed">
                  Customer has been notified. This order is removed from the active production queue.
                </p>
                <button
                  type="button"
                  onClick={() => handleStatusChange('pending')}
                  className="text-xs font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] hover:underline"
                >
                  Revert to Pending
                </button>
              </div>
            ) : (
              <div>
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc] mb-5">
                  Current Status Update
                </h4>
                <div className="space-y-2.5">
                  {WORKFLOW_STEPS.map(({ status, label, Icon }) => {
                    const isActive = order.status === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusChange(status)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                          isActive
                            ? 'liquid-glass-accent text-white ring-4 ring-sky-200/60 dark:ring-sky-500/30'
                            : 'liquid-glass-soft text-[#41566c] dark:text-[#eff6fc] hover:bg-white/70 dark:hover:bg-white/10'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{label}</span>
                        </span>
                        {isActive && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Internal Note */}
            <div className="mt-7 pt-6 border-t border-[#0f5a8a]/10 dark:border-white/10">
              <label
                htmlFor="internal-kitchen-note"
                className="block text-[11px] uppercase font-bold tracking-widest text-[#41566c] dark:text-[#b8cadc] mb-2"
              >
                Internal Note
              </label>
              <textarea
                id="internal-kitchen-note"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note for the kitchen staff..."
                className="w-full rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/15 dark:border-white/15 p-3 text-sm text-[#0f1f30] dark:text-[#eff6fc] h-24 focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
              />
              <button
                type="button"
                onClick={handleSaveNote}
                className="mt-3 w-full py-2.5 rounded-xl bg-[#0e7490] dark:bg-[#0f5a8a] text-white text-sm font-semibold hover:brightness-110 transition-all min-h-[42px]"
              >
                Save Note
              </button>
            </div>
          </section>

          {/* Map Integration */}
          <section className="liquid-glass rounded-3xl overflow-hidden">
            <div className="h-52 w-full relative overflow-hidden group">
              <ArtisanalImage
                src={IMAGES.hamptonsMap}
                alt={`Map route to ${order.deliveryVenue}`}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                <div className="w-11 h-11 rounded-full bg-[#0f5a8a] text-white flex items-center justify-center shadow-lg">
                  <MapPin className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="p-5">
              <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc] mb-2">
                Delivery Logistics
              </h4>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-[#0f1f30] dark:text-[#eff6fc] tabular-nums">
                  <Navigation className="w-4 h-4 text-[#0f5a8a] dark:text-[#7dd3fc] shrink-0" />
                  <span>{order.distanceMiles} miles from Kitchen</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sky-200/80 dark:bg-sky-500/30 text-[#0f4c75] dark:text-[#bae6fd] whitespace-nowrap">
                  {order.routeLabel}
                </span>
              </div>
            </div>
          </section>

          {/* Need Assistance */}
          <div className="liquid-glass-ink text-[#eff6fc] rounded-3xl p-6 space-y-3">
            <p className="font-serif text-lg">Need Assistance?</p>
            <p className="text-xs text-sky-100/80 leading-relaxed">
              Direct line to the floor manager available for high-priority bridal orders.
            </p>
            <button
              type="button"
              onClick={() => dispatch(setAssistanceModalOpen(true))}
              className="inline-flex items-center gap-2 text-sky-200 font-bold text-sm hover:underline min-h-[36px]"
            >
              <PhoneCall className="w-4 h-4" />
              Call Floor Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
