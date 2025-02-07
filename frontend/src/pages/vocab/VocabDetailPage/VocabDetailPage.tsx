import React, { useState, useEffect } from 'react'
import { VocabCard } from './VocabCard'
import { VocabDetailType } from './types'
import Button from 'components/Button'
import { VocabChatInterface } from 'components/VocabChatInterface'
import { useNavigate, useParams } from 'react-router-dom'
import TutorialOverlay from './TutorialOverlay' // 경로에 맞게 수정
import ExplanationCarousel from './ExplanationCarousel'
import { getVocabByNumber } from 'services' // 경로에 맞게 수정

export const VocabDetailPage: React.FC = () => {
  const { vocab_id } = useParams()
  const navigate = useNavigate()

  // 초기 데이터는 location.state를 사용할 수 있으나, vocab_id 변경 시 새로 데이터를 받아오도록 함
  const [vocabData, setVocabData] = useState<VocabDetailType | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)

  // vocabData가 없는 경우 백엔드에서 데이터를 받아옴
  useEffect(() => {
    if (vocab_id) {
      // 새 단어 데이터를 요청하기 전에 기존 데이터를 초기화하여 로딩 상태를 명확히 할 수 있음.
      setVocabData(null)
      getVocabByNumber(Number(vocab_id))
        .then((data) => {
          setVocabData(data)
        })
        .catch((err) => {
          console.error('단어 데이터를 가져오지 못했습니다.', err)
        })
    }
  }, [vocab_id]) // vocab_id가 바뀔 때마다 호출됨

  // 데이터가 아직 로딩 중이면 로딩 UI를 렌더링 (원하는 로딩 컴포넌트로 대체 가능)
  if (!vocabData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  // const handleBookmarkToggle = () => {
  //   setVocabData((prev) =>
  //     prev ? { ...prev, bookmark: !prev.bookmark } : prev
  //   );
  // };

  const handleQuizClick = () => {
    navigate(`/vocab/${vocab_id}/quiz`)
  }

  const handlePrevVocab = () => {
    const currentId = Number(vocab_id)
    if (currentId > 1) {
      navigate(`/vocab/${currentId - 1}`)
    }
  }

  const handleNextVocab = () => {
    const currentId = Number(vocab_id)
    const maxVocabId = 100
    if (currentId < maxVocabId) {
      navigate(`/vocab/${currentId + 1}`)
    }
  }

  const isFirstVocab = Number(vocab_id) <= 1
  const isLastVocab = Number(vocab_id) >= 100

  // 튜토리얼 단계 배열 (정적 렌더링을 위해 옳은 예문 카드에 disableAnimation 전달)
  const tutorialSteps = [
    {
      title: '단어 뜻 풀이',
      description:
        '단어 위에 마우스를 올리면 해당 한자어의 뜻을 확인할 수 있습니다.',
      component: (
        <VocabCard
          data={vocabData}
          type="definition"
          // onBookmarkToggle={handleBookmarkToggle}
        />
      ),
    },
    {
      title: '쉬운 설명',
      description: '해당 단어에 대한 간단하고 이해하기 쉬운 설명을 제공합니다.',
      component: <VocabCard data={vocabData} type="explanation" />,
    },
    {
      title: '옳은 예문 제공',
      description:
        '단어가 문장에서 어떻게 사용되는지 알 수 있도록, 쉬운 예시부터 어려운 예시까지 차례로 제공합니다.',
      component: <VocabCard data={vocabData} type="correctTutorial" />,
    },
    {
      title: '틀린 예문 제공',
      description:
        '잘못 사용된 예시를 함께 제공하여 올바른 사용법을 학습할 수 있도록 합니다.',
      component: <VocabCard data={vocabData} type="incorrectTutorial" />,
    },
    {
      title: 'AI 챗봇 문의',
      description:
        '모르는 것이 있다면, ‘아라부기’ 챗봇을 통해 즉시 질문할 수 있습니다.',
      component: <VocabChatInterface vocabId={String(vocabData.vocab_id)} />,
    },
    {
      title: '퀴즈 기능',
      description:
        '모든 학습을 마친 후, 이해도를 확인하기 위한 퀴즈를 제공합니다.',
      component: (
        <Button
          size="medium"
          color="purple"
          text="퀴즈 풀기"
          onClick={handleQuizClick}
          plusClasses="px=[10px]"
        />
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-background-primary">
      <main className="container mx-auto px-4 py-5">
        <div className="flex h-[917px] w-full items-center justify-center gap-[19px] py-5">
          {/* 왼쪽 영역: VocabCard 들 */}
          <div className="flex flex-col items-center gap-5">
            <div className="grid grid-cols-2 gap-4">
              <VocabCard
                data={vocabData}
                type="definition"
                // onBookmarkToggle={handleBookmarkToggle}
              />
              <ExplanationCarousel data={vocabData} />
              <VocabCard data={vocabData} type="correct" />
              <VocabCard data={vocabData} type="incorrect" />
            </div>
            {/* 단어 내비게이션 버튼 */}
            <div className="flex items-center gap-[22px]">
              <Button
                size="medium"
                color="purple"
                text="이전 단어"
                onClick={handlePrevVocab}
                plusClasses={`px=[10px] ${isFirstVocab ? 'opacity-50' : ''}`}
                showBackIcon={true}
                disabled={isFirstVocab}
              />
              <Button
                size="medium"
                color="purple"
                text="퀴즈 풀기"
                onClick={handleQuizClick}
                plusClasses="px=[10px]"
              />
              <Button
                size="medium"
                color="purple"
                text="다음 단어"
                onClick={handleNextVocab}
                plusClasses={`px=[10px] ${isLastVocab ? 'opacity-50' : ''}`}
                showFrontIcon={true}
                disabled={isLastVocab}
              />
            </div>
          </div>

          {/* 오른쪽 영역: 챗봇 UI 및 도움말 버튼 */}
          <div className="flex flex-col items-center">
            <VocabChatInterface vocabId={String(vocabData.vocab_id)} />
            {/* 도움말 영역 – 클릭 시 튜토리얼 오버레이 표시 */}
            <div
              className="mt-4 flex cursor-pointer items-center"
              onClick={() => setShowTutorial(true)}
            >
              <div className="bg-white/80 flex h-[32px] w-[32px] flex-col items-center justify-center rounded-[17.5px] border-2 border-[#707070] px-[11px] py-0.5">
                <div className="text-center leading-[31.2px] tracking-tight text-text-secondary body-s">
                  ?
                </div>
              </div>
              <div className="flex items-center p-2.5">
                <div className="text-text-secondary body-s">
                  현재 페이지의 사용법 알아보기
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* 튜토리얼 오버레이 조건부 렌더링 */}
      {showTutorial && (
        <TutorialOverlay
          steps={tutorialSteps}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  )
}

export default VocabDetailPage
