export type OrderStatus =
  | 'pending'
  | 'baking'
  | 'out_for_delivery'
  | 'completed'
  | 'rejected';

export type ProductCategory = 'Cakes' | 'Bouquets';

export type ThemeMode = 'light' | 'dark';

export interface OrderItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  image: string;
  tags: string[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  completed: boolean;
  active?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerInitials: string;
  customerEmail: string;
  customerPhone: string;
  collectionTitle: string;
  summaryItem: string;
  dateDisplay: string;
  scheduledDelivery: string;
  deliveryVenue: string;
  deliveryAddress: string;
  distanceMiles: number;
  routeLabel: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  internalNote: string;
  isPriority?: boolean;
  timeline: TimelineEvent[];
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  sku: string;
  category: ProductCategory;
  price: number;
  stock: number;
  maxStock: number;
  soldThisWeek: number;
  image: string;
}

export interface Customer {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  lifetimeSpend: number;
  lastOrderDate: string;
  tier: 'VVIP Bridal' | 'Atelier Regular' | 'Seasonal Patron';
  favoriteItem: string;
}

export interface ChartDataPoint {
  label: string;
  completed: number;
  inProgress: number;
  revenue: number;
  target: number;
}

export interface DriverRoute {
  id: string;
  driverName: string;
  vehicle: string;
  stopsRemaining: number;
  etaMinutes: number;
  zone: string;
  orderId: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'order' | 'success' | 'info' | 'warning' | 'error';
  orderId?: string;
  customerName?: string;
  itemSummary?: string;
  amount?: number;
  durationMs?: number;
  createdAt?: number;
}
