export interface VocabQuizListType {
  userLevel: number
  levelData: { level: number; quizId: number; isSolved: boolean }[]
}
