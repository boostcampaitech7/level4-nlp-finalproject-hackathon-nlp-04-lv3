import useTextData from 'hooks/temp.useTextData'
import { TitleBar } from './TitleBar'
import MainHelp from './MainHelp'
import TextContent from './TextContent'
import Button from 'components/Button'
import EasyExplainArea from './EasyExplainArea'
import ChatbotArea from './ChatbotArea'

const TextDetailPage = () => {
  const { data: textData } = useTextData(123)

  return (
    <div className="flex flex-grow justify-center bg-background-primary pb-[36px] pt-[24px]">
      {!!textData && (
        <div className="flex w-4/5 flex-col gap-y-[12px]">
          <TitleBar />
          <MainHelp />
          <div className="flex flex-grow gap-x-[40px]">
            <div className="flex flex-col gap-y-[20px]">
              <TextContent />
              <div className="flex justify-center gap-x-[22px]">
                <Button
                  text="이전 글"
                  size="small"
                  showBackIcon={true}
                  onClick={() => console.log('ds')}
                />
                <Button
                  text="퀴즈 풀기"
                  size="small"
                  onClick={() => console.log('ds')}
                />
                <Button
                  text="다음 글"
                  size="small"
                  showFrontIcon={true}
                  onClick={() => console.log('ds')}
                />
              </div>
            </div>
            <div className="flex w-[346px] flex-col gap-y-[10px]">
              <EasyExplainArea />
              <ChatbotArea />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TextDetailPage
