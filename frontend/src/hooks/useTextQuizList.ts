import { useQuery } from '@tanstack/react-query'
import { getTextQuizList } from 'services'
import { QuizListType } from 'types/quiz'

const useTextQuizList = (textId: number) => {
  return useQuery<QuizListType>({
    queryKey: ['textQuizList'],
    queryFn: () => getTextQuizList(textId),
    enabled: !!textId,
  })
}

export default useTextQuizList
