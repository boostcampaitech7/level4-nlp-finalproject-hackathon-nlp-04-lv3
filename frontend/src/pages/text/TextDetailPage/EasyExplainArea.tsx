import { useQueryClient } from '@tanstack/react-query'
import Button from 'components/Button'
import useTextAccount from '../../../hooks/text/useTextAccount'
import { useEffect, useState } from 'react'
import 'styles/scrollbar.css'

const EasyExplainArea = () => {
  const { data, isFetching } = useTextAccount()
  const queryClient = useQueryClient()
  const [textAccount, setTextAccount] = useState<string | undefined>()

  useEffect(() => {
    setTextAccount(data)
  }, [data])

  const resetTextAccount = () => {
    queryClient.setQueryData(['textAccount'], undefined)
    setTextAccount(undefined)
  }

  useEffect(() => {
    if (isFetching) {
      console.log('로딩 중...')
    } else if (textAccount) {
      console.log(textAccount)
    }
  }, [textAccount, isFetching])
  return (
    <div className="flex h-[240px] flex-col gap-y-[10px] rounded-[32px] bg-surface-primary-2 p-[16px]">
      <div className="text-text-primary button-l">
        좀 더 쉽게 설명해드릴게요
      </div>
      <div className="custom-scrollbar-small h-full overflow-y-auto text-text-primary button-s">
        {isFetching
          ? '아라부기가 생각하는 중이에요. 잠시만 기다려주세요.'
          : textAccount
            ? textAccount
            : '본문에서 궁금한 부분을 드래그하고 "이 부분 쉽게 설명해줘" 버튼을 눌러보세요.'}
      </div>
      {textAccount && (
        <Button
          text="설명 지우기"
          color="grey"
          size="xsmall"
          onClick={resetTextAccount}
          plusClasses=""
        />
      )}
    </div>
  )
}

export default EasyExplainArea
