import { useCallback } from 'react';
import { useUserStore } from '@/app/lib/stores/user.store';
import { CreateUserRequest, UpdateUserRequest } from '@/app/lib/types';

export const useUser = () => {
  const store = useUserStore();

  const fetchUserList = useCallback(() => store.fetchUserList(), [store.fetchUserList]);

  const createUser = useCallback(
    (payload: CreateUserRequest) => store.createUser(payload),
    [store.createUser]
  );

  const updateUser = useCallback(
    (id: string, payload: UpdateUserRequest) => store.updateUser(id, payload),
    [store.updateUser]
  );

  const deleteUser = useCallback(
    (id: string) => store.deleteUser(id),
    [store.deleteUser]
  );

  const fetchUserById = useCallback(
    (id: string) => store.fetchUserById(id),
    [store.fetchUserById]
  );

  return {
    // State
    userList: store.userList,
    currentUser: store.currentUser,
    loading: store.loading,
    error: store.error,

    // Actions
    fetchUserList,
    updateUser,
    createUser,
    deleteUser,
    fetchUserById,
    clearError: store.clearError,
  };
};
