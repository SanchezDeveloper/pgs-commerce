import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductType } from "./types/ProductType";


type CartState = {
    cart: ProductType[];
    addProduct: (product: ProductType) => void;
    removeProduct: (product: ProductType) => void;
    isOpen: boolean;
    toggleCart : () => void;
    onCheckout: string;
    setCheckout: (checkout: string) => void;
    proceedToCheckout: () => void;
    paymentIntent: string;
    setPaymentIntent: (paymentIntent: string) => void;
};

export const useCartStore = create<CartState>()(
    persist((set) => ({
      cart: [],
      addProduct: (item) =>
        set((state) => {
          const product = state.cart.find((p) => p.id === item.id);
          if (product) {
            const updatedCart = state.cart.map((p) => {
              if (p.id === item.id) {
                return { ...p, quantity: p.quantity ? p.quantity + 1 : 1 };
              }
              return p;
            });
            return { cart: updatedCart };
          } else {
            return { cart: [...state.cart, { ...item, quantity: 1 }] };
          }
        }),
      removeProduct: (item) =>
        set((state) => {
          const existingProduct = state.cart.find((p) => p.id === item.id);
  
          if (existingProduct && existingProduct.quantity! > 1) {
            const updatedCart = state.cart.map((p) => {
              if (p.id === item.id) {
                return { ...p, quantity: p.quantity! - 1 };
              }
              return p;
            });
            return { cart: updatedCart };
          } else {
            const filteredCart = state.cart.filter((p) => p.id !== item.id);
            return { cart: filteredCart };
          }
        }),
      isOpen: false,
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      onCheckout: 'cart',
      setCheckout: (checkout) => {
        console.log('Setando checkout para: ', checkout); // Adicionando log
        set(() => ({ onCheckout: checkout }));
      },
      proceedToCheckout: () => {
        console.log('Indo para o checkout'); // Log para verificar se o fluxo chega aqui
        set(() => ({ onCheckout: 'checkout' }));
      },
      paymentIntent: '',
      setPaymentIntent: (paymentIntent) => set(() => ({ paymentIntent })),
    }),
    { name: 'cart-storage' })
  );
  