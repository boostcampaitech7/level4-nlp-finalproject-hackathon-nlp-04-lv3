import { create } from 'zustand'

interface DiaryTextState {
  diaryText: string
  setDiaryText: (newText: string) => void
}

export const useDiaryTextStore = create<DiaryTextState>()((set) => ({
  diaryText: '',
  setDiaryText: (newText) => set({ diaryText: newText }),
}))
