import React, { useState, useCallback, useEffect } from 'react'
import AnimatedCards from './AnimatedCards'
import { TextAnimationWrapper } from './TextAnimationWrapper'
import { ImageAnimationWrapper } from './ImageAnimationWrapper'
import { ChatInterface } from './ChatInterface'
import { ChatMessage, ChatAction } from '../../types/chat'
import { ChatAnimationWrapper } from './ChatAnimationWrapper'
import LoginPopup from './LoginPopup'
import Button from 'components/Button'

export const GuestMainPage: React.FC = () => {
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
    <div className="w-full h-auto bg-[var(--color-surface-primary-1)] flex flex-col items-center overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 relative">
        <ImageAnimationWrapper
          imageSelector=".animated-image"
          className="absolute right-[-20%] top-[50px] w-[600px] h-auto -z-1"
          config={{
            duration: 1.5,
            x: 300,
            scale: 0.7,
            ease: 'power3.out',
            delay: 0.3,
          }}
        >
          <img
            src="/src/assets/araboogie100.svg"
            alt="아라부기 캐릭터"
            className="animated-image w-full h-full object-contain opacity-70"
          />
        </ImageAnimationWrapper>
        <div className="flex-col justify-start items-center gap-[85px] flex relative z-10">
          <div className="self-stretch h-auto flex-col justify-start items-center gap-[89px] flex pt-[100px]">
            <div className="h-[152px] flex-col justify-start items-center gap-[53px] flex">
              <div className="self-stretch text-center whitespace-normal">
                <span className="display-l text-[var(--color-main)]">
                  아라부기
                </span>
                <span className="display-l text-[var(--color-text-primary)]">
                  와 함께 <br />더 깊이 이해하고 더 넓게 소통하세요.
                </span>
              </div>
            </div>
            <div className="self-stretch px-2.5 flex justify-center items-stretch gap-5">
              <div className="w-full md:w-1/3 flex flex-col justify-between items-stretch">
                <div className="flex-grow p-6 bg-[var(--color-surface-primary-2)] rounded-[28px] flex flex-col justify-between">
                  <div className="body-m text-[var(--color-text-primary)] leading-7">
                    ‘사랑’과 ‘애정’은 느낌이 어떻게 다를까?
                  </div>
                  <div className="h-[80px] flex flex-col justify-end items-end gap-6">
                    <div className="h-9 flex justify-end items-center gap-3">
                      <div className="w-9 h-9" />
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

              <div className="w-full md:w-1/3 flex flex-col justify-between items-stretch">
                <div className="flex-grow p-6 bg-[var(--color-surface-primary-2)] rounded-[28px] flex flex-col justify-between">
                  <div className="body-m text-[var(--color-text-primary)] leading-7">
                    ‘고구마’는 어떻게 생긴 말일까? 한자어일까, 고유어일까,
                    아니면 외국어에서 왔을까?
                  </div>
                  <div className="h-[80px] flex flex-col justify-end items-end gap-6">
                    <div className="h-9 flex justify-end items-center gap-3">
                      <div className="w-9 h-9" />
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

              <div className="w-full md:w-1/3 flex flex-col justify-between items-stretch">
                <div className="flex-grow p-6 bg-[var(--color-surface-primary-2)] rounded-[28px] flex flex-col justify-between">
                  <div className="body-m text-[var(--color-text-primary)] leading-7">
                    ‘엉겁결’이라는 말, 왜 그렇게 쓰일까?
                  </div>
                  <div className="h-[80px] flex flex-col justify-end items-end gap-6">
                    <div className="h-9 flex justify-end items-center gap-3">
                      <div className="w-9 h-9" />
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
            </div>
          </div>

          <div className=" h-auto flex-col justify-start items-stretch gap-6 flex">
            <div className="title-m self-stretch h-[55px] text-[var(--color-text-primary)]">
              📖 OOO님이 관심 있어 할 만한 글이에요!
            </div>
            <div className="self-stretch p-2.5 grid grid-cols-1 md:grid-cols-2 gap-[60px]">
              <div className="bg-[var(--color-surface-primary-2)] rounded-[28px] p-[30px] flex flex-col gap-[26px] h-full">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-text-primary)] title-m">
                    말의 품격
                  </span>
                  <span className="text-[var(--color-text-intermediate)] body-m">
                    이기주
                  </span>
                </div>
                <div className="flex flex-col justify-between h-full">
                  <div className="text-neutral-600 body-m mb-6">
                    지금 우리는 '말의 힘'이 세상을 지배하는 시대에 살고 있다.
                    온당한 말 한마디가 천 냥 빚만 갚는 게 아니라 사람의 인생을,
                    나아가 조직과 공동체의 명운을 바꿔놓기도 한다. 말하기가
                    개인의 경쟁력을 평가하는 잣대가 된 지도 오래다. 말 잘하는
                    사람을 매력 있는 사람으로 간주하는 풍토는 갈수록 확산하고
                    있다. 그래서인지 날카로운 혀를 빼 들어 칼처럼 휘두르는
                    사람은 넘쳐나고, 자극적인 이야기를 폭포수처럼 쏟아내며
                    좌중을 들었다 놨다 하는 능변가는 홍수처럼 범람한다.
                  </div>
                  <div className="flex justify-end items-center gap-3">
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
              <div className="bg-[var(--color-surface-primary-2)] rounded-[28px] p-[30px] flex flex-col gap-[26px] h-full">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-text-primary)] title-m">
                    고요의 힘
                  </span>
                  <span className="text-[var(--color-text-intermediate)] body-m">
                    틱낫한
                  </span>
                </div>
                <div className="flex flex-col justify-between h-full">
                  <div className="text-neutral-600 body-m mb-6">
                    우리의 머릿속은 늘 생각으로 가득 차다. 그래서 다른 사람들의
                    이야기를 들을 공간조차 없다. 우리가 타인과 더 많이
                    연결되고자 한다면 그들의 이야기를 경청해야 한다. 진심으로 귀
                    기울여 듣는다는 것은 이해하는 것이고, 그것을 위해서는 우리가
                    "내면의 NSTNon-Stop Thinking 라디오"를 꺼야 한다고
                    조언하고다. 독자들은 이 책을 통해 틱낫한 스님이 설명하는
                    내면의 고독과 마음챙김의 가장 근원적 해법인 일상 수행의
                    다양하고 쉬운 방법을 직접 체험할 수 있을 것이다.
                  </div>
                  <div className="flex justify-end items-center gap-3">
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
          <div className="my-[50px]">
            <TextAnimationWrapper
              textSelector=".animated-text"
              className="w-full py-[50px] flex justify-center items-center gap-[200px] flex-col md:flex-row"
              config={{
                stagger: 0.3,
                x: -100,
                duration: 0.8,
                opacity: 0,
                ease: 'power2.out',
              }}
            >
              <div className="grow shrink basis-0 text-center md:text-left flex flex-col gap-2">
                <span className="animated-text block text-[var(--color-text-primary)] display-m">
                  나에게 맞는
                </span>
                <span className="animated-text block text-[var(--color-main)] display-m">
                  매일 새로운
                </span>
                <span className="animated-text block text-[var(--color-text-primary)] display-m">
                  맞춤 학습
                </span>
              </div>
              <div className="w-[670.93px] h-[510.12px] relative">
                <AnimatedCards />
              </div>
            </TextAnimationWrapper>
          </div>
          <div className="w-full py-[50px] justify-center items-center gap-[158px] flex flex-col md:flex-row">
            <ChatAnimationWrapper>
              <ChatInterface
                messages={messages}
                actions={chatActions}
                onSendMessage={handleSendMessage}
                width="w-[345px]"
                height="h-[700px]"
                messageSize="text-[18px]"
              />
            </ChatAnimationWrapper>
            <TextAnimationWrapper
              textSelector=".animated-text"
              className="w-full py-[50px] flex justify-center items-center gap-[58px] flex-col md:flex-row"
              config={{
                stagger: 0.1,
                x: -100,
                duration: 0.6,
                opacity: 0,
                ease: 'power2.out',
              }}
            >
              <div className="grow shrink basis-0 text-right flex flex-col gap-2">
                <div className="animated-text block display-m">
                  <span className="text-[var(--color-text-primary)]">
                    읽다가{' '}
                  </span>
                  <span className="text-[var(--color-main)]">막히면?</span>
                </div>
                <div className="animated-text block display-m">
                  <span className="text-[var(--color-main)]">아라부기</span>
                  <span className="text-[var(--color-text-primary)]">가</span>
                </div>
                <span className="animated-text block text-[var(--color-text-primary)] display-m">
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
      <div className="w-full py-[23px] bg-[var(--color-button-inverse)] justify-center items-center gap-2.5 inline-flex">
        <div className="grow shrink basis-0 flex-col justify-center items-center gap-2.5 inline-flex">
          <div className="self-stretch text-center">
            <span className="text-[var(--color-main)] text-[59px] font-normal font-['PartialSans']">
              아라
            </span>
            <span className="text-[var(--color-text-intermediate)] text-[59px] font-normal font-['PartialSans']">
              부기
            </span>
          </div>
          <div className="self-stretch text-center text-[var(--color-text-inverse)] body-m">
            GitHub: https://shorturl.at/XIlUM
          </div>
          <div className="self-stretch text-center text-[var(--color-text-inverse)] body-m">
            2024.08-2025.02
          </div>
        </div>
      </div>
    </div>
  )
}
