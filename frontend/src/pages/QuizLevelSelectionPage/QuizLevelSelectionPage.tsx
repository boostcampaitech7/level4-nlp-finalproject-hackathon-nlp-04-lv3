import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import Button from 'components/Button'
// /@ts-expect-error TypeScript 타입 체크를 무시하기 위해 추가
import goodSticker from '../../assets/good_sticker.svg?react'
import useTextQuizList from 'hooks/useTextQuizList'

interface LevelData {
  level: number
  is_solved: boolean
  quiz_id: number
}

interface UserLevelData {
  user_level: number
  level_data: LevelData[]
}

// 더미 데이터
const dummyLevelData: UserLevelData = {
  user_level: 4,
  level_data: [
    {
      level: 1,
      is_solved: true,
      quiz_id: 511278047,
    },
    {
      level: 2,
      is_solved: true,
      quiz_id: 511272848,
    },
    {
      level: 3,
      is_solved: false,
      quiz_id: 517678047,
    },
    {
      level: 4,
      is_solved: false,
      quiz_id: 511209047,
    },
    {
      level: 5,
      is_solved: false,
      quiz_id: 511223047,
    },
  ],
}

const QuizLevelSelectionPage = ({ section = 'text' }: { section: string }) => {
  const navigate = useNavigate()
  const { vocab_id, text_id } = useParams()
  const item_id = section === 'text' ? text_id : vocab_id
  const itemId = useMemo(() => {
    const parsedId = parseInt(item_id || '', 10)
    return isNaN(parsedId) ? 0 : parsedId
  }, [item_id])

  const useQuizList = section === 'text' ? useTextQuizList : useTextQuizList // TODO: useVocabQuizList 만들기
  const { data: quizList, isFetching, refetch } = useQuizList(itemId)

  useEffect(() => {
    if (itemId) {
      refetch()
    }
  }, [itemId])

  const handleQuizStart = (level: number) => {
    if (section === 'vocab') {
      navigate(`/vocab/${vocab_id}/quiz/${level}`)
    } else {
      navigate(`/text/${text_id}/quiz/${level}`)
    }
  }

  const handleQuizResult = (level: number) => {
    if (section === 'vocab') {
      navigate(`/vocab/${vocab_id}/quiz/${level}/result`)
    } else {
      navigate(`/text/${text_id}/quiz/${level}/result`)
    }
  }

  const getLevelDescription = (
    level: number,
    isSolved: boolean,
    userLevel: number,
  ) => {
    if (isSolved) {
      return '이미 풀어본 문제예요! 쉽게 풀 수 있을 거예요.'
    }
    if (level === userLevel) {
      return '지금 도전하기 좋은 난이도예요!'
    }
    if (level < userLevel) {
      return '조금 쉬워요. 가볍게 풀어보세요!'
    }
    if (level === userLevel + 1) {
      return '약간 어려워요. 도전해보세요!'
    }
    return '매우 어려워요. 깊이 있는 학습 후 도전해보세요!'
  }

  return (
    <div className="flex min-h-screen w-full justify-center bg-background-primary">
      <div className="w-full max-w-[960px] px-4">
        <div className="py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-text-primary title-m">퀴즈 난이도 선택</h1>
          </div>
          {isFetching ? (
            <div>퀴즈 풀이 기록을 불러오는 중이에요.</div>
          ) : (
            <div className="space-y-5">
              {quizList?.levelData?.map((data) => (
                <div
                  key={data.level}
                  className="flex w-full items-center justify-between rounded-[32px] bg-surface-primary-2 px-8 py-6"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-4">
                        <div className="text-text-primary title-m">
                          난이도 {data.level}
                        </div>
                        {data.isSolved && (
                          <div className="relative -my-2 flex h-[55px] w-[55px] items-center justify-center overflow-hidden">
                            <img
                              className="-translate-y-0.3 absolute h-full w-full scale-[1.5] transform object-contain"
                              src={goodSticker}
                              alt="완료"
                            />
                          </div>
                        )}
                      </div>
                      <div className="text-text-primary body-m">
                        {getLevelDescription(
                          data.level,
                          data.isSolved,
                          quizList?.userLevel,
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {data.isSolved ? (
                      <>
                        <Button
                          size="small"
                          color="grey"
                          text={'다시 풀기'}
                          onClick={() => handleQuizStart(data.level)}
                          plusClasses="px-[10px]"
                        />
                        <Button
                          size="small"
                          color="grey"
                          text={'정답 보기'}
                          onClick={() => handleQuizResult(data.level)}
                          plusClasses="px-[10px]"
                        />
                      </>
                    ) : (
                      data.level <= quizList?.userLevel && (
                        <Button
                          size="small"
                          color="purple"
                          text={'퀴즈 풀기'}
                          onClick={() => handleQuizStart(data.level)}
                          plusClasses="px-[10px]"
                        />
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizLevelSelectionPage
