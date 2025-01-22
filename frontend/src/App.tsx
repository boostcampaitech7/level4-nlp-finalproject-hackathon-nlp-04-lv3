import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import * as Pages from './pages'
import useIsAuthenticated from './hooks/useIsAuthenticated'

function App() {
  const { isAuthenticated } = useIsAuthenticated()

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Pages.MainLayout />}>
          <Route
            path="/"
            element={
              isAuthenticated ? <Pages.MainPage /> : <Pages.GuestMainPage />
            }
          />

          {/* 인증이 필요하지 않은 라우트들 */}
          <Route path="auth">
          <Route
              path="login"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Pages.LoginPage />
              }
            />
            <Route
              path="signup"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Pages.SignupPage />
              }
            />
          </Route>

          {/* 인증이 필요한 라우트들 */}
          <Route
            path="/*"
            element={
              isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
            }
          >
            {/* 1. text */}
            <Route path="text">
              <Route
                path=":text_id/quiz/:level/result"
                element={<Pages.TextQuizResultPage />}
              />
              <Route
                path=":text_id/quiz/:level"
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

            {/* 2. vocab */}
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

            {/* 3. diary */}
            <Route path="diary">
              <Route path=":diary_id" element={<Pages.DiaryDetailPage />} />
              <Route path="list" element={<Pages.DiaryListPage />} />
              <Route path="write" element={<Pages.DiaryWritePage />} />
            </Route>

            {/* 4. user */}
            <Route path="user">
              <Route
                path="study-record/:record_id"
                element={<Pages.StudyRecordDetailPage />}
              />
              <Route
                path="study-record/list"
                element={<Pages.StudyRecordListPage />}
              />
              <Route path="profile" element={<Pages.ProfilePage />} />
              <Route path="bookmark" element={<Pages.BookmarkListPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
