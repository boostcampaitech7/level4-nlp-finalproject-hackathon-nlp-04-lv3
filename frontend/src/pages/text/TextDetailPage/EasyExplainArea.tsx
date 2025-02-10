import { useQueryClient } from '@tanstack/react-query'
import Button from 'components/Button'
import useTextAccount from '../../../hooks/text/useTextAccount'
import { useEffect, useMemo, useState } from 'react'
import 'styles/scrollbar.css'
import { useParams } from 'react-router'

const EasyExplainArea = () => {
  const { text_id } = useParams<{ text_id: string }>()
  const textId = useMemo(() => {
    const parsedId = parseInt(text_id || '', 10)
    return isNaN(parsedId) ? 0 : parsedId
  }, [text_id])
  const { data, isFetching } = useTextAccount(textId)
  const queryClient = useQueryClient()
  const [textAccount, setTextAccount] = useState<string | undefined>()

  useEffect(() => {
    setTextAccount(data)
  }, [data])

  const resetTextAccount = () => {
    queryClient.setQueryData(['textAccount'], undefined)
    setTextAccount(undefined)
  }

  return (
    <div className="flex h-[240px] flex-col gap-y-[10px] rounded-[32px] bg-surface-primary-2 p-[16px]">
      <div className="text-text-primary button-l">
        좀 더 쉽게 설명해드릴게요
      </div>
      <div className="custom-scrollbar-small h-full overflow-y-auto whitespace-pre-line text-text-primary button-s">
        {isFetching
          ? '아라부기가 생각하는 중이에요.\n잠시만 기다려주세요.'
          : textAccount
            ? textAccount
            : '본문에서 궁금한 부분을 드래그하고,\n"이 부분 쉽게 설명해줘" 버튼을 눌러보세요.'}
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
