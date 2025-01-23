import { useQueryClient } from '@tanstack/react-query'
import { TextDataType } from 'types'
import 'styles/scrollbar.css'

const TextContent = () => {
  const queryClient = useQueryClient()
  const textData = queryClient.getQueryData<TextDataType>(['textData'])

  return (
    <div
      className={
        'custom-scrollbar-large h-[660px] w-[771px] overflow-y-auto rounded-[32px] bg-surface-primary-2 p-[20px] text-text-primary shadow-[0px_0px_13.199999809265137px_0px_rgba(178,148,250,1.00)] body-m'
      }
    >
      {textData?.text.map((text, index) => (
        <div key={index} className="py-[2px]">
          {text}
        </div>
      ))}
    </div>
  )
}

export default TextContent
