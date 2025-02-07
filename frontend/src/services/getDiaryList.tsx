import customAxios from './authenticatedAxios'
import { DiaryListType } from 'types/diary'

const getDiaryList = async (pageNum: number) => {
  const axios = customAxios()

  return axios
    .get(`/api/diary/page/${pageNum}`)
    .then((res) => {
      if (res.status != 200) {
        throw new Error('일기 목록을 불러오는 데 실패했습니다.')
      }
      const { data } = res
      const diaryList: DiaryListType = {
        pageNum: data.page_num,
        diaries: data.diaries.map((diary: any) => {
          return {
            diaryId: diary.diary_id,
            day: diary.day,
            status: diary.status,
            text: diary.text,
          }
        }),
        totalPageCount: data.total_page_count,
      }

      return diaryList
    })
    .catch((err) => {
      console.error(`API 요청 에러 발생: ${err}`)
      throw err
    })
}

export default getDiaryList
