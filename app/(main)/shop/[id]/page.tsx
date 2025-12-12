'use client';

import { useState, useEffect, use } from 'react';
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
  MessageSquare,
  User,
  Package,
} from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import { usePublicProduct } from '@/app/lib/hooks/use-public-product';
import {
  PublicProduct,
  publicProductService,
} from '@/app/lib/services/public-product.service';
import { ProductComment } from '@/app/lib/types/product';
import { useLocale } from '@/app/contexts/LocaleContext';
import { useUser } from '@/app/hooks/useUser';
import { toast } from 'react-toastify';
import { Button } from '@/app/components/ui/Button';
import Textarea from '@/app/components/ui/Textarea';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Enhanced interface for display with fallback data
interface DisplayProductDetail {
  id: string | number;
  title: string;
  price: string;
  discount: string | null;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stockCount: number;
  description: string;
  features: string[];
  specifications: { name: string; value: string }[];
  images: string[];
  relatedProducts: {
    id: string;
    title: string;
    price: string;
    image: string;
    category: string;
  }[];
  isFromApi: boolean;
  originalId?: number;
  actualPrice?: number;
  comments?: ProductComment[];
}

// Static fallback data
const staticProducts: Record<string, DisplayProductDetail> = {
  '1': {
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
        id: '4',
        title: 'سنسور فاصله‌سنج لیزری',
        price: '۹۵۰,۰۰۰',
        image: '/product-4.jpg',
        category: 'سنسور',
      },
    ],
    isFromApi: false,
    originalId: 1,
    actualPrice: 2100000,
  },
  '2': {
    id: '2',
    title: 'بورد کنترلر آردوینو پرو',
    price: '۸۵۰,۰۰۰',
    discount: null,
    category: 'قطعات الکترونیکی',
    rating: 5,
    reviews: 42,
    inStock: true,
    stockCount: 25,
    description:
      'بورد کنترلر آردوینو پرو یک میکروکنترلر قدرتمند و انعطاف‌پذیر برای پروژه‌های رباتیک و الکترونیک است.',
    features: [
      'میکروکنترلر ATmega328P',
      'فرکانس کاری 16 مگاهرتز',
      '14 پین دیجیتال',
      '6 پین آنالوگ',
      'پشتیبانی از USB',
      'قابلیت برنامه‌نویسی آسان',
    ],
    specifications: [
      { name: 'ابعاد', value: '۶.۸×۵.۳ سانتی‌متر' },
      { name: 'وزن', value: '۲۵ گرم' },
      { name: 'ولتاژ ورودی', value: '۷-۱۲ ولت' },
      { name: 'جریان خروجی', value: '۴۰ میلی‌آمپر' },
      { name: 'حافظه Flash', value: '۳۲ کیلوبایت' },
    ],
    images: ['/product-2.jpg', '/product-1.jpg', '/product-3.jpg'],
    relatedProducts: [
      {
        id: '1',
        title: 'کیت آموزشی ربات مسیریاب',
        price: '۲,۱۰۰,۰۰۰',
        image: '/product-1.jpg',
        category: 'کیت آموزشی',
      },
      {
        id: '4',
        title: 'سنسور فاصله‌سنج لیزری',
        price: '۹۵۰,۰۰۰',
        image: '/product-4.jpg',
        category: 'سنسور',
      },
    ],
    isFromApi: false,
    originalId: 2,
    actualPrice: 850000,
  },
  '3': {
    id: '3',
    title: 'ربات انسان‌نمای آموزشی',
    price: '۱۲,۰۰۰,۰۰۰',
    discount: '۱۰,۸۰۰,۰۰۰',
    category: 'ربات کامل',
    rating: 4.8,
    reviews: 16,
    inStock: false,
    stockCount: 0,
    description:
      'ربات انسان‌نمای آموزشی برای آموزش مفاهیم پیشرفته رباتیک و هوش مصنوعی طراحی شده است.',
    features: [
      'سیستم حرکتی پیشرفته',
      'سنسورهای تشخیص محیط',
      'قابلیت تعامل صوتی',
      'کنترل از راه دور',
      'برنامه‌نویسی ساده',
      'باتری بادوام',
    ],
    specifications: [
      { name: 'ابعاد', value: '۴۰×۲۰×۱۵ سانتی‌متر' },
      { name: 'وزن', value: '۲ کیلوگرم' },
      { name: 'ولتاژ کاری', value: '۱۲ ولت' },
      { name: 'زمان شارژ', value: '۴ ساعت' },
      { name: 'مدت زمان کارکرد', value: '۶ ساعت' },
    ],
    images: ['/product-3.jpg', '/product-1.jpg', '/product-2.jpg'],
    relatedProducts: [
      {
        id: '1',
        title: 'کیت آموزشی ربات مسیریاب',
        price: '۲,۱۰۰,۰۰۰',
        image: '/product-1.jpg',
        category: 'کیت آموزشی',
      },
      {
        id: '2',
        title: 'بورد کنترلر آردوینو پرو',
        price: '۸۵۰,۰۰۰',
        image: '/product-2.jpg',
        category: 'قطعات الکترونیکی',
      },
    ],
    isFromApi: false,
    originalId: 3,
    actualPrice: 10800000,
  },
  '4': {
    id: '4',
    title: 'سنسور فاصله‌سنج لیزری',
    price: '۹۵۰,۰۰۰',
    discount: null,
    category: 'سنسور',
    rating: 4.2,
    reviews: 35,
    inStock: true,
    stockCount: 18,
    description:
      'سنسور فاصله‌سنج لیزری با دقت بالا برای اندازه‌گیری دقیق فاصله در پروژه‌های رباتیک.',
    features: [
      'دقت اندازه‌گیری بالا',
      'سرعت پاسخ‌دهی فوق‌العاده',
      'مقاوم در برابر نور محیط',
      'اتصال آسان',
      'مصرف انرژی کم',
      'قابل استفاده در فضای باز',
    ],
    specifications: [
      { name: 'ابعاد', value: '۳×۲×۱ سانتی‌متر' },
      { name: 'وزن', value: '۱۰ گرم' },
      { name: 'برد اندازه‌گیری', value: '۰.۱ تا ۴۰ متر' },
      { name: 'دقت', value: '±۱ میلی‌متر' },
      { name: 'ولتاژ کاری', value: '۳.۳-۵ ولت' },
    ],
    images: ['/product-4.jpg', '/product-1.jpg', '/product-2.jpg'],
    relatedProducts: [
      {
        id: '1',
        title: 'کیت آموزشی ربات مسیریاب',
        price: '۲,۱۰۰,۰۰۰',
        image: '/product-1.jpg',
        category: 'کیت آموزشی',
      },
      {
        id: '2',
        title: 'بورد کنترلر آردوینو پرو',
        price: '۸۵۰,۰۰۰',
        image: '/product-2.jpg',
        category: 'قطعات الکترونیکی',
      },
    ],
    isFromApi: false,
    originalId: 4,
    actualPrice: 950000,
  },
};

