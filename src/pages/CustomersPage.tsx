import React, { useMemo, useState } from 'react';
import { Mail, MapPin, Phone, Search, Sparkles } from 'lucide-react';
import { INITIAL_CUSTOMERS } from '../data/seedData';
import { Customer } from '../types';

export const CustomersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'All' | Customer['tier']>('All');

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return INITIAL_CUSTOMERS.filter((c) => {
      const tierOk = tierFilter === 'All' || c.tier === tierFilter;
      const queryOk =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q);
      return tierOk && queryOk;
    });
  }, [search, tierFilter]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0f1f30] dark:text-[#eff6fc]">
            Patron Directory
          </h2>
          <p className="text-sm text-[#41566c] dark:text-[#b8cadc] mt-1">
            Bridal clients, gallery collectors, and repeat confectionery patrons.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#41566c] dark:text-[#b8cadc]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patron name or city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 dark:bg-black/30 border border-[#0f5a8a]/15 dark:border-white/10 text-sm text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
          />
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {(
          ['All', 'VVIP Bridal', 'Atelier Regular', 'Seasonal Patron'] as const
        ).map((tier) => (
          <button
            key={tier}
            type="button"
            onClick={() => setTierFilter(tier)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 min-h-[40px] ${
              tierFilter === tier
                ? 'liquid-glass-accent text-white'
                : 'liquid-glass-soft text-[#41566c] dark:text-[#b8cadc]'
            }`}
          >
            {tier}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="liquid-glass rounded-2xl p-6 flex flex-col justify-between space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-sky-200/75 dark:bg-sky-500/30 flex items-center justify-center font-serif font-bold text-[#0f4c75] dark:text-[#bae6fd] shrink-0">
                  {customer.initials}
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#0f1f30] dark:text-[#eff6fc]">
                    {customer.name}
                  </h3>
                  <p className="text-xs text-[#0f5a8a] dark:text-[#7dd3fc] font-semibold">
                    {customer.tier}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-[#0f1f30] dark:text-[#eff6fc] tabular-nums">
                ${customer.lifetimeSpend.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2 text-xs text-[#41566c] dark:text-[#b8cadc]">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{customer.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>{customer.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{customer.city}</span>
              </p>
              <p className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#0f5a8a] dark:text-[#7dd3fc]" />
                <span>Favorite: {customer.favoriteItem}</span>
              </p>
            </div>

            <div className="pt-4 border-t border-[#0f5a8a]/10 dark:border-white/10 flex items-center justify-between text-xs text-[#41566c] dark:text-[#b8cadc] tabular-nums">
              <span>{customer.totalOrders} orders placed</span>
              <span>Last: {customer.lastOrderDate}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
