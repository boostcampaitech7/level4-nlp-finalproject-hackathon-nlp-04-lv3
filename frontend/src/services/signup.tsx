import { SignupData } from 'types/user'
import authenticatedAxios from './authenticatedAxios'

const signup = async (signupData: SignupData) => {
  const axios = authenticatedAxios()
  return axios
    .post(
      `/api/auth/signup`,
      {
        name: signupData.name,
        username: signupData.username,
        password: signupData.password,
        level: signupData.level,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => {
      if (res.status !== 201) {
        throw new Error('회원가입 실패.')
      }

      return { username: signupData.username, password: signupData.password }
    })
    .catch((err) => {
      console.error(`회원가입 실패 ${err}`)
      throw err
    })
}

export default signup
