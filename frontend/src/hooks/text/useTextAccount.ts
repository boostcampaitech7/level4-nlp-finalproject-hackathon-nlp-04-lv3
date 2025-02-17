import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getTextAcount } from 'services'
import { useTextAccountStore } from 'stores/textAccountStore'

const useTextAccount = (textId: number) => {
  const [focused, setFocused] = useState<string>('')
  const { setAccount, setIsFetching } = useTextAccountStore()

  const queryResult = useQuery<string>({
    queryKey: ['textAccount', textId],
    queryFn: async () => await getTextAcount(textId, focused),
    enabled: false,
  })

  const requestTextAccount = (focused: string) => {
    setFocused(focused)
  }

  useEffect(() => {
    if (focused) {
      queryResult.refetch().then((res) => {
        setAccount(res.data || '')
      })
    }
  }, [focused])

  useEffect(() => {
    setIsFetching(queryResult.isFetching)
  }, [queryResult.isFetching])

  return { ...queryResult, requestTextAccount, setFocused }
}

export default useTextAccount
