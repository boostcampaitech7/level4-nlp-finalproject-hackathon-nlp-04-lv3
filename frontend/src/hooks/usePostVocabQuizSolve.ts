import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { postVocabQuizSolve } from 'services'

const usePostVocabQuizSolve = (vocabId: number) => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: postVocabQuizSolve,
    onSuccess: (quizId: number) => {
      alert('퀴즈 풀이를 성공적으로 제출하였습니다.')
      navigate(`/vocab/${vocabId}/quiz/${quizId}/result`)
    },
    onError: (err: any) => {
      console.error('퀴즈 풀이 제출 실패:', err)
      alert('퀴즈 풀이 제출에 실패했습니다.')
    },
  })
}

export default usePostVocabQuizSolve
