export interface TextQuizType {
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

export interface TextQuizListType {
  userLevel: number
  levelData: { level: number; quizId: number; isSolved: boolean }[]
}

export interface TextQuizSolveType {
  quizId: number
  userAnswer: [number, number, number]
}

export interface TextQuizResultType {
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
