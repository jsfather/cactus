const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://kaktos.kanoonbartarha.ir/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('authToken');

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...options.headers,
    },
    ...options,
  });

  return response.json();
}

export default request;
