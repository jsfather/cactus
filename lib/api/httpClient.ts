const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kaktos.kanoonbartarha.ir/api';

import Cookies from 'js-cookie';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = Cookies.get('authToken');

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'خطایی نامشخص رخ داده است');
  }

  return response.json();
}

export default request;