// Helper function to convert API product to display format
const convertApiProductToDisplayFormat = (
  apiProduct: PublicProduct
): DisplayProductDetail => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  // Extract features from attributes or use defaults
  const features = apiProduct.attributes
    ? Object.values(apiProduct.attributes).filter(
        (value) => value && value.length > 0
      )
    : ['محصول با کیفیت', 'گارانتی معتبر', 'پشتیبانی فنی', 'ارسال سریع'];

  // Extract specifications from attributes or use defaults
  const specifications = apiProduct.attributes
    ? Object.entries(apiProduct.attributes)
        .filter(([key, value]) => key && value)
        .map(([key, value]) => ({ name: key, value }))
    : [
        { name: 'وضعیت', value: 'جدید' },
        { name: 'گارانتی', value: '۶ ماه' },
      ];

  return {
    id: apiProduct.id.toString(),
    title: apiProduct.title,
    price: formatPrice(apiProduct.price),
    discount: apiProduct.discount_price
      ? formatPrice(apiProduct.discount_price)
      : null,
    category: apiProduct.category?.name || 'عمومی', // Use 'name' instead of 'title'
    rating: apiProduct.rating || 4.0,
    reviews: apiProduct.reviews_count || 0,
    inStock: apiProduct.stock > 0,
    stockCount: apiProduct.stock,
    description: apiProduct.description || 'توضیحات محصول در دسترس نیست.',
    features,
    specifications,
    images: apiProduct.image ? [apiProduct.image] : ['/product-1.jpg'],
    relatedProducts: [], // Will be populated from the products list
    isFromApi: true,
    originalId: apiProduct.id,
    actualPrice: apiProduct.discount_price || apiProduct.price,
  };
};

