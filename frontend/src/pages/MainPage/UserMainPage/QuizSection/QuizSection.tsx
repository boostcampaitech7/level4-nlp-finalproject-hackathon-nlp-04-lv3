import { useState } from 'react';
import { QuizData } from '../../../../types/mainPage';
import Button from '../../../../components/Button';
import QuizInProgress from './QuizInProgress';
import QuizSolution from './QuizSolution';
import Congrats from './Congrats';

interface QuizSectionProps {
  quizData: QuizData[];
  className?: string;
}

const QuizSection = ({ quizData, className = '' }: QuizSectionProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(Array(quizData.length).fill(null));
  const [showSolutionButton, setShowSolutionButton] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);

  const handleAnswerClick = (selectedIndex: number) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = selectedIndex;
      
      // 모든 답변이 채워졌는지 확인
      if (newAnswers.every(answer => answer !== null)) {
        setShowSolutionButton(true);
      }
      
      return newAnswers;
    });
  
    setTimeout(() => {
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }, 1000);
  };

  const handleProgressClick = (index: number) => {
    if (index >= 0 && index < quizData.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleNextSolution = () => {
    if (currentSolutionIndex < quizData.length - 1) {
      setCurrentSolutionIndex((prev) => prev + 1);
    } else {
      setShowCongrats(true);
    }
  };

  const handlePrevSolution = () => {
    if (currentSolutionIndex > 0) {
      setCurrentSolutionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className={`w-[610px] flex gap-4 flex-col relative ${className}`}>
      <h2 className="title-m text-[#202020]">
        🧐 오늘의 복습 퀴즈
      </h2>

      {showSolutionButton && !showAllResults && (
        <Button
          text="정답 및 해설"
          size="small"
          color="purple"
          onClick={() => setShowAllResults(true)}
          plusClasses="absolute right-4 top-[95px]"
        />
      )}

      <div className="mt-4">
        {!showAllResults && (
          <QuizInProgress
            quiz={quizData[currentQuestionIndex] as QuizData}
            currentIndex={currentQuestionIndex}
            totalQuizzes={quizData.length}
            userAnswer={userAnswers[currentQuestionIndex] as number | null}
            onAnswerClick={handleAnswerClick}
            onProgressClick={handleProgressClick}
          />
        )}
        {showAllResults && !showCongrats && (
          <QuizSolution
            quiz={quizData[currentSolutionIndex] as QuizData}
            userAnswer={userAnswers[currentSolutionIndex] as number | null}
            onPrevClick={handlePrevSolution}
            onNextClick={handleNextSolution}
            isFirst={currentSolutionIndex === 0}
            isLast={currentSolutionIndex === quizData.length - 1}
          />
        )}
        {showAllResults && showCongrats && (
          <Congrats onReviewClick={() => setShowCongrats(false)} />
        )}
      </div>
    </div>
  );
};

export default QuizSection;
