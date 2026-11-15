import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { createOrderWithToast } from '../../store/slices/ordersSlice';
import { setNewOrderModalOpen } from '../../store/slices/uiSlice';

export const NewOrderModal: React.FC = () => {
  const isOpen = useAppSelector((s) => s.ui.newOrderModalOpen);
  const products = useAppSelector((s) => s.inventory.items);
  const dispatch = useAppDispatch();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(
    products[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [deliveryVenue, setDeliveryVenue] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [scheduledDelivery, setScheduledDelivery] = useState('Oct 27, 2024');

  if (!isOpen) return null;

  const chosenProduct =
    products.find((p) => p.id === selectedProductId) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !chosenProduct) return;

    dispatch(
      createOrderWithToast({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        itemName: chosenProduct.name,
        itemDescription: chosenProduct.subtitle,
        quantity,
        unitPrice: chosenProduct.price,
        deliveryVenue: deliveryVenue.trim(),
        deliveryAddress: deliveryAddress.trim(),
        scheduledDelivery,
        image: chosenProduct.image,
      })
    );
    dispatch(setNewOrderModalOpen(false));
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setQuantity(1);
    setDeliveryVenue('');
    setDeliveryAddress('');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-order-title"
    >
      <div
        className="absolute inset-0 bg-[#0c1b2e]/55 dark:bg-black/70 backdrop-blur-md"
        onClick={() => dispatch(setNewOrderModalOpen(false))}
      />

      <div className="relative liquid-glass w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1.5 bg-[#0f5a8a]/25 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2
              id="new-order-title"
              className="font-serif text-2xl text-[#0f1f30] dark:text-[#eff6fc]"
            >
              New Custom Order
            </h2>
            <p className="text-xs text-[#41566c] dark:text-[#b8cadc] mt-1">
              Register a bespoke cake or floral bouquet commission.
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(setNewOrderModalOpen(false))}
            aria-label="Close modal"
            className="p-2 rounded-xl text-[#41566c] dark:text-[#b8cadc] hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Clara Vance"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1 (555) 204-8821"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
              Customer Email
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="clara@atelier.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
                Select Creation
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
              >
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} (${prod.price})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                min={1}
                max={25}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
                Delivery Venue
              </label>
              <input
                type="text"
                value={deliveryVenue}
                onChange={(e) => setDeliveryVenue(e.target.value)}
                placeholder="e.g. Gramercy Loft"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
                Scheduled Delivery
              </label>
              <input
                type="text"
                value={scheduledDelivery}
                onChange={(e) => setScheduledDelivery(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#41566c] dark:text-[#b8cadc] mb-1.5">
              Street Address
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="482 Oakwood Terrace, New York, NY"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/55 dark:bg-black/30 border border-[#0f5a8a]/20 dark:border-white/15 text-sm text-[#0f1f30] dark:text-[#eff6fc] focus:outline-none focus:ring-2 focus:ring-[#0f5a8a]/40"
            />
          </div>

          {chosenProduct && (
            <div className="liquid-glass-soft rounded-xl p-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#41566c] dark:text-[#b8cadc]">
                Estimated Order Total
              </span>
              <span className="text-xl font-serif font-bold text-[#0f5a8a] dark:text-[#7dd3fc] tabular-nums">
                ${(chosenProduct.price * quantity).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => dispatch(setNewOrderModalOpen(false))}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#41566c] dark:text-[#b8cadc] hover:bg-black/5 dark:hover:bg-white/10 min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="liquid-glass-accent text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
