import { TextQuizSolveType } from 'types/textQuiz'
import authenticatedAxios from './authenticatedAxios'

const postTextQuizSolve = async ({ quizId, userAnswer }: TextQuizSolveType) => {
  const axios = authenticatedAxios()
  return axios
    .post(
      `/api/text_quiz/solve`,
      { quiz_id: quizId, user_answer: userAnswer },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      if (res.status !== 200) {
        throw new Error('퀴즈 풀이 제출에 실패하였습니다.')
      }
      return quizId
    })
    .catch((err) => {
      console.error(`로그인 실패 ${err}`)
      throw err
    })
}

export default postTextQuizSolve
