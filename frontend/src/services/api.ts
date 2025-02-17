export interface VocabQuizResponse {
  quiz_id: number
  question: string[]
  options: string[]
  answer: number[]
  user_answer: number[]
  correct: boolean[]
  answer_explain: string[]
}

export const solveVocabQuiz = async (quiz_id: number, level: number): Promise<VocabQuizResponse> => {
  const response = await fetch(`/api/vocab_quiz/solve/${quiz_id}/${level}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quiz_id, level }),
  })

  if (!response.ok) {
    throw new Error('Failed to submit quiz answers')
  }

  return response.json()
}
