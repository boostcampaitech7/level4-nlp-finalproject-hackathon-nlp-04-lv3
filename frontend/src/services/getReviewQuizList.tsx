import { VocabReviewQuizType } from 'types/quiz'
import authenticatedAxios from './authenticatedAxios'

const getReviewQuizList = async () => {
  const axios = authenticatedAxios()

  return axios
    .get(`/api/main/vocab_review`)
    .then((res) => {
      console.log(res)
      if (res.status != 200) {
        throw new Error('퀴즈 데이터를 불러오는 데 실패했습니다.')
      }
      const { data } = res
      const vocabReviewQuizList: VocabReviewQuizType[] = data.map(
        (item: any) => {
          return {
            recordId: item.record_id,
            vocabId: item.vocab_id,
            vocab: item.vocab,
            hanja: item.hanja,
            dictMean: item.dict_mean,
            easyExplain: item.easy_explain,
            correctExample: item.correct_example,
            incorrectExample: item.incorrect_example,
            quizId: item.quiz_id,
            quizLevel: item.quiz_level,
            quizQuestion: item.quiz_question,
            quizOptions: item.quiz_options,
            quizCorrect: item.quiz_correct,
            quizUserAnswer: item.quiz_user_answer,
            quizAnswer: item.quiz_answer,
            quizAnswerExplain: item.quiz_answer_explain,
          }
        },
      )

      return vocabReviewQuizList
    })
    .catch((err) => {
      console.error(`API 요청 에러 발생: ${err}`)
      throw err
    })
}

export default getReviewQuizList
