import request from '../../httpClient';

export interface Blog {
  id: string;
  title: string;
  little_description: string;
  description: string;
  meta_title: string;
  meta_description: string;
}

export const getBlogs = () => request<Blog[]>('admin/blogs');

export const getBlog = (id: string) => request<Blog>(`admin/blogs/${id}`);

export const createBlog = async (data: Partial<Blog>) => {
  const response = await request<Blog>('admin/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response) {
    throw new Error('خطایی در ایجاد بلاگ رخ داده است');
  }
  
  return response;
};

export const updateBlog = (id: string, data: Partial<Blog>) =>
  request<Blog>(`admin/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteBlog = async (id: string) => {
  const response = await request<Blog>(`admin/blogs/${id}`, {
    method: 'DELETE',
  });

  if (!response) {
    throw new Error('خطایی در حذف بلاگ رخ داده است');
  }
  
};
