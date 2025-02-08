import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { postDiary } from 'services'

const usePostDiary = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: postDiary,
    onSuccess: (diaryId: number) => {
      alert('일기가 저장되었습니다. 피드백을 받으려면 "완료하기"를 눌러주세요.')
      navigate(`/diary/${diaryId}`)
    },
    onError: (err: any) => {
      console.error('일기 저장 실패: ', err)
      alert('일기 저장에 실패했습니다.')
    },
  })
}

export default usePostDiary
