import { useQueryClient } from '@tanstack/react-query'
import Button from 'components/Button'
import 'styles/scrollbar.css'
import { useTextAccountStore } from '../../../stores/textAccountStore'

const EasyExplainArea = ({
  showTutorial,
  showNextTutorial,
}: {
  showTutorial: boolean
  showNextTutorial: () => void
}) => {
  const queryClient = useQueryClient()

  const { account, isFetching, setAccount } = useTextAccountStore()

  const resetTextAccount = () => {
    queryClient.setQueryData(['textAccount'], undefined)
    setAccount('')
  }

  return (
    <div
      className={`relative flex h-[240px] flex-col gap-y-[10px] rounded-[32px] bg-surface-primary-2 p-[16px] ${showTutorial && 'z-40'}`}
    >
      <div className="text-text-primary button-l">
        좀 더 쉽게 설명해드릴게요
      </div>
      <div className="custom-scrollbar-small h-full overflow-y-auto whitespace-pre-line text-text-primary button-s">
        {isFetching
          ? '아라부기가 생각하는 중이에요.\n잠시만 기다려주세요.'
          : account
            ? account
            : '본문에서 궁금한 부분을 드래그하고,\n"이 부분 쉽게 설명해줘" 버튼을 눌러보세요.'}
      </div>
      {account && (
        <Button
          text="설명 지우기"
          color="grey"
          size="xsmall"
          onClick={resetTextAccount}
          plusClasses=""
        />
      )}
      {showTutorial && (
        <div className="absolute left-0 top-0 h-full w-full rounded-[32px] bg-text-transparent shadow-[0px_0px_13.199999809265137px_0px_rgba(178,148,250,1.00)]"></div>
      )}
      {showTutorial && (
        <div className="absolute left-[-12px] top-0 z-40 w-[300px] -translate-x-full transform rounded-[16px] bg-surface-primary-1 px-4 py-6 text-text-intermediate button-m">
          <div className="relative h-full w-full">
            드래그한 부분에 대해 쉽게 풀어서 설명해드릴게요!
            <Button
              text="다음"
              showFrontIcon={true}
              size="xsmall"
              color="white"
              onClick={showNextTutorial}
              plusClasses="absolute right-0 bottom-[-10px]"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default EasyExplainArea
