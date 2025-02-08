import authenticatedAxios from './authenticatedAxios'

const getVocabByNumber = async (vocabId: number) => {
  const axios = authenticatedAxios()
  return axios
    .get(`/api/vocab/${vocabId}`)
    .then((res) => {
      console.log(res)
      if (res.status !== 200) {
        throw new Error('Failed to get vocab data')
      }
      // 받아온 데이터를 구조분해 할당하여 원하는 형태로 반환할 수 있습니다.
      const {
        vocab_id,
        vocab,
        hanja,
        dict_mean,
        easy_explain,
        correct_example,
        incorrect_example,
      } = res.data
      console.log(res.data)
      return {
        vocab_id,
        vocab,
        hanja,
        dict_mean,
        easy_explain,
        correct_example,
        incorrect_example,
      }
    })
    .catch((err) => {
      console.error(err)
      throw new Error('Failed to get vocab data')
    })
}

export default getVocabByNumber
