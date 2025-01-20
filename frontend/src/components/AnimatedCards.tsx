import React from 'react';
import { AnimationWrapper } from './AnimationWrapper';

const AnimatedCards: React.FC = () => {
  const cards = [
    { title: '희망', caption: '더 나은 미래를 향한 발걸음' },
    { title: '성장', caption: '끊임없는 도전과 발전' },
    { title: '열정', caption: '불타오르는 학습의 의지' },
    { title: '열정', caption: '불타오르는 학습의 의지' },
    { title: '열정', caption: '불타오르는 학습의 의지' },
    { title: '가온누리', caption: '어떠한 일이 있어도 세상의 중심' },
  ];

  return (
    <AnimationWrapper
      cardSelector=".card"
      className="relative w-full h-full flex items-center justify-center"
      preset="fanOut"
      // 필요한 경우 추가 설정으로 프리셋을 덮어쓸 수 있습니다
      config={{
        initialX: 0,  // 프리셋의 설정을 덮어씁니다
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="card absolute w-[390px] h-[363px] px-[50px] py-[30px] bg-white rounded-[32px] shadow-[0px_0px_13.199999809265137px_0px_rgba(178,148,250,1.00)] flex-col justify-start items-start"
        >
          <div className="w-[303px] h-[60px] justify-end items-start inline-flex">
            <div className="w-[60px] h-[60px] px-[1.47px] pb-[5.73px] justify-center items-center flex" />
          </div>
          <div className="self-stretch h-[76px] flex-col justify-start items-start gap-2.5 flex">
            <div className="px-2.5 justify-center items-end gap-2.5 inline-flex">
              <div className="text-[#202020] text-[64px] font-black font-['Pretendard']">{card.title}</div>
              <div className="h-[38px] py-[7px]" />
            </div>
          </div>
          <div className="self-stretch grow shrink basis-0 px-2.5 justify-center items-center gap-2.5 inline-flex">
            <div className="grow shrink basis-0 self-stretch text-[#707070] text-2xl font-medium font-['Pretendard']">
              {card.caption}
            </div>
          </div>
        </div>
      ))}
    </AnimationWrapper>
  );
};

export default AnimatedCards;