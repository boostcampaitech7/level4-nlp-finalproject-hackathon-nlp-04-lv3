import useTextList from 'hooks/useTextList'
import TextCard from './TextCard'
import PageSelector from './PageSelector'
import { useTextListPageStore } from 'stores/textListPageStore'
import { useEffect } from 'react'

const TextListPage = () => {
  const { data: textList, isFetching, refetch, setPageNum } = useTextList()
  const { currentPage, totalPages, setTotalPages } = useTextListPageStore()

  useEffect(() => {
    if (textList?.totalPageCount && totalPages !== textList?.totalPageCount) {
      setTotalPages(textList.totalPageCount)
    }
  }, [textList, totalPages])

  useEffect(() => {
    if (!!currentPage && currentPage > 0) {
      setPageNum(currentPage)
      refetch()
    }
  }, [currentPage, setPageNum])

  return (
    <div className="flex min-h-screen flex-col items-center bg-background-primary pb-[36px] pt-[25px]">
      <div className="flex w-4/5 flex-col gap-y-[25px]">
        <div className="border-b-[4px] border-b-line pb-[8px] text-text-primary title-l">
          목록
        </div>
        {isFetching ? (
          <div>글 목록을 불러오는 중이에요.</div>
        ) : (
          <div className="grid grid-cols-4 gap-x-[30px] gap-y-[24px]">
            {textList?.texts.map((text, index) => {
              return (
                <TextCard
                  key={index}
                  textId={text.textId}
                  title={text.title}
                  category={text.category}
                />
              )
            })}
          </div>
        )}
        <PageSelector setPageNum={setPageNum} />
      </div>
    </div>
  )
}

export default TextListPage
