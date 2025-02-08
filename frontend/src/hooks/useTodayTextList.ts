import { useQuery } from '@tanstack/react-query'
import { getTodayTextList } from 'services'
import { TextDataType } from 'types/text'

const useTodayTextList = () => {
  return useQuery<TextDataType[]>({
    queryKey: ['todayTextList'],
    queryFn: getTodayTextList,
  })
}

export default useTodayTextList
