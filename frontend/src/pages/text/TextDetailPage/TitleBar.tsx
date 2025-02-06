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
    <div className="flex items-center justify-between border-b-4 border-line">
      <div className="text-text-primary title-l">
        {title + ' '}
        <span className="text-grey-400 title-s">/ {category}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button text="다른 글 보러가기" size="small" onClick={goToTextList} />
      </div>
    </div>
  )
}
