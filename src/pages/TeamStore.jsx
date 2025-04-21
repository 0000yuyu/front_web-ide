import { create } from 'zustand';

//UserList
export const UseUserStore = create((set) => ({
  teamId: 'Today I Learn',
  profile: '', // 예: 이미지 URL
  tiers: 'bronze', // 예: bronze, silver, gold 등

  // 상태 업데이트 함수들
  setTeamId: (id) => set({ teamId: id }),
  setProfile: (url) => set({ profile: url }),
  setTier: (tiers) => set({ tiers }),

  resetUser: () =>
    set({
      teamId: 'Today I Learn',
      profile: '',
      tiers: 'bronze',
    }),
}));

// Team detail menu.js
//notice: 공지사항,
//teamId: 팀ID,
export const UseNotice = create((set) => ({
  notices: [
    { id: 0, title: '팀 프로젝트 시작 안내 (2025.04.20)' },
    { id: 1, title: '스터디 회의는 금요일 19시에 진행됩니다.' },
  ],

  // (선택) 추가용 함수: 추후 관리자 페이지에서 사용 가능
  addNotice: (title) =>
    set((state) => ({
      notices: [...state.notices, { id: state.notices.length, title }],
    })),
}));

//creatQuest / 모달창 구현
export const useModalStore = create((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

// //questDetail
// questId: 문제;
// questStatus: 시작, 진행중, 완료, 로딩중
// joinMember: 참여팀원수;
// questDue: 마감일;
export const useProblemStore = create((set) => ({
  problems: [],
  addProblem: (problem) =>
    set((state) => ({
      problems: [...state.problems, problem],
    })),
}));
