'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { getProduct, deleteProduct, Product } from '@/app/lib/api/admin/products';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { 
  Package, 
  Edit, 
  Trash2, 
  ArrowLeft,
  DollarSign,
  Boxes,
  Tag,
  Calendar,
  Info
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProduct(resolvedParams.id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('خطا در بارگذاری محصول');
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id, router]);

  const handleDelete = async () => {
    if (!product || !confirm(`آیا از حذف محصول "${product.title}" مطمئن هستید؟`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteProduct(product.id);
      toast.success('محصول با موفقیت حذف شد');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('خطا در حذف محصول');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'نامشخص';
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">محصول یافت نشد</p>
      </div>
    );
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت محصولات', href: '/admin/products' },
          { label: product.title, href: `/admin/products/${product.id}`, active: true },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Button
                    variant="white"
                    onClick={() => router.push('/admin/products')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    بازگشت
                  </Button>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                      product.stock < 5 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : product.stock < 10
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}
                  >
                    <Boxes className="h-4 w-4" />
                    {product.stock} عدد در انبار
                  </span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {product.title}
                </h1>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {product.category?.name || 'نامشخص'}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {formatPrice(product.price)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(product.created_at)}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href={`/admin/products/${product.id}/edit`}>
                  <Button
                    variant="primary"
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    ویرایش
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  loading={isDeleting}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  تصویر محصول
                </h3>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  توضیحات محصول
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    ویژگی‌های محصول
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.attributes.map((attribute, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {attribute.key}:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {attribute.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  آمار محصول
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(product.price)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">قیمت</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Boxes className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {product.stock}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">موجودی</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {formatPrice(product.price * product.stock)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">ارزش کل</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
