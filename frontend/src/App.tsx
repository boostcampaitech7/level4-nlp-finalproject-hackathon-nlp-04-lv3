import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom'
import { useEffect } from 'react'
import * as Pages from './pages'
import { useAuthStore } from './stores/authStore'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
            <Route path="auth">
              <Route
                path="login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Pages.LoginPage />
                  )
                }
              />
              <Route
                path="signup"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Pages.SignupPage />
                  )
                }
              />
              <Route
                path="signup/survey"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Pages.ComprehensionSurveyPage />
                  )
                }
              />
            </Route>

            {/* 3. 인증이 필요한 라우트들 */}
            <Route
              element={
                isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
              }
            >
              {/* 3-1. text 관련 라우트 */}
              <Route path="text">
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
              </Route>

              {/* 3-2. vocab 관련 라우트 */}
              <Route path="vocab">
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
                <Route path=":vocab_id" element={<Pages.VocabDetailPage />} />
              </Route>

              {/* 3-3. diary 관련 라우트 */}
              <Route path="diary">
                <Route path=":diary_id" element={<Pages.DiaryDetailPage />} />
                <Route path="write" element={<Pages.DiaryWritePage />} />
                <Route path="list" element={<Pages.DiaryListPage />} />
              </Route>

              {/* 3-4. user 관련 라우트 */}
              <Route path="user">
                <Route path="profile" element={<Pages.ProfilePage />} />
                <Route
                  path="study-record"
                  element={<Pages.StudyRecordListPage />}
                />
                <Route
                  path="study-record/:record_id"
                  element={<Pages.StudyRecordDetailPage />}
                />
                <Route path="bookmark" element={<Pages.BookmarkListPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
