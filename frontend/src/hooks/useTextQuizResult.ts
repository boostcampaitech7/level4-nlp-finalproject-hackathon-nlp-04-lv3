import { useQuery } from '@tanstack/react-query'
import { getTextQuizResult } from 'services'
import { TextQuizResultType } from 'types/textQuiz'

const useTextQuizResult = (quizId: number) => {
  return useQuery<TextQuizResultType>({
    queryKey: ['textQuizResult'],
    queryFn: () => getTextQuizResult(quizId),
    enabled: !!quizId,
  })
}

export default useTextQuizResult
