import { PiHandsClappingDuotone } from 'react-icons/pi';
import Button from '../../../../components/Button';

interface CongratsProps {
  onReviewClick: () => void;
}

const Congrats = ({ onReviewClick }: CongratsProps) => {
  return (
    <div className="w-full h-[438px] flex flex-col items-center justify-center gap-6 p-8 bg-surface-primary-2 rounded-[32px] animate-fade-in">
      <PiHandsClappingDuotone className="text-accent-yellow animate-bounce text-8xl" />
      <h2 className="text-3xl font-bold text-text-primary">참 잘했어요! 🎉</h2>
      <Button
        text="해설 다시보기"
        color="purple"
        size="small"
        onClick={onReviewClick}
      />
    </div>
  );
};

export default Congrats;
