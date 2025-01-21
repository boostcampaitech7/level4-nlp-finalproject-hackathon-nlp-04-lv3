import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router'
import * as Pages from './pages'
import VocabPage from './vocabpage'

// 임시로 로그인 상태를 확인하는 함수
const isAuthenticated = () => {
  // TODO: 실제 로그인 상태 확인 로직 구현
  return false
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Pages.MainLayout />}>
          <Route path="/" element={
            isAuthenticated() ? (
              <Pages.MainPage />
            ) : (
              <Pages.GuestMainPage />
            )
          } />

          {/* 인증이 필요한 라우트들 */}
          <Route
            path="/*"
            element={
              isAuthenticated() ? (
                <Outlet />
              ) : (
                <Navigate to="/" replace />
              )
            }
          >
            {/* 1. auth */}
            <Route path="auth">
              <Route path="login" element={<Pages.LoginPage />} />
              <Route path="signup" element={<Pages.SignupPage />} />
            </Route>

            {/* 2. text */}
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

            {/* 3. vocab */}
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

            {/* 4. diary */}
            <Route path="diary">
              <Route path=":diary_id" element={<Pages.DiaryDetailPage />} />
              <Route path="list" element={<Pages.DiaryListPage />} />
              <Route path="write" element={<Pages.DiaryWritePage />} />
            </Route>

            {/* 5. user */}
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

        {/* 게스트용 라우트 */}
        <Route path="vocab-test" element={<VocabPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
