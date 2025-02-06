import { create } from 'zustand'

interface TextQuizUserAnswerState {
  quizId: number
  userAnswer: number[]
  setQuizId: (quizId: number) => void
  setAnswer: (questionIdx: number, answer: number) => void
  resetQuizSolve: () => void
}

export const useTextQuizUserAnswerStore = create<TextQuizUserAnswerState>()(
  (set) => ({
    quizId: -1,
    userAnswer: [-1, -1, -1],
    setQuizId: (quizId) => set({ quizId }),
    setAnswer: (questionIdx: number, answer: number) =>
      set((state) => ({
        userAnswer: state.userAnswer.map((val, idx) =>
          idx === questionIdx ? answer : val,
        ),
      })),
    resetQuizSolve: () => set({ quizId: -1, userAnswer: [-1, -1, -1] }),
  }),
)
