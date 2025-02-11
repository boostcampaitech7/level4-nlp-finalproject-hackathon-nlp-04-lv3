import { useQuery } from '@tanstack/react-query'
import { getVocabQuizResult } from 'services'
import { QuizResultType } from 'types/quiz'

const useVocabQuizResult = (quizId: number) => {
  return useQuery<QuizResultType>({
    queryKey: ['vocabQuizResult'],
    queryFn: () => getVocabQuizResult(quizId),
    enabled: !!quizId,
  })
}

export default useVocabQuizResult
