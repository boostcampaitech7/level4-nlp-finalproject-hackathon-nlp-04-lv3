import { useMutation } from '@tanstack/react-query'
import useLogin from 'services/login'
import { signup } from 'services'

const useSignup = () => {
  const login = useLogin()

  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      alert('회원 가입이 완료되었습니다.')
      login({ username: data.username, password: data.password })
    },
    onError: (err: any) => {
      console.error('회원 가입입 실패: ', err)
      alert('회원 가입에 실패했습니다.')
    },
  })
}

export default useSignup
