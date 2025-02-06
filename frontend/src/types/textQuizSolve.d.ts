export interface TextQuizSolveType {
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
