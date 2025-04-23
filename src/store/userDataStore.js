<<<<<<< HEAD
import { create } from 'zustand';
=======
import { create } from "zustand";
import { persist } from "zustand/middleware";
>>>>>>> 6e62d7b (refact : Teamlist dummy data deleted)

<<<<<<< HEAD
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
<<<<<<< HEAD

  // 세션에서 데이터를 로드하는 함수
  loadFromSessionStorage: () => {
    const savedData = sessionStorage.getItem('user-data');
    if (savedData) {
      const { nickname, tier, email, team_id } = JSON.parse(savedData);
      set({ nickname, tier, email, team_id });
    }
  },

  // 세션에 데이터를 저장하는 함수
  saveToSessionStorage: () => {
    const state = get(); // `get`을 제대로 사용
    sessionStorage.setItem(
      'user-data',
      JSON.stringify({
=======
=======
export const userDataStore = create(
  // persist 미들웨어를 사용하여 상태를 로컬 스토리지에 저장
  persist(
    // 상태와 액션을 정의하는 함수
    (set) => ({
      // 초기 상태 정의
      userId: null, // 사용자 ID
      nickname: null, // 닉네임
      tier: null, // 티어
      email: null, // 이메일
      teamId: null, // 팀 ID

      // 개별 상태를 업데이트하는 액션 메서드들
      setUserId: (userId) => set({ userId }),
      setNickname: (nickname) => set({ nickname }),
      setTier: (tier) => set({ tier }),
      setEmail: (email) => set({ email }),
      setTeamId: (teamId) => set({ teamId }),

      // 여러 프로필 정보를 한 번에 업데이트하는 메서드
      setUserProfile: ({ nickname, tier, email, teamId }) =>
        set({ nickname, tier, email, teamId }),

      // 사용자 프로필을 초기화하는 메서드
      resetUserProfile: () =>
        set({
          nickname: null,
          tier: null,
          email: null,
          teamId: null,
        }),
    }),
    // persist 미들웨어 옵션
>>>>>>> cf0774b (feat: 채팅 기능 추가)
    {
      // 로컬 스토리지에 저장될 키 이름
      name: "user-data-storage",
      // 로컬 스토리지에 저장할 상태 선택
      partialize: (state) => ({
>>>>>>> 6e62d7b (refact : Teamlist dummy data deleted)
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
