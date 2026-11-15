import React, { useEffect, useState } from 'react';
import { Save, Trash2, X } from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { useAppDispatch } from '../../store';
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from '../../store/slices/inventorySlice';
import { addToast } from '../../store/slices/uiSlice';

interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  editingProduct,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Cakes');
  const [price, setPrice] = useState('65');
  const [stock, setStock] = useState('12');

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setSubtitle(editingProduct.subtitle);
      setSku(editingProduct.sku);
      setCategory(editingProduct.category);
      setPrice(String(editingProduct.price));
      setStock(String(editingProduct.stock));
    } else {
      setName('');
      setSubtitle('Seasonal Special');
      setSku(`CK-AR-${Math.floor(100 + Math.random() * 899)}`);
      setCategory('Cakes');
      setPrice('65');
      setStock('10');
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const numericPrice = Math.max(1, Number(price) || 45);
    const numericStock = Math.max(0, Math.floor(Number(stock) || 0));

    if (editingProduct) {
      dispatch(
        updateProduct({
          id: editingProduct.id,
          name: name.trim(),
          subtitle: subtitle.trim(),
          sku: sku.trim(),
          category,
          price: numericPrice,
          stock: numericStock,
        })
      );
      dispatch(
        addToast({
          title: 'Product Updated',
          description: `${name.trim()} saved to inventory.`,
          variant: 'success',
        })
      );
    } else {
      dispatch(
        addProduct({
          name: name.trim(),
          subtitle: subtitle.trim(),
          sku: sku.trim(),
          category,
          price: numericPrice,
          stock: numericStock,
        })
      );
      dispatch(
        addToast({
          title: 'Product Added',
          description: `${name.trim()} is now live in inventory.`,
          variant: 'success',
        })
      );
    }
    onClose();
  };

  const handleDelete = () => {
    if (!editingProduct) return;
    dispatch(deleteProduct(editingProduct.id));
    dispatch(
      addToast({
        title: 'Product Removed',
        description: `${editingProduct.name} removed from catalog.`,
        variant: 'info',
      })
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
    >
      <div
        className="absolute inset-0 bg-[#0c1b2e]/55 dark:bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative liquid-glass w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 sm:p-8">
        <div className="w-10 h-1.5 bg-[#0f5a8a]/25 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2
              id="product-form-title"
              className="font-serif text-2xl text-[#0f1f30] dark:text-[#eff6fc]"
            >
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-1">
              Update bakery catalog details and live kitchen stock.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-[#41566c] dark:text-[#b8cadc] hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lavender Honey Tart"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
                Collection / Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
                SKU Code
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-sm font-mono text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
              >
                <option value="Cakes">Cakes</option>
                <option value="Bouquets">Bouquets</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
                Price ($)
              </label>
              <input
                type="number"
                min={1}
                step="0.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-sm tabular-nums text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
                Stock Qty
              </label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-sm tabular-nums text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-4">
            {editingProduct ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 flex items-center gap-1.5 min-h-[44px]"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#41566c] dark:text-[#b8cadc] hover:bg-black/5 dark:hover:bg-white/10 min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="liquid-glass-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all min-h-[44px]"
              >
                <Save className="w-4 h-4" />
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
