import { useQuery } from '@tanstack/react-query'
import { getTextQuizSolve } from 'services'
import { TextQuizSolveType } from 'types/textQuizSolve'

const useTextQuizSolve = (quizId: number) => {
  // TODO: 실제 api 함수 연결 및 훅 세부 설정 구현 예정
  return useQuery<TextQuizSolveType>({
    queryKey: ['textQuizSolve'],
    queryFn: () => getTextQuizSolve(quizId),
    enabled: !!quizId,
  })
}

export default useTextQuizSolve
