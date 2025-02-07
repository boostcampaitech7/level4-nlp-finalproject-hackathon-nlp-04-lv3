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
