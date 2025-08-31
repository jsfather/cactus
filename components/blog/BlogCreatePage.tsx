"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BlogForm from "./BlogFormRefactored";

const BlogCreatePage: React.FC = () => {
  const router = useRouter();

  const handleFormClose = () => {
    router.push("/blog");
  };

  const handleFormSuccess = () => {
    router.push("/blog");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={handleFormClose}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
          >
            ← Back to Blog List
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Blog</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <BlogForm
          blog={null}
          mode="create"
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          isModal={false}
        />
      </div>
    </div>
  );
};

export default BlogCreatePage;
