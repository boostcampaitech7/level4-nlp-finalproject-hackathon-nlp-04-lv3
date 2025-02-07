import { useQuery } from '@tanstack/react-query'
import { getTextQuiz } from 'services'
import { QuizType } from 'types/quiz'

const useTextQuiz = (quizId: number) => {
  return useQuery<QuizType>({
    queryKey: ['textQuiz'],
    queryFn: () => getTextQuiz(quizId),
    enabled: !!quizId,
  })
}

export default useTextQuiz
