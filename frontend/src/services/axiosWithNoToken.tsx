import axios from 'axios'

const customAxios = () => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  })

  return api
}

export default customAxios