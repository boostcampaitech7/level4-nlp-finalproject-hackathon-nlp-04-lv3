import { QuizData } from '../../../../types/mainPage';
import Button from '../../../../components/Button';

interface QuizSolutionProps {
  quiz: QuizData;
  userAnswer: number | null;
  onPrevClick: () => void;
  onNextClick: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const QuizSolution = ({
  quiz,
  userAnswer,
  onPrevClick,
  onNextClick,
  isFirst,
  isLast,
}: QuizSolutionProps) => {
  const correctIndex = quiz.quiz_correct.findIndex((c) => c === true);
  const isCorrect = userAnswer === correctIndex;

  // OX 표시
  const getMark = (idx: number) => {
    if (idx === correctIndex) return 'O';
    if (idx === userAnswer) return 'X';
    return '';
  };

  // OX 색깔
  const getMarkColor = (idx: number) => {
    if (idx === correctIndex) return 'text-accent-blue';
    if (idx === userAnswer) return 'text-accent-red-1';
    return 'text-[#e0e0e0]';
  };

  return (
    <div className="w-full px-5 h-[438px] bg-surface-primary-2 rounded-[32px] flex flex-col justify-between items-center pb-5">
      {/* 질문 + 정오 여부 */}
      <div className="w-full mt-8 flex flex-col justify-center space-x-5 text-center">
        <h3 className="body-l">{quiz.quiz_question[0]}</h3>
        <p className={`body-l ${isCorrect ? 'text-accent-blue' : 'text-accent-red-1'}`}>
          {isCorrect ? '맞았어요!' : '다시 한번 볼까요?'}
        </p>
      </div>

      {/* 선택지 2x2 배치, 앞에 O/X 표시 */}
      <div className="w-full grid grid-cols-2 mt-4 gap-4">
        {quiz.quiz_options.map((option, i) => (
          <div
            key={i}
            className="relative w-full h-[50px] px-4 py-2 rounded-[20px] flex items-center gap-3 bg-background-primary"
          >
            <div className={`text-3xl font-bold ${getMarkColor(i)}`}>
              {getMark(i)}
            </div>
            <div className={`body-m ${i === userAnswer ? 'font-bold' : 'font-normal'}`}>
              {option}
            </div>
          </div>
        ))}
      </div>

      {/* 하단 해설 (스크롤 가능하도록 설정) */}
      <div className="w-full bg-white bg-opacity-20 p-4 rounded-xl flex-grow overflow-y-auto max-h-[150px]">
        <h4 className="body-m font-semibold mb-2">해설</h4>
        <p className="body-s text-text-secondary whitespace-pre-line">
          {quiz.quiz_answer_explain[0]}
        </p>
      </div>

      {/* 이전 / 다음 해설 이동 버튼 (최하단 고정) */}
      <div className="w-full flex justify-between gap-3 mt-auto flex-shrink-0">
        <Button
          text="이전 해설"
          onClick={onPrevClick}
          color="grey"
          size="small"
          disabled={isFirst}
        />
        <Button
          text={isLast ? '학습 완료' : '다음 해설'}
          onClick={onNextClick}
          color="grey"
          size="small"
        />
      </div>
    </div>
  );
};

export default QuizSolution;
