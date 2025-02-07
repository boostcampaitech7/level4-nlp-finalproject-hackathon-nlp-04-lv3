import { QuizSolveType } from 'types/quiz'
import { create } from 'zustand'

interface TextQuizUserAnswerState {
  textQuizSolve: QuizSolveType
  setQuizId: (quizId: number) => void
  setAnswer: (questionIdx: number, answer: number) => void
  resetQuizSolve: () => void
}

export const useTextQuizUserAnswerStore = create<TextQuizUserAnswerState>()(
  (set) => ({
    textQuizSolve: {
      quizId: -1,
      userAnswer: [-1, -1, -1],
    },
    setQuizId: (quizId) =>
      set((state) => ({
        textQuizSolve: {
          quizId: quizId,
          userAnswer: state.textQuizSolve.userAnswer,
        },
      })),
    setAnswer: (questionIdx: number, answer: number) =>
      set((state) => {
        let prev = state.textQuizSolve.userAnswer
        prev[questionIdx] = answer
        return {
          textQuizSolve: {
            quizId: state.textQuizSolve.quizId,
            userAnswer: prev,
          },
        }
      }),
    resetQuizSolve: () =>
      set({ textQuizSolve: { quizId: -1, userAnswer: [-1, -1, -1] } }),
  }),
)
