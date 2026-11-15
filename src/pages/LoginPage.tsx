import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Moon, Sun, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../data/seedData';
import { useAppDispatch, useAppSelector } from '../store';
import { login } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import { addToast } from '../store/slices/uiSlice';
import { ArtisanalImage } from '../components/common/ArtisanalImage';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeMode = useAppSelector((s) => s.theme.mode);

  const [email, setEmail] = useState('admin@sonalicakes.com');
  const [password, setPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotNotice, setForgotNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, rememberMe }));
    dispatch(
      addToast({
        title: 'Welcome Back',
        description: 'Signed into The Artisanal Layer admin workspace.',
        variant: 'success',
      })
    );
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8 liquid-canvas-bg text-[#0f1f30] dark:text-[#eff6fc] overflow-hidden">
      {/* Ambient Liquid Glass Orbs */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-[8%] left-[6%] w-72 h-72 bg-sky-300/45 dark:bg-sky-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[12%] right-[8%] w-80 h-80 bg-teal-200/50 dark:bg-teal-600/30 rounded-full blur-3xl" />
      </div>

      {/* Theme Switch */}
      <button
        type="button"
        onClick={() => dispatch(toggleTheme())}
        aria-label="Toggle color theme"
        className="fixed top-4 right-4 z-20 liquid-glass min-h-[44px] min-w-[44px] rounded-2xl flex items-center justify-center text-[#41566c] dark:text-[#eff6fc] hover:scale-105 transition-transform"
      >
        {themeMode === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-300" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>

      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl liquid-glass">
        {/* Left Visual Hero */}
        <section className="relative lg:col-span-7 min-h-[260px] lg:min-h-[660px] overflow-hidden bg-[#0c2e4a]">
          <ArtisanalImage
            src={IMAGES.loginHeroCake}
            alt="Minimalist tiered wedding cake with artisanal botanical detailing"
            className="absolute inset-0 w-full h-full object-cover opacity-85 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08192b]/88 via-[#0e395c]/52 to-[#165985]/30 backdrop-blur-[2px]" />

          <div className="relative z-10 h-full p-8 sm:p-12 lg:p-16 flex flex-col justify-between text-white">
            <div>
              <span className="text-xs tracking-[0.2em] uppercase text-sky-200 font-semibold block mb-3">
                Est. 2024
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-balance">
                The Artisanal <br />
                <span className="italic font-light">Layer</span>
              </h1>
            </div>

            <div className="space-y-4 mt-8">
              <p className="text-white/90 text-base sm:text-lg max-w-sm leading-relaxed">
                Curating sweetness through intentional design and the finest ingredients.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-white/40" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/75">
                  Bakery Management Suite
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Form Canvas */}
        <section className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white/35 dark:bg-[#0c1a2a]/45 backdrop-blur-2xl">
          <div className="mb-9">
            <h2 className="font-serif text-3xl text-[#0f1f30] dark:text-[#eff6fc] mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-[#41566c] dark:text-[#b8cadc]">
              Please enter your credentials to access the gallery admin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label
                htmlFor="identity"
                className="block text-[11px] font-semibold uppercase tracking-widest text-[#41566c] dark:text-[#b8cadc] mb-2"
              >
                Email or Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-[#647b92] dark:text-[#b8cadc]" />
                <input
                  id="identity"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sonalicakes.com"
                  className="w-full pl-7 py-3 bg-transparent border-0 border-b border-[#94b2ce] dark:border-white/20 focus:border-[#0f5a8a] dark:focus:border-[#7dd3fc] focus:outline-none text-sm text-[#0f1f30] dark:text-[#eff6fc]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-[11px] font-semibold uppercase tracking-widest text-[#41566c] dark:text-[#b8cadc]"
                >
                  Secret Phrase
                </label>
                <button
                  type="button"
                  onClick={() => setForgotNotice((prev) => !prev)}
                  className="text-xs font-semibold text-[#0f5a8a] dark:text-[#7dd3fc] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-[#647b92] dark:text-[#b8cadc]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-7 pr-9 py-3 bg-transparent border-0 border-b border-[#94b2ce] dark:border-white/20 focus:border-[#0f5a8a] dark:focus:border-[#7dd3fc] focus:outline-none text-sm text-[#0f1f30] dark:text-[#eff6fc]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-[#647b92] dark:text-[#b8cadc] hover:text-[#0f5a8a]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {forgotNotice && (
                <p className="mt-2 text-xs text-[#0f5a8a] dark:text-[#7dd3fc]">
                  Demo mode active: enter any passphrase or click Sign Into Dashboard.
                </p>
              )}
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only peer"
              />
              <span className="w-10 h-5 rounded-full bg-sky-200 dark:bg-white/15 peer-checked:bg-[#0f5a8a] relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
              <span className="text-xs text-[#41566c] dark:text-[#b8cadc]">
                Keep me authenticated
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3.5 px-6 liquid-glass-accent text-white rounded-xl font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition-all min-h-[48px]"
            >
              Sign Into Dashboard
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-[#0f5a8a]/10 dark:border-white/10">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#41566c] dark:text-[#b8cadc]">
              Authorized Artisanal Access
            </p>
            <p className="text-xs text-[#41566c]/80 dark:text-[#b8cadc]/75 mt-1.5 leading-relaxed">
              Restricted to Sonali Cakes bakery management and pastry design personnel.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
