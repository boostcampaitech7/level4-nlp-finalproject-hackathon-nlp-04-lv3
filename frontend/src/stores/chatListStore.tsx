import { ChatType } from 'types/chat'
import { create } from 'zustand'

interface ChatListState {
  chatList: ChatType[]
  scrollDir: number // -1: 아래, 1: 위, 0: default
  addPrevChatList: (prevChatList: ChatType[]) => void
  addNewChat: (newChat: ChatType) => void
  resetChatList: () => void
  setScrollDir: (dir: number) => void
}

export const useChatListStore = create<ChatListState>()((set) => ({
  chatList: [],
  scrollDir: 0,
  addPrevChatList: (prevChatList) =>
    set((state) => {
      const uniqueChatlist: ChatType[] = []
      prevChatList.forEach((prevChat) => {
        if (
          !state.chatList.some(
            (chat) => chat.id === prevChat.id && chat.text === prevChat.text,
          )
        ) {
          uniqueChatlist.push(prevChat)
        }
      })
      return {
        chatList: [...uniqueChatlist, ...state.chatList],
        scrollDir: state.scrollDir,
      }
    }),
  addNewChat: (newChat) => {
    set((state) => ({
      chatList: [...state.chatList, newChat],
      scrollDir: state.scrollDir,
    }))
  },
  resetChatList: () => set({ chatList: [], scrollDir: 0 }),
  setScrollDir: (dir) =>
    set((state) => ({ chatList: state.chatList, scrollDir: dir })),
}))
