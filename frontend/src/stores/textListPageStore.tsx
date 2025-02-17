import { create } from 'zustand'

interface TextListPageState {
  currentPage: number
  totalPages: number
  setCurrentPage: (pageNum: number) => void
  setTotalPages: (totalPages: number) => void
}

export const useTextListPageStore = create<TextListPageState>()((set) => ({
  currentPage: 1,
  totalPages: 5,
  setCurrentPage: (pageNum) =>
    set((state) => ({ currentPage: pageNum, totalPages: state.totalPages })),
  setTotalPages: (totalPages) =>
    set((state) => ({
      currentPage: state.currentPage,
      totalPages: totalPages,
    })),
}))
