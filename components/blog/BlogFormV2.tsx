"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBlogStore } from "../../lib/store/blog";
import { Blog } from "../../lib/types/blog";
import {
  createBlogSchema,
  updateBlogSchema,
  CreateBlogInput,
  UpdateBlogInput,
} from "../../lib/validations/blog";
import { Button, Input, Textarea, TagInput, DateTimePicker, MarkdownEditor, Select } from "@/components/ui";

interface BlogFormProps {
  blog?: Blog | null;
  mode: "create" | "edit";
  onClose: () => void;
  onSuccess: () => void;
  isPage?: boolean;
}

const BlogFormV2: React.FC<BlogFormProps> = ({
  blog,
  mode,
  onClose,
  onSuccess,
  isPage = false,
}) => {
  const { createBlog, updateBlog, loading } = useBlogStore();

  const schema = mode === "create" ? createBlogSchema : updateBlogSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch,
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
          publish_at: blog.publish_at || new Date().toISOString(),
          tags: blog.tags || [],
        }
      : {
          title: "",
          little_description: "",
          description: "",
          meta_title: "",
          meta_description: "",
          slug: "",
          publish_at: new Date().toISOString(),
          tags: [],
        },
  });

  const onSubmit = async (data: CreateBlogInput | UpdateBlogInput) => {
    try {
      if (mode === "create") {
        await createBlog(data as CreateBlogInput);
      } else if (blog) {
        await updateBlog(blog.id, data as UpdateBlogInput);
      }
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Title"
          {...register("title")}
          error={errors.title?.message}
        />

        <Input
          label="Slug"
          {...register("slug")}
          error={errors.slug?.message}
        />
      </div>

      <Textarea
        label="Little Description"
        {...register("little_description")}
        error={errors.little_description?.message}
        rows={3}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <MarkdownEditor
            label="Description"
            value={field.value || ""}
            onChange={field.onChange}
            error={errors.description?.message}
          />
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Meta Title"
          {...register("meta_title")}
          error={errors.meta_title?.message}
        />

        <Controller
          name="publish_at"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              label="Publish Date"
              value={field.value || ""}
              onChange={field.onChange}
              error={errors.publish_at?.message}
            />
          )}
        />
      </div>

      <Textarea
        label="Meta Description"
        {...register("meta_description")}
        error={errors.meta_description?.message}
        rows={3}
      />

      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <TagInput
            value={field.value || []}
            onChange={field.onChange}
            error={errors.tags?.message}
          />
        )}
      />

      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? "Saving..." : mode === "create" ? "Create Blog" : "Update Blog"}
        </Button>
      </div>
    </form>
  );

  if (isPage) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {mode === "create" ? "Create New Blog" : "Edit Blog"}
        </h1>
        {formContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {mode === "create" ? "Create New Blog" : "Edit Blog"}
          </h3>
          {formContent}
        </div>
      </div>
    </div>
  );
};

export default BlogFormV2;
