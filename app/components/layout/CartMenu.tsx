'use client';

import { useState, useRef, useEffect } from 'react';
import { ShoppingBasket, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/contexts/CartContext';

export function CartMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { state, removeItem, updateQuantity } = useCart();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <ShoppingBasket className="h-5 w-5" />
        {state.totalItems > 0 && (
          <span className="bg-primary-600 absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
            {state.totalItems}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-2 w-80 origin-top-left rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
          >
            <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              سبد خرید
            </div>

            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <ShoppingBasket className="mb-2 h-12 w-12 text-gray-400 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400">سبد خرید شما خالی است</p>
              </div>
            ) : (
              <>
                <div className="mb-4 space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </h4>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-[20px] text-center text-sm text-gray-600 dark:text-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm font-medium text-gray-900 dark:text-white">
                    <span>مجموع</span>
                    <span>{state.totalPrice?.toLocaleString() || 0} تومان</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/shop/checkout');
                    }}
                    className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 mt-4 w-full rounded-lg px-4 py-2 text-center text-sm font-medium text-white transition-colors"
                  >
                    تکمیل خرید
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 