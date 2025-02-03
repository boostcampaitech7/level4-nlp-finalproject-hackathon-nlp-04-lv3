// stores/authStore.ts
import { create } from 'zustand'
import Cookies from 'js-cookie'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  /**
   * @param token 로그인 성공 시 발급받은 토큰 (또는 null)
   * @param persistent true인 경우 7일간 유지되는 쿠키, false면 세션 쿠키로 저장합니다.
   */
  setAuth: (token: string | null, persistent?: boolean) => void
  logout: () => void
  checkAuth: () => boolean
}

export const useAuthStore = create<AuthState>((set) => ({
  // 초기 상태는 현재 쿠키에 저장된 토큰을 읽어 결정합니다.
  isAuthenticated: !!Cookies.get('token'),
  token: Cookies.get('token') || null,
  setAuth: (token, persistent = false) => {
    if (token) {
      if (persistent) {
        // persistent가 true이면 7일간 유지되는 쿠키로 설정 (브라우저 종료 후에도 유지)
        Cookies.set('token', token)
      } else {
        // persistent가 false이면 세션 쿠키로 저장 (브라우저 종료 시 삭제)
        Cookies.set('token', token)
      }
      set({ isAuthenticated: true, token })
    } else {
      Cookies.remove('token')
      set({ isAuthenticated: false, token: null })
    }
  },
  logout: () => {
    Cookies.remove('token')
    set({ isAuthenticated: false, token: null })
  },
  checkAuth: () => {
    const token = Cookies.get('token')
    const isAuthenticated = !!token
    set({ isAuthenticated, token: token || null })
    return isAuthenticated
  }
}))
