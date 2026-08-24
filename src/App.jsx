import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './utils/AuthContext'
import { useAuth } from './utils/useAuth'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import SurveyRespond from './pages/SurveyRespond'
import InviteManager from './pages/InviteManager'
import SurveyBuilder from './components/dashboard/SurveyBuilder'
import SurveyResults from './components/dashboard/SurveyResults'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Survey management (owner only) */}
          <Route path="/surveys/new" element={<ProtectedRoute><SurveyBuilder /></ProtectedRoute>} />
          <Route path="/surveys/:id/edit" element={<ProtectedRoute><SurveyBuilder /></ProtectedRoute>} />
          <Route path="/surveys/:id/results" element={<ProtectedRoute><SurveyResults /></ProtectedRoute>} />
          <Route path="/surveys/:id/invites" element={<ProtectedRoute><InviteManager /></ProtectedRoute>} />

          {/* Public, no-auth respondent flow — reached via share link or QR code */}
          <Route path="/survey/respond/:id" element={<SurveyRespond />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}