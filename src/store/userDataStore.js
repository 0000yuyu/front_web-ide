import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const userDataStore = create(
  persist(
    (set) => ({
      userId: null,
      nickname: null,
      tier: null,
      email: null,
      teamId: null,

      setUserId: (userId) => set({ userId }),
      setNickname: (nickname) => set({ nickname }),
      setTier: (tier) => set({ tier }),
      setEmail: (email) => set({ email }),
      setTeamId: (teamId) => set({ teamId }),

      setUserProfile: ({ nickname, tier, email, teamId }) =>
        set({ nickname, tier, email, teamId }),

      resetUserProfile: () =>
        set({
          nickname: null,
          tier: null,
          email: null,
          teamId: null,
        }),
    }),
    {
      name: 'user-data-storage',
      partialize: (state) => ({
        nickname: state.nickname,
        tier: state.tier,
        email: state.email,
        teamId: state.teamId,
      }),
    }
  )
);
