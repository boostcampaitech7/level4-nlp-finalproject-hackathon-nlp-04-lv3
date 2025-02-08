import { JSX, useState } from 'react'
import Button from '../../../components/Button'
import { VocabDetailType, CardType } from './types'
import { motion, AnimatePresence } from 'framer-motion'

interface VocabCardProps {
  data: VocabDetailType
  // CardType에 "correctTutorial"과 "incorrectTutorial"도 포함되어 있다고 가정합니다.
  type: CardType
  onBookmarkToggle?: () => void
}

const VocabCard = ({ data, type }: VocabCardProps) => {
  const [difficultyLevel, setDifficultyLevel] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const [direction, setDirection] = useState(0)

  const handleDifficultyChange = (isHarder: boolean) => {
    setDirection(isHarder ? 1 : -1)
    setDifficultyLevel((prev) => {
      const nextLevel = isHarder
        ? prev >= 4
          ? 4
          : prev + 1
        : prev <= 0
          ? 0
          : prev - 1
      return nextLevel
    })
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  }

  const renderDefinitionCard = () => (
    <div className="inline-flex h-auto min-h-[363px] w-full min-w-[280px] max-w-[390px] flex-col items-start justify-start rounded-[32px] bg-surface-primary-2 px-4 py-[30px] shadow-[0px_0px_13.2px_rgba(178,148,250,1)] sm:px-[50px]">
      <div className="inline-flex h-[60px] w-full items-start justify-end sm:w-[303px]">
        {/* 즐겨찾기 버튼 등 추가 */}
      </div>
      <div className="flex h-auto flex-col items-start justify-start gap-2.5 self-stretch sm:h-[76px]">
        <div
          className="relative inline-flex items-end justify-center gap-2.5 px-2.5"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {showTooltip && data.hanja && (
            <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform">
              <div className="inline-flex h-auto items-center justify-center gap-2.5 whitespace-normal rounded-xl bg-text-secondary p-2.5 shadow-[0px_0px_12.9px_rgba(0,0,0,0.25)] sm:h-[92px] sm:whitespace-nowrap">
                <div className="text-text-inverse body-m">
                  {data.hanja.split('\n').map((line, index) => (
                    <p key={index} className="break-keep">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="break-words text-text-primary display-l">
            {data.vocab}
          </div>
          <div className="h-[38px] py-[7px]" />
        </div>
      </div>
      <div className="inline-flex shrink grow basis-0 items-center justify-center gap-2.5 self-stretch px-2.5 pt-3">
        <div className="shrink grow basis-0 self-stretch text-text-secondary caption-l">
          {data.dict_mean}
        </div>
      </div>
    </div>
  )

  const renderExplanationCard = () => (
    <div className="h-auto min-h-[363px] w-full min-w-[280px] max-w-[390px] overflow-hidden rounded-[32px] border-4 border-button-secondary-1 bg-surface-primary-2">
      <div className="flex h-full w-full flex-col">
        <div className="px-4 pb-4 pt-6 sm:px-8">
          <h3 className="self-stretch text-text-primary body-l">쉬운 설명</h3>
        </div>
        <div className="relative z-10 flex w-full flex-grow flex-col items-start px-4 sm:px-8">
          <div className="self-stretch tracking-tight text-text-primary body-s">
            {data.easy_explain}
          </div>
        </div>
      </div>
    </div>
  )

  // 옳은 예문 카드 (일반 버전 - 애니메이션 적용)
  const renderCorrectCard = () => (
    <div className="h-auto min-h-[363px] w-full min-w-[280px] max-w-[390px] overflow-hidden rounded-[32px] border-4 border-button-secondary-1 bg-surface-primary-2">
      <div className="flex h-full w-full flex-col">
        <div className="px-4 pb-4 pt-6 sm:px-8">
          <h3 className="text-text-primary body-l">옳은 사용</h3>
        </div>
        <div className="relative flex flex-1 items-center justify-center">
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <div className="font-['Pretendard'] text-[200px] font-bold text-[#426cff]/10 sm:text-[270px]">
              O
            </div>
          </div>
          <div className="relative z-10 flex w-full flex-col items-start overflow-hidden px-4 sm:px-8">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.p
                key={difficultyLevel}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full text-text-primary body-m"
              >
                {data.correct_example[difficultyLevel]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <div className="z-10 flex justify-end gap-2 px-4 pb-6 sm:px-8">
          <Button
            size="small"
            color="grey"
            text="쉽게"
            onClick={() => handleDifficultyChange(false)}
            plusClasses={`px-[10px] ${difficultyLevel === 0 ? 'opacity-50' : ''}`}
          />
          <Button
            size="small"
            color="grey"
            text="어렵게"
            onClick={() => handleDifficultyChange(true)}
            plusClasses={`px-[10px] ${difficultyLevel === 4 ? 'opacity-50' : ''}`}
          />
        </div>
      </div>
    </div>
  )

  // 튜토리얼 전용 옳은 예문 카드 (애니메이션 없이 정적으로 렌더링)
  const renderCorrectTutorialCard = () => (
    <div className="flex min-h-[363px] w-full min-w-[280px] max-w-[390px] flex-col overflow-hidden rounded-[32px] border-4 border-button-secondary-1 bg-surface-primary-2">
      {/* 상단 제목 영역 */}
      <div className="px-4 pb-4 pt-6 sm:px-8">
        <h3 className="text-text-primary body-l">옳은 사용</h3>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="relative mb-8 flex flex-1 items-center justify-center">
        {/* 배경 'O' 텍스트 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-['Pretendard'] text-[200px] font-bold text-[#426cff]/10 sm:text-[270px]">
            O
          </div>
        </div>

        {/* 예문 텍스트 */}
        <div className="relative flex w-full flex-col items-start overflow-hidden px-4 sm:px-8">
          <p className="w-full text-text-primary body-m">
            {data.correct_example[difficultyLevel]}
          </p>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2 px-4 pb-6 sm:px-8">
        <Button
          size="small"
          color="grey"
          text="쉽게"
          onClick={() => handleDifficultyChange(false)}
          plusClasses={`px-[10px] ${difficultyLevel === 0 ? 'opacity-50' : ''}`}
        />
        <Button
          size="small"
          color="grey"
          text="어렵게"
          onClick={() => handleDifficultyChange(true)}
          plusClasses={`px-[10px] ${difficultyLevel === 4 ? 'opacity-50' : ''}`}
        />
      </div>
    </div>
  )

  // 틀린 예문 카드 (일반 버전 - 애니메이션 적용 시 사용한 음수 마진 포함)
  const renderIncorrectCard = () => (
    <div className="h-auto min-h-[363px] w-full min-w-[280px] max-w-[390px] overflow-hidden rounded-[32px] border-4 border-button-secondary-1 bg-surface-primary-2">
      <div className="flex h-full w-full flex-col">
        <div className="px-4 pt-6 sm:px-8">
          <h3 className="text-text-primary body-l">틀린 사용</h3>
        </div>
        <div className="relative -mt-6 flex flex-1 items-center justify-center">
          <div className="absolute inset-0 z-0 -mt-4 flex items-center justify-center">
            <div className="font-['Pretendard'] text-[200px] font-bold text-[#ff4646]/10 sm:text-[270px]">
              X
            </div>
          </div>
          <div className="relative z-10 flex w-full flex-col items-start px-4 sm:px-8">
            <p className="text-text-primary body-m">
              {data.incorrect_example[0]}
            </p>
            <p className="mt-2 text-text-secondary caption-s">
              {data.incorrect_example[1]}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // 튜토리얼 전용 틀린 예문 카드 (음수 마진 제거)
  const renderIncorrectTutorialCard = () => (
    <div className="flex min-h-[363px] w-full min-w-[280px] max-w-[390px] flex-col overflow-hidden rounded-[32px] border-4 border-button-secondary-1 bg-surface-primary-2">
      {/* 상단 제목 영역 */}
      <div className="px-4 pt-6 sm:px-8">
        <h3 className="text-text-primary body-l">틀린 사용</h3>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="relative mb-8 flex flex-1 items-center justify-center">
        {/* 배경 'X' 텍스트 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-['Pretendard'] text-[200px] font-bold text-[#ff4646]/10 sm:text-[270px]">
            X
          </div>
        </div>

        {/* 틀린 예문 */}
        <div className="relative flex w-full flex-col items-start px-4 sm:px-8">
          <p className="text-text-primary body-m">
            {data.incorrect_example[0]}
          </p>
          <p className="mt-2 text-text-secondary caption-s">
            {data.incorrect_example[1]}
          </p>
        </div>
      </div>
    </div>
  )

  // 카드 타입에 따라 렌더링할 함수를 매핑
  const cardMap: { [key in CardType]: () => JSX.Element } = {
    definition: renderDefinitionCard,
    explanation: renderExplanationCard,
    correct: renderCorrectCard,
    incorrect: renderIncorrectCard,
    correctTutorial: renderCorrectTutorialCard,
    incorrectTutorial: renderIncorrectTutorialCard,
  }

  return cardMap[type]()
}

export default VocabCard
