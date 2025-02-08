import { TextAccountType } from 'types/textAccount'
// import authenticatedAxios from './authenticatedAxios'

interface TextAccountAPIProps {
  textId: number
  focused: string
}

const requestTextAcount = async ({ textId, focused }: TextAccountAPIProps) => {
  // const axios = authenticatedAxios()

  // return axios.post('/api/text/account',
  //   {text_id: textId, focused: focused },
  //   {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   },
  // )
  // .then((res) => {
  //   if (res.status != 200) {
  //     throw new Error('응답 요청에 실패하였습니다.')
  //   }
  //   const { data } = res
  //   const diaryId = data.diary_id
  //   return diaryId
  // })
  // .catch((err) => {
  //   console.error(`일기 저장 실패: ${err}`)
  //   throw err
  // })

  console.log(`${focused}에 대한 쉬운 설명 호출`)
  const dummyTextAccount: TextAccountType = {
    text_id: textId,
    account: `"${focused}"에 대한 쉬운 설명입니다.`,
  }

  await new Promise<TextAccountType>((resolve) => {
    setTimeout(resolve, 2000)
  })
  return dummyTextAccount
}

export default requestTextAcount
