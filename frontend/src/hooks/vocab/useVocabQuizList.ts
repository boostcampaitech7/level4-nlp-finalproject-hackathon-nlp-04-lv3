import { useQuery } from '@tanstack/react-query'
import { getVocabQuizList } from 'services'
import { VocabQuizListType } from 'types/vocab'

const useVocabQuizList = (vocabId: number) => {
  return useQuery<VocabQuizListType>({
    queryKey: ['vocabQuizList'],
    queryFn: () => getVocabQuizList(vocabId),
    enabled: !!vocabId,
  })
}

export default useVocabQuizList
