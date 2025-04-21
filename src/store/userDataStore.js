import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const userDataStore = create(
  persist(
    (set) => ({
      userId: null,
      nickname: null,
      tier: null,
      email: null,

      setUserId: (userId) => set({ userId }),
      setNickname: (nickname) => set({ nickname }),
      setTier: (tier) => set({ tier }),
      setEmail: (email) => set({ email }),

      setUserProfile: ({ nickname, tier, email }) =>
        set({ nickname, tier, email }),

      resetUserProfile: () =>
        set({
          nickname: null,
          tier: null,
          email: null,
        }),
    }),
    {
      name: 'user-data-storage', // localStorage에 저장될 키
      partialize: (state) => ({
        nickname: state.nickname,
        tier: state.tier,
        email: state.email,
      }),
    }
  )
);
