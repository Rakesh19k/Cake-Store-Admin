import React, { useEffect, useRef } from 'react';
import {
  BarChart3,
  Bell,
  LayoutDashboard,
  LogOut,
  Moon,
  Package,
  Plus,
  ReceiptText,
  Settings,
  Sun,
  Users,
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { simulateIncomingOrder } from '../../store/slices/ordersSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import {
  setNewOrderModalOpen,
  setPriorityModalOpen,
} from '../../store/slices/uiSlice';
import { ArtisanalImage } from '../common/ArtisanalImage';
import { AssistanceModal } from '../modals/AssistanceModal';
import { NewOrderModal } from '../modals/NewOrderModal';
import { PriorityOrderModal } from '../modals/PriorityOrderModal';
import { ToastContainer } from '../common/ToastContainer';

interface AppShellProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory', Icon: Package },
  { to: '/orders', label: 'Orders', Icon: ReceiptText },
  { to: '/customers', label: 'Customers', Icon: Users },
  { to: '/reports', label: 'Reports', Icon: BarChart3 },
  { to: '/settings', label: 'Settings', Icon: Settings },
];

const MOBILE_NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/orders', label: 'Orders', Icon: ReceiptText },
  { to: '/inventory', label: 'Inventory', Icon: Package },
  { to: '/reports', label: 'Reports', Icon: BarChart3 },
  { to: '/settings', label: 'Settings', Icon: Settings },
];

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const themeMode = useAppSelector((s) => s.theme.mode);
  const user = useAppSelector((s) => s.auth.user);
  const orders = useAppSelector((s) => s.orders.items);
  const liveOrderAlertsEnabled = useAppSelector(
    (s) => s.ui.liveOrderAlertsEnabled
  );
  const initialToastSent = useRef(false);

  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  useEffect(() => {
    if (initialToastSent.current || !liveOrderAlertsEnabled) return;
    initialToastSent.current = true;

    try {
      if (window.sessionStorage.getItem('sonali-initial-order-toast')) {
        return;
      }
    } catch {
      // ignore storage errors
    }

    const timer = window.setTimeout(() => {
      dispatch(simulateIncomingOrder());
      try {
        window.sessionStorage.setItem('sonali-initial-order-toast', '1');
      } catch {
        // ignore storage errors
      }
    }, 2400);

    return () => window.clearTimeout(timer);
  }, [dispatch, liveOrderAlertsEnabled]);

  const getPageTitle = () => {
    if (location.pathname.startsWith('/orders/')) return 'Order Details';
    if (location.pathname.startsWith('/orders')) return 'Order Management';
    if (location.pathname.startsWith('/inventory')) return 'Product Inventory';
    if (location.pathname.startsWith('/customers')) return 'Patron Directory';
    if (location.pathname.startsWith('/reports')) return 'Analytics & Reports';
    if (location.pathname.startsWith('/settings')) return 'Portal Settings';
    return 'Bakery Overview';
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative liquid-canvas-bg text-[#0f1f30] dark:text-[#eff6fc] transition-colors duration-300">
      {/* Ambient Liquid Refraction Orbs (Sky, Seafoam, Periwinkle) */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <div className="absolute -top-28 left-[8%] w-[34rem] h-[34rem] rounded-full bg-sky-300/45 dark:bg-sky-600/30 blur-[95px]" />
        <div className="absolute top-[18%] right-[4%] w-[38rem] h-[38rem] rounded-full bg-teal-200/50 dark:bg-teal-600/25 blur-[110px]" />
        <div className="absolute top-[48%] left-[38%] w-[30rem] h-[30rem] rounded-full bg-indigo-200/45 dark:bg-indigo-700/25 blur-[105px]" />
        <div className="absolute bottom-[-10%] left-[18%] w-[32rem] h-[32rem] rounded-full bg-cyan-200/45 dark:bg-cyan-700/25 blur-[100px]" />
      </div>

      {/* Fixed Desktop Liquid Glass Sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-4 bottom-4 left-4 w-64 z-40">
        <div className="liquid-glass-nav rounded-3xl h-full flex flex-col p-5">
          <div className="mb-7 px-2">
            <h1 className="font-serif text-xl font-bold text-[#0f5a8a] dark:text-[#7dd3fc] leading-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-0.5">
              Sonali Cakes Management
            </p>
          </div>

          <nav
            className="flex flex-col gap-1.5 flex-1 overflow-y-auto"
            aria-label="Primary navigation"
          >
            {NAV_ITEMS.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'liquid-glass-accent text-white font-semibold'
                      : 'text-[#41566c] dark:text-[#b8cadc] hover:bg-white/45 dark:hover:bg-white/10 hover:text-[#0f1f30] dark:hover:text-white'
                  }`
                }
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 pt-4 border-t border-white/50 dark:border-white/15 space-y-3">
            <button
              type="button"
              onClick={() => dispatch(setNewOrderModalOpen(true))}
              className="w-full liquid-glass-accent text-white py-3 px-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">New Order</span>
            </button>

            <div className="liquid-glass-soft rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/60 dark:border-white/20">
                <ArtisanalImage
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0f1f30] dark:text-[#eff6fc] truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-[#41566c] dark:text-[#b8cadc] truncate">
                  {user.role}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                title="Switch Account / Login Screen"
                aria-label="Sign out to login screen"
                className="p-2 rounded-xl text-[#41566c] dark:text-[#b8cadc] hover:bg-white/45 dark:hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Fixed Top Glass Navbar (Mobile & Desktop) */}
      <header className="fixed top-3 left-0 right-0 lg:top-4 lg:left-[272px] z-30 pointer-events-none">
        <div className="max-w-[1440px] w-full mx-auto px-3 sm:px-6 lg:px-8">
          <div className="pointer-events-auto liquid-glass-nav rounded-2xl h-14 px-4 sm:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="lg:hidden font-serif font-bold text-base text-[#0f5a8a] dark:text-[#7dd3fc] whitespace-nowrap">
                Sonali Cakes
              </span>
              <span className="hidden lg:inline-block text-sm font-semibold text-[#41566c] dark:text-[#b8cadc] truncate">
                {getPageTitle()}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => dispatch(setPriorityModalOpen(true))}
                aria-label="Review priority order notifications"
                className="relative min-h-[40px] min-w-[40px] px-2.5 rounded-xl flex items-center justify-center gap-1.5 text-[#41566c] dark:text-[#b8cadc] hover:bg-white/45 dark:hover:bg-white/10 transition-colors"
              >
                <Bell className="w-[18px] h-[18px]" />
                {pendingCount > 0 && (
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-[#0f5a8a] text-white tabular-nums leading-none">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => dispatch(toggleTheme())}
                aria-label={
                  themeMode === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                }
                className="min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center text-[#41566c] dark:text-[#b8cadc] hover:bg-white/45 dark:hover:bg-white/10 transition-colors"
              >
                {themeMode === 'dark' ? (
                  <Sun className="w-[18px] h-[18px] text-amber-300" />
                ) : (
                  <Moon className="w-[18px] h-[18px]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => dispatch(setNewOrderModalOpen(true))}
                aria-label="Create new order"
                className="lg:hidden min-h-[40px] min-w-[40px] rounded-xl liquid-glass-accent text-white flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area (Offset cleanly for Fixed Sidebar & Fixed Top Navbar) */}
      <div className="relative z-10 lg:pl-[272px] pt-[76px] lg:pt-[84px] pb-24 lg:pb-12">
        <main className="px-3 sm:px-6 lg:px-8 pt-2 max-w-[1440px] w-full mx-auto">
          {children}

          <footer className="mt-16 pt-8 border-t border-white/50 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#41566c] dark:text-[#b8cadc]">
            <div>
              <p className="font-serif italic text-lg text-[#0f5a8a] dark:text-[#7dd3fc]">
                Sonali Cakes
              </p>
              <p className="mt-1">
                © 2024 Sonali Cakes · Artisanal Confections & Floral Design
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <NavLink
                to="/orders"
                className="hover:text-[#0f5a8a] dark:hover:text-[#7dd3fc] transition-colors"
              >
                Orders
              </NavLink>
              <NavLink
                to="/inventory"
                className="hover:text-[#0f5a8a] dark:hover:text-[#7dd3fc] transition-colors"
              >
                Inventory
              </NavLink>
              <NavLink
                to="/reports"
                className="hover:text-[#0f5a8a] dark:hover:text-[#7dd3fc] transition-colors"
              >
                Reports
              </NavLink>
              <NavLink
                to="/login"
                className="hover:text-[#0f5a8a] dark:hover:text-[#7dd3fc] transition-colors"
              >
                Portal Login
              </NavLink>
            </div>
          </footer>
        </main>
      </div>

      {/* Fixed Mobile Bottom Glass Tab Bar */}
      <nav
        className="lg:hidden fixed bottom-2.5 left-0 right-0 z-40 pointer-events-none"
        aria-label="Mobile navigation"
      >
        <div className="max-w-[1440px] w-full mx-auto px-3 sm:px-6">
          <div className="pointer-events-auto liquid-glass-nav rounded-2xl grid grid-cols-5 items-center h-14">
            {MOBILE_NAV_ITEMS.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center min-h-[44px] text-[10px] font-medium transition-colors ${
                    isActive
                      ? 'text-[#0f5a8a] dark:text-[#7dd3fc] font-bold'
                      : 'text-[#41566c] dark:text-[#b8cadc]'
                  }`
                }
              >
                <Icon className="w-[18px] h-[18px] mb-0.5" />
                <span className="truncate max-w-[60px]">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <PriorityOrderModal />
      <NewOrderModal />
      <AssistanceModal />
      <ToastContainer />
    </div>
  );
};
