import { useQuery } from '@tanstack/react-query'
import { getText } from 'services'
import { TextDataType } from 'types/text'

const useTextData = (textId: number) => {
  return useQuery<TextDataType>({
    queryKey: ['textData'],
    queryFn: () => getText(textId),
    enabled: !!textId,
  })
}

export default useTextData
