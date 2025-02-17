import { useQuery } from '@tanstack/react-query'
import { getTextQuizResult } from 'services'
import { QuizResultType } from 'types/quiz'

const useTextQuizResult = (quizId: number) => {
  return useQuery<QuizResultType>({
    queryKey: ['textQuizResult'],
    queryFn: () => getTextQuizResult(quizId),
    enabled: !!quizId,
  })
}

export default useTextQuizResult
