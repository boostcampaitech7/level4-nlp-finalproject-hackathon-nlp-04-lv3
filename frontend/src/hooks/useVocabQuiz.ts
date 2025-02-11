import { useQuery } from '@tanstack/react-query'
import { getVocabQuiz } from 'services'
import { QuizType } from 'types/quiz'

const useVocabQuiz = (vocabId: number) => {
  return useQuery<QuizType>({
    queryKey: ['vocabQuiz'],
    queryFn: () => getVocabQuiz(vocabId),
    enabled: !!vocabId,
  })
}

export default useVocabQuiz
