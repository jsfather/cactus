'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
} from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';

// Sample product data (replace with actual data fetching)
const product = {
  id: '1',
  title: 'کیت آموزشی ربات مسیریاب',
  price: '۲,۵۰۰,۰۰۰',
  discount: '۲,۱۰۰,۰۰۰',
  category: 'کیت آموزشی',
  rating: 4.5,
  reviews: 28,
  inStock: true,
  stockCount: 12,
  description:
    'کیت آموزشی ربات مسیریاب یک مجموعه کامل برای یادگیری مفاهیم پایه رباتیک و برنامه‌نویسی است. این کیت شامل تمام قطعات مورد نیاز برای ساخت یک ربات مسیریاب هوشمند می‌باشد.',
  features: [
    'قابلیت تشخیص و تعقیب خط',
    'سنسورهای مادون قرمز با دقت بالا',
    'موتورهای DC با کیفیت',
    'برد کنترلر آردوینو',
    'قطعات پلاستیکی با دوام',
    'باتری قابل شارژ',
  ],
  specifications: [
    { name: 'ابعاد', value: '۲۰×۱۵×۱۰ سانتی‌متر' },
    { name: 'وزن', value: '۵۰۰ گرم' },
    { name: 'ولتاژ کاری', value: '۷.۴ ولت' },
    { name: 'زمان شارژ', value: '۲ ساعت' },
    { name: 'مدت زمان کارکرد', value: '۳ ساعت' },
  ],
  images: [
    '/product-1.jpg',
    '/product-2.jpg',
    '/product-3.jpg',
    '/product-4.jpg',
  ],
  relatedProducts: [
    {
      id: '2',
      title: 'بورد کنترلر آردوینو پرو',
      price: '۸۵۰,۰۰۰',
      image: '/product-2.jpg',
      category: 'قطعات الکترونیکی',
    },
    {
      id: '3',
      title: 'سنسور فاصله‌سنج لیزری',
      price: '۹۵۰,۰۰۰',
      image: '/product-4.jpg',
      category: 'سنسور',
    },
  ],
};

export default function Page() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const incrementQuantity = () => {
    if (quantity < product.stockCount) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product.inStock) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: parseInt(product.id),
          title: product.title,
          price: product.discount || product.price,
          image: product.images[0],
        });
      }
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-50 pt-24 pb-16 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
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
            <li>
              <Link
                href={`/shop/category/${product.category}`}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {product.category}
              </Link>
            </li>
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <li className="text-gray-900 dark:text-white">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              {product.discount && (
                <div className="absolute top-4 right-4 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white dark:bg-red-600">
                  تخفیف
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-primary-600 dark:border-primary-500'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} - تصویر ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-current text-yellow-400 dark:text-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({product.reviews} نظر)
                  </span>
                </div>
                <span className="text-primary-600 dark:text-primary-400 text-sm">
                  {product.category}
                </span>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl bg-white p-6 dark:bg-gray-800">
              <div className="flex items-end justify-between">
                <div>
                  {product.discount ? (
                    <>
                      <p className="text-primary-600 dark:text-primary-400 text-3xl font-bold">
                        {product.discount}
                        <span className="mr-1 text-base">تومان</span>
                      </p>
                      <p className="text-gray-500 line-through dark:text-gray-400">
                        {product.price} تومان
                      </p>
                    </>
                  ) : (
                    <p className="text-primary-600 dark:text-primary-400 text-3xl font-bold">
                      {product.price}
                      <span className="mr-1 text-base">تومان</span>
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {product.inStock ? (
                    <span className="text-green-600 dark:text-green-400">
                      موجود در انبار ({product.stockCount} عدد)
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">
                      ناموجود
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-2 text-gray-600 transition-colors hover:text-gray-900 disabled:text-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:disabled:text-gray-600"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stockCount}
                    className="p-2 text-gray-600 transition-colors hover:text-gray-900 disabled:text-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:disabled:text-gray-600"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 flex-1 rounded-lg px-6 py-3 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  افزودن به سبد خرید
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-white p-4 dark:bg-gray-800">
                <Truck className="text-primary-600 dark:text-primary-400 h-8 w-8" />
                <div>
                  <p className="font-medium">ارسال سریع</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ارسال به سراسر کشور
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white p-4 dark:bg-gray-800">
                <Shield className="text-primary-600 dark:text-primary-400 h-8 w-8" />
                <div>
                  <p className="font-medium">گارانتی اصالت</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    تضمین کیفیت محصول
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white p-4 dark:bg-gray-800">
                <RefreshCw className="text-primary-600 dark:text-primary-400 h-8 w-8" />
                <div>
                  <p className="font-medium">۷ روز ضمانت</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    بازگشت بدون شرط
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2>توضیحات محصول</h2>
              <p>{product.description}</p>
              <h3>ویژگی‌ها</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold">مشخصات فنی</h2>
              <div className="space-y-4">
                {product.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0 dark:border-gray-700"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {spec.name}
                    </span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">محصولات مرتبط</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {product.relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-2xl bg-white p-4 shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800"
              >
                <Link href={`/shop/${relatedProduct.id}`}>
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <p className="text-primary-600 dark:text-primary-400 mb-2 text-sm">
                      {relatedProduct.category}
                    </p>
                    <h3 className="mb-2 font-bold dark:text-white">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-bold">
                      {relatedProduct.price} تومان
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
