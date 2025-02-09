import { useQuery } from '@tanstack/react-query'
import { getReviewQuizList } from 'services'
import { VocabReviewQuizType } from 'types/quiz'

const useReviewQuizList = () => {
  return useQuery<VocabReviewQuizType[]>({
    queryKey: ['reviewQuizList'],
    queryFn: getReviewQuizList,
  })
}

export default useReviewQuizList
