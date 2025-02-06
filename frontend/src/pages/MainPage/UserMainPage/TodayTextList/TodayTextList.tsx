import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button';
import { TodayText } from '../../../../types/mainPage';

interface TodayTextListProps {
  texts: TodayText[];
  className?: string;
}

const TodayTextList = ({ texts, className = '' }: TodayTextListProps) => {
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <h2 className="text-[32px] font-semibold text-[#202020]">📖 오늘의 글</h2>
      {texts.map((text) => (
        <div
          key={text.text_id}
          className="w-full p-[34px] py-5 bg-surface-primary-2 rounded-3xl"
        >
          <div className="flex justify-between items-center mb-2.5">
            <div>
              <span className="body-l text-text-primary">{text.title} </span>
              <span className="body-m text-text-secondary">/ {text.category}</span>
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
            />
          </div>
          <p className="body-s text-text-secondary">{text.content}</p>
        </div>
      ))}
    </div>
  );
};

export default TodayTextList;
