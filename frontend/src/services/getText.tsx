import customAxios from './customAxios'
import { TextDataType } from 'types/text'

const getText = (textId: number) => {
  const axios = customAxios()

  return axios
    .get(`/api/text/${textId}`)
    .then((res) => {
      if (res.status != 200) {
        throw new Error('긴 글 데이터를 불러오는 데 실패했습니다.')
      }
      const { data } = res

      const text: TextDataType = {
        text_id: data.text_id,
        title: data.title,
        text: data.content.map((sentence: string) => {
          return sentence.trim()
        }),
        category: data.category,
      }

      return text
    })
    .catch((err) => {
      console.error(`API 요청 에러 발생: ${err}`)
      throw err
    })
}

export default getText
