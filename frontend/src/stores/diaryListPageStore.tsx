import { create } from 'zustand'

interface DiaryListPageState {
  currentPage: number
  totalPages: number
  setCurrentPage: (pageNum: number) => void
  setTotalPages: (totalPages: number) => void
  resetPages: () => void
}

export const useDiaryListPageStore = create<DiaryListPageState>()((set) => ({
  currentPage: 1,
  totalPages: 5,
  setCurrentPage: (pageNum) =>
    set((state) => ({ currentPage: pageNum, totalPages: state.totalPages })),
  setTotalPages: (totalPages) =>
    set((state) => ({
      currentPage: state.currentPage,
      totalPages: totalPages,
    })),
  resetPages: () =>
    set(() => ({
      currentPage: 1,
      totalPages: 5,
    })),
}))
