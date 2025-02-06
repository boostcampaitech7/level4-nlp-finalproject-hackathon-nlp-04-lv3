import { useQuery } from '@tanstack/react-query'
import { getTextQuiz } from 'services'
import { TextQuizType } from 'types/textQuiz'

const useTextQuiz = (quizId: number) => {
  return useQuery<TextQuizType>({
    queryKey: ['textQuiz'],
    queryFn: () => getTextQuiz(quizId),
    enabled: !!quizId,
  })
}

export default useTextQuiz
