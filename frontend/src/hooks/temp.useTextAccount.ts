import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getTextAcount } from 'services'
import { TextAccountType } from 'types'

interface TextAccountProps {
  textId: number
  focused: string
}

const useTextAccount = () => {
  const [queryEnabled, setQueryEnabled] = useState<boolean>(false)
  const [queryParams, setQueryParams] = useState<TextAccountProps>({
    textId: 0,
    focused: '',
  })

  // TODO: 실제 api 함수 연결 및 훅 세부 설정 구현 예정

  const queryResult = useQuery<TextAccountType>({
    queryKey: ['textAccount'],
    queryFn: async () => {
      const textAccount = await getTextAcount(queryParams)
      console.log(textAccount)
      setQueryEnabled(false)
      return textAccount
    },
    enabled: queryEnabled,
  })

  return { ...queryResult, setQueryParams, setQueryEnabled }
}

export default useTextAccount
