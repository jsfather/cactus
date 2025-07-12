'use client';

// For local Next.js API routes, we don't need the external API URL
const API_URL = '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value;
      }
    });
  }

  const token = localStorage.getItem('authToken');

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // For Next.js API routes, we use the path directly
  const url = path.startsWith('/api') ? path : `${API_URL}/${path}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'خطایی رخ داده است');
  }

  return response.json();
}

export default request;
