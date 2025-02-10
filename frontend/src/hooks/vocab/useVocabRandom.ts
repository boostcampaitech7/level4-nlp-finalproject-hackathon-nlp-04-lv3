import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import getVocabRandom from 'services/getVocabRandom'

const useVocabRandom = () => {
  const navigate = useNavigate()

  const queryResults = useQuery({
    queryKey: ['vocabRandom'],
    queryFn: getVocabRandom,
    enabled: false,
  })

  const navigateToRandomPage = async () => {
    await queryResults.refetch()
    if (queryResults.data?.vocab_id) {
      navigate(`/vocab/${queryResults.data?.vocab_id}`)
    }
  }

  return { ...queryResults, navigateToRandomPage }
}

export default useVocabRandom
