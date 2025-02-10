import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getVocabChatList } from 'services'
import { useChatListStore } from 'stores/chatListStore'
import { ChatType } from 'types/chat'

const useVocabChatList = (vocabId: number) => {
  // 현재까지 조회한 페이지 숫자의 최댓값
  const [pageNum, setPageNum] = useState<number>(0)
  const { addPrevChatList } = useChatListStore()

  const queryResult = useQuery({
    queryKey: ['vocabChatList'],
    queryFn: async () => {
      const vocabChatList = await getVocabChatList(vocabId, pageNum + 1)
      if (vocabChatList.chats.length === 0) {
        // 더 이상 대화 내역이 없으면 페이지를 -999로 만들어서 더 이상 refetch 안 일어나게 막음
        setPageNum(-999)
      } else {
        // store update
        let prevChatList: ChatType[] = []
        vocabChatList.chats.reverse().forEach((chat) => {
          prevChatList.push({
            id: chat.chatId,
            text: chat.question,
            role: 'user',
          })
          prevChatList.push({
            id: chat.chatId,
            text: chat.answer,
            role: 'assistant',
          })
        })
        addPrevChatList(prevChatList)
        setPageNum((prev) => prev + 1)
      }
      return vocabChatList
    },
    enabled: false,
  })

  return { ...queryResult, pageNum }
}

export default useVocabChatList
