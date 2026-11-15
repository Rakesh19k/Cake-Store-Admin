import React from 'react';
import {
  Clock,
  Flame,
  Truck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus;
  compact?: boolean;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    classes: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  pending: {
    label: 'Pending',
    classes:
      'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/25',
    Icon: Clock,
  },
  baking: {
    label: 'Baking',
    classes:
      'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border-indigo-500/25',
    Icon: Flame,
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    classes:
      'bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/25',
    Icon: Truck,
  },
  completed: {
    label: 'Completed',
    classes:
      'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/25',
    Icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    classes:
      'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/25',
    Icon: XCircle,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  compact = false,
}) => {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap shrink-0 backdrop-blur-md ${
        compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1 text-xs'
      } ${cfg.classes}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{cfg.label}</span>
    </span>
  );
};
