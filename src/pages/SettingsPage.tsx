import React, { useState } from 'react';
import { BellRing, LogOut, Moon, Save, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ArtisanalImage } from '../components/common/ArtisanalImage';
import { useAppDispatch, useAppSelector } from '../store';
import { logout, updateProfile } from '../store/slices/authSlice';
import { simulateIncomingOrder } from '../store/slices/ordersSlice';
import { setTheme } from '../store/slices/themeSlice';
import {
  addToast,
  setLiveOrderAlertsEnabled,
} from '../store/slices/uiSlice';

export const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeMode = useAppSelector((s) => s.theme.mode);
  const user = useAppSelector((s) => s.auth.user);
  const liveOrderAlertsEnabled = useAppSelector(
    (s) => s.ui.liveOrderAlertsEnabled
  );

  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [email, setEmail] = useState(user.email);
  const [dailyOvenCap, setDailyOvenCap] = useState(36);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile({ name, role, email }));
    dispatch(
      addToast({
        title: 'Settings Saved',
        description: 'Chef profile and studio preferences updated.',
        variant: 'success',
      })
    );
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#0f1f30] dark:text-[#eff6fc]">
          Portal Settings
        </h2>
        <p className="text-sm text-[#41566c] dark:text-[#b8cadc] mt-1">
          Appearance theme, pastry studio capacity, and account preferences.
        </p>
      </header>

      {/* Theme Appearance Card */}
      <section className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-5">
        <div>
          <h3 className="font-serif text-xl text-[#0f1f30] dark:text-[#eff6fc]">
            Appearance &amp; Liquid Glass Theme
          </h3>
          <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-1">
            Switch between Coastal Mist Light and Midnight Sapphire Dark modes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => dispatch(setTheme('light'))}
            className={`p-5 rounded-2xl text-left flex items-center gap-4 border transition-all min-h-[68px] ${
              themeMode === 'light'
                ? 'liquid-glass-accent text-white border-transparent'
                : 'liquid-glass-soft text-[#0f1f30] dark:text-[#eff6fc]'
            }`}
          >
            <Sun className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold text-sm">Coastal Mist Glass</p>
              <p className="text-xs opacity-80">Frosted ice &amp; ocean sapphire</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => dispatch(setTheme('dark'))}
            className={`p-5 rounded-2xl text-left flex items-center gap-4 border transition-all min-h-[68px] ${
              themeMode === 'dark'
                ? 'liquid-glass-accent text-white border-transparent'
                : 'liquid-glass-soft text-[#0f1f30] dark:text-[#eff6fc]'
            }`}
          >
            <Moon className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold text-sm">Midnight Sapphire Glass</p>
              <p className="text-xs opacity-80">Deep navy &amp; glacier sky</p>
            </div>
          </button>
        </div>
      </section>

      {/* Profile & Studio Config */}
      <form
        onSubmit={handleSaveProfile}
        className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#0f5a8a]/20 shrink-0">
            <ArtisanalImage
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-serif text-xl text-[#0f1f30] dark:text-[#eff6fc]">
              Chef Profile
            </h3>
            <p className="text-xs text-[#41566c] dark:text-[#b8cadc]">
              Displayed on order tickets and internal baker notes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/15 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
              Title / Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/15 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
              Portal Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/15 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
              Daily Oven Capacity (Orders)
            </label>
            <input
              type="number"
              min={10}
              max={120}
              value={dailyOvenCap}
              onChange={(e) => setDailyOvenCap(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/15 dark:border-white/15 text-sm tabular-nums text-[#0f1f30] dark:text-[#eff6fc]"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl liquid-glass-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className="flex items-center gap-3 cursor-pointer flex-1">
            <input
              type="checkbox"
              checked={liveOrderAlertsEnabled}
              onChange={(e) =>
                dispatch(setLiveOrderAlertsEnabled(e.target.checked))
              }
              className="w-5 h-5 accent-[#0f5a8a] shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-[#0f1f30] dark:text-[#eff6fc]">
                Live New Order Toast Alerts
              </p>
              <p className="text-xs text-[#41566c] dark:text-[#b8cadc]">
                Display liquid glass toast notifications whenever a new boutique order arrives.
              </p>
            </div>
          </label>
          <button
            type="button"
            onClick={() => dispatch(simulateIncomingOrder())}
            className="px-3.5 py-2 rounded-xl liquid-glass text-xs font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] flex items-center gap-1.5 whitespace-nowrap shrink-0 min-h-[38px]"
          >
            <BellRing className="w-3.5 h-3.5" />
            Test Order Toast
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => {
              dispatch(logout());
              navigate('/login');
            }}
            className="px-4 py-2.5 rounded-xl border border-[#0f5a8a]/25 dark:border-white/15 text-sm font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] flex items-center gap-2 hover:bg-[#0f5a8a]/10 min-h-[44px]"
          >
            <LogOut className="w-4 h-4" />
            Sign Out to Login Screen
          </button>

          <button
            type="submit"
            className="liquid-glass-accent text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
