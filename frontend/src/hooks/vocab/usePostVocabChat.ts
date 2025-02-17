import { useMutation } from '@tanstack/react-query'
import postVocabChat from 'services/vocab/postVocabChat'
import { useChatListStore } from 'stores/chatListStore'
import { ChatType, VocabChatRequestType, VocabChatSetType } from 'types/chat'

const usePostVocabChat = (vocabId: number) => {
  const { chatList, addNewChat, setScrollDir } = useChatListStore()

  const getPreviousChats = (chatList: ChatType[]) => {
    let previousChats: VocabChatSetType[] = []

    for (let i = 0; i < chatList.length; i += 2) {
      const userChat = chatList[i]
      const assistantChat = chatList[i + 1]
      if (userChat && assistantChat) {
        const chatSet: VocabChatSetType = {
          chatId: assistantChat?.id,
          question: userChat?.text,
          answer: assistantChat?.text,
        }
        previousChats.push(chatSet)
      }
    }

    return previousChats
  }

  const previous = getPreviousChats(chatList.slice(-10))

  const mutationResults = useMutation({
    mutationFn: postVocabChat,
    onSuccess: (answer: ChatType) => {
      setScrollDir(-1)
      addNewChat(answer)
    },
    onError: (err: any) => {
      console.error('채팅 요청 실패: ', err)
      const errorChat: ChatType = {
        id: (chatList[-1]?.id || chatList.length) + 1,
        text: '답변 생성에 실패하였습니다. 잠시 뒤 다시 한 번 시도해주세요.',
        focused: '',
        role: 'assistant',
      }
      setScrollDir(-1)
      addNewChat(errorChat)
    },
  })

  const submitQuestion = (question: string) => {
    if (question) {
      const request: VocabChatRequestType = {
        vocabId: vocabId,
        question: question,
        previous: previous,
      }
      mutationResults.mutate(request)
    }
  }

  return { ...mutationResults, submitQuestion }
}

export default usePostVocabChat
