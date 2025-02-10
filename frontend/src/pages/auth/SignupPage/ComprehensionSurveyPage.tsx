// ComprehensionSurveyPage.tsx
import { useState } from 'react'
import Button from 'components/Button'
import { useSignupFormStore } from 'stores/signupFormStore'
import useSignup from 'hooks/useSignup'

const ComprehensionSurveyPage = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const { formData, setLevel } = useSignupFormStore()
  const { mutate: signup } = useSignup()

  const exampleSentences = [
    '무거운 물체는 주변을 끌어당기는 힘이 있어요.',
    '무거운 물체는 주위를 구부려서 물건을 끌어당겨요.',
    '물체가 무거울수록 시공간을 휘게 만들어서 다른 물체를 끌어당겨요.',
    '일반상대성이론에 따르면, 물체의 질량이 클수록 시공간을 더 많이 휘어지게 하여 중력이 생긴다.',
    '아인슈타인의 일반상대성이론은 질량과 에너지가 시공간의 곡률을 발생시켜 중력이란 현상이 물체 간의 인력으로 나타난다고 설명한다.',
  ]

  const handleSubmit = async () => {
    if (selectedOption === null) {
      alert('가장 잘 이해되는 문장을 선택해주세요.')
      return
    }

    signup({
      name: formData.name,
      username: formData.username,
      password: formData.password,
      level: formData.level,
    })
  }

  return (
    <div className="flex items-center justify-center bg-background-primary">
      <div className="mx-auto w-full px-4 py-5">
        <div className="mb-14 text-center">
          <div className="mb-12">
            <p className="title-m">
              안녕하세요! 아래 문장들 중에{' '}
              <span className="text-accent-purple">가장 잘 이해되는 것</span>을
              하나 골라주세요.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl space-y-8">
          {exampleSentences.map((sentence, index) => (
            <div
              key={index}
              className="group flex cursor-pointer items-center gap-6 transition-all"
              onClick={() => {
                setSelectedOption(index)
                setLevel(index + 1)
              }}
            >
              {/* 라디오 버튼 스타일 수정 */}
              <div
                className={`relative h-14 w-14 flex-shrink-0 rounded-full border-4 transition-colors ${
                  selectedOption === index
                    ? 'border-accent-purple bg-surface-primary-2'
                    : 'group-hover:border-accent-purple/50 border-text-secondary bg-surface-primary-2'
                }`}
              >
                {/* 내부 작은 원 추가 */}
                <div
                  className={`absolute inset-0 m-auto h-6 w-6 rounded-full bg-accent-purple transition-transform ${selectedOption === index ? 'scale-100' : 'scale-0'}`}
                />
              </div>

              <div
                className={`w-full rounded-[32px] p-6 transition-all ${
                  selectedOption === index
                    ? 'border-2 border-accent-purple bg-surface-primary-2'
                    : 'bg-surface-primary-2 group-hover:bg-surface-primary-2'
                }`}
              >
                <p className="text-text-primary body-m">{sentence}</p>
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
