import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import * as Pages from './pages'
import { useAuthStore } from './stores/authStore'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ScrollToTop from 'components/ScrollToTop'

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore()
  const queryClient = new QueryClient()

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Pages.MainLayout />}>
            {/* 1. 인증 여부에 따라 다른 메인 페이지 */}
            <Route
              path="/"
              element={
                isAuthenticated ? <Pages.MainPage /> : <Pages.GuestMainPage />
              }
            />

            {/* 2. 인증이 필요하지 않은 라우트들 */}
            <Route
              path="auth/*"
              element={
                !isAuthenticated ? (
                  <Routes>
                    <Route path="login" element={<Pages.LoginPage />} />
                    <Route
                      path="signup/survey"
                      element={<Pages.ComprehensionSurveyPage />}
                    />
                    <Route path="signup" element={<Pages.SignupPage />} />
                  </Routes>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* 3. 인증이 필요한 라우트들 */}

            {/* 3-1. text 관련 라우트 */}
            <Route
              path="text/*"
              element={
                isAuthenticated ? (
                  <Routes>
                    <Route
                      path=":text_id/quiz/:quiz_id/result"
                      element={<Pages.TextQuizResultPage />}
                    />
                    <Route
                      path=":text_id/quiz/:quiz_id"
                      element={<Pages.TextQuizPage />}
                    />
                    <Route
                      path=":text_id/quiz"
                      element={<Pages.QuizLevelSelectionPage section="text" />}
                    />
                    <Route path=":text_id" element={<Pages.TextDetailPage />} />
                    <Route path="list" element={<Pages.TextListPage />} />
                    <Route path="add" element={<Pages.TextAddPage />} />
                  </Routes>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* 3-2. vocab 관련 라우트 */}
            <Route
              path="vocab/*"
              element={
                isAuthenticated ? (
                  <Routes>
                    <Route
                      path=":vocab_id/quiz/:level/result"
                      element={<Pages.VocabQuizResultPage />}
                    />
                    <Route
                      path=":vocab_id/quiz/:level"
                      element={<Pages.VocabQuizPage />}
                    />
                    <Route
                      path=":vocab_id/quiz"
                      element={<Pages.QuizLevelSelectionPage section="vocab" />}
                    />
                    <Route
                      path=":vocab_id"
                      element={<Pages.VocabDetailPage />}
                    />
                  </Routes>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* 3-3. diary 관련 라우트 */}
            <Route
              path="diary/*"
              element={
                isAuthenticated ? (
                  <Routes>
                    <Route
                      path=":diary_id"
                      element={<Pages.DiaryDetailPage />}
                    />
                    <Route path="write" element={<Pages.DiaryWritePage />} />
                    <Route path="list" element={<Pages.DiaryListPage />} />
                  </Routes>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* 3-4. user 관련 라우트 */}
            <Route
              path="user/*"
              element={
                isAuthenticated ? (
                  <Routes>
                    <Route path="profile" element={<Pages.ProfilePage />} />
                    <Route
                      path="study-record"
                      element={<Pages.StudyRecordListPage />}
                    />
                    <Route
                      path="study-record/:record_id"
                      element={<Pages.StudyRecordDetailPage />}
                    />
                    <Route
                      path="bookmark"
                      element={<Pages.BookmarkListPage />}
                    />
                  </Routes>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
