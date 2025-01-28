import { useQueryClient } from '@tanstack/react-query'
import { Button } from 'components'
import { useNavigate } from 'react-router'
import { TextDataType } from 'types'

export const TitleBar = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const textData = queryClient.getQueryData<TextDataType>(['textData'])

  const goToTextList = () => {
    navigate('/text/list')
  }

  return (
    <div className="flex items-center justify-between border-b-4 border-line">
      <div className="text-text-primary title-l">
        {textData?.title + ' '}
        <span className="text-grey-400 title-s">/ {textData?.category}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button text="다른 글 보러가기" size="small" onClick={goToTextList} />
      </div>
    </div>
  )
}
