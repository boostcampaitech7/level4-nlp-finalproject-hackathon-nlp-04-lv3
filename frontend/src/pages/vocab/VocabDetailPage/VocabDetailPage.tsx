import React, { useState } from 'react';
import { VocabCard } from './VocabCard';
import { VocabDetailType } from './types';
import Button from 'components/Button';
import {VocabChatInterface} from 'components/VocabChatInterface'; // Import VocabChatInterface component
import { useNavigate, useParams, useLocation } from 'react-router-dom'



export const VocabDetailPage: React.FC = () => {
  const location = useLocation();
  const { vocab_id } = useParams()
  const navigate = useNavigate()
  const [vocabData, setVocabData] = useState<VocabDetailType>(
    location.state?.vocabData ||{
    vocab_id: 11123043,
    vocab: "독실한",
    hanja: "독: 두텁다, 진실되다 \n실: 참되다, 실제",
    bookmark: false,
    dict_mean: "믿음이 두텁고 성실하다.",
    easy_explain: "어떤 믿음이나 신념을 매우 깊고 진지하게 믿고 따르는 것을 뜻해요 주로 종교를 열심히 믿는 사람을 말할 때 많이 사용하지만, 꼭 종교가 아니어도 어떤 생각이나 가치를 진심으로 지키는 사람에게도 쓸 수 있어요.",
    correct_example: [
    "그는 매일 새벽에 교회에 나가 기도하는 독실한 신자였다", // 난이도 1: 간단한 설명
    "그녀는 힘든 상황에서도 신앙을 잃지 않고 독실한 자세로 예배에 참석했다", // 난이도 2: 신앙심 강조
    "그는 기독교 신앙을 기반으로 한 가치관을 지키며 살아가는 독실한 사람이었다", // 난이도 3: 신앙과 가치관의 연관성
    "어려운 삶의 고비에서도 그는 독실한 신앙으로 인해 희망을 놓지 않았다", // 난이도 4: 신앙의 영향과 삶의 어려움
    "그는 독실한 신앙을 바탕으로 지역 사회에서 자선 활동을 이끄는 데 열정을 쏟았다" // 난이도 5: 신앙의 실천과 사회적 영향
    ],

    incorrect_example: [
      "그는 독실한 운동 실력으로 대회에서 우승했다.",
      "\"독실한\"은 실력에 쓰이지 않음"
    ]
  });

  const handleBookmarkToggle = () => {
    setVocabData(prev => ({
      ...prev,
      bookmark: !prev.bookmark
    }));
  };

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
    // 임시로 최대 ID를 10으로 설정. 실제로는 API에서 최대 ID를 받아와야 함
    const maxVocabId = 10
    if (currentId < maxVocabId) {
      navigate(`/vocab/${currentId + 1}`)
    }
  }

  const isFirstVocab = Number(vocab_id) <= 1
  const isLastVocab = Number(vocab_id) >= 10 // 임시로 최대 ID를 10으로 설정

  return (
    <div className="min-h-screen bg-background-primary">
      <main className="container mx-auto px-4 py-5">
        <div className="h-[917px] px-[138px] py-5 justify-start items-start gap-[19px] inline-flex">
          {/* Left section with cards */}
          <div className="flex-col justify-center items-center gap-5 inline-flex">
            <div className="grid grid-cols-2 gap-4">
              <VocabCard 
                data={vocabData} 
                type="definition" 
                onBookmarkToggle={handleBookmarkToggle}
              />
              <VocabCard 
                data={vocabData} 
                type="explanation"
              />
              <VocabCard 
                data={vocabData} 
                type="correct"
              />
              <VocabCard 
                data={vocabData} 
                type="incorrect"
              />
            </div>
            {/* Navigation buttons */}
            <div className="justify-start items-center gap-[22px] inline-flex">
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

          {/* Right section with chat UI */}
          <VocabChatInterface vocabId={String(vocabData.vocab_id)} />
        </div>
      </main>
    </div>
  );
};

export default VocabDetailPage;
