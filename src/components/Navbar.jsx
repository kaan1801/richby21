import { useState } from 'react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'history',   label: 'History',   icon: '◷' },
  { id: 'statistics',label: 'Stats',     icon: '◎' },
  { id: 'settings',  label: 'Settings',  icon: '◉' },
]

export default function Navbar({ activeTab, onTabChange, username, onLogout }) {
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(8, 13, 24, 0.7)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <img src="/public/r21-logo.png" alt="R21" style={{ height: 30, width: 'auto' }} />
            <span style={{
              fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.9rem',
              letterSpacing: '0.18em', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase'
            }}>
              RichBy21
            </span>
          </div>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hide-mobile">
            {NAV_ITEMS.map(item => {
              const active = activeTab === item.id
              return (
                <button key={item.id} onClick={() => onTabChange(item.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '6px 16px', borderRadius: 8, border: 'none',
                  background: active ? 'rgba(110,231,183,0.09)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-ui)', fontSize: '0.78rem',
                  fontWeight: active ? 500 : 400, cursor: 'pointer',
                  letterSpacing: '0.06em',
                  transition: 'all 0.18s',
                  borderBottom: active ? '1px solid rgba(110,231,183,0.35)' : '1px solid transparent',
                }}>
                  <span style={{ fontSize: '0.9rem' }}>{item.icon}</span>
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hide-mobile">
            <span style={{ color: 'var(--text-subtle)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {username}
            </span>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
            <button onClick={onLogout} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 7,
              border: '1px solid rgba(248,113,113,0.2)',
              background: 'transparent',
              color: 'rgba(252,165,165,0.7)', fontSize: '0.75rem',
              fontFamily: 'var(--font-ui)', cursor: 'pointer',
              letterSpacing: '0.06em', transition: 'all 0.18s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              ⎋ Logout
            </button>
          </div>

          {/* Burger */}
          <button className="show-mobile" onClick={() => setOpen(!open)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: 5, padding: 6
          }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', width: 20, height: 1.5,
                background: 'rgba(255,255,255,0.6)', borderRadius: 2,
                transition: 'all 0.25s',
                transform: open
                  ? i===0 ? 'translateY(6.5px) rotate(45deg)'
                  : i===2 ? 'translateY(-6.5px) rotate(-45deg)'
                  : 'scaleX(0)'
                  : 'none',
                opacity: open && i===1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div style={{
        overflow: 'hidden', transition: 'max-height 0.3s ease',
        maxHeight: open ? 320 : 0,
        background: 'rgba(8,13,24,0.95)',
        borderTop: open ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}>
        <div style={{ padding: '10px 24px 16px' }}>
          {NAV_ITEMS.map(item => {
            const active = activeTab === item.id
            return (
              <button key={item.id} onClick={() => { onTabChange(item.id); setOpen(false) }} style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '12px 14px', marginBottom: 4, borderRadius: 10,
                border: 'none', borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                background: active ? 'rgba(110,231,183,0.07)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                fontFamily: 'var(--font-ui)', fontSize: '0.82rem', cursor: 'pointer',
              }}>
                <span>{item.icon}</span> {item.label}
              </button>
            )
          })}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8, paddingTop: 10 }}>
            <button onClick={() => { onLogout(); setOpen(false) }} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '12px 14px', borderRadius: 10, border: 'none',
              background: 'transparent', color: 'rgba(252,165,165,0.7)',
              fontFamily: 'var(--font-ui)', fontSize: '0.82rem', cursor: 'pointer',
            }}>
              ⎋ Logout
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </nav>
  )
}
