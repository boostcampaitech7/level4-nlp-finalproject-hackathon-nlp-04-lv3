import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { logout } from 'services'
import { useAuthStore } from 'stores/authStore'

const useLogout = () => {
  const navigate = useNavigate()
  const { logout: setLogout } = useAuthStore()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      alert('로그아웃 되었습니다.')
      setLogout()
      navigate(`/auth/login`)
    },
    onError: (err: any) => {
      console.error('로그아웃 실패: ', err)
      alert('로그아웃에 실패했습니다.')
    },
  })
}

export default useLogout
