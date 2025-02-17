import AnimationWrapper from './AnimationWrapper'

const AnimatedCards = () => {
  const cards = [
    { title: '🥚', caption: '이스터에그' },
    { title: '세븐', caption: '일레븐' },
    { title: '열정', caption: '2+1 행사 중' },
    { title: '수면', caption: '50% 할인' },
    { title: '마감시간', caption: '2월12일' },
    { title: '가온누리', caption: '어떠한 일이 있어도 세상의 중심' },
  ]

  return (
    <AnimationWrapper
      cardSelector=".card"
      className="relative flex h-full w-full items-center justify-center"
      preset="fanOut"
      // 필요한 경우 추가 설정으로 프리셋을 덮어쓸 수 있습니다
      config={{
        initialX: 0, // 프리셋의 설정을 덮어씁니다
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="card absolute h-[363px] w-[390px] flex-col items-start justify-start rounded-[32px] bg-surface-secondary px-[50px] py-[30px] shadow-[0px_0px_13.199999809265137px_0px_var(--color-accent-purple)]"
        >
          <div className="inline-flex h-[60px] w-[303px] items-start justify-end">
            <div className="flex h-[60px] w-[60px] items-center justify-center px-[1.47px] pb-[5.73px]" />
          </div>
          <div className="flex h-[76px] flex-col items-start justify-start gap-2.5 self-stretch">
            <div className="inline-flex items-end justify-center gap-2.5 px-2.5">
              <div className="text-text-primary display-l">{card.title}</div>
              <div className="h-[38px] py-[7px]" />
            </div>
          </div>
          <div className="inline-flex shrink grow basis-0 items-center justify-center gap-2.5 self-stretch px-2.5 py-2">
            <div className="shrink grow basis-0 self-stretch text-text-secondary caption-m">
              {card.caption}
            </div>
          </div>
        </div>
      ))}
    </AnimationWrapper>
  )
}

export default AnimatedCards
