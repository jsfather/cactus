'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Star } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import { usePublicProduct } from '@/app/lib/hooks/use-public-product';
import { PublicProduct } from '@/app/lib/services/public-product.service';
import { useLocale } from '@/app/contexts/LocaleContext';

interface DisplayProduct {
  id: string | number;
  title: string;
  price: string;
  discount: string | null;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  originalId?: number;
  actualPrice?: number;
}

const categories = [
  { id: 'all', name: 'همه محصولات', count: 42 },
  { id: 'educational-kits', name: 'کیت آموزشی', count: 15 },
  { id: 'electronics', name: 'قطعات الکترونیکی', count: 12 },
  { id: 'robots', name: 'ربات کامل', count: 8 },
  { id: 'sensors', name: 'سنسور', count: 7 },
];

// Helper function to convert API product to display format
const convertApiProductToDisplayFormat = (
  apiProduct: PublicProduct
): DisplayProduct => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return {
    id: apiProduct.id, // Use original ID without prefix
    title: apiProduct.title,
    price: formatPrice(apiProduct.price),
    discount: apiProduct.discount_price
      ? formatPrice(apiProduct.discount_price)
      : null,
    image: apiProduct.image || '/product-1.jpg', // Fallback image
    category: apiProduct.category?.name || 'عمومی', // Use 'name' instead of 'title'
    rating: apiProduct.rating || 4.0,
    reviews: apiProduct.reviews_count || 0,
    inStock: apiProduct.stock > 0,
    originalId: apiProduct.id, // Keep original ID for cart
    actualPrice: apiProduct.discount_price || apiProduct.price, // Numeric price for cart
  };
};

export default function Page() {
  const { t, dir } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [availability, setAvailability] = useState<'all' | 'in-stock'>('all');
  const { addItem } = useCart();

  // Fetch API products
  const {
    products: apiProducts,
    loading,
    error,
    fetchHomeProducts,
  } = usePublicProduct();

  useEffect(() => {
    fetchHomeProducts();
  }, [fetchHomeProducts]);

  // Convert API products to display format
  const allProducts = apiProducts.map(convertApiProductToDisplayFormat);

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      product.category ===
        categories.find((c) => c.id === selectedCategory)?.name;
    const matchesAvailability =
      availability === 'all' ||
      (availability === 'in-stock' && product.inStock);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div dir={dir} className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-20 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold">
              {t.shop.pageTitle}
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {' '}
                {t.shop.pageTitleHighlight}
              </span>
            </h1>
            <p className="mb-12 text-xl text-gray-600 dark:text-gray-300">
              {t.shop.pageSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <div className="relative flex-1 md:max-w-md">
                <input
                  type="search"
                  placeholder={t.shop.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 pl-10 dark:border-gray-700 dark:bg-gray-800"
                />
                <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Filter className="h-5 w-5" />
                {t.shop.filters.title}
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Categories */}
                <div className="mb-4">
                  <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                    {t.shop.filters.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`rounded-full px-4 py-1 text-sm ${
                          selectedCategory === category.id
                            ? 'bg-primary-600 dark:bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {category.name} ({category.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div className="mb-4">
                  <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                    {t.shop.filters.availability}
                  </h3>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === 'all'}
                        onChange={() => setAvailability('all')}
                        className="text-primary-600"
                      />
                      <span>{t.shop.filters.all}</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === 'in-stock'}
                        onChange={() => setAvailability('in-stock')}
                        className="text-primary-600"
                      />
                      <span>{t.shop.filters.inStockOnly}</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Products Grid */}
          {loading && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-800">
                    <div className="mb-4 aspect-square rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-6 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/shop/${product.id}`}>
                    <div className="group rounded-2xl bg-white p-4 shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70">
                      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110 dark:opacity-90"
                        />
                        {product.discount && (
                          <div className="absolute top-2 left-2 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white dark:bg-red-600">
                            {dir === 'rtl' ? 'تخفیف' : 'Discount'}
                          </div>
                        )}
                        {!product.inStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white">
                              {dir === 'rtl' ? 'ناموجود' : 'Out of Stock'}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (product.inStock) {
                              addItem({
                                id:
                                  product.originalId ||
                                  (typeof product.id === 'number'
                                    ? product.id
                                    : parseInt(
                                        product.id
                                          .toString()
                                          .replace('api-', '')
                                      )),
                                title: product.title,
                                price: product.discount || product.price,
                                image: product.image,
                              });
                            }
                          }}
                          className="absolute right-2 bottom-2 rounded-full bg-white/90 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
                        >
                          <svg
                            className="text-primary-600 dark:text-primary-400 h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                          {product.category}
                        </div>
                        <h3 className="font-bold dark:text-gray-100">
                          {product.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating)
                                    ? 'fill-current text-yellow-400 dark:text-yellow-500'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({product.reviews})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            {product.discount ? (
                              <>
                                <span className="text-primary-600 dark:text-primary-400 text-lg font-bold">
                                  {product.discount}
                                </span>
                                <span className="mr-2 text-sm text-gray-500 line-through dark:text-gray-400">
                                  {product.price}
                                </span>
                              </>
                            ) : (
                              <span className="text-primary-600 dark:text-primary-400 text-lg font-bold">
                                {product.price}
                              </span>
                            )}
                            <span className="mr-1 text-sm text-gray-600 dark:text-gray-300">
                              {t.common.toman}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (product.inStock) {
                                addItem({
                                  id:
                                    product.originalId ||
                                    (typeof product.id === 'number'
                                      ? product.id
                                      : parseInt(
                                          product.id
                                            .toString()
                                            .replace('api-', '')
                                        )),
                                  title: product.title,
                                  price: product.discount || product.price,
                                  image: product.image,
                                });
                              }
                            }}
                            className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                              product.inStock
                                ? 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white'
                                : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                            }`}
                            disabled={!product.inStock}
                          >
                            {product.inStock
                              ? dir === 'rtl'
                                ? 'افزودن به سبد'
                                : 'Add to Cart'
                              : dir === 'rtl'
                                ? 'ناموجود'
                                : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="py-8 text-center">
              <p className="mb-4 text-lg text-red-600 dark:text-red-400">
                {dir === 'rtl'
                  ? `خطا در بارگذاری محصولات: ${error}`
                  : `Error loading products: ${error}`}
              </p>
              <button
                onClick={fetchHomeProducts}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                {dir === 'rtl' ? 'تلاش مجدد' : 'Try Again'}
              </button>
            </div>
          )}

          {/* No Results Message */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {dir === 'rtl'
                  ? 'متأسفانه هیچ محصولی با معیارهای جستجوی شما یافت نشد.'
                  : 'Sorry, no products found matching your search criteria.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
