import { VocabChatPageType } from 'types/chat'
import authenticatedAxios from '../authenticatedAxios'

const getVocabChatList = async (vocabId: number, pageNum: number) => {
  const axios = authenticatedAxios()

  return axios
    .get(`/api/vocab/chatbot/${vocabId}/${pageNum}`)
    .then((res) => {
      if (res.status != 200) {
        throw new Error('대화 내역을 불러오는 데 실패했습니다.')
      }
      const { data } = res
      console.log(data)
      const vocabChatPage: VocabChatPageType = {
        vocabId: data.vocab_id,
        pageNum: data.page_num,
        chats: data.chats.map((chat: any) => {
          return {
            chatId: chat.chat_id,
            question: chat.question,
            answer: chat.answer,
          }
        }),
      }

      return vocabChatPage
    })
    .catch((err) => {
      console.error(`API 요청 에러 발생: ${err}`)
      throw err
    })
}

export default getVocabChatList
