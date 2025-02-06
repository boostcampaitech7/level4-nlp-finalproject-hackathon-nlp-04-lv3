import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { postTextQuizSolve } from 'services'
import { useTextQuizUserAnswerStore } from 'stores/textQuizUserAnswerStore'

const usePostTextQuizSolve = (textId: number) => {
  const navigate = useNavigate()
  const { resetQuizSolve } = useTextQuizUserAnswerStore()

  return useMutation({
    mutationFn: postTextQuizSolve,
    onSuccess: (quizId: number) => {
      alert('퀴즈 풀이를 성공적으로 제출하였습니다.')
      resetQuizSolve()
      navigate(`/text/${textId}/quiz/${quizId}/result`)
    },
    onError: (err: any) => {
      console.error('퀴즈 풀이 제출 실패:', err)
      alert('퀴즈 풀이 제출에 실패했습니다.')
    },
  })
}

export default usePostTextQuizSolve
