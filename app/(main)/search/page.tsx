'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  User,
  ThumbsUp,
  ThumbsDown,
  Star,
  ShoppingBag,
  FileText,
} from 'lucide-react';
import { useSearch } from '@/app/lib/hooks/use-search';
import { useCart } from '@/app/contexts/CartContext';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { useLocale } from '@/app/contexts/LocaleContext';

function SearchContent() {
  const { t, dir } = useLocale();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(initialQuery);
  const {
    query,
    blogs,
    products,
    blogsLoading,
    productsLoading,
    searchAll,
    setQuery,
  } = useSearch();
  const { addItem } = useCart();

  // Perform initial search from URL
  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setSearchInput(initialQuery);
      searchAll(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchAll(searchInput.trim());
      // Update URL without refresh
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchInput.trim());
      window.history.pushState({}, '', url.toString());
    }
  };

  const isLoading = blogsLoading || productsLoading;
  const hasResults = blogs.length > 0 || products.length > 0;
  const hasSearched = query.length > 0;

  return (
    <div dir={dir} className="min-h-screen bg-white pt-20 dark:bg-gray-900">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-20 pb-12 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
              جستجو در{' '}
              <span className="from-primary-600 to-primary-800 bg-gradient-to-r bg-clip-text text-transparent">
                {t.common.siteName}
              </span>
            </h1>
            <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
              در مقالات و محصولات جستجو کنید
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
              <div className="relative">
                <input
                  type="search"
                  placeholder="جستجوی مقالات و محصولات..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="focus:ring-primary-500 w-full rounded-full border border-gray-200 bg-white px-6 py-4 text-lg text-gray-900 placeholder-gray-500 shadow-lg focus:border-transparent focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 absolute end-2 top-2 rounded-full p-3 text-white transition-colors"
                >
                  <Search className="h-6 w-6" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {isLoading && <LoadingSpinner />}

          {/* Results */}
          {!isLoading && hasSearched && (
            <>
              {/* Results Summary */}
              <div className="mb-8">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  نتایج جستجو برای:{' '}
                  <span className="font-bold text-gray-900 dark:text-white">
                    "{query}"
                  </span>{' '}
                  ({blogs.length + products.length} نتیجه)
                </p>
              </div>

              {/* No Results */}
              {!hasResults && (
                <div className="py-12 text-center">
                  <Search className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    متأسفانه نتیجه‌ای یافت نشد
                  </p>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    لطفاً عبارت دیگری را جستجو کنید
                  </p>
                </div>
              )}

              {/* Blog Results */}
              {blogs.length > 0 && (
                <div className="mb-12">
                  <div className="mb-6 flex items-center gap-3">
                    <FileText className="text-primary-600 dark:text-primary-400 h-6 w-6" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      مقالات ({blogs.length})
                    </h2>
                    <Link
                      href={`/blog?search=${encodeURIComponent(query)}`}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 mr-auto text-sm font-medium"
                    >
                      مشاهده همه در وبلاگ ←
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {blogs.slice(0, 6).map((post, index) => {
                      const postTags = post.tags
                        .flatMap((tagString) =>
                          tagString.split(',').map((tag) => tag.trim())
                        )
                        .filter(Boolean);

                      return (
                        <motion.article
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
                        >
                          <Link href={`/blog/${post.id}`}>
                            <div className="from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 relative h-40 bg-gradient-to-br">
                              <div className="text-primary-600 dark:text-primary-300 flex h-full items-center justify-center">
                                <svg
                                  className="h-12 w-12 opacity-50"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="p-5">
                              <div className="mb-3 flex flex-wrap gap-2">
                                {postTags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <h3 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-2 line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">
                                {post.title}
                              </h3>
                              <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                                {post.little_description}
                              </p>
                              <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                                {post.user && (
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {post.user.first_name}{' '}
                                      {post.user.last_name}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-3 text-xs">
                                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                    <ThumbsUp className="h-3 w-3" />
                                    <span>{post.likes_count || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                    <ThumbsDown className="h-3 w-3" />
                                    <span>{post.dislikes_count || 0}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.article>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Product Results */}
              {products.length > 0 && (
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <ShoppingBag className="text-primary-600 dark:text-primary-400 h-6 w-6" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      محصولات ({products.length})
                    </h2>
                    <Link
                      href={`/shop?search=${encodeURIComponent(query)}`}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 mr-auto text-sm font-medium"
                    >
                      مشاهده همه در فروشگاه ←
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {products.slice(0, 8).map((product, index) => {
                      const formatPrice = (price: number) => {
                        return new Intl.NumberFormat('fa-IR').format(price);
                      };

                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Link href={`/shop/${product.id}`}>
                            <div className="group rounded-2xl bg-white p-4 shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800">
                              <div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
                                <Image
                                  src={product.image || '/product-1.jpg'}
                                  alt={product.title}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                {product.discount_price && (
                                  <div className="absolute top-2 left-2 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">
                                    تخفیف
                                  </div>
                                )}
                                {product.stock <= 0 && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white">
                                      ناموجود
                                    </span>
                                  </div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (product.stock > 0) {
                                      addItem({
                                        id: product.id,
                                        title: product.title,
                                        price: formatPrice(
                                          product.discount_price ||
                                            product.price
                                        ),
                                        image:
                                          product.image || '/product-1.jpg',
                                      });
                                    }
                                  }}
                                  className="absolute right-2 bottom-2 rounded-full bg-white/90 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
                                >
                                  <svg
                                    className="text-primary-600 dark:text-primary-400 h-5 w-5"
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
                                  {product.category?.name || 'عمومی'}
                                </div>
                                <h3 className="line-clamp-1 font-bold dark:text-gray-100">
                                  {product.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < Math.floor(product.rating || 0)
                                            ? 'fill-current text-yellow-400'
                                            : 'text-gray-300 dark:text-gray-600'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    ({product.reviews_count || 0})
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div>
                                    {product.discount_price ? (
                                      <>
                                        <span className="text-primary-600 dark:text-primary-400 font-bold">
                                          {formatPrice(product.discount_price)}
                                        </span>
                                        <span className="mr-2 text-sm text-gray-500 line-through">
                                          {formatPrice(product.price)}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-primary-600 dark:text-primary-400 font-bold">
                                        {formatPrice(product.price)}
                                      </span>
                                    )}
                                    <span className="mr-1 text-xs text-gray-600 dark:text-gray-300">
                                      {t.common.toman}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Initial State - No search yet */}
          {!isLoading && !hasSearched && (
            <div className="py-12 text-center">
              <Search className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
              <p className="text-xl text-gray-500 dark:text-gray-400">
                برای شروع، عبارت مورد نظر خود را جستجو کنید
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchContent />
    </Suspense>
  );
}
