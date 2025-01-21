import { BrowserRouter, Routes, Route } from 'react-router'
import * as Pages from './pages'
import GuestMainPage from './guestmainpage'
import VocabPage from './vocabpage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pages.MainLayout />}>
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

          {/* 0. main */}
          <Route index element={<Pages.MainPage />} />

          {/* 6. guest */}
          <Route path="guest" element={<GuestMainPage />} />
          <Route path="vocab-test" element={<VocabPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
