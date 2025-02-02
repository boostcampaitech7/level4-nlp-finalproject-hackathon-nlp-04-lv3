import { TextAccountType } from 'types'
import { TextQuizType } from 'types/textQuiz'

const getTextQuiz = async (quizId: number) => {
  console.log(`${quizId} 퀴즈 호출`)
  const dummyTextQuiz: TextQuizType = {
    question: [
      '연금술사가 읽고 있던 책의 저자는 누구인가요?',
      '나르키소스가 호수를 찾은 이유는 무엇인가요?',
      '오스카 와일드가 나르키소스의 전설을 다르게 해석한 부분은 무엇인가요?',
    ],
    options: [
      '파울로 코엘료',
      '오스카 와일드',
      '윌리엄 셰익스피어',
      '애드거 앨런 포',
      '자신의 그림자를 보기 위해',
      '자신의 아름다움을 확인하기 위해',
      '요정들의 비밀을 듣기 위해',
      '자신의 목소리를 듣기 위해',
      '호수는 나르키소스를 사랑했기 때문에 슬퍼했다.',
      '나르키소스는 자신의 아름다움이 아닌 영혼을 보았다.',
      '나르키소스가 죽은 이유는 자신의 모습을 보지 못하게 되었기 때문이다.',
      '호수는 자신의 아름다움을 나르키소스의 눈에서 보았기 때문에 슬퍼했다.',
    ],
  }

  await new Promise<TextAccountType>((resolve) => {
    setTimeout(resolve, 2000)
  })
  return dummyTextQuiz
}

export default getTextQuiz
