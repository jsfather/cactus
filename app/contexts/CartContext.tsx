'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

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
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, change: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to convert Persian digits to English and extract numeric value
function parsePrice(price: string): number {
  // Convert Persian digits to English digits
  const persianToEnglish: { [key: string]: string } = {
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
  };
  
  let englishPrice = price;
  Object.keys(persianToEnglish).forEach(persian => {
    englishPrice = englishPrice.replace(new RegExp(persian, 'g'), persianToEnglish[persian]);
  });
  
  // Remove all non-digit characters and convert to number
  const numericValue = parseInt(englishPrice.replace(/[^0-9]/g, ''));
  return isNaN(numericValue) ? 0 : numericValue;
}

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
            (state.totalPrice || 0) + parsePrice(action.payload.price),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        totalItems: state.totalItems + 1,
        totalPrice:
          (state.totalPrice || 0) + parsePrice(action.payload.price),
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
          (state.totalPrice || 0) -
          parsePrice(itemToRemove.price) * itemToRemove.quantity,
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
          (state.totalPrice || 0) +
          parsePrice(item.price) * action.payload.change,
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
}

// Get initial state from localStorage or use default
function getInitialState(): CartState {
  if (typeof window === 'undefined') {
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };
  }

  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      const parsed = JSON.parse(savedCart);
      // Validate the parsed data structure
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
        // Recalculate total price and items to fix any NaN values
        const totalItems = parsed.items.reduce((sum: number, item: CartItem) => sum + (item.quantity || 0), 0);
        const totalPrice = parsed.items.reduce((sum: number, item: CartItem) => {
          const price = parsePrice(item.price);
          return sum + (price * (item.quantity || 0));
        }, 0);
        
        return {
          items: parsed.items || [],
          totalItems,
          totalPrice,
        };
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
    }
  }

  return {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    const existingItem = state.items.find(
      (cartItem) => cartItem.id === item.id
    );

    dispatch({ type: 'ADD_ITEM', payload: item });
    
    if (existingItem) {
      toast.success(`تعداد ${item.title} در سبد خرید افزایش یافت`);
    } else {
      toast.success(`${item.title} به سبد خرید اضافه شد`);
    }
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
