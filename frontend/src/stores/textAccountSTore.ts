import { create } from 'zustand'

interface AccountState {
  account: string
  setAccount: (newText: string) => void
}

export const useTextAccountSTore = create<AccountState>()((set) => ({
  account: '',
  setAccount: (newText) => set({ account: newText }),
}))
