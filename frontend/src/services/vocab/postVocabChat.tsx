import authenticatedAxios from 'services/authenticatedAxios'
import { ChatType, VocabChatRequestType } from 'types/chat'

const postVocabChat = async (request: VocabChatRequestType) => {
  const axios = authenticatedAxios()

  return axios
    .post(
      '/api/vocab/chatbot',
      {
        vocab_id: request.vocabId,
        question: request.question,
        previous: request.previous.map((item) => {
          return {
            chat_id: item.chatId,
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
        role: 'assistant',
      }
      return answer
    })
    .catch((err) => {
      console.error(`채팅 요청 실패: ${err}`)
      throw err
    })
}

export default postVocabChat
