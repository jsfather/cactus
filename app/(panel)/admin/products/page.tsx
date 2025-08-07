'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  getProducts,
  deleteProduct,
  Product,
} from '@/app/lib/api/admin/products';
import {
  getProductCategories,
  ProductCategory,
} from '@/app/lib/api/admin/product-categories';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import {
  Plus,
  Package,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  ShoppingCart,
  DollarSign,
  Boxes,
  AlertTriangle,
} from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        getProducts(),
        getProductCategories(),
      ]);
      setProducts(productsResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('خطا در بارگذاری محصولات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (product) => product.category_id.toString() === categoryFilter
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter]);

  const handleDelete = async (id: number | string, title: string) => {
    if (!confirm(`آیا از حذف محصول "${title}" مطمئن هستید؟`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteProduct(id);
      toast.success('محصول با موفقیت حذف شد');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('خطا در حذف محصول');
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const getTotalValue = () => {
    return products.reduce(
      (total, product) => total + product.price * product.stock,
      0
    );
  };

  const getLowStockCount = () => {
    return products.filter((product) => product.stock < 5).length;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت محصولات', href: '/admin/products', active: true },
        ]}
      />

      <div className="mt-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              مدیریت محصولات
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              مدیریت محصولات، قیمت‌ها و موجودی انبار
            </p>
          </div>
          <div className="mt-4 flex gap-3 sm:mt-0">
            <Link href="/admin/product-categories">
              <Button variant="white" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                مدیریت دسته‌بندی‌ها
              </Button>
            </Link>
            <Link href="/admin/products/new">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                افزودن محصول
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      کل محصولات
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {products.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Boxes className="h-6 w-6 text-green-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      کل موجودی
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {products.reduce(
                        (total, product) => total + product.stock,
                        0
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      ارزش کل انبار
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {formatPrice(getTotalValue())}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                      موجودی کم
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {getLowStockCount()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        

        {/* Products Table */}
        <div className="mt-6">
          {filteredProducts.length === 0 ? (
            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
              <div className="px-6 py-12 text-center">
                <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  {products.length === 0
                    ? 'هیچ محصولی یافت نشد'
                    : 'نتیجه‌ای برای فیلتر شما یافت نشد'}
                </h3>
                <p className="mb-6 text-gray-500 dark:text-gray-400">
                  {products.length === 0
                    ? 'برای شروع، اولین محصول خود را ایجاد کنید'
                    : 'فیلترهای جستجو را تغییر دهید'}
                </p>
                {products.length === 0 && (
                  <Link href="/admin/products/new">
                    <Button className="mx-auto flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      افزودن محصول
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-hidden bg-white shadow sm:rounded-md dark:bg-gray-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        محصول
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        دسته‌بندی
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        قیمت
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        موجودی
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              {product.image ? (
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={product.image}
                                  alt={product.title}
                                />
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-600">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {product.title}
                              </div>
                              <div className="max-w-xs truncate text-sm text-gray-500 dark:text-gray-400">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {product.category?.name ||
                            categories.find((c) => c.id === product.category_id)
                              ?.name ||
                            'نامشخص'}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              product.stock < 5
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                : product.stock < 10
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            }`}
                          >
                            {product.stock} عدد
                          </span>
                        </td>
                        <td className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap">
                          <div className="flex items-center gap-2 justify-start">
                            <Link href={`/admin/products/${product.id}`}>
                              <Button
                                variant="white"
                                className="flex items-center gap-1 px-3 py-1 text-sm"
                              >
                                <Eye className="h-4 w-4" />
                                مشاهده
                              </Button>
                            </Link>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button
                                variant="white"
                                className="flex items-center gap-1 px-3 py-1 text-sm"
                              >
                                <Edit className="h-4 w-4" />
                                ویرایش
                              </Button>
                            </Link>
                            <Button
                              variant="danger"
                              onClick={() =>
                                handleDelete(product.id, product.title)
                              }
                              loading={deletingId === product.id}
                              className="flex items-center gap-1 px-3 py-1 text-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                              حذف
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
