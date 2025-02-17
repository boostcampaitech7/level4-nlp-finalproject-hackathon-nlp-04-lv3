import { create } from 'zustand'

interface AccountState {
  account: string
  isFetching: boolean
  setAccount: (newText: string) => void
  setIsFetching: (fetching: boolean) => void
}

export const useTextAccountStore = create<AccountState>()((set) => ({
  account: '',
  isFetching: false,
  setAccount: (newText) => set({ account: newText }),
  setIsFetching: (fetching) => set({ isFetching: fetching }),
}))
