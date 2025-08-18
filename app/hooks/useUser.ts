// DEPRECATED: Use useAuth instead for new code
// This hook is kept for backward compatibility and delegates to useAuth
import { useAuth } from '@/app/lib/hooks/use-auth';
import { UpdateProfileRequest, User } from '@/app/lib/types';

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  logout: () => void;
  refetch: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
}

export function useUser(): UseUserReturn {
  const auth = useAuth();

  return {
    user: auth.user,
    loading: auth.loading,
    error: auth.error ? new Error(auth.error) : null,
    isAuthenticated: auth.isAuthenticated,
    logout: auth.logout,
    refetch: () => auth.fetchProfile(true).then(() => {}),
    updateProfile: async (data: UpdateProfileRequest) => {
      await auth.updateProfile(data);
    },
  };
}
