'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProduct } from '@/app/lib/hooks/use-product';
import { useProductCategory } from '@/app/lib/hooks/use-product-category';
import { CreateProductRequest, UpdateProductRequest, ProductAttribute } from '@/app/lib/types/product';
import Breadcrumbs from '@/app/components/ui/Breadcrumbs';
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import Textarea from '@/app/components/ui/Textarea';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Package, Plus, X, Save, ArrowLeft } from 'lucide-react';

const productSchema = z.object({
  title: z.string().min(1, 'نام محصول نمی‌تواند خالی باشد'),
  category_id: z.string().min(1, 'دسته‌بندی محصول انتخاب کنید'),
  description: z.string().min(1, 'توضیحات محصول نمی‌تواند خالی باشد'),
  price: z.coerce.number().min(0, 'قیمت نمی‌تواند منفی باشد'),
  stock: z.coerce.number().min(0, 'موجودی نمی‌تواند منفی باشد'),
  image: z.string().optional(),
  attributes: z.array(z.object({
    key: z.string().min(1, 'کلید ویژگی نمی‌تواند خالی باشد'),
    value: z.string().min(1, 'مقدار ویژگی نمی‌تواند خالی باشد'),
  })).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Props {
  params: { id: string };
}

export default function ProductFormPage({ params }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const { 
    createProduct, 
    updateProduct, 
    fetchProductById, 
    currentProduct, 
    loading 
  } = useProduct();
  const { categories, fetchCategories, loading: categoriesLoading } = useProductCategory();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      category_id: '',
      description: '',
      price: 0,
      stock: 0,
      image: '',
      attributes: [{ key: '', value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
  });

  useEffect(() => {
    fetchCategories();
    
    if (params.id !== 'new') {
      setIsEditing(true);
      fetchProductById(params.id);
    }
  }, [fetchCategories, fetchProductById, params.id]);

  useEffect(() => {
    if (isEditing && currentProduct) {
      const attributesArray = currentProduct.attributes 
        ? Object.entries(currentProduct.attributes).map(([key, value]) => ({ key, value }))
        : [{ key: '', value: '' }];

      reset({
        title: currentProduct.title,
        category_id: currentProduct.category?.id?.toString() || '',
        description: currentProduct.description,
        price: currentProduct.price,
        stock: currentProduct.stock,
        image: currentProduct.image || '',
        attributes: attributesArray,
      });
    }
  }, [currentProduct, isEditing, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setSubmitting(true);
      
      // Filter out empty attributes
      const filteredAttributes = data.attributes?.filter(
        attr => attr.key.trim() && attr.value.trim()
      ) || [];

      if (isEditing) {
        const productData: UpdateProductRequest = {
          title: data.title,
          category_id: Number(data.category_id),
          description: data.description,
          price: data.price,
          stock: data.stock,
          image: data.image || '',
          attributes: filteredAttributes,
        };

        await updateProduct(params.id, productData);
        toast.success('محصول با موفقیت بروزرسانی شد');
      } else {
        const productData: CreateProductRequest = {
          title: data.title,
          category_id: Number(data.category_id),
          description: data.description,
          price: data.price,
          stock: data.stock,
          image: data.image || '',
          attributes: filteredAttributes,
        };

        await createProduct(productData);
        toast.success('محصول با موفقیت ایجاد شد');
      }
      
      router.push('/admin/products');
    } catch (error) {
      toast.error(isEditing ? 'خطا در بروزرسانی محصول' : 'خطا در ایجاد محصول');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || categoriesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'پنل مدیریت', href: '/admin' },
          { label: 'مدیریت محصولات', href: '/admin/products' },
          { 
            label: isEditing ? 'ویرایش محصول' : 'افزودن محصول', 
            href: `/admin/products/${params.id}`, 
            active: true 
          },
        ]}
      />

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {isEditing ? 'ویرایش محصول' : 'افزودن محصول جدید'}
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {isEditing ? 'اطلاعات محصول را ویرایش کنید' : 'اطلاعات محصول جدید را وارد کنید'}
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

        <div className="mt-6 rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  id="title"
                  label="نام محصول"
                  required
                  placeholder="نام محصول را وارد کنید..."
                  error={errors.title?.message}
                  {...register('title')}
                />
                <Select
                  id="category_id"
                  label="دسته‌بندی"
                  required
                  placeholder="دسته‌بندی محصول را انتخاب کنید..."
                  error={errors.category_id?.message}
                  options={categories.map(cat => ({
                    label: cat.name,
                    value: cat.id.toString(),
                  }))}
                  {...register('category_id')}
                />
              </div>

              <Textarea
                id="description"
                label="توضیحات محصول"
                required
                placeholder="توضیحات محصول را وارد کنید..."
                error={errors.description?.message}
                {...register('description')}
                rows={4}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Input
                  id="price"
                  label="قیمت (تومان)"
                  type="number"
                  required
                  placeholder="0"
                  error={errors.price?.message}
                  {...register('price')}
                />
                <Input
                  id="stock"
                  label="موجودی"
                  type="number"
                  required
                  placeholder="0"
                  error={errors.stock?.message}
                  {...register('stock')}
                />
                <Input
                  id="image"
                  label="تصویر محصول"
                  placeholder="URL تصویر محصول..."
                  error={errors.image?.message}
                  {...register('image')}
                />
              </div>

              {/* Attributes */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    ویژگی‌های محصول
                  </h3>
                  <Button
                    type="button"
                    variant="white"
                    onClick={() => append({ key: '', value: '' })}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    افزودن ویژگی
                  </Button>
                </div>
                <div className="mt-4 space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-3">
                      <div className="flex-1">
                        <Input
                          label={index === 0 ? 'کلید ویژگی' : ''}
                          placeholder="مثال: رنگ، سایز، ..."
                          error={errors.attributes?.[index]?.key?.message}
                          {...register(`attributes.${index}.key`)}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          label={index === 0 ? 'مقدار ویژگی' : ''}
                          placeholder="مثال: قرمز، بزرگ، ..."
                          error={errors.attributes?.[index]?.value?.message}
                          {...register(`attributes.${index}.value`)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="flex items-center gap-1 px-3 py-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t pt-6">
                <Button
                  type="button"
                  variant="white"
                  onClick={() => router.push('/admin/products')}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  loading={submitting}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isEditing ? 'بروزرسانی محصول' : 'ایجاد محصول'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
