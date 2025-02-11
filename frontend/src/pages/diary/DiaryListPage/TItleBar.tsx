import { Button } from 'components'
import { useNavigate } from 'react-router'

const TitleBar = () => {
  const navigate = useNavigate()

  const goToDiaryWrite = () => {
    navigate('/diary/write')
  }

  return (
    <div className="flex items-center justify-between border-b-4 border-line">
      <div className="text-text-primary title-l">일기</div>
      <Button text="작성하러 가기" size="small" onClick={goToDiaryWrite} />
    </div>
  )
}

export default TitleBar
