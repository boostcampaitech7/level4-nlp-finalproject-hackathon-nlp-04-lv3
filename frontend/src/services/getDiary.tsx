import customAxios from './customAxios'
import { DiaryType } from 'types/diary'

const getDiary = async (diaryId: number) => {
  const axios = customAxios()

  return axios
    .get(`/api/diary/diary_id/${diaryId}`)
    .then((res) => {
      console.log(res)
      if (res.status != 200) {
        throw new Error('일기를 불러오는 데 실패했습니다.')
      }
      const { data } = res

      const addLeadingQuoteIfOdd = (str: string) => {
        // 문자열 내의 " 개수
        const qoutes = str.match(/"/g) || []
        const quoteCount = qoutes.length

        // 만약 "의 개수가 홀수라면 맨 앞에 "를 붙여줌
        if (quoteCount % 2 !== 0) {
          return '"' + str
        }

        // 그렇지 않으면 원본 문자열을 그대로 반환
        return str
      }

      const feedback = data.feedback || []
      const processdFeedback = feedback.map(
        (rawData: [number, number, string, string]) => {
          const processed = [
            rawData[0],
            rawData[1],
            addLeadingQuoteIfOdd(rawData[2]),
            addLeadingQuoteIfOdd(rawData[3]),
          ]
          return processed
        },
      )

      const diary: DiaryType = {
        diaryId: data.diary_id,
        status: data.status,
        text: data.text,
        feedback: processdFeedback,
        review: data.review || '',
        createdAt: data.created_at,
      }

      return diary
    })
    .catch((err) => {
      console.error(`API 요청 에러 발생: ${err}`)
      throw err
    })
}

export default getDiary
