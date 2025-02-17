import { TextDataType } from 'types/text'
import authenticatedAxios from './authenticatedAxios'

const getTodayTextList = async () => {
  const axios = authenticatedAxios()

  return axios
    .get(`/api/main/text`)
    .then((res) => {
      const { data } = res
      if (res.status != 200) {
        throw new Error('오늘의 글 목록을 불러오는 데 실패했습니다.')
      }
      const textList: TextDataType[] = data.map((text: any) => {
        return {
          textId: text.text_id,
          title: text.title,
          category: text.category,
          content: text.content,
        }
      })

      return textList
    })
    .catch((err) => {
      console.error(`API 요청 에러 발생: ${err}`)
      throw err
    })
}

export default getTodayTextList
