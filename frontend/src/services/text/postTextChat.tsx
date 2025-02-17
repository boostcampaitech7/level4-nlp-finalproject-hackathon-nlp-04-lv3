import authenticatedAxios from 'services/authenticatedAxios'
import { ChatType, TextChatRequestType } from 'types/chat'

const postTextChat = async (request: TextChatRequestType) => {
  const axios = authenticatedAxios()

  return axios
    .post(
      '/api/text/chatbot',
      {
        text_id: request.textId,
        focused: request.focused,
        question: request.question,
        previous: request.previous.map((item) => {
          return {
            chat_id: item.chatId,
            focused: item.focused,
            question: item.question,
            answer: item.answer,
          }
        }),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      console.log(res)
      if (res.status != 200) {
        throw new Error('채팅 요청에 실패하였습니다.')
      }
      const { data } = res
      const answer: ChatType = {
        id: data.chat_id,
        text: data.answer,
        focused: '',
        role: 'assistant',
      }
      return answer
    })
    .catch((err) => {
      console.error(`채팅 요청 실패: ${err}`)
      throw err
    })
}

export default postTextChat
