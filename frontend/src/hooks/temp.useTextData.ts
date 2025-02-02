import { useQuery } from '@tanstack/react-query'
import { getTextData } from 'services'
import { TextDataType } from 'types'

const useTextData = (textId: number) => {
  // TODO: 실제 api 함수 연결 및 훅 세부 설정 구현 예정
  return useQuery<TextDataType>({
    queryKey: ['textData'],
    queryFn: () => getTextData(textId),
    enabled: !!textId,
  })
}

export default useTextData
