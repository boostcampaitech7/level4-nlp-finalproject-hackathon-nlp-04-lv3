import { TextAccountType } from 'types'

interface TextAccountAPIProps {
  textId: number
  focused: string
}

const getTextAcount = async ({ textId, focused }: TextAccountAPIProps) => {
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

export default getTextAcount
