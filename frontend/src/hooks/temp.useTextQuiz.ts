import { useQuery } from '@tanstack/react-query'
import getTextQuizAPI from 'services/temp.getTextQuizAPI'
import { TextQuizType } from 'types/textQuiz'

const useTextQuiz = (quizId: number) => {
  // TODO: 실제 api 함수 연결 및 훅 세부 설정 구현 예정
  return useQuery<TextQuizType>({
    queryKey: ['textQuiz'],
    queryFn: () => getTextQuizAPI(quizId),
    enabled: !!quizId,
  })
}

export default useTextQuiz
