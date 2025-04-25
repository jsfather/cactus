import { useEffect, useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/auth/send-otp';
  };

  return { isAuthenticated, logout };
}
