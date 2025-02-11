import { QuizData } from '../../../../types/mainPage';
import ProgressBar from '../../../../components/ProgressBar';

interface QuizInProgressProps {
  quiz: QuizData;
  currentIndex: number;
  totalQuizzes: number;
  userAnswer: number | null;
  onAnswerClick: (index: number) => void;
  onProgressClick: (index: number) => void;
}

const QuizInProgress = ({
  quiz,
  currentIndex,
  totalQuizzes,
  userAnswer,
  onAnswerClick,
  onProgressClick,
}: QuizInProgressProps) => {
  return (
    <div className="w-full min-h-[438px] pt-12 px-5 bg-surface-primary-2 rounded-[32px] flex flex-col justify-between space-y-[30px]">
      {/* 문제 */}
      <div className="space-y-[20px] pt-5 text-center">
        <h3 className="body-l">{quiz.quiz_question[0]}</h3>
      </div>

      {/* 선택지 (2x2 grid) */}
      <div className="w-full grid grid-cols-2 gap-5">
        {quiz.quiz_options.map((option, index) => (
          <button
            key={index}
            className={`w-full h-[50px] px-5 py-[5px] rounded-[20px] body-m text-left ${
              userAnswer === index
                ? 'bg-button-primary-1 hover:bg-button-primary-2 transition-transform'
                : 'bg-background-primary hover:bg-button-secondary-1 transform hover:scale-105 transition-transform'
            }`}
            onClick={() => onAnswerClick(index)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* 진행도 표시 */}
      <ProgressBar
        total={totalQuizzes}
        current={currentIndex}
        onClick={onProgressClick}
        className="mt-auto"
      />
    </div>
  );
};

export default QuizInProgress;
