import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Search,
} from 'lucide-react';
import { ArtisanalImage } from '../components/common/ArtisanalImage';
import { ProductFormModal } from '../components/modals/ProductFormModal';
import { useAppDispatch, useAppSelector } from '../store';
import {
  adjustProductStock,
  setInventoryCategory,
  setInventorySearch,
} from '../store/slices/inventorySlice';
import { Product, ProductCategory } from '../types';

const PAGE_SIZE = 6;

export const InventoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.inventory.items);
  const categoryFilter = useAppSelector((s) => s.inventory.categoryFilter);
  const searchQuery = useAppSelector((s) => s.inventory.searchQuery);
  const activeOrdersCount = useAppSelector(
    (s) =>
      s.orders.items.filter(
        (o) => o.status !== 'completed' && o.status !== 'rejected'
      ).length
  );

  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const cakesCount = products.filter((p) => p.category === 'Cakes').length;
  const bouquetsCount = products.filter((p) => p.category === 'Bouquets').length;
  const lowStockCount = products.filter((p) => p.stock <= 3).length;
  const totalValuation = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const catMatch =
        categoryFilter === 'All' || p.category === categoryFilter;
      const queryMatch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q);
      return catMatch && queryMatch;
    });
  }, [products, categoryFilter, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );
  const safePage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0f1f30] dark:text-[#eff6fc] tracking-tight">
            Product Inventory
          </h2>
          <p className="text-sm text-[#41566c] dark:text-[#b8cadc] mt-1">
            Manage your curated collection of artisanal cakes and bouquets.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="liquid-glass-accent text-white px-5 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all min-h-[44px] whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </header>

      {/* Stats Overview Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="liquid-glass rounded-2xl p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc]">
            Total SKUs
          </p>
          <h3 className="text-3xl sm:text-4xl font-serif text-[#0f5a8a] dark:text-[#7dd3fc] mt-2 tabular-nums">
            {products.length}
          </h3>
          <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-2">
            {cakesCount} Cakes · {bouquetsCount} Bouquets
          </p>
        </div>

        <div className="liquid-glass rounded-2xl p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc]">
            Low Stock
          </p>
          <h3 className="text-3xl sm:text-4xl font-serif text-amber-600 dark:text-amber-400 mt-2 tabular-nums">
            {lowStockCount}
          </h3>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-2 font-medium">
            Requires immediate attention
          </p>
        </div>

        <div className="liquid-glass rounded-2xl p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc]">
            Total Value
          </p>
          <h3 className="text-3xl sm:text-4xl font-serif text-[#0f1f30] dark:text-[#eff6fc] mt-2 tabular-nums">
            ${totalValuation.toLocaleString()}
          </h3>
          <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-2">
            +12% from last month
          </p>
        </div>

        <div className="liquid-glass-soft rounded-2xl p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc]">
            Active Orders
          </p>
          <h3 className="text-3xl sm:text-4xl font-serif text-[#0f5a8a] dark:text-[#7dd3fc] mt-2 tabular-nums">
            {activeOrdersCount}
          </h3>
          <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-2">
            Fulfillment in progress
          </p>
        </div>
      </section>

      {/* Inventory Table Card */}
      <section className="liquid-glass rounded-3xl overflow-hidden">
        <div className="px-5 sm:px-8 py-5 border-b border-[#0f5a8a]/10 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Cakes', 'Bouquets'] as (ProductCategory | 'All')[]).map(
              (cat) => {
                const count =
                  cat === 'All'
                    ? products.length
                    : cat === 'Cakes'
                    ? cakesCount
                    : bouquetsCount;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      dispatch(setInventoryCategory(cat));
                      setPage(1);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[38px] ${
                      categoryFilter === cat
                        ? 'liquid-glass-accent text-white'
                        : 'bg-white/45 dark:bg-white/5 text-[#41566c] dark:text-[#b8cadc] hover:bg-white/70 dark:hover:bg-white/10'
                    }`}
                  >
                    {cat === 'All' ? `All Items (${count})` : `${cat} (${count})`}
                  </button>
                );
              }
            )}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#41566c] dark:text-[#b8cadc]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                dispatch(setInventorySearch(e.target.value));
                setPage(1);
              }}
              placeholder="Search inventory..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/50 dark:bg-black/30 border border-[#0f5a8a]/15 dark:border-white/10 text-sm text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/35 dark:bg-black/20 text-[11px] uppercase tracking-widest font-bold text-[#41566c] dark:text-[#b8cadc]">
                <th className="px-8 py-4">Product</th>
                <th className="px-4 py-4">SKU</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">Stock</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0f5a8a]/10 dark:divide-white/10">
              {paginatedProducts.map((product) => {
                const isLow = product.stock <= 3;
                const fillPct = Math.min(
                  100,
                  Math.round((product.stock / Math.max(product.maxStock, 1)) * 100)
                );
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/60 dark:border-white/10">
                          <ArtisanalImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#0f1f30] dark:text-[#eff6fc]">
                            {product.name}
                          </p>
                          <p className="text-xs text-[#41566c] dark:text-[#b8cadc]">
                            {product.subtitle}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-[#41566c] dark:text-[#b8cadc]">
                      {product.sku}
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-[#41566c] dark:text-[#b8cadc]">
                      {product.category}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-[#0f1f30] dark:text-[#eff6fc] tabular-nums">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              adjustProductStock({ id: product.id, delta: -1 })
                            )
                          }
                          aria-label={`Decrease stock for ${product.name}`}
                          className="w-7 h-7 rounded-lg bg-white/55 dark:bg-white/10 flex items-center justify-center hover:bg-white dark:hover:bg-white/20"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <div className="w-14 h-1.5 bg-sky-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isLow
                                ? 'bg-amber-500'
                                : 'bg-[#0f5a8a] dark:bg-[#7dd3fc]'
                            }`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-bold tabular-nums w-6 ${
                            isLow
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-[#0f1f30] dark:text-[#eff6fc]'
                          }`}
                        >
                          {product.stock}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              adjustProductStock({ id: product.id, delta: 1 })
                            )
                          }
                          aria-label={`Increase stock for ${product.name}`}
                          className="w-7 h-7 rounded-lg bg-white/55 dark:bg-white/10 flex items-center justify-center hover:bg-white dark:hover:bg-white/20"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEditModal(product)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-[#0f5a8a] dark:text-[#7dd3fc] hover:bg-[#0f5a8a]/10 transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Inventory Cards */}
        <div className="md:hidden divide-y divide-[#0f5a8a]/10 dark:divide-white/10">
          {paginatedProducts.map((product) => {
            const isLow = product.stock <= 3;
            return (
              <div key={product.id} className="p-4 flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/60 dark:border-white/10">
                  <ArtisanalImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#0f1f30] dark:text-[#eff6fc] truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-[#41566c] dark:text-[#b8cadc]">
                    {product.sku} · {product.category}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-bold tabular-nums">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-[#41566c]">·</span>
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        isLow
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-[#0f5a8a] dark:text-[#7dd3fc]'
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openEditModal(product)}
                  className="px-3.5 py-2 rounded-xl liquid-glass-soft text-xs font-bold text-[#0f5a8a] dark:text-[#7dd3fc] min-h-[40px]"
                >
                  Edit
                </button>
              </div>
            );
          })}
        </div>

        {paginatedProducts.length === 0 && (
          <div className="p-12 text-center text-sm text-[#41566c] dark:text-[#b8cadc]">
            No products found matching your search.
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 sm:px-8 py-5 bg-white/35 dark:bg-black/20 border-t border-[#0f5a8a]/10 dark:border-white/10 flex items-center justify-between">
          <p className="text-xs text-[#41566c] dark:text-[#b8cadc] tabular-nums">
            Showing {paginatedProducts.length} of {filteredProducts.length} items
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
              className="w-10 h-10 rounded-xl liquid-glass-soft flex items-center justify-center disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold tabular-nums px-2">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
              className="w-10 h-10 rounded-xl liquid-glass-soft flex items-center justify-center disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <ProductFormModal
        isOpen={modalOpen}
        editingProduct={editingProduct}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
