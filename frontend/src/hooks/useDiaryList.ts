import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getDiaryList } from 'services'
import { DiaryListType } from 'types/diary'

const useDiaryList = () => {
  const [pageNum, setPageNum] = useState<number>(1)

  const queryResult = useQuery<DiaryListType>({
    queryKey: ['diaryList'],
    queryFn: () => {
      const diaryList = getDiaryList(pageNum)
      return diaryList
    },
    enabled: false,
  })

  return { ...queryResult, setPageNum }
}

export default useDiaryList
