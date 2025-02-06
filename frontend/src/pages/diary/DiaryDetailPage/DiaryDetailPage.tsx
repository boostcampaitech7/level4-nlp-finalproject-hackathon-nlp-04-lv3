import useDiary from 'hooks/temp.useDiary'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SlicedTextType } from 'types/diary'
import getSlicedTexts from 'utils/getSlicedTexts'
import { RoughNotation } from 'react-rough-notation'
import TitleBar from './TItleBar'
import Button from 'components/Button'
import araboogie from '../../../assets/araboogie100.svg?react'

interface LineData {
  // SVG 경로를 그릴 때 필요한 점들
  d: string
  color: string
}

interface Position {
  top: number
  left: number
  width: number
  height: number
}

const DiaryDetailPage = () => {
  const { diary_id } = useParams<{ diary_id: string }>()
  const diaryId = useMemo(() => {
    const parsedId = parseInt(diary_id || '', 10)
    return isNaN(parsedId) ? 0 : parsedId
  }, [diary_id])

  const { data: diary, isFetching, refetch } = useDiary(diaryId)

  const [slicedTexts, setSlicedTexts] = useState<SlicedTextType[] | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    return () => {
      setSlicedTexts([])
      setTextPositions([])
      setIsFocused([])
      setFeedbackPositions([])
      setLines([])
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [diaryId])

  useEffect(() => {
    if (diary) {
      setSlicedTexts(getSlicedTexts(diary))
    }
  }, [diary])

  // 가장 바깥 div
  const wrapperRef = useRef<HTMLDivElement>(null)
  // 본문 컨테이너 참조
  const containerRef = useRef<HTMLDivElement>(null)

  // 본문 구절 span의 ref
  const textRefs = useRef<(HTMLSpanElement | null)[]>([])
  // 본문 구절 span의 화면상 위치를 계산하여 저장
  const [textPositions, setTextPositions] = useState<Position[]>([])

  const [isFocused, setIsFocused] = useState<boolean[]>([])

  // 피드백 div의 ref
  const feedbackRefs = useRef<(HTMLDivElement | null)[]>([])
  // 피드백 div의 위치(top, height)
  const [feedbackPositions, setFeedbackPositions] = useState<Position[]>([])

  // 본문 구절 - 피드백 연결선 정보
  const [lines, setLines] = useState<LineData[]>([])

  // textPositions 계산산
  useLayoutEffect(() => {
    if (!containerRef.current) return

    // 컨테이너의 시작점(상단 좌표)
    const containerRect = containerRef.current.getBoundingClientRect()

    // 각 구절이 화면상에서 어느 위치에 있는지 계산
    const newPositions = textRefs.current.map((textRef) => {
      if (!textRef) return { top: 0, left: 0, width: 0, height: 0 }
      const rect = textRef.getBoundingClientRect()

      // 컨테이너를 기준으로 한 상대적 top 계산
      const offsetTop = rect.top - containerRect.top
      const offsetLeft = rect.left - containerRect.left

      return {
        top: offsetTop,
        left: offsetLeft,
        width: rect.width,
        height: rect.height,
      }
    })

    setTextPositions(newPositions)
  }, [slicedTexts])

  // feedbackPositions 계산
  useLayoutEffect(() => {
    if (!containerRef.current || !textPositions || !slicedTexts) return

    let isLeft = false
    let prevLeftPosition = { top: -1, left: -1, width: -1, height: -1 }
    let prevRightPosition = { top: -1, left: -1, width: -1, height: -1 }

    const newFeedbackPositions = slicedTexts.map((slicedText, idx) => {
      // 피드백이 없는 구절은 노트 표시 안 함
      if (!slicedText.feedback) return { top: 0, left: 0, width: 0, height: 0 }

      isLeft = !isLeft

      const textPosition = textPositions[idx] || {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      }

      const height = Math.ceil(slicedText.feedback.length / 19) * 43 + 72
      let pos = {
        top: textPosition.top - 40,
        left: isLeft ? -276 : 580,
        width: 256,
        height: height,
      }
      if (isLeft) {
        if (
          prevLeftPosition.top > -1 &&
          pos.top < prevLeftPosition.top + prevLeftPosition.height + 20
        ) {
          pos.top = prevLeftPosition.top + prevLeftPosition.height + 50
        }
      } else {
        if (
          prevRightPosition.top > -1 &&
          pos.top < prevRightPosition.top + prevRightPosition.height + 20
        ) {
          pos.top = prevRightPosition.top + prevRightPosition.height + 50
        }
      }

      if (isLeft) {
        prevLeftPosition = pos
      } else {
        prevRightPosition = pos
      }

      return pos
    })

    setFeedbackPositions(newFeedbackPositions)
    const newIsFocused = new Array(newFeedbackPositions.length).fill(false)
    setIsFocused(newIsFocused)
  }, [slicedTexts, textPositions])

  // lines 계산
  useLayoutEffect(() => {
    if (!textPositions || !slicedTexts || !feedbackPositions) return

    let isLeft = false

    const newLines = slicedTexts.map((slicedText, idx) => {
      if (!slicedText.feedback) return { d: '', color: '' }

      isLeft = !isLeft
      const textPosition = textPositions[idx] || {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      }
      const feedbackPosition = feedbackPositions[idx] || {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      }

      const y1 = textPosition.top + textPosition.height / 2
      const y2 = feedbackPosition.top + feedbackPosition.height / 2
      const x1 = isLeft
        ? textPosition.left
        : textPosition.left + textPosition.width
      const x2 = isLeft
        ? feedbackPosition.left + feedbackPosition.width
        : feedbackPosition.left

      // 베지어 곡선 제어점(제일 간단하게 중간 지점 근처로 배치)
      const midX = (x1 + x2) / 2
      // 큐빅베지어
      const d = `M ${x1},${y1} C ${midX},${y1} ${midX},${y2} ${x2},${y2}`
      // console.log(`${idx}번 연결선: ${d}`)
      return {
        d: d,
        color: isLeft
          ? 'var(--color-accent-red-1)'
          : 'var(--color-accent-blue)',
      }
    })

    setLines(newLines)
  }, [slicedTexts, textPositions, feedbackPositions])

  const displayTexts = () => {
    let isLeft = false
    return slicedTexts?.map((slicedText, idx) => {
      if (slicedText.withFeedback) {
        isLeft = !isLeft
        return (
          <span
            ref={(el) => (textRefs.current[idx] = el)}
            key={`t-${idx}`}
            className={`${isFocused[idx] && (isLeft ? 'bg-red-500' : 'bg-blue-400')}`}
          >
            <RoughNotation
              type={slicedText.text.length < 17 ? 'circle' : 'underline'}
              multiline={true}
              show={true}
              color={
                isLeft
                  ? 'var(--color-accent-red-1)'
                  : 'var(--color-accent-blue)'
              }
            >
              {slicedText.text}
            </RoughNotation>
          </span>
        )
      } else {
        return (
          <span key={`t-${idx}`} ref={(el) => (textRefs.current[idx] = el)}>
            {slicedText.text}
          </span>
        )
      }
    })
  }

  const handleClickFeedback =
    (index: number) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()
      setIsFocused((prevFocus) =>
        prevFocus.map((_, i) => (i === index ? true : false)),
      )
    }

  useEffect(() => {
    const handleOutsideClick = () => {
      setIsFocused(new Array(feedbackPositions.length).fill(false))
    }

    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [feedbackPositions.length])

  const displayFeedback = () => {
    if (!slicedTexts || !feedbackPositions) return null
    let isLeft = false

    const feedbacks = slicedTexts?.map((slicedText, idx) => {
      // 피드백이 없는 구절은 노트 표시 안 함
      if (!slicedText.feedback) return null

      if (slicedText.withFeedback) {
        isLeft = !isLeft
      }
      const pos = feedbackPositions[idx]

      // 예시: 왼쪽에 놓을지 오른쪽에 놓을지를 번갈아가며 지정
      // 실제로는 구절의 길이, 페이지 레이아웃 등을 고려해서 로직을 짤 수 있음
      const feedbackSide = isLeft
        ? 'left-[-20px] -translate-x-full'
        : 'right-[-20px] translate-x-full'

      const focusStyles = `z-20 scale-105 ${isLeft ? 'shadow-[0px_0px_8px_0px_rgba(255,131,131,0.9)]' : 'shadow-[0px_0px_10px_0px_rgba(155,177,255,1.0)]'}`

      return (
        <div
          ref={(el) => (feedbackRefs.current[idx] = el)}
          key={`f-${idx}`}
          className={`absolute w-[256px] whitespace-pre-line rounded-[16px] bg-surface-tertiary p-[20px] font-bold text-text-primary transition-all duration-300 ease-in-out feedback-m ${feedbackSide} ${isFocused[idx] ? focusStyles : 'hover:cursor-pointer hover:bg-line'}`}
          style={{
            top: pos?.top ? pos.top : 0, // 구절의 top 위치에 맞춰서 달아줌
          }}
          onClick={handleClickFeedback(idx)}
        >
          <p>{slicedText.feedback}</p>
          {isFocused[idx] ? (
            <p
              className={`${isLeft ? 'text-red-400' : 'text-blue-300'} pt-[10px]`}
            >
              {'✨이렇게 고쳐 쓸 수 있어요:\n'}
              {slicedText.modified}
            </p>
          ) : (
            <p className="text-end text-[16px] text-text-secondary">
              ...자세히 보기
            </p>
          )}
        </div>
      )
    })
    return feedbacks
  }

  return (
    <>
      <div
        ref={wrapperRef}
        key={`diary-${diaryId}`}
        className={`flex h-full min-w-[1440px] justify-center bg-background-primary py-[24px]`}
      >
        <div className="flex w-4/5 flex-col gap-y-[20px]">
          <TitleBar
            createdAt={diary?.createdAt || '2025-01-01'}
            status={diary?.status || 0}
          />
          <div className="flex flex-col items-center gap-y-[36px] rounded-[16px] py-[36px]">
            {diary && diary.status > 0 && (
              <div className="flex w-full items-end justify-end gap-x-[24px] pr-[24px]">
                <div className="tranform relative max-w-[500px] rotate-[5deg] whitespace-pre-line rounded-[32px] bg-surface-tertiary p-[20px] font-bold text-main feedback-m">
                  {/* 말풍선 안의 컨텐츠 */}
                  {diary.status === 3 ? (
                    <>
                      <p className="text-red-200 body-m">
                        ⚠️ 일기에서 AI 윤리에 위반되는 내용이 감지되었습니다.
                      </p>
                      <p className="text-text-primary">{diary.review}</p>
                    </>
                  ) : (
                    <p>
                      {diary.status === 1
                        ? '일기 쓰느라 고생 많았어요!\n 아라부기가 일기에서 맞춤법이나 문법을 다듬어 줄 부분을 찾고 있어요. 내일 아침에 확인할 수 있게 준비해둘게요.🥰'
                        : diary.review}
                    </p>
                  )}

                  {/* 꼬리 부분 */}
                  <div className="absolute right-[-24px] top-1/3 h-0 w-0 -translate-y-1/2 transform border-y-[18px] border-l-[40px] border-y-transparent border-l-surface-tertiary" />
                </div>
                <div className="relative flex h-[160px] w-[160px] translate-y-8 transform items-center justify-center overflow-visible p-[5px]">
                  <img
                    className="absolute h-full w-full transform object-contain"
                    src={araboogie}
                    alt="완료"
                  />
                </div>
              </div>
            )}
            <div className="flex w-[560px] flex-col gap-y-[22px]">
              <div
                ref={containerRef}
                className="relative w-[560px] rounded-[32px] bg-surface-primary-2 p-[20px] leading-loose text-text-primary shadow-[0px_0px_13.199999809265137px_0px_rgba(178,148,250,1.00)] body-m"
              >
                {isFetching || !diary
                  ? '일기를 불러오는 중이에요.'
                  : displayTexts()}
                {slicedTexts && feedbackPositions && displayFeedback()}
                {lines && (
                  <svg className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full overflow-visible">
                    {lines?.map((line, idx) => {
                      return (
                        <path
                          key={`l-${idx}`}
                          d={line.d}
                          fill="none"
                          stroke={line.color}
                          strokeWidth={2}
                        />
                      )
                    })}
                  </svg>
                )}
              </div>
              <div className="flex items-center justify-center gap-x-[22px]">
                <Button
                  text={diary && diary?.status === 0 ? '수정' : '제출완료'}
                  size="small"
                  disabled={diary && diary?.status >= 1}
                  onClick={() => console.log('수정 페이지...')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[360px] bg-background-primary" />
    </>
  )
}

export default DiaryDetailPage
