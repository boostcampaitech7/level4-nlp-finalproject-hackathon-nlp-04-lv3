import basicAxios from './basicAxios'

const checkDuplicate = async (username: string) => {
  const axios = basicAxios()

  return axios
    .post(
      `/api/auth/check_username?username=${username}`,
      {},
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    .then((res) => {
      const { data } = res

      if (res.status !== 200) {
        throw new Error('중복 체크 실패.')
      }
      return data.is_available
    })
    .catch((err) => {
      console.error(`중복 체크 실패 ${err}`)
      throw err
    })
}

export default checkDuplicate
