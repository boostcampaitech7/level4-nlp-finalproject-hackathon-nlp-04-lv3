import { Button } from 'components'
import { useNavigate } from 'react-router'
import goodSticker from '/assets/good_sticker.svg?react'

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
      <div className="flex items-center gap-x-[10px]">
        <div className="text-text-primary title-l">
          {title + ' '}
          <span className="text-grey-400 title-s">/ {category}</span>
        </div>
        <div className="relative -my-2 flex h-[60px] w-[60px] items-center justify-center overflow-hidden">
          <img
            className="-translate-y-0.3 absolute h-full w-full scale-[1.5] transform object-contain"
            src={goodSticker}
            alt="완료"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button text="다른 글 보러가기" size="small" onClick={goToTextList} />
      </div>
    </div>
  )
}
