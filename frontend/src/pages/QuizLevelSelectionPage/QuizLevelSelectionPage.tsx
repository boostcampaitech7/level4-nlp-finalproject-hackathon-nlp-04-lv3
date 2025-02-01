import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Button from 'components/Button'
// @ts-expect-error TypeScript 타입 체크를 무시하기 위해 추가
import goodSticker from '../../assets/good_sticker.svg?react'

interface LevelData {
  level: number;
  is_solved: boolean;
  quiz_id: number;
}

interface UserLevelData {
  user_level: number;
  level_data: LevelData[];
}

// 더미 데이터
const dummyLevelData: UserLevelData = {
  user_level: 2,
  level_data: [
    {
      level: 0,
      is_solved: true,
      quiz_id: 511278047
    },
    {
      level: 1,
      is_solved: true,
      quiz_id: 511272848
    },
    {
      level: 2,
      is_solved: false,
      quiz_id: 517678047
    },
    {
      level: 3,
      is_solved: false,
      quiz_id: 511209047
    },
    {
      level: 4,
      is_solved: false,
      quiz_id: 511223047
    }
  ]
}

const QuizLevelSelectionPage = ({ section = 'text' }: { section: string }) => {
  const navigate = useNavigate()
  const { vocab_id } = useParams()
  const [levelData, setLevelData] = useState<UserLevelData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 더미 데이터를 사용하여 API 호출 시뮬레이션
    const simulateApiCall = () => {
      setTimeout(() => {
        setLevelData(dummyLevelData)
        setIsLoading(false)
      }, 500) // 0.5초 딜레이로 로딩 상태 표시
    }

    simulateApiCall()
  }, [])

  const handleQuizStart = (level: number) => {
    if (section === 'vocab') {
      navigate(`/vocab/${vocab_id}/quiz/${level}`)
    } else {
      navigate(`/text/${vocab_id}/quiz/${level}`)
    }
  }

  const getLevelDescription = (level: number, isSolved: boolean, userLevel: number) => {
    if (isSolved) {
      return "이미 풀어본 문제예요! 쉽게 풀 수 있을 거예요."
    }
    if (level === userLevel) {
      return "지금 도전하기 좋은 난이도예요!"
    }
    if (level < userLevel) {
      return "조금 쉬워요. 가볍게 풀어보세요!"
    }
    if (level === userLevel + 1) {
      return "약간 어려워요. 도전해보세요!"
    }
    return "매우 어려워요. 깊이 있는 학습 후 도전해보세요!"
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex justify-center w-full min-h-screen bg-background-primary">
      <div className="w-full max-w-[960px] px-4">
        <div className="py-8">
          <div className="mb-8">
            <h1 className="title-m text-text-primary mb-2">퀴즈 난이도 선택</h1>
          </div>
          <div className="space-y-5">
            {levelData?.level_data.map((data) => (
              <div key={data.level} className="w-full px-8 py-6 bg-surface-primary-2 rounded-[32px] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="title-m text-text-primary">난이도 {data.level+1}</div>
                      {data.is_solved && (
                        <div className="flex items-center justify-center w-[55px] h-[55px] -my-2 relative overflow-hidden">
                        <img 
                          className="w-full h-full object-contain absolute transform scale-[1.5] -translate-y-0.3" 
                          src={goodSticker} 
                          alt="완료" 
                        />
                      </div>
                      )}
                    </div>
                    <div className="body-m text-text-primary">
                      {getLevelDescription(data.level, data.is_solved, levelData.user_level)}
                    </div>
                  </div>
                  
                </div>
                <div className="flex gap-4">
                  {data.is_solved ? (
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
                        onClick={() => navigate(`/vocab/${vocab_id}/quiz/${data.level}/result`)}
                        plusClasses="px-[10px]"
                      />
                    </>
                  ) : (
                    data.level <= levelData.user_level + 1 && (
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
        </div>
      </div>
    </div>
  )
}

export default QuizLevelSelectionPage
