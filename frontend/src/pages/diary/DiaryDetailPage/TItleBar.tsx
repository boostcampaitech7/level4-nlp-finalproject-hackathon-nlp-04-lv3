import { Button } from 'components'
import { useNavigate } from 'react-router'
import goodSticker from '/assets/good_sticker.svg?react'

interface TitleBarProps {
  createdAt: string
  status: number
}

const TitleBar = ({ createdAt, status }: TitleBarProps) => {
  const navigate = useNavigate()

  const goToDiaryList = () => {
    navigate('/diary/list')
  }

  const getTitle = () => {
    const date = new Date(createdAt)

    const dateString = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(date)
    return dateString
  }

  return (
    <div className="flex items-center justify-between border-b-4 border-line">
      <div className="flex items-center gap-x-[10px]">
        <div className="text-text-primary title-l">{getTitle()}</div>
        {status === 2 && (
          <div className="relative -my-2 flex h-[60px] w-[60px] items-center justify-center overflow-hidden">
            <img
              className="-translate-y-0.3 absolute h-full w-full scale-[1.5] transform object-contain"
              src={goodSticker}
              alt="완료"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          text="다른 일기 보러가기"
          size="small"
          onClick={goToDiaryList}
        />
      </div>
    </div>
  )
}

export default TitleBar
