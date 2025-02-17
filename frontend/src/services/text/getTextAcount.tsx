import authenticatedAxios from 'services/authenticatedAxios'

const getTextAcount = async (textId: number, focused: string) => {
  const axios = authenticatedAxios()

  return axios
    .post(
      '/api/text/account',
      { text_id: textId, focused: focused },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      console.log(res)
      if (res.status != 200) {
        throw new Error('설명 요청에 실패하였습니다.')
      }
      const { data } = res
      const explain: string = data.explain
      return explain
    })
    .catch((err) => {
      console.error(`설명 요청 실패: ${err}`)
      const errMsg =
        'AI 서버에 요청이 많아 설명 생성에 실패했어요.\n잠시 뒤에 다시 시도해보시겠어요?'
      return errMsg
    })
}

export default getTextAcount
