import { create } from "zustand";

export const userDataStore = create((set, get) => ({
  user_id: null,
  nickname: null,
  tier: null,
  email: null,
  team_id: null,

  // 데이터 세팅 함수들
  setUser_id: (user_id) => set({ user_id }),
  setNickname: (nickname) => set({ nickname }),
  setTier: (tier) => set({ tier }),
  setEmail: (email) => set({ email }),
  setTeam_id: (team_id) => set({ team_id }),

  setUserProfile: ({ nickname, tier, email, team_id }) =>
    set({ nickname, tier, email, team_id }),

  resetUserProfile: () =>
    set({
      nickname: null,
      tier: null,
      email: null,
      team_id: null,
    }),

  // 세션에서 데이터를 로드하는 함수
  loadFromSessionStorage: () => {
    const savedData = sessionStorage.getItem("user-data");
    if (savedData) {
      const { nickname, tier, email, team_id } = JSON.parse(savedData);
      set({ nickname, tier, email, team_id });
    }
  },

  // 세션에 데이터를 저장하는 함수
  saveToSessionStorage: () => {
    const state = get(); // `get`을 제대로 사용
    sessionStorage.setItem(
      "user-data",
      JSON.stringify({
        nickname: state.nickname,
        tier: state.tier,
        email: state.email,
        team_id: state.team_id,
      })
    );
  },
}));

// 앱이 시작할 때 세션에서 데이터 로드
userDataStore.getState().loadFromSessionStorage();

// 상태가 변할 때마다 세션에 데이터 저장
userDataStore.subscribe(() => {
  userDataStore.getState().saveToSessionStorage();
});
