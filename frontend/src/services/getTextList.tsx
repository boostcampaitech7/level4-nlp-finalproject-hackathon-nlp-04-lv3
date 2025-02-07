import { TextListType } from 'types/text'
import customAxios from './customAxios'

const getTextList = async (pageNum: number) => {
  const axios = customAxios()

  return axios
    .get(`/api/text/list/${pageNum}`)
    .then((res) => {
      const { data } = res
      if (res.status != 200) {
        throw new Error('긴 글 목록을 불러오는 데 실패했습니다.')
      }
      const textList: TextListType = {
        pageNum: data.page_num,
        texts: data.texts.map((text: any) => {
          return {
            textId: text.text_id,
            title: text.title,
            category: text.category,
          }
        }),
        totalPageCount: data.total_page_count,
      }

      return textList
    })
    .catch((err) => {
      console.error(`API 요청 에러 발생: ${err}`)
      throw err
    })
}

export default getTextList
