import React, { useState } from 'react';
import { PhoneCall, Send, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  addToast,
  setAssistanceModalOpen,
} from '../../store/slices/uiSlice';

export const AssistanceModal: React.FC = () => {
  const isOpen = useAppSelector((s) => s.ui.assistanceModalOpen);
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState(
    'Requesting chilled courier confirmation for bridal tier.'
  );

  if (!isOpen) return null;

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setAssistanceModalOpen(false));
    dispatch(
      addToast({
        title: 'Floor Manager Paged',
        description: 'Chef Julianne & Dispatch Desk notified immediately.',
        variant: 'success',
      })
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistance-title"
    >
      <div
        className="absolute inset-0 bg-[#0c1b2e]/55 dark:bg-black/70 backdrop-blur-md"
        onClick={() => dispatch(setAssistanceModalOpen(false))}
      />
      <div className="relative liquid-glass-ink text-[#eff6fc] w-full max-w-md rounded-3xl p-7">
        <button
          type="button"
          onClick={() => dispatch(setAssistanceModalOpen(false))}
          aria-label="Close assistance dialog"
          className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-sky-300/20 border border-sky-300/30 flex items-center justify-center mb-4">
          <PhoneCall className="w-5 h-5 text-sky-200" />
        </div>

        <h2 id="assistance-title" className="font-serif text-2xl mb-1">
          Floor Manager Dispatch
        </h2>
        <p className="text-xs text-sky-100/80 mb-5">
          Direct priority line to the bridal & chilled logistics coordinator.
        </p>

        <div className="rounded-2xl bg-white/10 border border-white/15 p-4 mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Elena Rostova · Floor Lead</p>
            <p className="text-xs text-sky-100/75 mt-0.5">
              Extension 404 · Kitchen Deck A
            </p>
          </div>
          <a
            href="tel:+15552348891"
            className="px-3.5 py-2 rounded-xl bg-sky-200 text-[#0a1d32] text-xs font-bold hover:brightness-105 transition-all whitespace-nowrap shrink-0"
          >
            Call Ext. 404
          </a>
        </div>

        <form onSubmit={handleDispatch} className="space-y-3">
          <label className="block text-xs font-semibold text-sky-100/85">
            Send Priority Kitchen Alert
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl bg-white/10 border border-white/15 p-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-300/40"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-sky-200 text-[#0a1d32] text-sm font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all min-h-[44px]"
          >
            <Send className="w-4 h-4" />
            Dispatch Priority Message
          </button>
        </form>
      </div>
    </div>
  );
};
