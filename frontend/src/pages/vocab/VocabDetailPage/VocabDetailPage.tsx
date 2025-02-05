import React, { useState } from 'react';
import { VocabCard } from './VocabCard';
import { VocabDetailType } from './types';
import Button from 'components/Button';
import { VocabChatInterface } from 'components/VocabChatInterface';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import TutorialOverlay from './TutorialOverlay'; // 경로에 맞게 수정
import ExplanationCarousel from './ExplanationCarousel';

export const VocabDetailPage: React.FC = () => {
  const location = useLocation();
  const { vocab_id } = useParams();
  const navigate = useNavigate();

  const [vocabData, setVocabData] = useState<VocabDetailType>(
    location.state?.vocabData || {
      vocab_id: 11123043,
      vocab: "독실한",
      hanja: "독: 두텁다, 진실되다 \n실: 참되다, 실제",
      bookmark: false,
      dict_mean: "믿음이 두텁고 성실하다.",
      easy_explain:
        "어떤 믿음이나 신념을 매우 깊고 진지하게 믿고 따르는 것을 뜻해요. 주로 종교를 열심히 믿는 사람을 말할 때 많이 사용하지만, 꼭 종교가 아니어도 어떤 생각이나 가치를 진심으로 지키는 사람에게도 쓸 수 있어요.",
      correct_example: [
        "그는 매일 새벽에 교회에 나가 기도하는 독실한 신자였다",
        "그녀는 힘든 상황에서도 신앙을 잃지 않고 독실한 자세로 예배에 참석했다",
        "그는 기독교 신앙을 기반으로 한 가치관을 지키며 살아가는 독실한 사람이었다",
        "어려운 삶의 고비에서도 그는 독실한 신앙으로 인해 희망을 놓지 않았다",
        "그는 독실한 신앙을 바탕으로 지역 사회에서 자선 활동을 이끄는 데 열정을 쏟았다"
      ],
      incorrect_example: [
        "그는 독실한 운동 실력으로 대회에서 우승했다.",
        "\"독실한\"은 실력에 쓰이지 않음"
      ]
    }
  );

  const [showTutorial, setShowTutorial] = useState(false);

  const handleBookmarkToggle = () => {
    setVocabData(prev => ({
      ...prev,
      bookmark: !prev.bookmark
    }));
  };

  const handleQuizClick = () => {
    navigate(`/vocab/${vocab_id}/quiz`);
  };

  const handlePrevVocab = () => {
    const currentId = Number(vocab_id);
    if (currentId > 1) {
      navigate(`/vocab/${currentId - 1}`);
    }
  };

  const handleNextVocab = () => {
    const currentId = Number(vocab_id);
    const maxVocabId = 100;
    if (currentId < maxVocabId) {
      navigate(`/vocab/${currentId + 1}`);
    }
  };

  const isFirstVocab = Number(vocab_id) <= 1;
  const isLastVocab = Number(vocab_id) >= 100;

  // 튜토리얼 단계 배열 (정적 렌더링을 위해 옳은 예문 카드에 disableAnimation 전달)
  const tutorialSteps = [
    {
      title: "단어 뜻 풀이",
      description: "단어 위에 마우스를 올리면 해당 한자어의 뜻을 확인할 수 있습니다.",
      component: (
        <VocabCard
          data={vocabData}
          type="definition"
          onBookmarkToggle={handleBookmarkToggle}
        />
      )
    },
    {
      title: "쉬운 설명",
      description: "해당 단어에 대한 간단하고 이해하기 쉬운 설명을 제공합니다.",
      component: (
        <VocabCard
          data={vocabData}
          type="explanation"
        />
      )
    },
    {
      title: "옳은 예문 제공",
      description: "단어가 문장에서 어떻게 사용되는지 알 수 있도록, 쉬운 예시부터 어려운 예시까지 차례로 제공합니다.",
      component: (
        <VocabCard data={vocabData} type="correctTutorial" />
      )
    },
    {
      title: "틀린 예문 제공",
      description: "잘못 사용된 예시를 함께 제공하여 올바른 사용법을 학습할 수 있도록 합니다.",
      component: (
        <VocabCard data={vocabData} type="incorrectTutorial" />
      )
    },
    {
      title: "AI 챗봇 문의",
      description: "모르는 것이 있다면, ‘아라부기’ 챗봇을 통해 즉시 질문할 수 있습니다.",
      component: (
        <VocabChatInterface vocabId={String(vocabData.vocab_id)} />
      )
    },
    {
      title: "퀴즈 기능",
      description: "모든 학습을 마친 후, 이해도를 확인하기 위한 퀴즈를 제공합니다.",
      component: (
        <Button
          size="medium"
          color="purple"
          text="퀴즈 풀기"
          onClick={handleQuizClick}
          plusClasses="px=[10px]"
        />
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background-primary">
      <main className="container mx-auto px-4 py-5">
        <div className="h-[917px] w-full py-5 flex justify-center items-center gap-[19px]">
          {/* 왼쪽 영역: VocabCard 들 */}
          <div className="flex flex-col items-center gap-5">
            <div className="grid grid-cols-2 gap-4">
              <VocabCard
                data={vocabData}
                type="definition"
                onBookmarkToggle={handleBookmarkToggle}
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
              className="flex items-center mt-4 cursor-pointer"
              onClick={() => setShowTutorial(true)}
            >
              <div className="w-[32px] h-[32px] px-[11px] py-0.5 bg-white/80 rounded-[17.5px] border-2 border-[#707070] flex flex-col justify-center items-center">
                <div className="text-center text-text-secondary body-s leading-[31.2px] tracking-tight">
                  ?
                </div>
              </div>
              <div className="p-2.5 flex items-center">
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
        <TutorialOverlay steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
};

export default VocabDetailPage;
