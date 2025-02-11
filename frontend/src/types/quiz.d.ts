export interface QuizType {
  question: [string, string, string]
  options: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ]
}

export interface QuizListType {
  userLevel: number
  levelData: { level: number; quizId: number; isSolved: boolean }[]
}

export interface QuizSolveType {
  quizId: number
  userAnswer: [number, number, number]
}

export interface QuizResultType {
  question: [string, string, string]
  options: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ]
  answer: [number, number, number]
  answerExplain: [string, string, string]
  userAnswer: [number, number, number]
  correct: [boolean, boolean, boolean]
}

export interface VocabReviewQuizType {
  recordId: number
  vocabId: number
  vocab: string
  hanja: string
  dictMean: string
  easyExplain: string
  correctExample: string[]
  incorrectExample: string
  quizId: number
  quizLevel: number
  quizQuestion: string[]
  quizOptions: string[]
  quizCorrect: boolean[]
  quizUserAnswer: number[]
  quizAnswer: number[]
  quizAnswerExplain: string[]
}
