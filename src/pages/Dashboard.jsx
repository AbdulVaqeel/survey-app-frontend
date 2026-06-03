import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/useAuth'
import api from '../utils/api'

const STATUS_COLORS = {
  active: { bg: '#dcfce7', text: '#16a34a' },
  draft: { bg: '#fef9c3', text: '#a16207' },
  closed: { bg: '#f1f5f9', text: '#64748b' },
}

function StatCard({ icon, label, value, trend, color = 'var(--teal, #0d9488)' }) {
  return (
    <div style={{
      background: 'var(--white, #ffffff)', borderRadius: 16, padding: '24px',
      border: '1px solid var(--border, #e2e8f0)', flex: 1, minWidth: 180,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 11,
        background: `${color}18`, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 20, marginBottom: 14,
      }}>{icon}</div>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
        color: 'var(--ink, #0f172a)', letterSpacing: '-1px', lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--muted, #64748b)', marginTop: 6 }}>{label}</div>
      {trend && (
        <div style={{
          fontSize: 12, marginTop: 8, fontWeight: 500,
          color: trend.startsWith('+') ? '#16a34a' : '#dc2626',
        }}>{trend} this week</div>
      )}
    </div>
  )
}

function MiniBar({ pct, color = 'var(--teal, #0d9488)' }) {
  return (
    <div style={{
      height: 6, borderRadius: 99, background: 'var(--border, #e2e8f0)',
      overflow: 'hidden', flex: 1,
    }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: color, borderRadius: 99,
        transition: 'width 0.8s ease',
      }} />
    </div>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    api.get('/survey/stats')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavClick = (e, label) => {
    e.preventDefault() 
    if (label === 'Settings') {
      navigate('/login')
    }
  }

  const surveys = stats?.surveys || []
  const tabs = ['All', 'Active', 'Draft', 'Closed']
  const filtered = activeTab === 'All'
    ? surveys
    : surveys.filter(s => s.status.toLowerCase() === activeTab.toLowerCase())

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--surface, #f8fafc)' }} className="sp-dashboard-root">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        
        :root {
          --font-display: 'Sora', sans-serif;
        }

        .sp-dashboard-root { 
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .sp-action-btn {
          padding: 8px 18px; 
          border-radius: 10px; 
          font-size: 13px; 
          font-weight: 600; 
          border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(135deg, #0d9488, #0f766e);
          color: #fff;
          box-shadow: 0 4px 12px rgba(13,148,136,0.3);
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }

        .sp-action-btn:hover {
          transform: translateY(-1px);
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{
        width: sidebarOpen ? 240 : 64,
        background: 'var(--ink, #0f172a)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease',
        overflow: 'hidden', flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: sidebarOpen ? '24px 20px' : '24px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #0d9488, #f59e0b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', fontSize: 16,
          }}>S</div>
          {sidebarOpen && (
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
              color: '#fff', whiteSpace: 'nowrap',
            }}>SurveyPulse</span>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {[
            { icon: '🏠', label: 'Dashboard', active: true },
            { icon: '📋', label: 'My Surveys' },
            { icon: '📊', label: 'Analytics' },
            { icon: '👥', label: 'Respondents' },
            { icon: '⚙️', label: 'Settings' },
          ].map(({ icon, label, active }) => (
            <div key={label} 
              onClick={(e) => handleNavClick(e, label)}
              style={{
                display: 'flex', alignItems: 'center',
                gap: 12, padding: sidebarOpen ? '10px 20px' : '10px 16px',
                cursor: 'pointer',
                background: active ? 'rgba(13,148,136,0.2)' : 'transparent',
                borderLeft: active ? '3px solid var(--teal, #0d9488)' : '3px solid transparent',
                transition: 'background 0.15s',
                margin: '2px 0',
              }}
              onMouseEnter={e => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
              {sidebarOpen && (
                <span style={{
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                  whiteSpace: 'nowrap',
                }}>{label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* User strip */}
        <div style={{
          padding: sidebarOpen ? '16px 20px' : '16px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--teal, #0d9488), var(--amber, #f59e0b))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 14,
          }}>V</div>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.full_name || 'Vaqeel'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
                {user?.username}
              </div>
            </div>
          )}
          {sidebarOpen && (
            <button onClick={handleLogout} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
              fontSize: 16, padding: 4, cursor: 'pointer', flexShrink: 0,
            }} title="Sign out">↩</button>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <header style={{
          padding: '0 32px', height: 64,
          background: 'var(--white, #ffffff)', borderBottom: '1px solid var(--border, #e2e8f0)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(o => !o)}
              style={{
                background: 'none', border: 'none', fontSize: 18, cursor: 'pointer',
                color: 'var(--muted, #64748b)', padding: 4,
              }}
            >☰</button>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800,
              color: 'var(--ink, #0f172a)', letterSpacing: '-0.4px',
            }}>Dashboard</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="sp-action-btn">+ New Survey</button>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--teal, #0d9488), var(--amber, #f59e0b))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}>V</div>
          </div>
        </header>

        {/* Content area */}
        <div style={{ padding: '32px', flex: 1 }}>

          {/* Welcome */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
              color: 'var(--ink, #0f172a)', letterSpacing: '-0.5px',
            }}>
              Good morning, {user?.full_name || 'Vaqeel'} 👋
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted, #64748b)', marginTop: 4 }}>
              Here's what's happening with your surveys today.
            </p>
          </div>

          {/* Stat cards */}
          {loading ? (
            <div style={{ display: 'flex', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  flex: 1, minWidth: 180, height: 120, borderRadius: 16,
                  background: 'linear-gradient(90deg, var(--border, #e2e8f0) 25%, var(--surface, #f8fafc) 50%, var(--border, #e2e8f0) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.4s infinite',
                }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
              <StatCard icon="📋" label="Total surveys" value={stats?.total_surveys ?? '—'} trend="+2" />
              <StatCard icon="✅" label="Active surveys" value={stats?.active_surveys ?? '—'} color="#16a34a" />
              <StatCard icon="📬" label="Responses today" value={stats?.responses_today ?? '—'} trend="+12" color="#7c3aed" />
              <StatCard icon="📈" label="Completion rate" value={stats ? `${stats.completion_rate}%` : '—'} trend="+3.1%" color="var(--amber, #f59e0b)" />
            </div>
          )}

          {/* Survey table */}
          <div style={{
            background: 'var(--white, #ffffff)', borderRadius: 16,
            border: '1px solid var(--border, #e2e8f0)',
            overflow: 'hidden',
          }}>
            {/* Table header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid var(--border, #e2e8f0)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 12,
            }}>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
                color: 'var(--ink, #0f172a)',
              }}>Your Surveys</h3>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, background: 'var(--surface, #f8fafc)', padding: 4, borderRadius: 10 }}>
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '6px 14px', borderRadius: 7, fontSize: 13, fontWeight: 500,
                      background: activeTab === tab ? 'var(--white, #ffffff)' : 'transparent',
                      color: activeTab === tab ? 'var(--ink, #0f172a)' : 'var(--muted, #64748b)',
                      border: 'none',
                      boxShadow: activeTab === tab ? 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))' : 'none',
                      transition: 'all 0.15s',
                    }}
                  >{tab}</button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface, #f8fafc)' }}>
                    {['Survey Title', 'Status', 'Responses', 'Completion', 'Actions'].map(col => (
                      <th key={col} style={{
                        padding: '12px 24px', textAlign: 'left',
                        fontSize: 12, fontWeight: 600, color: 'var(--muted, #64748b)',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                        borderBottom: '1px solid var(--border, #e2e8f0)',
                      }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} style={{ padding: '16px 24px' }}>
                          <div style={{
                            height: 16, borderRadius: 8,
                            background: 'var(--border, #e2e8f0)',
                            width: `${60 + i * 10}%`,
                          }} />
                        </td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{
                        padding: '48px', textAlign: 'center',
                        color: 'var(--muted, #64748b)', fontSize: 14,
                      }}>
                        No surveys in this category yet.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s, i) => {
                      const sc = STATUS_COLORS[s.status] || STATUS_COLORS.draft
                      return (
                        <tr key={s.id} style={{
                          borderBottom: i < filtered.length - 1 ? '1px solid var(--border, #e2e8f0)' : 'none',
                          transition: 'background 0.15s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface, #f8fafc)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--ink, #0f172a)' }}>
                              {s.title}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                              background: sc.bg, color: sc.text, textTransform: 'capitalize',
                            }}>{s.status}</span>
                          </td>
                          <td style={{ padding: '16px 24px', fontSize: 14, color: 'var(--ink-soft, #475569)' }}>
                            {s.responses.toLocaleString()}
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <MiniBar pct={s.completion}
                                color={s.status === 'active' ? 'var(--teal, #0d9488)' : s.status === 'closed' ? 'var(--muted, #64748b)' : 'var(--amber, #f59e0b)'}
                              />
                              <span style={{ fontSize: 13, color: 'var(--muted, #64748b)', minWidth: 36 }}>
                                {s.completion}%
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {['View', 'Edit'].map(a => (
                                <button key={a} style={{
                                  padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                                  background: 'var(--surface, #f8fafc)', color: 'var(--ink-soft, #475569)',
                                  border: '1px solid var(--border, #e2e8f0)', cursor: 'pointer',
                                  transition: 'all 0.15s',
                                }}
                                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--teal, #0d9488)'}
                                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border, #e2e8f0)'}
                                >{a}</button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick activity feed */}
          <div style={{
            background: 'var(--white, #ffffff)', borderRadius: 16, border: '1px solid var(--border, #e2e8f0)',
            padding: '24px', marginTop: 24,
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
              color: 'var(--ink, #0f172a)', marginBottom: 16,
            }}>Recent Activity</h3>
            {[
              { icon: '📬', text: 'New response on Customer Satisfaction Q2', time: '2 min ago' },
              { icon: '🆕', text: 'Survey "NPS – Enterprise Clients" created', time: '1 hr ago' },
              { icon: '✅', text: '"Onboarding Experience 2025" closed successfully', time: '3 hrs ago' },
              { icon: '📤', text: 'Export for Product Feedback downloaded', time: 'Yesterday' },
            ].map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                paddingBottom: 14, marginBottom: i < 3 ? 14 : 0,
                borderBottom: i < 3 ? '1px solid var(--border, #e2e8f0)' : 'none',
              }}>
                <span style={{
                  fontSize: 18, width: 36, height: 36, borderRadius: 9,
                  background: 'var(--surface, #f8fafc)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: 'var(--ink, #0f172a)', fontWeight: 400 }}>{a.text}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted, #64748b)', marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}