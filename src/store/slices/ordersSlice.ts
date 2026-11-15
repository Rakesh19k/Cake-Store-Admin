import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_ORDERS, IMAGES } from '../../data/seedData';
import { Order, OrderStatus } from '../../types';
import type { AppDispatch, RootState } from '../index';
import { addToast } from './uiSlice';

interface OrdersState {
  items: Order[];
  bakersNote: string;
  searchQuery: string;
  statusFilter: OrderStatus | 'all';
  priorityDismissed: boolean;
  simulationCursor: number;
}

const initialState: OrdersState = {
  items: INITIAL_ORDERS,
  bakersNote:
    'High volume of custom floral orders for Saturday morning. Ensure we have extra fresh peonies and edible gold leaf in stock by Friday.',
  searchQuery: '',
  statusFilter: 'all',
  priorityDismissed: false,
  simulationCursor: 0,
};

export interface CreateOrderPayload {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemName: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  deliveryVenue: string;
  deliveryAddress: string;
  scheduledDelivery: string;
  image?: string;
  isPriority?: boolean;
}

const INCOMING_ORDER_TEMPLATES = [
  {
    customerName: 'Clara Vance',
    customerEmail: 'clara.vance@atelier.co',
    customerPhone: '+1 (555) 204-8821',
    itemName: 'Rose Lychee Bloom & Peonies',
    itemDescription: '2-Tier Chiffon Cake with Silk-Tied Peony Bouquet',
    quantity: 1,
    unitPrice: 245.0,
    deliveryVenue: 'Gramercy Loft',
    deliveryAddress: '34 Gramercy Park E, New York, NY 10003',
    scheduledDelivery: 'Today · 04:30 PM',
    image: IMAGES.roseLychee,
    isPriority: true,
  },
  {
    customerName: 'Devon Brooks',
    customerEmail: 'dbrooks@meridian.org',
    customerPhone: '+1 (555) 619-3302',
    itemName: 'Grand Tiered Wedding Cake',
    itemDescription: '3-Tiers, Madagascar Vanilla, Fresh Raspberry Compote',
    quantity: 1,
    unitPrice: 850.0,
    deliveryVenue: 'The Foundry',
    deliveryAddress: '42-38 9th St, Long Island City, NY 11101',
    scheduledDelivery: 'Oct 27, 11:00 AM',
    image: IMAGES.weddingCakeTiered,
    isPriority: true,
  },
  {
    customerName: 'Mei Chen',
    customerEmail: 'mei.chen@gallery9.com',
    customerPhone: '+1 (555) 845-1904',
    itemName: 'Signature Pastry Bouquet',
    itemDescription: '24 Pastel Macaron Blossoms & Edible Gold Leaf',
    quantity: 2,
    unitPrice: 95.0,
    deliveryVenue: 'Crosby Street Studio',
    deliveryAddress: '79 Crosby St, SoHo, NY 10012',
    scheduledDelivery: 'Today · 05:15 PM',
    image: IMAGES.pastryBouquet,
    isPriority: false,
  },
  {
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.s@verve.vc',
    customerPhone: '+1 (555) 773-6210',
    itemName: 'Saffron Pistachio Reserve',
    itemDescription: 'Kashmiri Saffron Sponge & Roasted Pistachio Cream',
    quantity: 1,
    unitPrice: 185.0,
    deliveryVenue: 'Tribeca Rooftop',
    deliveryAddress: '2 Desbrosses St, New York, NY 10013',
    scheduledDelivery: 'Tomorrow · 01:00 PM',
    image: IMAGES.saffronPistachio,
    isPriority: false,
  },
];

