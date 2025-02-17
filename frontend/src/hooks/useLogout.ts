import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { logout } from 'services'
import { useAuthStore } from 'stores/authStore'

const useLogout = () => {
  const navigate = useNavigate()
  const { logout: setLogout } = useAuthStore()

  return useQuery({
    queryKey: ['auth/logout'],
    queryFn: async () => {
      await logout()
      alert('로그아웃되었습니다.')
      setLogout()
      navigate('/auth/login')
    },
    enabled: false,
  })
}

export default useLogout
