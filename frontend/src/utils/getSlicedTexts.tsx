import { DiaryType, SlicedTextType } from 'types/diary'

const getSlicedTexts = (rawData: DiaryType) => {
  const slicedTexts: SlicedTextType[] = []

  if (rawData.feedback.length === 0) {
    slicedTexts.push({
      text: rawData.text,
      withFeedback: false,
      feedback: '',
      modified: '',
    })
    return slicedTexts
  }

  const rawText = rawData.text
  const feedbacks = [...rawData.feedback].sort((a, b) => a[0] - b[0])

  let currentIdx = 0
  feedbacks.forEach((feedback) => {
    const [startIdx, endIdx, message, modified] = feedback

    if (startIdx > currentIdx) {
      const normalText = rawText.slice(currentIdx, startIdx)
      if (normalText) {
        slicedTexts.push({
          text: normalText,
          withFeedback: false,
          feedback: '',
          modified: '',
        })
      }
    }

    const feedbackText = rawText.slice(startIdx, endIdx + 1)
    if (feedbackText) {
      slicedTexts.push({
        text: feedbackText,
        withFeedback: true,
        feedback: message,
        modified: modified,
      })
    }

    currentIdx = endIdx + 1
  })

  if (currentIdx < rawText.length) {
    const remainingText = rawText.slice(currentIdx)
    if (remainingText) {
      slicedTexts.push({
        text: remainingText,
        withFeedback: false,
        feedback: '',
        modified: '',
      })
    }
  }

  return slicedTexts
}

export default getSlicedTexts
