import authenticatedAxios from './authenticatedAxios'

const postDiary = async (text: string) => {
  const axios = authenticatedAxios()

  return axios
    .post(
      '/api/diary/save',
      { text: text },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      if (res.status != 202) {
        throw new Error('일기 저장에 실패하였습니다.')
      }
      const { data } = res
      const diaryId = data.diary_id
      return diaryId
    })
    .catch((err) => {
      console.error(`일기 저장 실패: ${err}`)
      throw err
    })
}

export default postDiary
