import { QuizListType } from 'types/quiz'
import authenticatedAxios from './authenticatedAxios'

const getTextQuizList = (textId: number) => {
  const axios = authenticatedAxios()

  return axios
    .get(`/api/level/text/${textId}`)
    .then((res) => {
      if (res.status != 200) {
        throw new Error('퀴즈 목록을 불러오는 데 실패했습니다.')
      }
      const { data } = res
      console.log(data)
      const textQuizList: QuizListType = {
        userLevel: data.user_level,
        levelData: data.level_data.map((quiz: any) => {
          return {
            level: quiz.level,
            quizId: quiz.quiz_id,
            isSolved: quiz.is_solved,
          }
        }),
      }

      return textQuizList
    })
    .catch((err) => {
      console.error(`API 요청 에러 발생: ${err}`)
      throw err
    })
}

export default getTextQuizList