function buildTimelineForStatus(order: Order, nextStatus: OrderStatus) {
  const base = order.timeline.map((t) => ({ ...t }));
  if (nextStatus === 'pending') {
    return base.map((t, idx) => ({
      ...t,
      completed: idx < 2,
      active: idx === 2,
    }));
  }
  if (nextStatus === 'baking') {
    return base.map((t, idx) => {
      if (idx < 2) return { ...t, completed: true, active: false };
      if (idx === 2)
        return {
          ...t,
          title: 'Baking In Progress',
          timestamp: 'Confirmed · Active on Deck',
          description:
            'Currently in the tiered cooling phase. Decoration scheduled for tomorrow.',
          completed: false,
          active: true,
        };
      return { ...t, completed: false, active: false };
    });
  }
  if (nextStatus === 'out_for_delivery') {
    return base.map((t, idx) => {
      if (idx < 3) return { ...t, completed: true, active: false };
      return {
        ...t,
        title: 'Out for Delivery',
        timestamp: 'Dispatched · Live Courier',
        description: 'Chilled artisanal van en route to delivery venue.',
        completed: false,
        active: true,
      };
    });
  }
  if (nextStatus === 'completed') {
    return base.map((t, idx) => {
      if (idx === 3) {
        return {
          ...t,
          title: 'Delivered & Completed',
          timestamp: 'Signed & Accepted',
          description: 'Successfully handed over in pristine condition.',
          completed: true,
          active: false,
        };
      }
      return { ...t, completed: true, active: false };
    });
  }
  return base.map((t, idx) => {
    if (idx < 2) return { ...t, completed: true, active: false };
    if (idx === 2)
      return {
        ...t,
        title: 'Order Declined',
        timestamp: 'Customer Notified',
        description: 'Removed from active production schedule.',
        completed: false,
        active: false,
      };
    return { ...t, completed: false, active: false };
  });
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrderSearch(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setOrderStatusFilter(state, action: PayloadAction<OrderStatus | 'all'>) {
      state.statusFilter = action.payload;
    },
    updateOrderStatus(
      state,
      action: PayloadAction<{ id: string; status: OrderStatus }>
    ) {
      const order = state.items.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        order.timeline = buildTimelineForStatus(order, action.payload.status);
        if (order.isPriority && action.payload.status !== 'pending') {
          order.isPriority = false;
          state.priorityDismissed = true;
        }
      }
    },
    saveOrderNote(
      state,
      action: PayloadAction<{ id: string; note: string }>
    ) {
      const order = state.items.find((o) => o.id === action.payload.id);
      if (order) {
        order.internalNote = action.payload.note;
      }
    },
    updateBakersNote(state, action: PayloadAction<string>) {
      state.bakersNote = action.payload;
    },
    incrementSimulationCursor(state) {
      state.simulationCursor += 1;
    },
    createOrder(state, action: PayloadAction<CreateOrderPayload>) {
      const payload = action.payload;
      const numericSuffix = 9045 + state.items.length;
      const id = payload.id || `#SC-${numericSuffix}`;
      const initials = payload.customerName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
      const total = payload.quantity * payload.unitPrice;
      const newOrder: Order = {
        id,
        customerName: payload.customerName,
        customerInitials: initials || 'GC',
        customerEmail: payload.customerEmail || 'client@sonalicakes.com',
        customerPhone: payload.customerPhone || '+1 (555) 201-9988',
        collectionTitle: payload.itemName,
        summaryItem:
          payload.quantity > 1
            ? `${payload.itemName} (x${payload.quantity})`
            : payload.itemName,
        dateDisplay: 'Just now',
        scheduledDelivery: payload.scheduledDelivery || 'Oct 26, 2024',
        deliveryVenue: payload.deliveryVenue || 'Private Residence',
        deliveryAddress:
          payload.deliveryAddress || '410 Lafayette St, New York, NY 10003',
        distanceMiles: 4.5,
        routeLabel: 'ATELIER DIRECT',
        total,
        status: 'pending',
        isPriority: payload.isPriority,
        internalNote: 'Newly received order awaiting kitchen confirmation.',
        items: [
          {
            id: `item-${numericSuffix}-1`,
            name: payload.itemName,
            description:
              payload.itemDescription || 'Artisanal signature preparation',
            quantity: payload.quantity,
            price: payload.unitPrice,
            image: payload.image || IMAGES.roseLychee,
            tags: ['New Order'],
          },
        ],
        timeline: [
          {
            id: 't1',
            title: 'Order Received',
            timestamp: 'Just now',
            description: 'Received via boutique portal.',
            completed: true,
          },
          {
            id: 't2',
            title: 'Ingredients Sourced',
            timestamp: 'Queued',
            description: 'Awaiting pantry allocation.',
            completed: false,
            active: true,
          },
          {
            id: 't3',
            title: 'Baking In Progress',
            timestamp: 'Scheduled',
            description: 'Oven slot pending confirmation.',
            completed: false,
          },
          {
            id: 't4',
            title: 'Scheduled for Delivery',
            timestamp: payload.scheduledDelivery || 'Oct 26, 2024',
            description: 'Chilled courier delivery.',
            completed: false,
          },
        ],
      };
      state.items.unshift(newOrder);
    },
  },
});

export const {
  setOrderSearch,
  setOrderStatusFilter,
  updateOrderStatus,
  saveOrderNote,
  updateBakersNote,
  incrementSimulationCursor,
  createOrder,
} = ordersSlice.actions;

export const createOrderWithToast =
  (payload: Omit<CreateOrderPayload, 'id'>) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const nextId = `#SC-${9045 + state.orders.items.length}`;
    dispatch(createOrder({ ...payload, id: nextId }));

    if (state.ui.liveOrderAlertsEnabled) {
      const itemSummary =
        payload.quantity > 1
          ? `${payload.itemName} (x${payload.quantity})`
          : payload.itemName;
      dispatch(
        addToast({
          variant: 'order',
          title: 'New Order Received',
          orderId: nextId,
          customerName: payload.customerName,
          itemSummary,
          amount: payload.quantity * payload.unitPrice,
          durationMs: 7500,
        })
      );
    }
    return nextId;
  };

export const simulateIncomingOrder =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const template =
      INCOMING_ORDER_TEMPLATES[
        state.orders.simulationCursor % INCOMING_ORDER_TEMPLATES.length
      ];
    dispatch(incrementSimulationCursor());
    return dispatch(createOrderWithToast(template));
  };

export default ordersSlice.reducer;
