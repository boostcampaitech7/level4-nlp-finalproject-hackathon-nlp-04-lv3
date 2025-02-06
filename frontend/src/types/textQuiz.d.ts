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
