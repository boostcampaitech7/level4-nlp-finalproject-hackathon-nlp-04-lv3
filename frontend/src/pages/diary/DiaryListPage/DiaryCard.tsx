import { FaChevronRight } from 'react-icons/fa6'
import { DiaryCardType } from 'types/diary'
import goodSticker from '/assets/good_sticker.svg?react'
import { PiWarningBold } from 'react-icons/pi'
import { useNavigate } from 'react-router'

const DiaryCard = ({ diary }: { diary: DiaryCardType }) => {
  const getTitle = () => {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    const date = new Date(diary.day)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const dayName = dayNames[date.getDay()]

    return `${month}월 ${day}일 (${dayName})`
  }

  const navigate = useNavigate()
  const handleClickCard = () => {
    navigate(`/diary/${diary.diaryId}`)
  }

  const hoverStyles =
    'hover:cursor-pointer hover:bg-surface-tertiary hover:scale-105'
  return (
    <div
      onClick={handleClickCard}
      key={`diary-${diary.diaryId}-card`}
      className={`flex h-[140px] w-[960px] transform gap-x-[20px] rounded-[20px] bg-surface-primary-2 p-[10px] duration-300 ${hoverStyles}`}
    >
      <div className="relative flex h-[120px] w-[120px] items-center justify-center overflow-hidden">
        {diary.status === 2 ? (
          <img
            className="-translate-y-0.3 absolute h-full w-full scale-[1.5] transform object-contain"
            src={goodSticker}
            alt="완료"
          />
        ) : diary.status === 3 ? (
          <div className="flex flex-col items-center text-accent-red-1 button-s">
            <PiWarningBold size={66} />
            <p>유해 컨텐츠 감지</p>
          </div>
        ) : (
          <div
            className={`flex h-[90px] w-[90px] items-center whitespace-pre-line rounded-full ${diary.status === 0 ? 'bg-surface-secondary' : 'bg-purple-700'} feedback-m`}
          >
            <p
              className={`w-full text-center font-bold ${diary.status === 0 ? 'text-text-intermediate' : 'text-text-primary'}`}
            >
              {diary.status === 0 ? `아직 제출\n하기 전` : `일기 검사 중`}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-y-[10px] pt-[5px]">
        <div className="flex justify-between">
          <div className="text-text-primary title-m">{getTitle()}</div>
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-purple-700 text-purple-200">
            <FaChevronRight size={22} />
          </div>
        </div>
        <div className="line-clamp-2 overflow-hidden pr-[10px] text-start leading-tight text-text-secondary body-s">
          {`${diary.text}...`}
        </div>
      </div>
    </div>
  )
}

export default DiaryCard
