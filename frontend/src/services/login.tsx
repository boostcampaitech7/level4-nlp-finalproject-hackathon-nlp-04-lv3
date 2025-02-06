import { useNavigate } from 'react-router'
import customAxios from './axiosWithNoToken'
import { useAuthStore } from 'stores/authStore'
import Cookies from 'js-cookie'

interface loginData {
  username: string
  password: string
}

const useLogin = () => {
  const axios = customAxios()
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
        console.log(data)
        const accessToken = data.access_token || ''
        console.log(accessToken)
        // localStorage.setItem('token', accessToken)
        setAuth(accessToken)
        console.log(Cookies.get('access_token'))
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
