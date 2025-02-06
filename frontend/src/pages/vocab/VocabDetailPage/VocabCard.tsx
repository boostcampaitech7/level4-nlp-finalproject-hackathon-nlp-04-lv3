import React, { useState } from 'react';
import Button from '../../../components/Button';
import { VocabDetailType, CardType } from './types';
import { motion, AnimatePresence } from 'framer-motion';

interface VocabCardProps {
  data: VocabDetailType;
  // CardType에 "correctTutorial"과 "incorrectTutorial"도 포함되어 있다고 가정합니다.
  type: CardType;
  onBookmarkToggle?: () => void;
}

export const VocabCard: React.FC<VocabCardProps> = ({ data, type, onBookmarkToggle }) => {
  const [difficultyLevel, setDifficultyLevel] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [direction, setDirection] = useState(0);

  const handleDifficultyChange = (isHarder: boolean) => {
    setDirection(isHarder ? 1 : -1);
    setDifficultyLevel(prev => {
      const nextLevel = isHarder ? (prev >= 4 ? 4 : prev + 1) : (prev <= 0 ? 0 : prev - 1);
      return nextLevel;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const renderDefinitionCard = () => (
    <div className="w-full max-w-[390px] min-w-[280px] h-auto min-h-[363px] px-4 sm:px-[50px] py-[30px] bg-surface-primary-2 rounded-[32px] shadow-[0px_0px_13.2px_rgba(178,148,250,1)] flex-col justify-start items-start inline-flex">
      <div className="w-full sm:w-[303px] h-[60px] justify-end items-start inline-flex">
        {/* 즐겨찾기 버튼 등 추가 */}
      </div>
      <div className="self-stretch h-auto sm:h-[76px] flex-col justify-start items-start gap-2.5 flex">
        <div 
          className="relative px-2.5 justify-center items-end gap-2.5 inline-flex"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {showTooltip && data.hanja && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
              <div className="h-auto sm:h-[92px] p-2.5 bg-text-secondary rounded-xl shadow-[0px_0px_12.9px_rgba(0,0,0,0.25)] justify-center items-center gap-2.5 inline-flex whitespace-normal sm:whitespace-nowrap">
                <div className="text-text-inverse body-m">
                  {data.hanja.split('\n').map((line, index) => (
                    <p key={index} className="break-keep">{line}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="text-text-primary display-l break-words">
            {data.vocab}
          </div>
          <div className="h-[38px] py-[7px]" />
        </div>
      </div>
      <div className="self-stretch grow shrink basis-0 pt-3 px-2.5 justify-center items-center gap-2.5 inline-flex">
        <div className="grow shrink basis-0 self-stretch text-text-secondary caption-l">
          {data.dict_mean}
        </div>
      </div>
    </div>
  );

  const renderExplanationCard = () => (
    <div className="w-full max-w-[390px] min-w-[280px] h-auto min-h-[363px] bg-surface-primary-2 rounded-[32px] border-4 border-button-secondary-1 overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <div className="px-4 sm:px-8 pt-6 pb-4">
          <h3 className="self-stretch text-text-primary body-l">
            쉬운 설명
          </h3>
        </div>
        <div className="relative z-10 flex flex-col items-start px-4 sm:px-8 w-full flex-grow">
          <div className="self-stretch text-text-primary body-s tracking-tight">
            {data.easy_explain}
          </div>
        </div>
      </div>
    </div>
  );

  // 옳은 예문 카드 (일반 버전 - 애니메이션 적용)
  const renderCorrectCard = () => (
    <div className="w-full max-w-[390px] min-w-[280px] h-auto min-h-[363px] bg-surface-primary-2 rounded-[32px] border-4 border-button-secondary-1 overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <div className="px-4 sm:px-8 pt-6 pb-4">
          <h3 className="body-l text-text-primary">
            옳은 사용
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <div className="text-[200px] sm:text-[270px] font-bold font-['Pretendard'] text-[#426cff]/10">
              O
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-start px-4 sm:px-8 w-full overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.p
                key={difficultyLevel}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="body-m text-text-primary w-full"
              >
                {data.correct_example[difficultyLevel]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <div className="px-4 sm:px-8 pb-6 flex justify-end gap-2 z-10">
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
  );

  // 튜토리얼 전용 옳은 예문 카드 (애니메이션 없이 정적으로 렌더링)
  const renderCorrectTutorialCard = () => (
    <div className="w-full max-w-[390px] min-w-[280px] min-h-[363px] bg-surface-primary-2 rounded-[32px] border-4 border-button-secondary-1 overflow-hidden flex flex-col">
  {/* 상단 제목 영역 */}
  <div className="px-4 sm:px-8 pt-6 pb-4">
    <h3 className="body-l text-text-primary">옳은 사용</h3>
  </div>

  {/* 메인 콘텐츠 영역 */}
  <div className="flex-1 flex items-center justify-center relative mb-8">
    {/* 배경 'O' 텍스트 */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-[200px] sm:text-[270px] font-bold font-['Pretendard'] text-[#426cff]/10">
        O
      </div>
    </div>

    {/* 예문 텍스트 */}
    <div className="relative flex flex-col items-start px-4 sm:px-8 w-full overflow-hidden">
      <p className="body-m text-text-primary w-full">
        {data.correct_example[difficultyLevel]}
      </p>
    </div>
  </div>

  {/* 버튼 영역 */}
  <div className="px-4 sm:px-8 pb-6 flex justify-end gap-2">
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

  );

  // 틀린 예문 카드 (일반 버전 - 애니메이션 적용 시 사용한 음수 마진 포함)
  const renderIncorrectCard = () => (
    <div className="w-full max-w-[390px] min-w-[280px] h-auto min-h-[363px] bg-surface-primary-2 rounded-[32px] border-4 border-button-secondary-1 overflow-hidden">
      <div className="w-full h-full flex flex-col">
        <div className="px-4 sm:px-8 pt-6">
          <h3 className="body-l text-text-primary">틀린 사용</h3>
        </div>
        <div className="flex-1 relative flex items-center justify-center -mt-6">
          <div className="absolute inset-0 flex items-center justify-center z-0 -mt-4">
            <div className="text-[200px] sm:text-[270px] font-bold font-['Pretendard'] text-[#ff4646]/10">
              X
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-start px-4 sm:px-8 w-full">
            <p className="body-m text-text-primary">
              {data.incorrect_example[0]}
            </p>
            <p className="caption-s text-text-secondary mt-2">
              {data.incorrect_example[1]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // 튜토리얼 전용 틀린 예문 카드 (음수 마진 제거)
  const renderIncorrectTutorialCard = () => (
    <div className="w-full max-w-[390px] min-w-[280px] min-h-[363px] bg-surface-primary-2 rounded-[32px] border-4 border-button-secondary-1 overflow-hidden flex flex-col">
  {/* 상단 제목 영역 */}
  <div className="px-4 sm:px-8 pt-6">
    <h3 className="body-l text-text-primary">틀린 사용</h3>
  </div>

  {/* 메인 콘텐츠 영역 */}
  <div className="flex-1 flex items-center justify-center relative mb-8">
    {/* 배경 'X' 텍스트 */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-[200px] sm:text-[270px] font-bold font-['Pretendard'] text-[#ff4646]/10">
        X
      </div>
    </div>

    {/* 틀린 예문 */}
    <div className="relative flex flex-col items-start px-4 sm:px-8 w-full">
      <p className="body-m text-text-primary">
        {data.incorrect_example[0]}
      </p>
      <p className="caption-s text-text-secondary mt-2">
        {data.incorrect_example[1]}
      </p>
    </div>
  </div>
</div>

  );

  // 카드 타입에 따라 렌더링할 함수를 매핑
  const cardMap: { [key in CardType]: () => JSX.Element } = {
    definition: renderDefinitionCard,
    explanation: renderExplanationCard,
    correct: renderCorrectCard,
    incorrect: renderIncorrectCard,
    correctTutorial: renderCorrectTutorialCard,
    incorrectTutorial: renderIncorrectTutorialCard,
  };

  return cardMap[type]();
};
