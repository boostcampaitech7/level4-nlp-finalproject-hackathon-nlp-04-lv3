import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getTextChatList } from 'services'
import { useChatListStore } from 'stores/chatListStore'
import { ChatType } from 'types/chat'

const useTextChatList = (textId: number) => {
  // 현재까지 조회한 페이지 숫자의 최댓값
  const [pageNum, setPageNum] = useState<number>(0)
  const { addPrevChatList } = useChatListStore()

  const queryResult = useQuery({
    queryKey: ['textChatList'],
    queryFn: async () => {
      const textChatList = await getTextChatList(textId, pageNum + 1)
      if (textChatList.chats.length === 0) {
        // 더 이상 대화 내역이 없으면 페이지를 -999로 만들어서 더 이상 refetch 안 일어나게 막음
        setPageNum(-999)
      } else {
        // store update
        let prevChatList: ChatType[] = []
        textChatList.chats.reverse().forEach((chat) => {
          prevChatList.push({
            id: chat.chatId,
            text: chat.question,
            focused: chat.focused,
            role: 'user',
          })
          prevChatList.push({
            id: chat.chatId,
            text: chat.answer,
            focused: chat.focused,
            role: 'assistant',
          })
        })
        addPrevChatList(prevChatList)
        setPageNum((prev) => prev + 1)
      }
      return textChatList
    },
    enabled: false,
  })

  return { ...queryResult, pageNum }
}

export default useTextChatList
