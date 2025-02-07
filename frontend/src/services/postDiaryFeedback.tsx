import customAxios from './customAxios'

const postDiaryFeedback = async (text: string) => {
  const axios = customAxios()

  return axios
    .post(
      '/api/diary/feedback',
      { text: text },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      if (res.status != 202) {
        throw new Error('일기 제출에 실패하였습니다.')
      }
      const { data } = res
      const diaryId = data.diary_id
      return diaryId
    })
    .catch((err) => {
      console.error(`일기 제출 실패: ${err}`)
      throw err
    })
}

export default postDiaryFeedback
