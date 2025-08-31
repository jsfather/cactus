"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBlogStore } from "../../lib/store/blog";
import { Button, MarkdownRenderer } from "@/components/ui";

interface BlogDetailProps {
  blogId: number;
  onBack?: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ blogId, onBack }) => {
  const router = useRouter();
  const {
    currentBlog,
    loading,
    error,
    fetchBlog,
    clearCurrentBlog,
    clearError,
  } = useBlogStore();

  useEffect(() => {
    // Fetch the blog immediately
    fetchBlog(blogId);

    return () => {
      clearCurrentBlog();
      clearError();
    };
  }, [blogId]); // Remove function dependencies to prevent unnecessary re-runs

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/blog");
    }
  };

  // Show loading if we're fetching data or if we don't have data yet
  if (loading || (!currentBlog && !error)) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
            <div className="mt-4">
              <Button
                onClick={handleBack}
                variant="secondary"
                size="sm"
                className="bg-red-100 text-red-800 hover:bg-red-200"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Blog not found.</p>
        <Button onClick={handleBack} variant="primary" className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          onClick={handleBack}
          variant="secondary"
          size="sm"
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Blog List
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {currentBlog.title}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {currentBlog.little_description}
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          <span>Created: {currentBlog.created_at}</span>
          {currentBlog.publish_at && (
            <span>Publish: {currentBlog.publish_at}</span>
          )}
          {currentBlog.user && (
            <span>
              Author: {currentBlog.user.first_name} {currentBlog.user.last_name}
            </span>
          )}
        </div>

        {/* Tags */}
        {currentBlog.tags && currentBlog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {currentBlog.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Content</h2>
        <MarkdownRenderer
          content={currentBlog.description}
          className="text-gray-700"
        />
      </div>

      {/* SEO Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          SEO Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <p className="text-gray-900">{currentBlog.meta_title}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <p className="text-gray-900">{currentBlog.meta_description}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
              {currentBlog.slug}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
