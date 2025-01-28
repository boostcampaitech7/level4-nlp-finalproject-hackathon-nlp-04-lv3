import { ChatMessage } from 'types/chat'
import { create } from 'zustand'

interface TextChatMessagesState {
  messages: ChatMessage[]
  addMessage: (newMessage: ChatMessage) => void
}

export const useTextChatMessagesStore = create<TextChatMessagesState>()(
  (set) => ({
    messages: [],
    addMessage: (newMessage) => {
      set((state) => ({
        messages: [...state.messages, newMessage],
      }))
      if (newMessage.type === 'user') {
        const answerMessage: ChatMessage = {
          id: newMessage.id + 1,
          content: `답변입니다.`,
          type: 'bot',
          timestamp: new Date(),
        }
        setTimeout(() => {
          set((state) => ({
            messages: [...state.messages, answerMessage],
          }))
        }, 1000)
      }
    },
  }),
)
