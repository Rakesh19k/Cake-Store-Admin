import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  Check,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateOrderStatus } from '../../store/slices/ordersSlice';
import { addToast, dismissToast } from '../../store/slices/uiSlice';
import { ToastMessage } from '../../types';

interface ToastCardProps {
  toast: ToastMessage;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [paused, setPaused] = useState(false);

  const durationMs = toast.durationMs ?? (toast.variant === 'order' ? 7500 : 4200);
  const [remainingMs, setRemainingMs] = useState(durationMs);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setRemainingMs((prev) => {
        if (prev <= 100) {
          clearInterval(interval);
          dispatch(dismissToast(toast.id));
          return 0;
        }
        return prev - 100;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [paused, toast.id, dispatch]);

  const progressPct = Math.max(0, Math.min(100, (remainingMs / durationMs) * 100));

  const handleAcceptOrder = () => {
    if (!toast.orderId) return;
    dispatch(updateOrderStatus({ id: toast.orderId, status: 'baking' }));
    dispatch(dismissToast(toast.id));
    dispatch(
      addToast({
        variant: 'success',
        title: `Order ${toast.orderId} Accepted`,
        description: `${toast.customerName ?? 'Order'} moved to Baking deck.`,
        durationMs: 3600,
      })
    );
  };

  const handleViewOrder = () => {
    if (!toast.orderId) return;
    dispatch(dismissToast(toast.id));
    navigate(`/orders/${encodeURIComponent(toast.orderId)}`);
  };

  if (toast.variant === 'order') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: -16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: 28, scale: 0.96 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        role="status"
        aria-live="assertive"
        className="pointer-events-auto liquid-glass-order-toast rounded-2xl overflow-hidden"
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-200/75 dark:bg-sky-500/25 border border-[#0f5a8a]/20 dark:border-sky-300/25 flex items-center justify-center shrink-0 text-[#0f5a8a] dark:text-[#7dd3fc] shadow-inner">
              <BellRing className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-serif text-sm font-bold text-[#0f1f30] dark:text-[#eff6fc] truncate">
                  {toast.title}
                </p>
                {toast.orderId && (
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0f5a8a]/12 dark:bg-sky-400/15 text-[#0f5a8a] dark:text-[#7dd3fc] tabular-nums shrink-0">
                    {toast.orderId}
                  </span>
                )}
              </div>

              {(toast.customerName || toast.description) && (
                <p className="text-xs font-semibold text-[#0f1f30] dark:text-[#eff6fc] mt-1 truncate">
                  {toast.customerName ?? toast.description}
                </p>
              )}

              {(toast.itemSummary || typeof toast.amount === 'number') && (
                <div className="flex items-center justify-between gap-2 mt-0.5 text-xs text-[#41566c] dark:text-[#b8cadc]">
                  <span className="truncate">{toast.itemSummary}</span>
                  {typeof toast.amount === 'number' && (
                    <span className="font-bold text-[#0f5a8a] dark:text-[#7dd3fc] tabular-nums shrink-0">
                      ${toast.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  )}
                </div>
              )}

              {toast.orderId && (
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={handleAcceptOrder}
                    className="liquid-glass-accent text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:brightness-110 active:scale-[0.98] transition-all min-h-[34px]"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept Order
                  </button>
                  <button
                    type="button"
                    onClick={handleViewOrder}
                    className="px-3 py-1.5 rounded-xl bg-white/45 dark:bg-white/10 backdrop-blur-md border border-white/70 dark:border-white/15 text-xs font-semibold text-[#0f1f30] dark:text-[#eff6fc] hover:bg-white/70 dark:hover:bg-white/15 transition-colors flex items-center gap-1 min-h-[34px]"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => dispatch(dismissToast(toast.id))}
              aria-label="Dismiss new order alert"
              className="p-1.5 rounded-xl text-[#41566c] dark:text-[#b8cadc] hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Countdown Progress Bar */}
        <div className="h-[2.5px] w-full bg-[#0f5a8a]/10 dark:bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#0f5a8a] to-[#5eead4] dark:from-[#38bdf8] dark:to-[#0f766e] transition-[width] duration-100 ease-linear"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </motion.div>
    );
  }

  const Icon =
    toast.variant === 'success'
      ? CheckCircle2
      : toast.variant === 'warning'
      ? AlertTriangle
      : toast.variant === 'error'
      ? XCircle
      : Info;

  const iconColor =
    toast.variant === 'success'
      ? 'text-emerald-600 dark:text-emerald-400'
      : toast.variant === 'warning'
      ? 'text-amber-600 dark:text-amber-400'
      : toast.variant === 'error'
      ? 'text-slate-600 dark:text-slate-300'
      : 'text-[#0f5a8a] dark:text-[#7dd3fc]';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="status"
      className="pointer-events-auto liquid-glass rounded-2xl overflow-hidden"
    >
      <div className="p-3.5 sm:p-4 flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0f1f30] dark:text-[#eff6fc]">
            {toast.title}
          </p>
          {toast.description && (
            <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-0.5">
              {toast.description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => dispatch(dismissToast(toast.id))}
          aria-label="Dismiss notification"
          className="p-1.5 rounded-lg text-[#41566c] dark:text-[#b8cadc] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="h-[2px] w-full bg-[#0f5a8a]/10 dark:bg-white/10">
        <div
          className="h-full bg-[#0f5a8a]/60 dark:bg-[#7dd3fc]/60 transition-[width] duration-100 ease-linear"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const toasts = useAppSelector((s) => s.ui.toasts);

  return (
    <div
      className="fixed top-[78px] lg:top-[84px] left-3 right-3 sm:left-auto sm:right-6 lg:right-8 z-[120] flex flex-col gap-3 sm:w-[390px] pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
