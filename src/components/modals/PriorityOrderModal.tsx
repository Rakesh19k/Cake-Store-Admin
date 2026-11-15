import React from 'react';
import { BellRing, CheckCircle2, X, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateOrderStatus } from '../../store/slices/ordersSlice';
import { addToast, setPriorityModalOpen } from '../../store/slices/uiSlice';

export const PriorityOrderModal: React.FC = () => {
  const isOpen = useAppSelector((s) => s.ui.priorityModalOpen);
  const orders = useAppSelector((s) => s.orders.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const targetOrder =
    orders.find((o) => o.isPriority && o.status === 'pending') ||
    orders.find((o) => o.status === 'pending') ||
    orders[0];

  if (!targetOrder) return null;

  const handleAccept = () => {
    dispatch(updateOrderStatus({ id: targetOrder.id, status: 'baking' }));
    dispatch(setPriorityModalOpen(false));
    dispatch(
      addToast({
        title: `Order ${targetOrder.id} Accepted`,
        description: `${targetOrder.customerName}'s order moved to Baking deck.`,
        variant: 'success',
      })
    );
  };

  const handleReject = () => {
    dispatch(updateOrderStatus({ id: targetOrder.id, status: 'rejected' }));
    dispatch(setPriorityModalOpen(false));
    dispatch(
      addToast({
        title: `Order ${targetOrder.id} Declined`,
        description: 'Customer notification queued.',
        variant: 'warning',
      })
    );
  };

  const handleInspect = () => {
    dispatch(setPriorityModalOpen(false));
    navigate(`/orders/${encodeURIComponent(targetOrder.id)}`);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="priority-modal-title"
    >
      <div
        className="absolute inset-0 bg-[#0c1b2e]/55 dark:bg-black/70 backdrop-blur-md"
        onClick={() => dispatch(setPriorityModalOpen(false))}
      />

      <div className="relative liquid-glass w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-[fadeIn_180ms_ease-out]">
        <button
          type="button"
          onClick={() => dispatch(setPriorityModalOpen(false))}
          aria-label="Close notification modal"
          className="absolute top-4 right-4 p-2 rounded-full text-[#41566c] dark:text-[#b8cadc] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-7 sm:p-8">
          <div className="w-16 h-16 rounded-full bg-sky-200/75 dark:bg-sky-500/25 border border-[#0f5a8a]/20 flex items-center justify-center mb-5 mx-auto shadow-inner">
            <BellRing className="w-7 h-7 text-[#0f5a8a] dark:text-[#7dd3fc]" />
          </div>

          <div className="text-center mb-6">
            <h2
              id="priority-modal-title"
              className="text-2xl sm:text-3xl font-serif font-bold text-[#0f1f30] dark:text-[#eff6fc] mb-1.5"
            >
              New Order Received
            </h2>
            <p className="text-sm text-[#41566c] dark:text-[#b8cadc]">
              A new high-value order is awaiting your approval.
            </p>
          </div>

          <div className="liquid-glass-soft rounded-2xl p-5 mb-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#41566c] dark:text-[#b8cadc] font-medium">
                Order ID
              </span>
              <span className="font-mono font-bold text-[#0f5a8a] dark:text-[#7dd3fc] tabular-nums">
                {targetOrder.id}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#41566c] dark:text-[#b8cadc] font-medium">
                Customer
              </span>
              <span className="font-bold text-[#0f1f30] dark:text-[#eff6fc]">
                {targetOrder.customerName}
              </span>
            </div>

            <div className="pt-2 space-y-1.5 border-t border-[#0f5a8a]/10 dark:border-white/10">
              <p className="text-[11px] font-semibold text-[#41566c] dark:text-[#b8cadc] tracking-wide">
                Item Details
              </p>
              {targetOrder.items.map((item) => (
                <p
                  key={item.id}
                  className="text-sm text-[#0f1f30] dark:text-[#eff6fc] leading-snug"
                >
                  {item.quantity}x {item.name}
                </p>
              ))}
            </div>

            <div className="pt-3 border-t border-[#0f5a8a]/15 dark:border-white/10 flex justify-between items-center">
              <span className="text-xs font-bold tracking-wider uppercase text-[#41566c] dark:text-[#b8cadc]">
                Total Amount
              </span>
              <span className="text-2xl font-bold font-serif text-[#0f5a8a] dark:text-[#7dd3fc] tabular-nums">
                ${targetOrder.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleAccept}
              className="w-full liquid-glass-accent text-white py-3.5 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all min-h-[44px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              Accept Order
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="w-full py-3.5 px-6 rounded-xl font-semibold border border-[#0f5a8a]/25 dark:border-white/15 text-[#41566c] dark:text-[#eff6fc] hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <XCircle className="w-4 h-4" />
              Reject Order
            </button>
            <button
              type="button"
              onClick={handleInspect}
              className="w-full py-2 text-xs font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] hover:underline"
            >
              Inspect Full Order Sheet
            </button>
          </div>
        </div>

        <div className="bg-[#0f5a8a]/10 dark:bg-white/5 py-3 px-6 text-center border-t border-[#0f5a8a]/10 dark:border-white/10">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#0f5a8a] dark:text-[#7dd3fc]">
            Priority Notification
          </p>
        </div>
      </div>
    </div>
  );
};
