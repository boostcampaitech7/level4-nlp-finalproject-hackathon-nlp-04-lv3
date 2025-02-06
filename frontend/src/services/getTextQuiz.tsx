import { TextQuizType } from 'types/textQuiz'
import customAxios from './customAxios'

const getTextQuiz = async (quizId: number) => {
  const axios = customAxios()

  return axios
    .get(`/api/text_quiz/${quizId}`)
    .then((res) => {
      if (res.status != 200) {
        throw new Error('퀴즈 데이터를 불러오는 데 실패했습니다.')
      }
      const { data } = res
      const textQuiz: TextQuizType = {
        question: data?.question || [],
        options: data?.options || [],
      }

      return textQuiz
    })
    .catch((err) => {
      console.error(`API 요청 에러 발생: ${err}`)
      throw err
    })
}

export default getTextQuiz
