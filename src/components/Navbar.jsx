import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../utils/useAuth'

export default function Navbar({ dark = false }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const navLinks = user
    ? [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About' },
        { to: '/dashboard', label: 'Dashboard' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About' },
      ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: '68px',
      background: dark ? 'rgba(13,17,23,0.85)' : 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
      transition: 'background 0.3s',
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #0d9488, #f59e0b)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: '#fff',
          fontFamily: 'var(--font-display)',
        }}>S</span>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
          color: dark ? '#fff' : 'var(--ink)',
          letterSpacing: '-0.3px',
        }}>SurveyPulse</span>
      </Link>

      {/* Desktop nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to} style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
            color: isActive(to)
              ? 'var(--teal)'
              : dark ? 'rgba(255,255,255,0.75)' : 'var(--muted)',
            background: isActive(to)
              ? dark ? 'rgba(13,148,136,0.15)' : 'rgba(13,148,136,0.08)'
              : 'transparent',
            transition: 'all 0.2s',
          }}>{label}</Link>
        ))}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8 }}>
            <span style={{
              fontSize: 13, color: dark ? 'rgba(255,255,255,0.5)' : 'var(--muted)',
            }}>
              {user.username}
            </span>
            <button onClick={logout} style={{
              padding: '7px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              background: 'transparent',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.2)' : 'var(--border)'}`,
              color: dark ? 'rgba(255,255,255,0.8)' : 'var(--ink)',
              transition: 'all 0.2s',
            }}>Sign out</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, marginLeft: 8 }}>
            <Link to="/login" style={{
              padding: '7px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              background: 'transparent',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.2)' : 'var(--border)'}`,
              color: dark ? 'rgba(255,255,255,0.8)' : 'var(--ink)',
              transition: 'all 0.2s',
            }}>Log in</Link>
            <Link to="/login" style={{
              padding: '7px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              background: 'linear-gradient(135deg, var(--teal), #0f766e)',
              color: '#fff', border: 'none',
              boxShadow: '0 2px 8px rgba(13,148,136,0.35)',
              transition: 'all 0.2s',
            }}>Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  )
}