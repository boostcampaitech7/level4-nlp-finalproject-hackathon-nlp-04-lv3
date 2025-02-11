import { Button } from 'components'
import { useNavigate } from 'react-router'

interface TitleBarProps {
  title: string
  category: string
}

export const TitleBar = ({ title, category }: TitleBarProps) => {
  const navigate = useNavigate()

  const goToTextList = () => {
    navigate('/text/list')
  }

  return (
    <div className="flex items-end justify-between gap-x-[20px] border-b-4 border-line">
      {title ? (
        <div className="flex-1 text-text-primary title-l">
          {title + ' '}
          <span className="text-grey-400 title-s">/ {category}</span>
        </div>
      ) : (
        <div></div>
      )}
      <div className="flex items-center gap-2 pb-[10px]">
        <Button text="다른 글 보러가기" size="small" onClick={goToTextList} />
      </div>
    </div>
  )
}
