'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import {
  getProductCategories,
  ProductCategory,
} from '@/app/lib/api/admin/product-categories';
import {
  createProduct,
  ProductFormData,
} from '@/app/lib/api/admin/products';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Plus, Minus, Package, Save, ArrowLeft } from 'lucide-react';

const productSchema = z.object({
  title: z.string().min(1, 'نام محصول الزامی است'),
  category_id: z.string().min(1, 'دسته‌بندی الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  price: z.number().min(0, 'قیمت باید مثبت باشد'),
  stock: z.number().min(0, 'موجودی باید مثبت باشد'),
  image: z.string().optional(),
  attributes: z.array(
    z.object({
      key: z.string().min(1, 'نام ویژگی الزامی است'),
      value: z.string().min(1, 'مقدار ویژگی الزامی است'),
    })
  ),
});

type NewProductFormData = z.infer<typeof productSchema>;

export default function ProductFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<NewProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      attributes: [{ key: '', value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const categoriesResponse = await getProductCategories();
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('خطا در بارگذاری اطلاعات');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: NewProductFormData) => {
    try {
      const formData: ProductFormData = {
        ...data,
        category_id: parseInt(data.category_id),
        image: data.image || '', // Provide empty string if undefined
        attributes: data.attributes.filter((attr: { key: string; value: string }) => attr.key && attr.value),
      };

      await createProduct(formData);
      toast.success('محصول با موفقیت ایجاد شد');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('خطا در ایجاد محصول');
    }
  };

  const addAttribute = () => {
    append({ key: '', value: '' });
  };

  const removeAttribute = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت محصولات', href: '/admin/products' },
          {
            label: 'افزودن محصول',
            href: '/admin/products/new',
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              افزودن محصول جدید
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              اطلاعات محصول، قیمت و ویژگی‌ها را وارد کنید
            </p>
          </div>
          <Button
            variant="white"
            onClick={() => router.push('/admin/products')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            بازگشت
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                اطلاعات اصلی
              </h3>
            </div>
            <div className="space-y-6 px-6 py-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    نام محصول *
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...register('title')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="نام محصول را وارد کنید"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="category_id"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    دسته‌بندی *
                  </label>
                  <select
                    id="category_id"
                    {...register('category_id')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="">دسته‌بندی را انتخاب کنید</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category_id.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  توضیحات *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register('description')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="توضیحات محصول را وارد کنید"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  تصویر محصول
                </label>
                <input
                  type="url"
                  id="image"
                  {...register('image')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="آدرس تصویر محصول"
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.image.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Price and Stock */}
          <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                قیمت و موجودی
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    قیمت (تومان) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    {...register('price', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="0"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    موجودی *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    {...register('stock', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  ویژگی‌های محصول
                </h3>
                <Button
                  type="button"
                  variant="white"
                  onClick={addAttribute}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  افزودن ویژگی
                </Button>
              </div>
            </div>
            <div className="space-y-4 px-6 py-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      {...register(`attributes.${index}.key`)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="نام ویژگی (مثل: رنگ، سایز)"
                    />
                    {errors.attributes?.[index]?.key && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.attributes[index]?.key?.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      {...register(`attributes.${index}.value`)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="مقدار ویژگی (مثل: آبی، بزرگ)"
                    />
                    {errors.attributes?.[index]?.value && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.attributes[index]?.value?.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => removeAttribute(index)}
                    disabled={fields.length === 1}
                    className="flex items-center gap-1 px-3 py-2"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-start gap-3">
            <Button
              type="submit"
              loading={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              ایجاد محصول
            </Button>
            <Button
              type="button"
              variant="white"
              onClick={() => router.push('/admin/products')}
            >
              انصراف
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
