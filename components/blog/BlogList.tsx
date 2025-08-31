"use client";

import React, { useEffect, useState } from "react";
import { useBlogStore } from "../../lib/store/blog";
import { Blog } from "../../lib/types/blog";
import BlogForm from "./BlogForm";
import BlogDetail from "./BlogDetail";
import { Button } from "@/components/ui";

const BlogList: React.FC = () => {
  const { blogs, loading, error, fetchBlogs, deleteBlog, clearError } =
    useBlogStore();

  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormMode("edit");
    setShowForm(true);
    setShowDetail(false);
  };

  const handleView = (blog: Blog) => {
    setSelectedBlog(blog);
    setShowDetail(true);
    setShowForm(false);
  };

  const handleCreate = () => {
    setSelectedBlog(null);
    setFormMode("create");
    setShowForm(true);
    setShowDetail(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await deleteBlog(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedBlog(null);
  };

  const handleDetailClose = () => {
    setShowDetail(false);
    setSelectedBlog(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedBlog(null);
    fetchBlogs();
  };

  if (showDetail && selectedBlog) {
    return <BlogDetail blogId={selectedBlog.id} onBack={handleDetailClose} />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
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
                size="sm"
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
                      onClick={() => handleView(blog)}
                      variant="secondary"
                      size="sm"
                      className="text-green-600 hover:text-green-900"
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => handleEdit(blog)}
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

      {/* Blog Form Modal */}
      {showForm && (
        <BlogForm
          blog={selectedBlog}
          mode={formMode}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default BlogList;
