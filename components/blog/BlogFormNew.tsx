"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBlogStore } from "../../lib/store/blog";
import { Blog } from "../../lib/types/blog";
import {
  createBlogSchema,
  updateBlogSchema,
  CreateBlogInput,
  UpdateBlogInput,
} from "../../lib/validations/blog";
import { Button, Input, Textarea } from "@/components/ui";

interface BlogFormProps {
  blog?: Blog | null;
  mode: "create" | "edit";
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
  const [tagInput, setTagInput] = useState("");

  const schema = mode === "create" ? createBlogSchema : updateBlogSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateBlogInput | UpdateBlogInput>({
    resolver: zodResolver(schema),
    defaultValues: blog
      ? {
          title: blog.title,
          little_description: blog.little_description,
          description: blog.description,
          meta_title: blog.meta_title,
          meta_description: blog.meta_description,
          slug: blog.slug,
          tags: blog.tags || [],
          user_id: blog.user?.id || 1,
          publish_at: blog.publish_at || "",
        }
      : {
          user_id: 1, // Default user ID
          tags: [],
        },
  });

  useEffect(() => {
    setValue("tags", tags);
  }, [tags, setValue]);

  const onSubmit = async (data: CreateBlogInput | UpdateBlogInput) => {
    const formData = { ...data, tags };

    let success = false;
    if (mode === "create") {
      success = await createBlog(formData as CreateBlogInput);
    } else if (blog) {
      success = await updateBlog(blog.id, formData as UpdateBlogInput);
    }

    if (success) {
      onSuccess();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const formContent = (
    <div className="space-y-6">
      {/* Header - only show for modal mode */}
      {isModal && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {mode === "create" ? "Create New Blog" : "Edit Blog"}
          </h3>
          <Button
            onClick={onClose}
            variant="secondary"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="text-2xl">&times;</span>
          </Button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            {...register("title")}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Short Description *
          </label>
          <textarea
            {...register("little_description")}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.little_description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.little_description.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            {...register("description")}
            rows={6}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Meta Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Meta Title *
          </label>
          <input
            type="text"
            {...register("meta_title")}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.meta_title && (
            <p className="mt-1 text-sm text-red-600">
              {errors.meta_title.message}
            </p>
          )}
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Meta Description *
          </label>
          <textarea
            {...register("meta_description")}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.meta_description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.meta_description.message}
            </p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Slug *
          </label>
          <input
            type="text"
            {...register("slug")}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="Add a tag..."
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              type="button"
              onClick={addTag}
              variant="primary"
              className="rounded-l-none border-l-0"
            >
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <Button
                    type="button"
                    onClick={() => removeTag(tag)}
                    variant="secondary"
                    size="sm"
                    className="ml-2 text-blue-600 hover:text-blue-800 p-0 w-4 h-4"
                  >
                    &times;
                  </Button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* User ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            User ID *
          </label>
          <input
            type="number"
            {...register("user_id", { valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.user_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.user_id.message}
            </p>
          )}
        </div>

        {/* Publish Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Publish Date *
          </label>
          <input
            type="date"
            {...register("publish_at")}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.publish_at && (
            <p className="mt-1 text-sm text-red-600">
              {errors.publish_at.message}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} variant="primary">
            {loading
              ? "Saving..."
              : mode === "create"
              ? "Create Blog"
              : "Update Blog"}
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
        <div className="mt-3">{formContent}</div>
      </div>
    </div>
  );
};

export default BlogForm;
