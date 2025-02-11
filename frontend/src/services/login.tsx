import { useNavigate } from 'react-router'
import basicAxios from './basicAxios'
import { useAuthStore } from 'stores/authStore'
import { loginData } from 'types/user'

const useLogin = () => {
  const axios = basicAxios()
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const login = async ({ username, password }: loginData) => {
    return axios
      .post(
        `/auth/login`,
        { username: username, password: password },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then((res) => {
        const { data } = res

        if (res.status !== 200) {
          throw new Error('로그인 실패.')
        }
        const accessToken = data.access_token || ''
        setAuth(accessToken)
        navigate('/')
      })
      .catch((err) => {
        console.error(`로그인 실패 ${err}`)
        throw err
      })
  }
  return login
}

export default useLogin
