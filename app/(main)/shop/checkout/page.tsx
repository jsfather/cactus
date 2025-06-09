'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the order to your backend
    alert('سفارش شما با موفقیت ثبت شد');
    clearCart();
    router.push('/shop');
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto min-h-screen px-4 pt-24">
        <div className="flex flex-col items-center justify-center py-16">
          <h1 className="mb-4 text-2xl font-bold">سبد خرید شما خالی است</h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            برای خرید به فروشگاه بازگردید
          </p>
          <Link
            href="/shop"
            className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg px-6 py-2 text-white transition-colors"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-4 pt-24">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link
              href="/shop"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              فروشگاه
            </Link>
          </li>
          <ChevronLeft className="h-4 w-4 text-gray-400" />
          <li className="text-gray-900 dark:text-white">تکمیل خرید</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Checkout Form */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">اطلاعات ارسال</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                ایمیل
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                شماره تماس
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                آدرس
              </label>
              <textarea
                id="address"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows={3}
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  شهر
                </label>
                <input
                  type="text"
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div>
                <label
                  htmlFor="postalCode"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  کد پستی
                </label>
                <input
                  type="text"
                  id="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 w-full rounded-lg px-6 py-3 text-white transition-colors"
            >
              ثبت سفارش
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">خلاصه سفارش</h2>
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="mb-6 space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-primary-600 dark:text-primary-400">
                          {(
                            parseInt(item.price.replace(/[^0-9]/g, '')) *
                            item.quantity
                          ).toLocaleString()}{' '}
                          تومان
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  جمع سبد خرید
                </span>
                <span>{state.totalPrice.toLocaleString()} تومان</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  هزینه ارسال
                </span>
                <span>رایگان</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold dark:border-gray-700">
                <span>مجموع</span>
                <span className="text-primary-600 dark:text-primary-400">
                  {state.totalPrice.toLocaleString()} تومان
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 