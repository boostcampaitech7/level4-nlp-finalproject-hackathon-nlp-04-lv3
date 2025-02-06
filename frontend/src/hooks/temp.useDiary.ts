import { useQuery } from '@tanstack/react-query'
import { getDiary } from 'services'
import { DiaryType } from 'types/diary'

const useDiary = (diaryId: number) => {
  // TODO: 실제 api 함수 연결 및 훅 세부 설정 구현 예정
  return useQuery<DiaryType>({
    queryKey: ['diary'],
    queryFn: () => getDiary(diaryId),
    enabled: !!diaryId,
  })
}

export default useDiary
