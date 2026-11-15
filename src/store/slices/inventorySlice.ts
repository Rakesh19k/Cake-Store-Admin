import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_PRODUCTS, IMAGES } from '../../data/seedData';
import { Product, ProductCategory } from '../../types';

interface InventoryState {
  items: Product[];
  categoryFilter: ProductCategory | 'All';
  searchQuery: string;
}

const initialState: InventoryState = {
  items: INITIAL_PRODUCTS,
  categoryFilter: 'All',
  searchQuery: '',
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventoryCategory(
      state,
      action: PayloadAction<ProductCategory | 'All'>
    ) {
      state.categoryFilter = action.payload;
    },
    setInventorySearch(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    adjustProductStock(
      state,
      action: PayloadAction<{ id: string; delta: number }>
    ) {
      const product = state.items.find((p) => p.id === action.payload.id);
      if (product) {
        product.stock = Math.max(
          0,
          Math.min(product.maxStock + 20, product.stock + action.payload.delta)
        );
      }
    },
    addProduct(
      state,
      action: PayloadAction<{
        name: string;
        subtitle: string;
        sku: string;
        category: ProductCategory;
        price: number;
        stock: number;
      }>
    ) {
      const p = action.payload;
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: p.name,
        subtitle: p.subtitle || 'Artisanal Creation',
        sku: p.sku || `SC-${Math.floor(100 + Math.random() * 900)}`,
        category: p.category,
        price: p.price,
        stock: p.stock,
        maxStock: Math.max(p.stock, 20),
        soldThisWeek: 0,
        image:
          p.category === 'Bouquets'
            ? IMAGES.midnightPeonies
            : IMAGES.roseLychee,
      };
      state.items.unshift(newProduct);
    },
    updateProduct(
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        subtitle: string;
        sku: string;
        category: ProductCategory;
        price: number;
        stock: number;
      }>
    ) {
      const existing = state.items.find((p) => p.id === action.payload.id);
      if (existing) {
        existing.name = action.payload.name;
        existing.subtitle = action.payload.subtitle;
        existing.sku = action.payload.sku;
        existing.category = action.payload.category;
        existing.price = action.payload.price;
        existing.stock = action.payload.stock;
        existing.maxStock = Math.max(existing.maxStock, action.payload.stock);
      }
    },
    deleteProduct(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
  },
});

export const {
  setInventoryCategory,
  setInventorySearch,
  adjustProductStock,
  addProduct,
  updateProduct,
  deleteProduct,
} = inventorySlice.actions;

export default inventorySlice.reducer;
