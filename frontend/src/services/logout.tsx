import customAxios from './customAxios'

const postLogout = async () => {
  const axios = customAxios()

  return axios
    .get('/api/auth/logout')
    .then((res) => {
      if (res.status != 200) {
        throw new Error('로그아웃에 실패하였습니다.')
      }

      return true
    })
    .catch((err) => {
      console.error(`로그아웃 실패: ${err}`)
      throw err
    })
}

export default postLogout
