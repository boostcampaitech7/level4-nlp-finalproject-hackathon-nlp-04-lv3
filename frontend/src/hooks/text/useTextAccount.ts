import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getTextAcount } from 'services'

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

  const queryResult = useQuery<string>({
    queryKey: ['textAccount'],
    queryFn: async () => {
      const textAccount = await getTextAcount(
        queryParams.textId,
        queryParams.focused,
      )
      setQueryEnabled(false)
      return textAccount
    },
    enabled: queryEnabled,
  })

  return { ...queryResult, setQueryParams, setQueryEnabled }
}

export default useTextAccount
