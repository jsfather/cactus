'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBlogStore } from '../../lib/store/blog';
import { Blog } from '../../lib/types/blog';
import {
  createBlogSchema,
  updateBlogSchema,
  CreateBlogInput,
  UpdateBlogInput,
} from '../../lib/validations/blog';

// Import UI components
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import TagInput from '../ui/TagInput';
import DateTimePicker from '../ui/DateTimePicker';
import MarkdownEditor from '../ui/MarkdownEditor';

interface BlogFormProps {
  blog?: Blog | null;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSuccess: () => void;
  isModal?: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({
  blog,
  mode,
  onClose,
  onSuccess,
  isModal = true,
}) => {
  const { createBlog, updateBlog, loading } = useBlogStore();
  const [tags, setTags] = useState<string[]>(blog?.tags || []);

  const schema = mode === 'create' ? createBlogSchema : updateBlogSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<CreateBlogInput | UpdateBlogInput>({
    resolver: zodResolver(schema),
    defaultValues: blog ? {
      title: blog.title,
      little_description: blog.little_description,
      description: blog.description,
      meta_title: blog.meta_title,
      meta_description: blog.meta_description,
      slug: blog.slug,
      tags: blog.tags || [],
      user_id: blog.user?.id || 1,
      publish_at: blog.publish_at || '',
    } : {
      user_id: 1,
      tags: [],
    },
  });

  useEffect(() => {
    setValue('tags', tags);
  }, [tags, setValue]);

  const onSubmit = async (data: CreateBlogInput | UpdateBlogInput) => {
    const formData = { ...data, tags };
    
    let success = false;
    if (mode === 'create') {
      success = await createBlog(formData as CreateBlogInput);
    } else if (blog) {
      success = await updateBlog(blog.id, formData as UpdateBlogInput);
    }

    if (success) {
      onSuccess();
    }
  };

  const formContent = (
    <div className="space-y-6">
      {/* Header - only show for modal mode */}
      {isModal && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {mode === 'create' ? 'Create New Blog' : 'Edit Blog'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <Input
          label="Title *"
          {...register('title')}
          error={errors.title?.message}
        />

        {/* Short Description */}
        <Textarea
          label="Short Description *"
          {...register('little_description')}
          rows={3}
          error={errors.little_description?.message}
        />

        {/* Description with Markdown Editor */}
        <div className="mb-4">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <MarkdownEditor
                label="Description *"
                value={field.value || ''}
                onChange={field.onChange}
                error={errors.description?.message}
              />
            )}
          />
        </div>

        {/* Meta Title */}
        <Input
          label="Meta Title *"
          {...register('meta_title')}
          error={errors.meta_title?.message}
        />

        {/* Meta Description */}
        <Textarea
          label="Meta Description *"
          {...register('meta_description')}
          rows={3}
          error={errors.meta_description?.message}
        />

        {/* Slug */}
        <Input
          label="Slug *"
          {...register('slug')}
          error={errors.slug?.message}
        />

        {/* Tags */}
        <TagInput tags={tags} setTags={setTags} />

        {/* User ID */}
        <Input
          label="User ID *"
          type="number"
          {...register('user_id', { valueAsNumber: true })}
          error={errors.user_id?.message}
        />

        {/* Publish Date */}
        <Controller
          name="publish_at"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              label="Publish Date *"
              value={field.value || ''}
              onChange={field.onChange}
              error={errors.publish_at?.message}
            />
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Create Blog' : 'Update Blog'}
          </Button>
        </div>
      </form>
    </div>
  );

  if (!isModal) {
    return formContent;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {formContent}
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
