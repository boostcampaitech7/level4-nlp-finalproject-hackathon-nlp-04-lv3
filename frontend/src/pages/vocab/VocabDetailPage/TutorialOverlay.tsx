import { useState } from 'react'
import Button from 'components/Button'

type TutorialStep = {
  title: string
  description: string
  // component를 넣으면 해당 컴포넌트를 렌더링합니다.
  component?: React.ReactNode
}

type TutorialOverlayProps = {
  steps: TutorialStep[]
  onClose: () => void
}

const TutorialOverlay = ({ steps, onClose }: TutorialOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-3xl rounded-[32px] bg-surface-primary-2 p-6">
        <h2 className="mb-4 title-m">{step?.title}</h2>
        <div className="flex items-center justify-between">
          {step?.component && (
            <div className="w-full max-w-[390px]">{step.component}</div>
          )}
          <p className="mb-20 ml-4 flex-1 self-center body-s">
            {step?.description}
          </p>
        </div>
        <div className="mt-6 flex justify-between">
          <Button
            size="small"
            color="purple"
            text="이전"
            onClick={() => setCurrentStep(currentStep - 1)}
            plusClasses="min-w-[90px]"
            disabled={currentStep === 0}
          />
          {currentStep < steps.length - 1 ? (
            <Button
              size="small"
              color="purple"
              text="다음"
              onClick={() => setCurrentStep(currentStep + 1)}
              plusClasses="min-w-[90px]"
            />
          ) : (
            <Button
              size="small"
              color="purple"
              text="닫기"
              onClick={onClose}
              plusClasses="min-w-[90px]"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default TutorialOverlay
