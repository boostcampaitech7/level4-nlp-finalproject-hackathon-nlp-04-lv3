import { useQuery } from '@tanstack/react-query'
import { getDiary } from 'services'
import { DiaryType } from 'types/diary'

const useDiary = (diaryId: number) => {
  return useQuery<DiaryType>({
    queryKey: ['diary'],
    queryFn: () => getDiary(diaryId),
    enabled: !!diaryId,
  })
}

export default useDiary
