import { useQuery } from '@tanstack/react-query'
import { getTextQuizList } from 'services'
import { TextQuizListType } from 'types/textQuiz'

const useTextQuizList = (textId: number) => {
  return useQuery<TextQuizListType>({
    queryKey: ['textQuizList'],
    queryFn: () => getTextQuizList(textId),
    enabled: !!textId,
  })
}

export default useTextQuizList
