import { QuizType } from 'types/quiz'
import authenticatedAxios from './authenticatedAxios'

const getVocabQuiz = async (quizId: number) => {
  const axios = authenticatedAxios()

  return axios
    .get(`/api/vocab_quiz/${quizId}`)
    .then((res) => {
      console.log(res)
      if (res.status != 200) {
        throw new Error('퀴즈 데이터를 불러오는 데 실패했습니다.')
      }
      const { data } = res
      const vocabQuiz: QuizType = {
        question: data?.question || [],
        options: data?.options || [],
      }

      return vocabQuiz
    })
    .catch((err) => {
      console.error(`API 요청 에러 발생: ${err}`)
      throw err
    })
}

export default getVocabQuiz
