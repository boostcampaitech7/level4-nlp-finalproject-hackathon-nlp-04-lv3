import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  setAuth: (token: string | null) => void
  logout: () => void
  checkAuth: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: !!localStorage.getItem('token'),
      token: localStorage.getItem('token'),
      setAuth: (token) => {
        if (token) {
          localStorage.setItem('token', token)
          set({ isAuthenticated: true, token })
        } else {
          localStorage.removeItem('token')
          set({ isAuthenticated: false, token: null })
        }
      },
      logout: () => {
        localStorage.removeItem('token')
        set({ isAuthenticated: false, token: null })
      },
      checkAuth: () => {
        const token = localStorage.getItem('token')
        const isAuthenticated = !!token
        set({ isAuthenticated, token })
        return isAuthenticated
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)