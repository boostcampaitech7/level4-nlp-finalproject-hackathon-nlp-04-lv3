import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getTextList } from 'services'
import { TextListType } from 'types/textList'

const useTextList = () => {
  const [pageNum, setPageNum] = useState<number>(1)

  // TODO: 실제 api 함수 연결 및 훅 세부 설정 구현 예정

  const queryResult = useQuery<TextListType>({
    queryKey: ['textList'],
    queryFn: () => {
      const textList = getTextList(pageNum)
      return textList
    },
    enabled: false,
  })

  return { ...queryResult, setPageNum }
}

export default useTextList
