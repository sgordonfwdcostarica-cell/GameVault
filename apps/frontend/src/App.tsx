import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AdminRoute } from './components/layout/AdminRoute'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { LibraryPage } from './pages/LibraryPage'
import { PlayPage } from './pages/PlayPage'
import { AdminGamesPage } from './pages/AdminGamesPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/play/:playRoute" element={<PlayPage />} />
            <Route
              path="/library"
              element={
                <ProtectedRoute>
                  <LibraryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminGamesPage />
                </AdminRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
