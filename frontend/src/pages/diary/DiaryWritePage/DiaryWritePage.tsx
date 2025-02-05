import Button from 'components/Button';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DiaryWritePage = () => {
  // 한국 기준 오늘 날짜 포맷팅 (예: "2025년 1월 16일 목요일")
  const today = new Date();
  const formattedDate = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  // 초기 텍스트는 빈 문자열로 설정
  const [diaryText, setDiaryText] = useState('');
  const navigate = useNavigate();

  // "저장하기" 버튼 핸들러: /api/diary/save 엔드포인트 호출
  const handleSave = async () => {
    try {
      const response = await fakeApiCall('/api/diary/save', { text: diaryText });
      // Type assertion to ensure response has the expected structure
      const typedResponse = response as { message: string };
      alert(typedResponse.message);
    } catch (error) {
      console.error(error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // "완료하기" 버튼 핸들러: /api/diary/feedback 엔드포인트 호출 후 다이어리 상세 페이지로 이동
  const handleFeedback = async () => {
    try {
      const response = await fakeApiCall('/api/diary/feedback', { text: diaryText });
      // Type assertion to ensure response has the expected structure
      const typedResponse = response as { message: string; diary_id?: string };
      alert(typedResponse.message);
      if (typedResponse.diary_id) {
        navigate(`/diary/${typedResponse.diary_id}`);
      }
    } catch (error) {
      console.error(error);
      alert('완료 처리에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // "취소하기" 버튼 핸들러: 이전 페이지로 이동
  const handleCancel = () => {
    if (window.confirm('정말 취소하시겠습니까?')) {
      window.history.back();
    }
  };

  // 더미 API 호출 함수 (엔드포인트에 따라 1초 후에 더미 데이터 반환)
  const fakeApiCall = (endpoint: string, data: unknown) => {
    console.log(`API 호출 [${endpoint}] 데이터:`, data);
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint === '/api/diary/save') {
          resolve({
            message: 'Diary successfully saved',
            diary_id: 1,
          });
        } else if (endpoint === '/api/diary/feedback') {
          resolve({
            message: 'Diary successfully accepted',
            diary_id: 1,
          });
        }
      }, 1000);
    });
  };

  return (
    <div className="w-full min-h-screen bg-background-primary items-center justify-center">
    <div className="w-full max-w-[1440px] mx-auto h-[898px] px-[145px] pt-[33px] flex flex-col justify-start items-center gap-9">
      {/* Header */}
      <div className="self-stretch h-[46px] flex flex-col justify-start items-start gap-2">
        <div className="self-stretch flex justify-between items-end">
          <div className="text-center">
            <span className="text-text-primary title-m">
              {formattedDate}{' '}
            </span>
            <span className="text-text-secondary title-s font-semibold">
              일기를 써볼까요?
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="self-stretch h-[685px] flex flex-col justify-center items-center gap-5">
        <div className="self-stretch flex justify-center items-start gap-4">
          <div className="flex flex-col justify-start items-center gap-[22px]">
            <div className="flex w-full py-2.5 justify-center items-center gap-[60px]">
              {/* 좌측 설명 영역 */}
              <div className="w-[493px] flex flex-col justify-start items-start gap-[20px]">
              <div className="text-text-primary title-m">
                  오늘 하루 어떠셨나요?
                </div>
                <div>
                  <span className="text-text-secondary body-m">
                    오늘 어떤 일이 있었는지 떠올려보고{' '}
                  </span>
                  <span className="text-text-primary body-m">
                    🤔
                    <br />
                  </span>
                  <span className="text-text-secondary body-m">
                    하루의 기분을 자유롭게 표현해보세요
                    <br />
                    가볍게 날씨 얘기로 시작해보는 것도 좋아요 🍃
                  </span>
                </div>
              </div>
              {/* 우측 텍스트 입력 영역 */}
              <div className="w-[560px] h-[604px] bg-surface-primary-2 rounded-[32px] shadow-[0px_0px_13.2px_0px_rgba(178,148,250,1)] flex justify-start items-start overflow-hidden">
                <textarea
                  className="w-full h-full resize-none outline-none bg-transparent p-5 text-text-primary body-m leading-[43.2px] tracking-tight"
                  value={diaryText}
                  onChange={(e) => setDiaryText(e.target.value)}
                  placeholder="여기에 일기를 작성해주세요..."
                />
              </div>
            </div>
            {/* 버튼 영역 */}
            <div className="flex justify-start items-center gap-[22px]">
            <Button
              size="small"
              color="purple"
              text="저장하기"
              onClick={handleSave}
            />
            <Button
              size="small"
              color="purple"
              text="취소하기"
              onClick={handleCancel}
            />
            <Button
              size="small"
              color="purple"
              text="완료하기"
              onClick={handleFeedback}
            />
            
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DiaryWritePage;
