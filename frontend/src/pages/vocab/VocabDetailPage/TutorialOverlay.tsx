import React, { useState } from 'react';
import Button from 'components/Button';

type TutorialStep = {
  title: string;
  description: string;
  // component를 넣으면 해당 컴포넌트를 렌더링합니다.
  component?: React.ReactNode;
};

type TutorialOverlayProps = {
  steps: TutorialStep[];
  onClose: () => void;
};

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ steps, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface-primary-2 p-6 rounded-[32px] max-w-3xl w-full">
        <h2 className="title-m mb-4">{step?.title}</h2>
        <div className="flex justify-between items-center">
          {step?.component && (
            <div className="w-full max-w-[390px]">
              {step.component}
            </div>
          )}
          <p className="body-s flex-1 ml-4 self-center mb-20">{step?.description}</p>
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
  );
};

export default TutorialOverlay;
