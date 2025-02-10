import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getTextAcount } from 'services'

const useTextAccount = (textId: number) => {
  const [focused, setFocused] = useState<string>('')

  const queryResult = useQuery<string>({
    queryKey: ['textAccount', textId],
    queryFn: () => getTextAcount(textId, focused),
    enabled: false,
  })

  const requestTextAccount = (focused: string) => {
    setFocused(focused)
    queryResult.refetch()
  }

  return { ...queryResult, requestTextAccount }
}

export default useTextAccount
