import { ChatType } from 'types/chat'
import { create } from 'zustand'

interface ChatListState {
  chatList: ChatType[]
  addPrevChatList: (prevChatList: ChatType[]) => void
  addNewChat: (newChat: ChatType) => void
  resetChatList: () => void
}

export const useChatListStore = create<ChatListState>()((set) => ({
  chatList: [],
  addPrevChatList: (prevChatList) =>
    set((state) => ({
      chatList: [...prevChatList, ...state.chatList],
    })),
  addNewChat: (newChat) => {
    set((state) => ({ chatList: [...state.chatList, newChat] }))
  },
  resetChatList: () => set({ chatList: [] }),
}))
