import { useQueryClient } from '@tanstack/react-query'
import { TextDataType } from 'types'

const TextContent = () => {
  const queryClient = useQueryClient()
  const textData = queryClient.getQueryData<TextDataType>(['textData'])
  const getConcatText = () => {
    return textData?.text.join('\n')
  }
  return (
    <div
      className={
        'custom-scrollbar-large h-[660px] min-w-[771px] overflow-y-auto whitespace-pre-line rounded-[32px] bg-surface-primary-2 p-[20px] text-text-primary shadow-[0px_0px_13.199999809265137px_0px_rgba(178,148,250,1.00)] body-m'
      }
    >
      {getConcatText()}
    </div>
  )
}

export default TextContent
