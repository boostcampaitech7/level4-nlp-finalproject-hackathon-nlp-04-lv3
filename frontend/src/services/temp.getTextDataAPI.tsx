import { TextDataType } from 'types'

// TODO: 실제 API 호출 함수로 구현 예정
const getTextDataAPI = (textId: number) => {
  const dummyTextData: TextDataType = {
    text_id: textId,
    title: '연금술사',
    category: '소설',
    text: [
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    ],
  }
  return dummyTextData
}

export default getTextDataAPI
