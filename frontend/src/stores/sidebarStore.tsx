import { create } from 'zustand'

interface SidebarState {
  isSidebarOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
}

export const useSidebarStore = create<SidebarState>()((set) => ({
  isSidebarOpen: false,
  openSidebar: () => set(() => ({ isSidebarOpen: true })),
  closeSidebar: () => set(() => ({ isSidebarOpen: false })),
}))
