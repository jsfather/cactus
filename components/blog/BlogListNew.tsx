"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBlogStore } from "../../lib/store/blog";
import Button from "../ui/Button";

const BlogList: React.FC = () => {
  const router = useRouter();
  const { blogs, loading, error, fetchBlogs, deleteBlog, clearError } =
    useBlogStore();

  useEffect(() => {
    // Fetch blogs immediately
    fetchBlogs();

    return () => {
      clearError();
    };
  }, []); // Remove fetchBlogs from dependencies to prevent re-runs

  const handleEdit = (blogId: number) => {
    router.push(`/blog/${blogId}`);
  };

  const handleView = (blogId: number) => {
    router.push(`/blog/${blogId}/view`);
  };

  const handleCreate = () => {
    router.push("/blog/create");
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await deleteBlog(id);
    }
  };

  if (loading || (blogs.length === 0 && !error)) {
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
                onClick={clearError}
                variant="secondary"
                className="bg-red-100 text-red-800 hover:bg-red-200"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <Button onClick={handleCreate} variant="primary">
          Create New Blog
        </Button>
      </div>

      {/* Blog List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {blogs.map((blog) => (
            <li key={blog.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {blog.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {blog.little_description}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>Created: {blog.created_at}</span>
                      {blog.publish_at && (
                        <span className="ml-4">Publish: {blog.publish_at}</span>
                      )}
                    </div>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleView(blog.id)}
                      variant="secondary"
                      size="sm"
                      className="text-green-600 hover:text-green-900"
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => handleEdit(blog.id)}
                      variant="secondary"
                      size="sm"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(blog.id)}
                      variant="danger"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No blogs found. Create your first blog!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
