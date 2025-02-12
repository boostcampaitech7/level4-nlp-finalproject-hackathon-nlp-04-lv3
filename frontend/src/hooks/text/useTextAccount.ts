import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getTextAcount } from 'services'
import { useTextAccountSTore } from 'stores/textAccountSTore'

const useTextAccount = (textId: number) => {
  const [focused, setFocused] = useState<string>('')
  const { setAccount } = useTextAccountSTore()

  const queryResult = useQuery<string>({
    queryKey: ['textAccount', textId],
    queryFn: async () => await getTextAcount(textId, focused),
    enabled: false,
  })

  const requestTextAccount = (focused: string) => {
    setFocused(focused)
    // queryResult.refetch()
  }

  useEffect(() => {
    if (focused) {
      queryResult.refetch().then((res) => {
        setAccount(res.data || '')
      })
    }
  }, [focused])

  return { ...queryResult, requestTextAccount, setFocused }
}

export default useTextAccount
