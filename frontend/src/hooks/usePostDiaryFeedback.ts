import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { postDiaryFeedback } from 'services'

const usePostDiaryFeedback = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: postDiaryFeedback,
    onSuccess: (diaryId: number) => {
      alert('일기가 제출되었습니다. 피드백이 완료되면 알려드릴게요.')
      navigate(`/diary/${diaryId}`)
    },
    onError: (err: any) => {
      console.error('일기 제출 실패: ', err)
      alert('일기 제출에 실패했습니다.')
    },
  })
}

export default usePostDiaryFeedback
