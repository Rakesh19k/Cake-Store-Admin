import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastMessage } from '../../types';

interface UiState {
  priorityModalOpen: boolean;
  newOrderModalOpen: boolean;
  assistanceModalOpen: boolean;
  liveOrderAlertsEnabled: boolean;
  toasts: ToastMessage[];
}

const initialState: UiState = {
  priorityModalOpen: false,
  newOrderModalOpen: false,
  assistanceModalOpen: false,
  liveOrderAlertsEnabled: true,
  toasts: [],
};

const MAX_VISIBLE_TOASTS = 4;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPriorityModalOpen(state, action: PayloadAction<boolean>) {
      state.priorityModalOpen = action.payload;
    },
    setNewOrderModalOpen(state, action: PayloadAction<boolean>) {
      state.newOrderModalOpen = action.payload;
    },
    setAssistanceModalOpen(state, action: PayloadAction<boolean>) {
      state.assistanceModalOpen = action.payload;
    },
    setLiveOrderAlertsEnabled(state, action: PayloadAction<boolean>) {
      state.liveOrderAlertsEnabled = action.payload;
    },
    addToast(state, action: PayloadAction<Omit<ToastMessage, 'id'>>) {
      const nextToast: ToastMessage = {
        ...action.payload,
        id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: Date.now(),
      };
      state.toasts.push(nextToast);
      if (state.toasts.length > MAX_VISIBLE_TOASTS) {
        state.toasts = state.toasts.slice(state.toasts.length - MAX_VISIBLE_TOASTS);
      }
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearAllToasts(state) {
      state.toasts = [];
    },
  },
});

export const {
  setPriorityModalOpen,
  setNewOrderModalOpen,
  setAssistanceModalOpen,
  setLiveOrderAlertsEnabled,
  addToast,
  dismissToast,
  clearAllToasts,
} = uiSlice.actions;

export default uiSlice.reducer;
