'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  createProduct,
  updateProduct,
  getProduct,
  Product,
  ProductFormData,
} from '@/app/lib/api/admin/products';
import {
  getProductCategories,
  ProductCategory,
} from '@/app/lib/api/admin/product-categories';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import Textarea from '@/app/components/ui/Textarea';
import { Button } from '@/app/components/ui/Button';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { useFormWithBackendErrors } from '@/app/hooks/useFormWithBackendErrors';
import { ApiError } from '@/app/lib/api/client';

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

type ProductFormInputs = z.infer<typeof productSchema>;

export default function ProductFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const isNew = resolvedParams.id === 'new';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    submitWithErrorHandling,
    globalError,
    reset,
    control,
  } = useFormWithBackendErrors<ProductFormInputs>(productSchema);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
  });

  useEffect(() => {
    // Set default values for new products
    if (isNew) {
      reset({
        title: '',
        category_id: '',
        description: '',
        price: 0,
        stock: 0,
        image: '',
        attributes: [{ key: '', value: '' }],
      });
    }
  }, [isNew, reset]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await getProductCategories();
        setCategories(categoriesResponse.data || []);

        if (!isNew) {
          const productResponse = await getProduct(resolvedParams.id);
          const product = productResponse.data;
          
          if (!product) {
            toast.error('محصول یافت نشد');
            router.push('/admin/products');
            return;
          }

          // Convert attributes object to array format
          let attributesArray: { key: string; value: string }[] = [{ key: '', value: '' }];
          if (product.attributes && typeof product.attributes === 'object') {
            const attrs = Object.entries(product.attributes).map(([key, value]) => ({
              key,
              value: String(value)
            }));
            attributesArray = attrs.length > 0 ? attrs : [{ key: '', value: '' }];
          }

          // Get category_id from either category_id field or category.id
          const categoryId = product.category_id || (product.category?.id);
          
          reset({
            title: product.title || '',
            category_id: categoryId ? categoryId.toString() : '',
            description: product.description || '',
            price: product.price || 0,
            stock: product.stock || 0,
            image: product.image || '',
            attributes: attributesArray,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('خطا در بارگذاری اطلاعات');
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isNew, resolvedParams.id, reset, router]);

  const onSubmit = async (data: ProductFormInputs) => {
    const formData: ProductFormData = {
      ...data,
      category_id: parseInt(data.category_id),
      image: data.image || '',
      attributes: data.attributes.filter((attr) => attr.key && attr.value),
    };

    if (isNew) {
      await createProduct(formData);
      toast.success('محصول با موفقیت ایجاد شد');
    } else {
      await updateProduct(resolvedParams.id, formData);
      toast.success('محصول با موفقیت بروزرسانی شد');
    }
    router.push('/admin/products');
  };

  const handleError = (error: ApiError) => {
    console.log('Product form submission error:', error);
    if (error?.message) {
      toast.error(error.message);
    } else {
      toast.error('خطا در ثبت محصول');
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
            label: isNew ? 'افزودن محصول' : 'ویرایش محصول',
            href: `/admin/products/${resolvedParams.id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {isNew ? 'افزودن محصول جدید' : 'ویرایش محصول'}
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

        <form
          onSubmit={handleSubmit(submitWithErrorHandling(onSubmit, handleError))}
          className="space-y-8"
        >
          {globalError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-100 p-4 text-sm text-red-700">
              {globalError}
            </div>
          )}

          {/* Basic Information */}
          <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                اطلاعات اصلی
              </h3>
            </div>
            <div className="space-y-6 px-6 py-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  id="title"
                  label="نام محصول"
                  required
                  placeholder="نام محصول را وارد کنید"
                  error={errors.title?.message}
                  {...register('title')}
                />

                <Select
                  id="category_id"
                  label="دسته‌بندی"
                  required
                  placeholder="دسته‌بندی را انتخاب کنید"
                  error={errors.category_id?.message}
                  options={categories.map((category) => ({
                    label: category.name,
                    value: category.id.toString(),
                  }))}
                  {...register('category_id')}
                />
              </div>

              <Textarea
                id="description"
                label="توضیحات"
                required
                placeholder="توضیحات محصول را وارد کنید"
                error={errors.description?.message}
                {...register('description')}
              />

              <Input
                id="image"
                label="تصویر محصول"
                placeholder="آدرس تصویر محصول"
                error={errors.image?.message}
                {...register('image')}
              />
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
                <Input
                  id="price"
                  label="قیمت (تومان)"
                  type="number"
                  required
                  placeholder="0"
                  convertNumbers
                  error={errors.price?.message}
                  {...register('price', { valueAsNumber: true })}
                />

                <Input
                  id="stock"
                  label="موجودی"
                  type="number"
                  required
                  placeholder="0"
                  convertNumbers
                  error={errors.stock?.message}
                  {...register('stock', { valueAsNumber: true })}
                />
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
                <div key={field.id} className="flex items-start gap-4">
                  <div className="flex-1">
                    <Input
                      id={`attributes.${index}.key`}
                      placeholder="نام ویژگی (مثل: رنگ، سایز)"
                      error={errors.attributes?.[index]?.key?.message}
                      {...register(`attributes.${index}.key`)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      id={`attributes.${index}.value`}
                      placeholder="مقدار ویژگی (مثل: قرمز، بزرگ)"
                      error={errors.attributes?.[index]?.value?.message}
                      {...register(`attributes.${index}.value`)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => removeAttribute(index)}
                    disabled={fields.length === 1}
                    className="mt-1 flex items-center gap-1 px-3 py-2"
                  >
                    <Trash2 className="h-4 w-4" />
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
              {isNew ? 'ایجاد محصول' : 'بروزرسانی محصول'}
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
