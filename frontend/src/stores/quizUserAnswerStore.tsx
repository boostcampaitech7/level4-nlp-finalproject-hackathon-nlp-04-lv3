import { QuizSolveType } from 'types/quiz'
import { create } from 'zustand'

interface QuizUserAnswerState {
  quizSolve: QuizSolveType
  setQuizId: (quizId: number) => void
  setAnswer: (questionIdx: number, answer: number) => void
  resetQuizSolve: () => void
}

export const useQuizUserAnswerStore = create<QuizUserAnswerState>()((set) => ({
  quizSolve: {
    quizId: -1,
    userAnswer: [-1, -1, -1],
  },
  setQuizId: (quizId) =>
    set((state) => ({
      quizSolve: {
        quizId: quizId,
        userAnswer: state.quizSolve.userAnswer,
      },
    })),
  setAnswer: (questionIdx: number, answer: number) =>
    set((state) => {
      let prev = state.quizSolve.userAnswer
      prev[questionIdx] = answer
      return {
        quizSolve: {
          quizId: state.quizSolve.quizId,
          userAnswer: prev,
        },
      }
    }),
  resetQuizSolve: () =>
    set({ quizSolve: { quizId: -1, userAnswer: [-1, -1, -1] } }),
}))
