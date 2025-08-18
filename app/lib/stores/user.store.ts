import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { userService } from '@/app/lib/services/user.service';
import type { ApiError } from '@/app/lib/api/client';
import { User, CreateUserRequest, UpdateUserRequest, GetUserResponse } from '@/app/lib/types';

interface UserState {
  // State
  userList: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  fetchUserList: () => Promise<void>;
  createUser: (payload: CreateUserRequest) => Promise<GetUserResponse>;
  updateUser: (id: string, payload: UpdateUserRequest) => Promise<GetUserResponse>;
  deleteUser: (id: string) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools((set, get) => ({
    // Initial state
    userList: [],
    currentUser: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    fetchUserList: async () => {
      try {
        set({ loading: true, error: null });
        const response = await userService.getList();
        set({
          userList: response.data,
          loading: false,
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    createUser: async (payload) => {
      try {
        set({ loading: true, error: null });
        const newUser = await userService.create(payload);
        set((state) => ({
          userList: [newUser.data, ...state.userList],
          loading: false,
        }));
        return newUser;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    updateUser: async (id, payload) => {
      try {
        set({ loading: true, error: null });
        const updatedUser = await userService.update(id, payload);
        set((state) => ({
          userList: state.userList.map((user) =>
            user.id.toString() === id ? updatedUser.data : user
          ),
          currentUser: updatedUser.data,
          loading: false,
        }));
        return updatedUser;
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    deleteUser: async (id) => {
      try {
        set({ loading: true, error: null });
        await userService.delete(id);
        set((state) => ({
          userList: state.userList.filter((user) => user.id.toString() !== id),
          loading: false,
        }));
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },

    fetchUserById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const user = await userService.getById(id);
        set({ currentUser: user.data, loading: false });
      } catch (error) {
        const apiError = error as ApiError;
        set({ error: apiError.message, loading: false });
        throw error;
      }
    },
  }))
);
