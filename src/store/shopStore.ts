import { create } from 'zustand'

interface CartItem {
  id: number;
  quantity: number;
}

interface ShopState {
  favorites: number[];
  cart: CartItem[];
  toggleFavorite: (productId: number) => void;
  setFavorites: (favoriteIds: number[]) => void;
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

export const useShopStore = create<ShopState>((set) => ({
  favorites: [],
  cart: [],
  setFavorites: (favoriteIds) => set({ favorites: favoriteIds }),
  toggleFavorite: (productId) =>
    set((state) => ({
      favorites: state.favorites.includes(productId)
        ? state.favorites.filter((id) => id !== productId)
        : [...state.favorites, productId],
    })),
  addToCart: (productId) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === productId)
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      } else {
        return { cart: [...state.cart, { id: productId, quantity: 1 }] }
      }
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),
  clearCart: () => set({ cart: [] }),
}))