export default function Page({ params }: ProductPageProps) {
  const { t, dir } = useLocale();
  const { user } = useUser();
  const resolvedParams = use(params);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<DisplayProductDetail | null>(null);
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const { addItem } = useCart();

  // Fetch API products
  const {
    allProducts,
    allProductsLoading,
    error,
    fetchAllProducts,
    findProductById,
    clearError,
  } = usePublicProduct();

  useEffect(() => {
    // Clear error and fetch all products if not already loaded
    clearError();

    if (allProducts.length === 0 && !allProductsLoading) {
      fetchAllProducts();
    }
  }, [allProducts.length, allProductsLoading, fetchAllProducts, clearError]);

  // Fetch product with comments
  useEffect(() => {
    const fetchProductWithComments = async () => {
      try {
        const response = await publicProductService.getById(resolvedParams.id);
        if (response.data.comments) {
          setComments(response.data.comments);
        }
      } catch (error) {
        console.error('Error fetching product comments:', error);
      }
    };

    fetchProductWithComments();
  }, [resolvedParams.id]);

  useEffect(() => {
    // Find product by ID once products are loaded
    if (allProducts.length > 0) {
      const productId = parseInt(resolvedParams.id);
      const foundProduct = findProductById(productId);

      if (foundProduct) {
        // Use API data
        const displayProduct = convertApiProductToDisplayFormat(foundProduct);

        // Add related products from the same category
        const relatedProducts = allProducts
          .filter(
            (p) =>
              p.id !== foundProduct.id &&
              p.category?.name === foundProduct.category?.name
          )
          .slice(0, 3)
          .map((p) => ({
            id: p.id.toString(),
            title: p.title,
            price: new Intl.NumberFormat('fa-IR').format(
              p.discount_price || p.price
            ),
            image: p.image || '/product-1.jpg',
            category: p.category?.name || 'عمومی',
          }));

        displayProduct.relatedProducts = relatedProducts;
        setProduct(displayProduct);
      } else {
        // Fall back to static data if API product not found
        const staticProduct = staticProducts[resolvedParams.id];
        if (staticProduct) {
          setProduct(staticProduct);
        } else {
          // If no static data either, use a default fallback
          setProduct({
            id: resolvedParams.id,
            title: 'محصول یافت نشد',
            price: '0',
            discount: null,
            category: 'عمومی',
            rating: 0,
            reviews: 0,
            inStock: false,
            stockCount: 0,
            description: 'متأسفانه این محصول یافت نشد.',
            features: [],
            specifications: [],
            images: ['/product-1.jpg'],
            relatedProducts: [],
            isFromApi: false,
            originalId: parseInt(resolvedParams.id) || 0,
            actualPrice: 0,
          });
        }
      }
    } else if (!allProductsLoading && allProducts.length === 0) {
      // If API fails, use static data
      const staticProduct = staticProducts[resolvedParams.id];
      if (staticProduct) {
        setProduct(staticProduct);
      }
    }
  }, [allProducts, resolvedParams.id, findProductById, allProductsLoading]);

  // Show loading state
  if (allProductsLoading || !product) {
    return (
      <div
        dir={dir}
        className="min-h-screen bg-gray-50 pt-24 pb-16 dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Image skeleton */}
            <div className="space-y-4">
              <div className="aspect-square animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
                  ></div>
                ))}
              </div>
            </div>
            {/* Content skeleton */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-32 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          id: product.originalId || parseInt(product.id.toString()),
          title: product.title,
          price: product.discount || product.price,
          image: product.images[0],
        });
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('برای ارسال نظر باید وارد شوید');
      return;
    }

    if (!commentContent.trim()) {
      toast.error('لطفا محتوای نظر را وارد کنید');
      return;
    }

    try {
      setCommentLoading(true);
      await publicProductService.addComment(resolvedParams.id, {
        content: commentContent,
      });

      toast.success(
        'نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد'
      );
      setCommentContent('');

      // Refresh product to get updated comments
      const response = await publicProductService.getById(resolvedParams.id);
      if (response.data.comments) {
        setComments(response.data.comments);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در ارسال نظر');
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div
      dir={dir}
      className="min-h-screen bg-gray-50 pt-24 pb-16 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        {/* Error message */}
        {error && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                  خطا در بارگذاری محصولات
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {error}
                  {!product?.isFromApi && product
                    ? ' (نمایش داده‌های آفلاین)'
                    : ''}
                </p>
              </div>
              <button
                onClick={() => {
                  clearError();
                  fetchAllProducts();
                }}
                className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-800 transition-colors hover:bg-red-200 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
              >
                {t.common.retry}
              </button>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="/shop"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {t.shop.backToShop}
              </Link>
            </li>
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <li>
              <span className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                {product.category}
              </span>
            </li>
            <ChevronLeft className="h-4 w-4 text-gray-400" />
            <li className="text-gray-900 dark:text-white">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
              {imageError[selectedImage] ? (
                <div className="flex h-full w-full flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                  <Package className="mb-4 h-24 w-24" />
                  <span className="text-sm">تصویر موجود نیست</span>
                </div>
              ) : (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                  onError={() =>
                    setImageError((prev) => ({
                      ...prev,
                      [selectedImage]: true,
                    }))
                  }
                />
              )}
              {product.discount && (
                <div className="absolute top-4 right-4 rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white dark:bg-red-600">
                  {t.shop.discount}
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-gray-100 transition-colors dark:bg-gray-800 ${
                    selectedImage === index
                      ? 'border-primary-600 dark:border-primary-500'
                      : 'border-transparent'
                  }`}
                >
                  {imageError[index] ? (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-500">
                      <Package className="h-8 w-8" />
                    </div>
                  ) : (
                    <Image
                      src={image}
                      alt={`${product.title} - تصویر ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={() =>
                        setImageError((prev) => ({ ...prev, [index]: true }))
                      }
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {product.title}
                </h1>
                <div className="flex gap-2">
                  {product.isFromApi ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-200">
                      آنلاین
                    </span>
                  ) : (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                      آفلاین
                    </span>
                  )}
                </div>
              </div>
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
                    ({product.reviews} {t.shop.reviews})
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
                        <span className="mr-1 text-base">{t.common.toman}</span>
                      </p>
                      <p className="text-gray-500 line-through dark:text-gray-400">
                        {product.price} {t.common.toman}
                      </p>
                    </>
                  ) : (
                    <p className="text-primary-600 dark:text-primary-400 text-3xl font-bold">
                      {product.price}
                      <span className="mr-1 text-base">{t.common.toman}</span>
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {product.inStock ? (
                    <span className="text-green-600 dark:text-green-400">
                      {t.shop.inStock} ({product.stockCount} {t.shop.items})
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">
                      {t.shop.outOfStock}
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
                  {t.shop.addToCart}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-white p-4 dark:bg-gray-800">
                <RefreshCw className="text-primary-600 dark:text-primary-400 h-8 w-8 shrink-0" />
                <div>
                  <p className="font-medium">
                    {t.shop.productDetail.fastShipping}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.shop.productDetail.shippingDescription}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white p-4 dark:bg-gray-800">
                <Shield className="text-primary-600 dark:text-primary-400 h-8 w-8 shrink-0" />
                <div>
                  <p className="font-medium">
                    {t.shop.productDetail.authenticityGuarantee}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.shop.productDetail.qualityAssurance}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white p-4 dark:bg-gray-800">
                <Truck className="text-primary-600 dark:text-primary-400 h-8 w-8 shrink-0" />
                <div>
                  <p className="font-medium">
                    {t.shop.productDetail.returnGuarantee}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.shop.productDetail.returnDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2>{t.shop.productDetail.description}</h2>
              <ReactMarkdown remarkPlugins={[remarkBreaks, remarkGfm]}>
                {product.description}
              </ReactMarkdown>
              {product.features.length > 0 && (
                <>
                  <h3>{t.shop.productDetail.features}</h3>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Specifications */}
            <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold">
                {t.shop.specifications}
              </h2>
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
          <h2 className="mb-8 text-2xl font-bold">{t.shop.relatedProducts}</h2>
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
                      {relatedProduct.price} {t.common.toman}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Comments Section */}
        <section className="mt-16">
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <MessageSquare className="h-6 w-6" />
              نظرات کاربران ({comments.filter((c) => c.approved).length})
            </h3>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <Textarea
                  id="comment"
                  label="نظر خود را بنویسید"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={4}
                  placeholder="نظر خود را درباره این محصول بنویسید..."
                  required
                />
                <Button
                  type="submit"
                  disabled={commentLoading}
                  className="mt-4"
                >
                  {commentLoading ? 'در حال ارسال...' : 'ارسال نظر'}
                </Button>
              </form>
            ) : (
              <div className="mb-8 rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  برای ارسال نظر ابتدا{' '}
                  <Link
                    href="/send-otp"
                    className="text-primary-600 font-semibold underline"
                  >
                    وارد شوید
                  </Link>
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.filter((c) => c.approved).length > 0 ? (
                comments
                  .filter((comment) => comment.approved)
                  .map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {comment.user?.profile_picture ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${comment.user.profile_picture}`}
                              alt={`${comment.user.first_name} ${comment.user.last_name}`}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">
                              {comment.user?.first_name}{' '}
                              {comment.user?.last_name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {comment.created_at}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                  هنوز نظری ثبت نشده است. اولین نفر باشید!
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
