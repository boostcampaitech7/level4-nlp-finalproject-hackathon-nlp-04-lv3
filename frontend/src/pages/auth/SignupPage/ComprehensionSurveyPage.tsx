// ComprehensionSurveyPage.tsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from 'components/Button'
import { useAuthStore } from '../../../stores/authStore'

interface SignupData {
  username: string;
  name: string;
  password: string;
}

const ComprehensionSurveyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore() 
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const signupData = location.state?.signupData as SignupData;

  const exampleSentences = [
    '무거운 물체는 주변을 끌어당기는 힘이 있어요.',
    '무거운 물체는 주위를 구부려서 물건을 끌어당겨요.',
    '물체가 무거울수록 시공간을 휘게 만들어서 다른 물체를 끌어당겨요.',
    '일반상대성이론에 따르면, 물체의 질량이 클수록 시공간을 더 많이 휘어지게 하여 중력이 생긴다.',
    '아인슈타인의 일반상대성이론은 질량과 에너지가 시공간의 곡률을 발생시켜 중력이란 현상이 물체 간의 인력으로 나타난다고 설명한다.'
  ]

  const handleSubmit = async () => {
    if (selectedOption === null) {
      alert('가장 잘 이해되는 문장을 선택해주세요.');
      return;
    }

    if (!signupData) {
      alert('회원가입 정보가 없습니다. 회원가입 페이지로 이동합니다.');
      navigate('/auth/signup');
      return;
    }

    try {
    // ▶▶▶ 백엔드 API 연동 시 사용할 코드 시작 ▶▶▶
    // const response = await fetch('/api/auth/signup', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     ...signupData,
    //     level: selectedOption
    //   })
    // });

    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || '회원가입에 실패했습니다.');
    // }

    // const data = await response.json();
    // ▶▶▶ 백엔드 API 연동 시 사용할 코드 끝 ▶▶▶

    // ▼▼▼ 더미 데이터(개발용) - API 연동 시 삭제 ▼▼▼
    const dummyResponse = {
      token: 'dummy-jwt-token',
      user: {
        id: Math.random().toString(36).substr(2, 9),
        ...signupData,
        level: selectedOption
      }
    };
    await new Promise(resolve => setTimeout(resolve, 1000));
    const data = dummyResponse;
    // ▲▲▲ 더미 데이터(개발용) - API 연동 시 삭제 ▲▲▲

    setAuth(data.token);
    alert('회원가입이 완료되었습니다! 서비스를 이용해주세요.');
    navigate('/');
  } catch (error) {
    console.error('회원가입 실패:', error);
    alert(error || '회원가입에 실패했습니다. 다시 시도해주세요.');
  }
}

  return (
    <div className="flex justify-center items-center bg-background-primary">
      <div className="w-full px-4 mx-auto py-5">
        <div className="text-center mb-14">          
          <div className="mb-12">
            <p className="title-m">
              안녕하세요! 아래 문장들 중에 <span className="text-accent-purple">가장 잘 이해되는 것</span>을 하나 골라주세요.
            </p>
          </div>
        </div>

        <div className="space-y-8 max-w-4xl w-full mx-auto">
          {exampleSentences.map((sentence, index) => (
            <div 
              key={index}
              className="group flex items-center gap-6 cursor-pointer transition-all"
              onClick={() => setSelectedOption(index)}
            >
              {/* 라디오 버튼 스타일 수정 */}
              <div className={`relative flex-shrink-0 w-14 h-14 rounded-full border-4 transition-colors
                ${selectedOption === index 
                  ? 'border-accent-purple bg-surface-primary-2' 
                  : 'border-text-secondary bg-surface-primary-2 group-hover:border-accent-purple/50'}`}
              >
                {/* 내부 작은 원 추가 */}
                <div className={`absolute inset-0 m-auto w-6 h-6 bg-accent-purple rounded-full transition-transform
                  ${selectedOption === index ? 'scale-100' : 'scale-0'}`} />
              </div>

              <div className={`w-full p-6 rounded-[32px] transition-all
                ${selectedOption === index
                  ? 'bg-surface-primary-2 border-2 border-accent-purple'
                  : 'bg-surface-primary-2 group-hover:bg-surface-primary-2'}`}>
                <p className="body-m text-text-primary">
                  {sentence}
                </p>
              </div>
            </div>
          ))}

          <Button
            text="설문 제출하고 회원 가입하기"
            size="large"
            color="purple"
            plusClasses="w-full text-3xl h-[79px] rounded-[20px] mt-10"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}

export default ComprehensionSurveyPage