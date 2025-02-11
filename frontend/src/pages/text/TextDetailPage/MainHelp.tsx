import { Button } from 'components'

const MainHelp = ({
  setShowTutorials,
  setTutorialStep,
}: {
  setShowTutorials: React.Dispatch<React.SetStateAction<boolean>>
  setTutorialStep: React.Dispatch<React.SetStateAction<number>>
}) => {
  return (
    <div className="flex gap-x-[10px] text-text-secondary body-s">
      <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-text-secondary bg-surface-primary-2 body-m">
        <span>?</span>
      </div>
      <div>
        글에서 궁금한 부분을 드래그하면 아라부기가{' '}
        <span className="text-accent-purple">쉽게 설명</span>해주거나{' '}
        <span className="text-accent-purple">질문하기</span>에 답해줘요
      </div>
      <Button
        text="도움말 보기"
        size="xsmall"
        onClick={() => {
          setTutorialStep(1)
          setShowTutorials(true)
        }}
      />
    </div>
  )
}

export default MainHelp
