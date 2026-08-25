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

// Products menu
import Features from './pages/product/Features'
import Analytics from './pages/product/Analytics'
import Security from './pages/product/Security'
import Pricing from './pages/product/Pricing'

// Company menu
import Careers from './pages/company/Careers'
import Blog from './pages/company/Blog'
import Contact from './pages/company/Contact'

// Legal menu
import Privacy from './pages/legal/Privacy'
import Terms from './pages/legal/Terms'
import Cookies from './pages/legal/Cookies'

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

          {/* Products menu — each a standalone page/file */}
          <Route path="/product/features" element={<Features />} />
          <Route path="/product/analytics" element={<Analytics />} />
          <Route path="/product/security" element={<Security />} />
          <Route path="/product/pricing" element={<Pricing />} />

          {/* Company menu — each a standalone page/file */}
          <Route path="/company/careers" element={<Careers />} />
          <Route path="/company/blog" element={<Blog />} />
          <Route path="/company/contact" element={<Contact />} />

          {/* Legal menu — each a standalone page/file */}
          <Route path="/legal/privacy" element={<Privacy />} />
          <Route path="/legal/terms" element={<Terms />} />
          <Route path="/legal/cookies" element={<Cookies />} />

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