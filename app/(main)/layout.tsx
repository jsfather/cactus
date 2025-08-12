'use client';

import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    deleteUser,
    clearError,
  } = useUser();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
