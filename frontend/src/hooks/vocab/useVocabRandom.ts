import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import getVocabRandom from 'services/getVocabRandom'

const useVocabRandom = () => {
  const navigate = useNavigate()

  const queryResults = useQuery({
    queryKey: ['vocabRandom'],
    queryFn: getVocabRandom,
    enabled: false,
  })

  useEffect(() => {
    if (!queryResults.isFetching && queryResults.data) {
      navigate(`/vocab/${queryResults.data?.vocab_id}`)
    }
  }, [queryResults.isFetching, queryResults.data])

  return { ...queryResults }
}

export default useVocabRandom
