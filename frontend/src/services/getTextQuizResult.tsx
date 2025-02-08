import { QuizResultType } from 'types/quiz'
import authenticatedAxios from './authenticatedAxios'

const getTextQuizResult = async (quizId: number) => {
  const axios = authenticatedAxios()

  return axios
    .get(`/api/text_quiz/solve/${quizId}`)
    .then((res) => {
      if (res.status != 200) {
        throw new Error('퀴즈 풀이 결과 데이터를 불러오는 데 실패했습니다.')
      }
      const { data } = res
      const textQuizResult: QuizResultType = {
        question: data.question || [],
        options: data.options || [],
        answer: data.answer || [],
        answerExplain: data.answer_explain || [],
        userAnswer: data.user_answer || [],
        correct: data.correct || [],
      }

      return textQuizResult
    })
    .catch((err) => {
      console.error(`API 요청 에러 발생: ${err}`)
      throw err
    })
}

export default getTextQuizResult
