import { TextChatPageType } from 'types/chat'
import authenticatedAxios from './authenticatedAxios'

const getTextChatList = async (textId: number, pageNum: number) => {
  const axios = authenticatedAxios()

  return axios
    .get(`/api/text/chatbot/${textId}/${pageNum}`)
    .then((res) => {
      if (res.status != 200) {
        throw new Error('대화 내역을 불러오는 데 실패했습니다.')
      }
      const { data } = res
      console.log(data)
      const textChatPage: TextChatPageType = {
        textId: data.text_id,
        pageNum: data.page_num,
        chats: data.chats.map((chat: any) => {
          return {
            chatId: chat.chat_id,
            focused: chat.focused,
            question: chat.question,
            answer: chat.answer,
          }
        }),
      }

      return textChatPage
    })
    .catch((err) => {
      console.error(`API 요청 에러 발생: ${err}`)
      throw err
    })
}

export default getTextChatList
