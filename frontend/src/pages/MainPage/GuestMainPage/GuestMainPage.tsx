import { useState, useCallback, useEffect } from 'react'
import AnimatedCards from './AnimatedCards'
import TextAnimationWrapper from './TextAnimationWrapper'
import ImageAnimationWrapper from './ImageAnimationWrapper'
import ChatInterface from './GuestChatInterface'
import { ChatMessage, ChatAction } from '../../../types/chat'
import AnimationWrapper from './AnimationWrapper'
import LoginPopup from './LoginPopup'
import Button from 'components/Button'
import MagneticText from 'components/MagneticText'
import Footer from '../../../components/Footer'

const GuestMainPage = () => {
  useEffect(() => {
    // 페이지 로드 시 스크롤 위치 초기화
    window.scrollTo(0, 0)
  }, [])

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: '여기서 주인공의 심정이 어떨까?',
      type: 'user',
      timestamp: new Date(),
    },
    {
      id: '2',
      content: '주인공은 혼란스럽지만 희망을 잃지 않으려 노력하는 것 같아요.',
      type: 'bot',
      timestamp: new Date(),
    },
  ])

  const chatActions: ChatAction[] = [
    {
      id: '1',
      label: '비슷한 말',
      onClick: () => console.log('비슷한 말 클릭'),
    },
    { id: '2', label: '반대말', onClick: () => console.log('반대말 클릭') },
    {
      id: '3',
      label: '추가 설명',
      onClick: () => console.log('추가 설명 클릭'),
    },
  ]

  const handleSendMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      type: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }, [])

  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false)

  const handleButtonClick = () => {
    setIsLoginPopupOpen(true)
  }

  return (
    <div className="flex h-auto w-full flex-col items-center overflow-hidden bg-surface-primary-1">
      <div className="relative mx-auto max-w-[1440px] px-4 md:px-8 lg:px-16">
        <ImageAnimationWrapper
          imageSelector=".animated-image"
          className="-z-1 absolute right-[-20%] top-[50px] h-auto w-[600px]"
          config={{
            duration: 1.5,
            x: 300,
            scale: 0.7,
            ease: 'power3.out',
            delay: 0.3,
          }}
        >
          <img
            src="/assets/araboogie100.svg"
            alt="아라부기 캐릭터"
            className="animated-image h-full w-full object-contain opacity-70"
          />
        </ImageAnimationWrapper>
        <div className="relative z-10 flex flex-col items-center justify-start gap-[150px]">
          <div className="flex h-auto flex-col items-center justify-start gap-[10px] self-stretch pt-[50px]">
            <div className="self-stretch whitespace-normal text-center">
              <span className="text-main display-l">아라부기</span>
              <span className="text-text-primary display-l">
                와 함께 <br />더 깊이 이해하고 더 넓게 소통해주세요.
              </span>
            </div>
            <AnimationWrapper
              cardSelector=".card"
              preset="fadeUp"
              config={{
                initialY: 50,
                duration: 1,
                stagger: 0.2,
              }}
              className="flex items-stretch justify-center gap-5 self-stretch px-2.5"
            >
              <div className="card flex w-full flex-col items-stretch justify-between md:w-1/3">
                <div className="flex flex-grow flex-col justify-between rounded-[28px] bg-surface-primary-2 p-6">
                  <div className="leading-7 text-text-primary body-m">
                    '사랑'과 '애정'은 느낌이 어떻게 다를까?
                  </div>
                  <div className="flex h-[80px] flex-col items-end justify-end gap-6">
                    <div className="flex h-9 items-center justify-end gap-3">
                      <div className="h-9 w-9" />
                      <Button
                        size="small"
                        color="grey"
                        text={'알아보기'}
                        onClick={handleButtonClick}
                        plusClasses="px-[10px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card flex w-full flex-col items-stretch justify-between md:w-1/3">
                <div className="flex flex-grow flex-col justify-between rounded-[28px] bg-surface-primary-2 p-6">
                  <div className="leading-7 text-text-primary body-m">
                    '고구마'는 어떻게 생긴 말일까? 한자어일까, 고유어일까,
                    아니면 외국어에서 왔을까?
                  </div>
                  <div className="flex h-[80px] flex-col items-end justify-end gap-6">
                    <div className="flex h-9 items-center justify-end gap-3">
                      <div className="h-9 w-9" />
                      <Button
                        size="small"
                        color="grey"
                        text={'알아보기'}
                        onClick={handleButtonClick}
                        plusClasses="px-[10px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card flex w-full flex-col items-stretch justify-between md:w-1/3">
                <div className="flex flex-grow flex-col justify-between rounded-[28px] bg-surface-primary-2 p-6">
                  <div className="leading-7 text-text-primary body-m">
                    '엉겁결'이라는 말, 왜 그렇게 쓰일까?
                  </div>
                  <div className="flex h-[80px] flex-col items-end justify-end gap-6">
                    <div className="flex h-9 items-center justify-end gap-3">
                      <div className="h-9 w-9" />
                      <Button
                        size="small"
                        color="grey"
                        text={'알아보기'}
                        onClick={handleButtonClick}
                        plusClasses="px-[10px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AnimationWrapper>
          </div>

          <div className="flex h-auto flex-col items-stretch justify-start gap-6">
            <div className="h-[55px] self-stretch text-text-primary title-m">
              📖 OOO님이 관심 있어할 만한 글이에요!
            </div>
            <div className="grid grid-cols-1 gap-[60px] self-stretch p-2.5 md:grid-cols-2">
              <div className="flex h-full flex-col gap-[26px] rounded-[28px] bg-surface-primary-2 p-[30px]">
                <div className="flex items-center gap-2">
                  <span className="text-text-primary title-m">말의 품격</span>
                  <span className="text-text-primary body-m">이기주</span>
                </div>
                <div className="flex h-full flex-col justify-between">
                  <div className="mb-6 text-text-secondary body-m">
                    <MagneticText>
                      지금 우리는 '말의 힘'이 세상을 지배하는 시대에 살고 있다.
                      온당한 말 한마디가 천 냥 빚만 갚는 게 아니라 사람의
                      인생을, 나아가 조직과 공동체의 명운을 바꿔놓기도 한다.
                      말하기가 개인의 경쟁력을 평가하는 잣대가 된 지도 오래다.
                      말 잘하는 사람을 매력 있는 사람으로 간주하는 풍토는 갈수록
                      확산하고 있다. 그래서인지 날카로운 혀를 빼 들어 칼처럼
                      휘두르는 사람은 넘쳐나고, 자극적인 이야기를 폭포수처럼
                      쏟아내며 좌중을 들었다 놨다 하는 능변가는 홍수처럼
                      범람한다.
                    </MagneticText>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      size="small"
                      color="purple"
                      text={'읽으러 가기'}
                      onClick={handleButtonClick}
                      plusClasses="px-[10px]"
                      showFrontIcon={true}
                    />
                  </div>
                </div>
              </div>
              <div className="flex h-full flex-col gap-[26px] rounded-[28px] bg-surface-primary-2 p-[30px]">
                <div className="flex items-center gap-2">
                  <span className="text-text-primary title-m">고요의 힘</span>
                  <span className="text-text-primary body-m">틱낫한</span>
                </div>
                <div className="flex h-full flex-col justify-between">
                  <div className="mb-6 text-text-secondary body-m">
                    <MagneticText>
                      우리의 머릿속은 늘 생각으로 가득 차다. 그래서 다른
                      사람들의 이야기를 들을 공간조차 없다. 우리가 타인과 더
                      많이 연결되고자 한다면 그들의 이야기를 경청해야 한다.
                      진심으로 귀 기울여 듣는다는 것은 이해하는 것이고, 그것을
                      위해서는 우리가 "내면의 NSTNon-Stop Thinking 라디오"를
                      꺼야 한다고 조언하고다. 독자들은 이 책을 통해 틱낫한
                      스님이 설명하는 내면의 고독과 마음챙김의 가장 근원적
                      해법인 일상 수행의 다양하고 쉬운 방법을 직접 체험할 수
                      있을 것이다.
                    </MagneticText>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      size="small"
                      color="purple"
                      text={'읽으러 가기'}
                      onClick={handleButtonClick}
                      plusClasses="px-[10px]"
                      showFrontIcon={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <TextAnimationWrapper
              textSelector=".animated-text"
              className="flex w-full flex-col items-center justify-center gap-[200px] py-[50px] md:flex-row"
              config={{
                stagger: 0.3,
                x: -100,
                duration: 0.8,
                opacity: 0,
                ease: 'power2.out',
              }}
            >
              <div className="flex shrink grow basis-0 flex-col gap-2 text-center md:text-left">
                <span className="animated-text block text-text-primary display-m">
                  나에게 맞는
                </span>
                <span className="animated-text block text-main display-m">
                  매일 새로운
                </span>
                <span className="animated-text block text-text-primary display-m">
                  맞춤 학습
                </span>
              </div>
              <div className="relative h-[510.12px] w-[670.93px]">
                <AnimatedCards />
              </div>
            </TextAnimationWrapper>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-[100px] px-[100px] py-[100px] md:flex-row">
            <AnimationWrapper
              cardSelector=".chat-container"
              preset="fadeUp"
              config={{
                initialY: 50,
                initialOpacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
              }}
            >
              <div className="chat-container">
                <ChatInterface
                  messages={messages}
                  actions={chatActions}
                  onSendMessage={handleSendMessage}
                  width="w-[345px]"
                  height="h-[700px]"
                />
              </div>
            </AnimationWrapper>
            <TextAnimationWrapper
              textSelector=".animated-text"
              className="flex w-full flex-col items-center justify-center gap-[58px] py-[50px] md:flex-row"
              config={{
                stagger: 0.1,
                x: -100,
                duration: 0.6,
                opacity: 0,
                ease: 'power2.out',
              }}
            >
              <div className="flex shrink grow basis-0 flex-col gap-2 text-right">
                <div className="animated-text block display-m">
                  <span className="text-text-primary">읽다가 </span>
                  <span className="text-main">막히면?</span>
                </div>
                <div className="animated-text block display-m">
                  <span className="text-main">아라부기</span>
                  <span className="text-text-primary">가</span>
                </div>
                <span className="animated-text block text-text-primary display-m">
                  친절하게 풀어드립니다
                </span>
              </div>
            </TextAnimationWrapper>
          </div>
        </div>
      </div>
      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={() => setIsLoginPopupOpen(false)}
      />
      <Footer />
    </div>
  )
}

export default GuestMainPage
