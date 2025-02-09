import 'styles/scrollbar.css'
import 'styles/drag.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import useTextAccount from '../../../hooks/text/useTextAccount'
import { ChatType } from 'types/chat'
import { useParams } from 'react-router'
import { useChatListStore } from 'stores/chatListStore'
import usePostTextChat from 'hooks/text/usePostTextChat'

interface TooltipPosition {
  x: number
  y: number
}

const TextContent = ({ text }: { text: string[] }) => {
  const { setQueryParams, setQueryEnabled } = useTextAccount()
  const { text_id } = useParams<{ text_id: string }>()
  const textId = useMemo(() => {
    const parsedId = parseInt(text_id || '', 10)
    return isNaN(parsedId) ? 0 : parsedId
  }, [text_id])

  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
    x: 0,
    y: 0,
  })
  const [inputValue, setInputValue] = useState('')
  const tooltipRef = useRef<HTMLDivElement | null>(null)

  // 드래그 하이라이트를 위한 span 태그
  const highlightSpanRef = useRef<HTMLSpanElement | null>(null)
  // 하이라이트된 원본 텍스트(DocumentFragment)를 보관하기 위한 Ref
  const highlightExtractedRef = useRef<DocumentFragment | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // 툴팁이 표시되는 드래그 영역을 지정
  const dragRef = useRef<HTMLDivElement>(null)

  // 질문 입력 인풋의 표시 여부
  const [tooltipExpanded, setTooltipExpanded] = useState<boolean>(false)

  // 툴팁 닫기
  const closeTooltip = () => {
    setTooltipExpanded(false)
    setShowTooltip(false)
    setInputValue('')
  }

  // 드래그 하이라이트 표시 제거
  const removeHighlight = () => {
    if (highlightSpanRef.current && highlightExtractedRef.current) {
      const span = highlightSpanRef.current
      span.replaceWith(span.innerText)
    }

    // ref들 초기화
    highlightSpanRef.current = null
    highlightExtractedRef.current = null
  }

  // 드래그 시 툴팁 표시 위치 계산 & 하이라이트를 위한 커스텀 span 영역 만들기
  useEffect(() => {
    // 마우스 드래그가 끝날 때(mouseup) 선택 영역 가져오고 툴팁 표시
    const handleMouseUp = () => {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0)

        if (range.toString().trim().length === 0) return

        // selection Range의 위치 정보
        const rect = range.getBoundingClientRect()
        setTooltipPosition({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY - 40, // 툴팁을 위쪽으로 약간 띄움
        })

        // ---- (1) Range 안의 내용을 추출 ----
        const extracted = range.extractContents() // DocumentFragment

        // ---- (2) 새 <span>을 만들어 추출된 내용 감싸기 ----
        const highlightSpan = document.createElement('span')
        highlightSpan.className = 'bg-[var(--color-drag-background)]'
        highlightSpan.appendChild(extracted)

        // ---- (3) Range 위치에 새 <span> 삽입 ----
        range.insertNode(highlightSpan)

        // ---- (4) 원본 Selection 해제 ----
        selection.removeAllRanges()

        // 나중에 복원할 수 있도록 레퍼런스 보관
        highlightSpanRef.current = highlightSpan
        // 원본 텍스트(DocumentFragment)는 이때 저장
        highlightExtractedRef.current = extracted

        setShowTooltip(true)
      }
    }

    // 툴팁 외부를 클릭했을 때 툴팁을 닫고 하이라이트 해제
    const handleClickOutside = (e: MouseEvent) => {
      if (
        (!tooltipRef.current && !showTooltip) ||
        (tooltipRef.current && !tooltipRef.current.contains(e.target as Node))
      ) {
        removeHighlight()
        closeTooltip()
      }
    }

    // ESC 키를 눌렀을 때 툴팁을 닫고 선택 영역 해제
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        removeHighlight()
        closeTooltip()
      }
    }

    dragRef.current?.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      dragRef.current?.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // 질문 인풋 열릴 때 자동 포커스
  useEffect(() => {
    if (tooltipExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [tooltipExpanded])

  const { addNewChat } = useChatListStore()
  const { submitQuestion } = usePostTextChat(textId)

  // 인풋에서 엔터를 누르면 툴팁만 닫음 (하이라이트는 그대로 유지)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (highlightSpanRef.current?.innerText && inputValue) {
        const newChat: ChatType = {
          id: 0,
          text: `"${highlightSpanRef.current?.innerText}"\n${inputValue}`,
          focused: highlightSpanRef.current?.innerText,
          role: 'user',
        }
        addNewChat(newChat)
        submitQuestion(
          `"${highlightSpanRef.current?.innerText}"\n${inputValue}`,
          highlightSpanRef.current?.innerText,
        )
      }
      closeTooltip()
    }
  }

  // 쉬운 설명 호출
  const callTextAccount = () => {
    if (!!highlightSpanRef.current?.innerText) {
      closeTooltip()
      setQueryParams({
        textId: textId || 0,
        focused: highlightSpanRef.current?.innerText,
      })
      setQueryEnabled(true)
    }
  }

  // 본문 한 줄에 한 문장 씩 표시되게 합치기
  const getConcatText = () => {
    return text.join('\n')
  }

  return (
    <div
      ref={dragRef}
      className={
        'custom-scrollbar-large h-[660px] min-w-[771px] overflow-y-auto whitespace-pre-line rounded-[32px] bg-surface-primary-2 p-[20px] text-text-primary shadow-[0px_0px_13.199999809265137px_0px_rgba(178,148,250,1.00)] body-m'
      }
    >
      {getConcatText()}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute flex h-[34px] items-center rounded-[16px] bg-background-primary text-text-primary shadow-[0px_0px_13.199999809265137px_0px_rgba(178,148,250,1.00)] transition-opacity duration-300 button-s"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          <button
            onClick={callTextAccount}
            className="h-[34px] rounded-l-[16px] border-r-[1px] border-line px-[10px] hover:bg-button-secondary-2"
          >
            이 부분 쉽게 설명해줘
          </button>

          <div
            className={`flex items-center ${tooltipExpanded ? 'gap-x-[10px]' : 'hover:bg-button-secondary-2'} h-[34px] rounded-r-[16px] px-[10px]`}
          >
            <button
              onClick={() => {
                setTooltipExpanded(true)
              }}
              disabled={tooltipExpanded}
            >
              질문하기
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="질문을 입력하세요"
              className={`h-[22px] overflow-hidden rounded-md bg-gray-200 text-gray-900 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-300 ${tooltipExpanded ? 'mx-[5px] w-[200px] px-2 py-1' : 'm-0 w-0 px-0'}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TextContent
