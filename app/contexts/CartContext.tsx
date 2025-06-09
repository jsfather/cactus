'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

interface CartItem {
  id: number;
  title: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; change: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, change: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalItems: state.totalItems + 1,
          totalPrice:
            state.totalPrice +
            parseInt(action.payload.price.replace(/[^0-9]/g, '')),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        totalItems: state.totalItems + 1,
        totalPrice:
          state.totalPrice +
          parseInt(action.payload.price.replace(/[^0-9]/g, '')),
      };
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (!itemToRemove) return state;

      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice:
          state.totalPrice -
          parseInt(itemToRemove.price.replace(/[^0-9]/g, '')) *
            itemToRemove.quantity,
      };
    }

    case 'UPDATE_QUANTITY': {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (!item) return state;

      const newQuantity = item.quantity + action.payload.change;
      if (newQuantity < 1) return state;

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: newQuantity }
            : item
        ),
        totalItems: state.totalItems + action.payload.change,
        totalPrice:
          state.totalPrice +
          parseInt(item.price.replace(/[^0-9]/g, '')) * action.payload.change,
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      Object.assign(state, parsedCart);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: number, change: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, change } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
