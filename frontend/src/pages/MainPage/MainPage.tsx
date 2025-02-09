import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { PiHandsClappingDuotone } from 'react-icons/pi'
import Button from 'components/Button'
import ProgressBar from 'components/ProgressBar'
import authenticatedAxios from 'services/authenticatedAxios'
import useReviewQuizList from 'hooks/main/useReviewQuizList'
import { VocabReviewQuizType } from 'types/quiz'
import useVocabRandom from 'hooks/vocab/useVocabRandom'
import 'styles/scrollbar.css'

// 오늘의 글 데이터 타입 정의
interface TodayText {
  text_id: number
  title: string
  category: string
  content: string
}

// 실제로는 fetch API를 사용하거나 axios를 사용하여 데이터를 가져오세요.
const fetchTodayTexts = async (): Promise<TodayText[]> => {
  try {
    const response = await authenticatedAxios().get('/api/main/text')
    console.log(response.data)
    return response.data.slice(0, 3) // Get only first 3 items
  } catch (error) {
    console.error('Error fetching today texts:', error)
    throw error
  }
}

const MainPage = () => {
  const navigate = useNavigate()

  // 검색
  const [searchTerm, setSearchTerm] = useState('')
  // 오늘의 글
  const [todayTexts, setTodayTexts] = useState<TodayText[]>([])
  // const { }
  // 퀴즈
  const [quizData, setQuizData] = useState<VocabReviewQuizType[]>([])
  // 문제 풀이 중일 때: 현재 문제 인덱스
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  // 사용자 선택 답안 저장 (문제 수와 동일한 길이)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])

  const [showSolutionButton, setShowSolutionButton] = useState(false)
  // 모든 문제를 푼 뒤, 전체 해설 보기 단계로 전환
  const [showAllResults, setShowAllResults] = useState(false)
  // 전체 해설 보기에서, 현재 보고 있는 문제 번호
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0)
  const [showCongrats, setShowCongrats] = useState(false)

  const { data: reviewQuizList, isLoading } = useReviewQuizList()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [texts] = await Promise.all([fetchTodayTexts()])
        setTodayTexts(texts)
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (!isLoading && reviewQuizList) {
      setQuizData(reviewQuizList)
      console.log(reviewQuizList)
    }
  }, [isLoading, reviewQuizList])

  // 문제 풀이 중: 보기 클릭 시 동작
  const handleAnswerClick = (selectedIndex: number) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev]
      newAnswers[currentQuestionIndex] = selectedIndex

      // 모든 답변이 채워졌는지 확인
      if (newAnswers.every((answer) => answer !== null)) {
        setShowSolutionButton(true)
      }

      return newAnswers
    })

    setTimeout(() => {
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
      }
    }, 1000)
  }

  // 문제 풀기 화면에서 ProgressBar 클릭 시 원하는 문제로 건너뛰기 (옵션)
  const handleProgressClick = (index: number) => {
    if (index >= 0 && index < quizData.length) {
      setCurrentQuestionIndex(index)
    }
  }

  // 전체 해설 보기: 다음 문제 해설
  const handleNextSolution = () => {
    if (currentSolutionIndex < quizData.length - 1) {
      setCurrentSolutionIndex((prev) => prev + 1)
    } else {
      setShowCongrats(true)
    }
  }

  // 전체 해설 보기: 이전 문제 해설
  const handlePrevSolution = () => {
    if (currentSolutionIndex > 0) {
      setCurrentSolutionIndex((prev) => prev - 1)
    }
  }

  const getVocabData = (vocab: string) => {
    const axios = authenticatedAxios()
    return axios
      .get(`api/main/vocab/${vocab}`)
      .then((res) => {
        const { data } = res
        if (res.status != 200) {
          throw new Error('Failed to get vocab data')
        }
        console.log(data)
        const {
          vocab_id,
          vocab,
          hanja,
          dict_mean,
          easy_explain,
          correct_example,
          incorrect_example,
        } = data
        return {
          vocab_id,
          vocab,
          hanja,
          dict_mean,
          easy_explain,
          correct_example,
          incorrect_example,
        }
      })
      .catch((err) => {
        console.log(err)
        throw new Error('Failed to get vocab data')
      })
  }

  // 단어 검색
  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    try {
      const data = await getVocabData(searchTerm)
      navigate(`/vocab/${data.vocab_id}`, { state: { vocabData: data } })
    } catch (error) {
      console.error('Search failed:', error)
    }
  }
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  // "문제 풀기" 화면 렌더링 함수
  const renderQuizInProgress = () => {
    const currentQuiz = quizData[currentQuestionIndex]
    if (!currentQuiz) return null

    const userAnswerIndex = userAnswers[currentQuestionIndex] ?? -1

    return (
      <div className="flex min-h-[463px] w-full flex-col justify-between space-y-[30px] rounded-[32px] bg-surface-primary-2 px-5 pt-12 text-text-primary">
        {/* 문제 */}
        <div className="space-y-[20px] pt-5 text-center">
          <h3 className="text-start body-l">{currentQuiz.quizQuestion[0]}</h3>
        </div>

        {/* 선택지 (2x2 grid) */}
        <div className="grid w-full grid-cols-2 gap-5">
          {currentQuiz.quizOptions.map((option, index) => (
            <button
              key={index}
              className={`h-[50px] w-full rounded-[20px] px-5 py-[5px] text-left body-m ${
                userAnswerIndex === index
                  ? 'bg-button-primary-1 transition-transform hover:bg-button-primary-2'
                  : 'transform bg-background-primary transition-transform hover:scale-105 hover:bg-button-secondary-1'
              }`}
              onClick={() => handleAnswerClick(index)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* 진행도 표시 */}
        <ProgressBar
          total={quizData.length}
          current={currentQuestionIndex}
          onClick={handleProgressClick}
          className="mt-auto"
        />
      </div>
    )
  }

  // "해설 보기" 화면 렌더링 함수 (하나씩 순서대로)
  const renderSolution = () => {
    const quiz = quizData[currentSolutionIndex]
    if (!quiz) return null
    const userIndex = userAnswers[currentSolutionIndex] ?? -1
    const correctIndex = quiz.quizAnswer[0]
    const isCorrect = userIndex === correctIndex

    // OX 표시
    const getMark = (idx: number) => {
      if (idx === correctIndex) return 'O'
      if (idx === userIndex) return 'X'
      return ''
    }
    // OX 색깔
    const getMarkColor = (idx: number) => {
      if (idx === correctIndex) return 'text-accent-blue'
      if (idx === userIndex) return 'text-accent-red-1'
      return 'text-[#e0e0e0]'
    }

    const getBgColor = (idx: number) => {
      if (idx === correctIndex) return 'bg-blue-500'
      if (idx === userIndex) return 'bg-red-700'
      return 'bg-background-primary'
    }

    return (
      <div className="flex h-[463px] w-full flex-col items-center justify-between rounded-[32px] bg-surface-primary-2 px-5 pb-5">
        {/* 질문 + 정오 여부 */}
        <div className="mt-8 flex w-full flex-col justify-center gap-y-[12px]">
          <h3 className="text-start body-l">{quiz.quizQuestion[0]}</h3>
          <p className="text-start text-text-intermediate body-m">
            {isCorrect ? (
              <span className="text-accent-blue">정답이에요!</span>
            ) : (
              <span>
                {`정답은 `}
                <span className="font-bold text-accent-blue body-l">
                  {quiz.quizOptions[0]?.toString()}
                </span>
                {`이에요. `}
                <span className="text-accent-red-1">{'다시 한번 볼까요?'}</span>
              </span>
            )}
          </p>
        </div>

        {/* 선택지 2x2 배치, 앞에 O/X 표시 */}
        <div className="mt-4 grid w-full grid-cols-2 gap-4">
          {quiz.quizOptions.map((option, i) => (
            <div
              key={i}
              className={`relative flex h-[50px] w-full items-center gap-3 rounded-[20px] px-4 py-2 ${getBgColor(i)}`}
            >
              <div className={`text-3xl font-bold ${getMarkColor(i)}`}>
                {getMark(i)}
              </div>
              <div
                className={`body-m ${i === userIndex ? 'font-bold' : 'font-normal'}`}
              >
                {option}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 해설 (스크롤 가능하도록 설정) */}
        <div className="bg-white custom-scrollbar-small max-h-[150px] w-full flex-grow overflow-y-auto rounded-xl bg-opacity-20 p-4">
          <h4 className="mb-2 font-semibold body-m">해설</h4>
          <p className="whitespace-pre-line text-text-secondary body-s">
            {quiz.quizAnswerExplain[0]}
          </p>
        </div>

        {/* 이전 / 다음 해설 이동 버튼 (최하단 고정) */}
        <div className="mt-auto flex w-full flex-shrink-0 justify-between gap-3">
          <Button
            text="이전 해설"
            onClick={handlePrevSolution}
            color="grey"
            size="small"
            disabled={currentSolutionIndex === 0}
          />
          <Button
            text={
              currentSolutionIndex < quizData.length - 1
                ? '다음 해설'
                : '학습 완료'
            }
            onClick={handleNextSolution}
            color="grey"
            size="small"
          />
        </div>
      </div>
    )
  }
  const renderCongrats = () => (
    <div className="animate-fade-in flex h-[463px] w-full flex-col items-center justify-center gap-6 rounded-[32px] bg-surface-primary-2 p-8">
      <PiHandsClappingDuotone className="text-accent-yellow animate-bounce text-8xl" />
      <h2 className="text-3xl font-bold text-text-primary">참 잘했어요! 🎉</h2>
      <Button
        text="해설 다시보기"
        color="purple"
        size="small"
        onClick={() => setShowCongrats(false)}
      />
    </div>
  )

  const { navigateToRandomPage } = useVocabRandom()

  return (
    <div className="relative">
      <div className="flex min-h-screen w-full items-center justify-center bg-[#c9b2ff] p-5">
        <div className="flex w-full max-w-[1440px] flex-col items-center gap-10">
          {/* 상단 영역: 제목 + 검색 */}
          <div className="flex w-full flex-col gap-4">
            <h1 className="text-[52px] font-bold">
              <span className="text-[#8a59ff]">아라부기</span>
              <span className="text-[#202020]">
                와 함께 오늘, 어떤 걸 배워볼까요?
              </span>
            </h1>
            <div className="inline-flex h-[97.19px] w-full items-center gap-[23.10px] rounded-[36.95px] bg-surface-primary-2 px-[41.57px] py-[23.10px]">
              <FaSearch
                className="cursor-pointer text-[#707070]"
                style={{
                  width: '34.64px',
                  height: '34.64px',
                  fontSize: '34.64px',
                }}
                onClick={handleSearch}
              />
              <input
                type="text"
                placeholder="단어 검색하기"
                className="w-[653.60px] bg-transparent text-[36.95px] font-medium leading-[50.81px] text-[#707070] placeholder-[#707070] focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>

          {/* 메인 컨텐츠: 좌측 - 오늘의 글, 우측 - 퀴즈 or 해설 */}
          <div className="flex w-full items-start justify-between gap-5">
            {/* 왼쪽: 오늘의 글 */}
            <div className="flex flex-1 flex-col gap-8">
              <h2 className="text-[32px] font-semibold text-text-primary">
                📖 오늘의 글
              </h2>
              {todayTexts.map((text) => (
                <div
                  key={text.text_id}
                  className="flex w-full max-w-full flex-col gap-2 overflow-hidden rounded-3xl bg-surface-primary-2 p-[34px] py-5"
                >
                  <div className="mb-2.5 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="inline-block max-w-[480px] truncate text-text-primary body-l">
                        {text.title}{' '}
                      </span>
                      <span className="text-text-secondary body-m">
                        / {text.category}
                      </span>
                    </div>
                    <Button
                      text="읽으러 가기"
                      color="purple"
                      size="small"
                      onClick={() =>
                        navigate(`/text/${text.text_id}`, {
                          state: { textData: text },
                        })
                      }
                      plusClasses="min-w-[120px] whitespace-nowrap"
                    />
                  </div>
                  <p className="max-w-[700px] truncate text-text-secondary body-s">
                    {text.content}
                  </p>
                </div>
              ))}
            </div>

            {/* 오른쪽: 문제 풀이 or 해설 보기 */}
            <div className="relative flex w-[610px] flex-col gap-8">
              <h2 className="text-text-primary title-m">🧐 오늘의 복습 퀴즈</h2>
              {quizData.length === 0 ? (
                <div className="flex min-h-[463px] w-full flex-col items-center justify-center gap-y-[60px] rounded-[32px] bg-surface-primary-2 px-5 pt-12">
                  <div className="whitespace-pre-line text-center leading-loose body-m">
                    {'오늘은 복습 퀴즈가 없어요.\n 내일 다시 확인해보세요.'}
                  </div>

                  <Button
                    text="단어 공부하러 가기"
                    size="small"
                    onClick={navigateToRandomPage}
                  />
                </div>
              ) : (
                <>
                  {showSolutionButton && !showAllResults && (
                    <Button
                      text="정답 및 해설"
                      size="small"
                      color="purple"
                      onClick={() => setShowAllResults(true)}
                      plusClasses="absolute right-4 top-[95px]" /* 우측 16px, 상단 70px */
                    />
                  )}
                  <div className="">
                    {' '}
                    {/* 컨텐츠 상단 여백 추가 */}
                    {!showAllResults && renderQuizInProgress()}
                    {showAllResults &&
                      (showCongrats ? renderCongrats() : renderSolution())}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage
