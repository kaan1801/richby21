import { useState, useEffect } from 'react'
import useIsMobile from '../hooks/useIsMobile'

/* ── helpers ───────────────────────────────────────────── */
const Toggle = ({ enabled, onChange }) => (
  <button onClick={() => onChange(!enabled)} style={{
    width: 44, height: 25, borderRadius: 13, border: 'none', cursor: 'pointer', flexShrink: 0,
    background: enabled ? `rgba(var(--accent-rgb),0.35)` : 'rgba(255,255,255,0.08)',
    position: 'relative', transition: 'background 0.25s',
    boxShadow: enabled ? `0 0 12px rgba(var(--accent-rgb),0.2)` : 'none',
  }}>
    <span style={{
      position: 'absolute', top: 3.5, left: enabled ? 22 : 3.5,
      width: 18, height: 18, borderRadius: '50%', transition: 'left 0.25s',
      background: enabled ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
    }} />
  </button>
)

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 26 }}>
    <div style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 10, paddingLeft: 2 }}>
      {title}
    </div>
    <div className="glass" style={{ overflow: 'hidden' }}>{children}</div>
  </div>
)

const Row = ({ icon, label, sub, children, last }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '15px 20px', gap: 12,
    borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.05)',
    flexWrap: 'wrap',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0, flex: '1 1 160px' }}>
      <span style={{ fontSize: '1rem', opacity: 0.65, flexShrink: 0 }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '0.92rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{sub}</div>}
      </div>
    </div>
    <div style={{ flexShrink: 0 }}>{children}</div>
  </div>
)

const Pills = ({ options, value, onChange }) => (
  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
    {options.map(opt => (
      <button key={opt.value ?? opt} onClick={() => onChange(opt.value ?? opt)} style={{
        padding: '5px 13px', borderRadius: 20, cursor: 'pointer',
        fontSize: '0.78rem', fontFamily: 'var(--font-ui)', letterSpacing: '0.02em',
        background: (value === (opt.value ?? opt)) ? `rgba(var(--accent-rgb),0.16)` : 'rgba(255,255,255,0.05)',
        color:      (value === (opt.value ?? opt)) ? 'var(--accent)'                : 'var(--text-muted)',
        border:     (value === (opt.value ?? opt)) ? '1px solid rgba(var(--accent-rgb),0.32)' : '1px solid transparent',
        transition: 'all 0.18s',
      }}>{opt.label ?? opt}</button>
    ))}
  </div>
)

const ColorSwatch = ({ color, active, onClick }) => (
  <button onClick={onClick} style={{
    width: 26, height: 26, borderRadius: '50%', border: 'none', cursor: 'pointer',
    background: color, transition: 'all 0.18s', flexShrink: 0,
    boxShadow: active ? `0 0 0 2px rgba(255,255,255,0.15), 0 0 0 4px ${color}55` : '0 0 0 2px rgba(255,255,255,0.06)',
    transform: active ? 'scale(1.15)' : 'scale(1)',
  }} />
)

/* ── Change Password Modal ───────────────────────────────── */
function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [status, setStatus] = useState(null) // null | 'error' | 'success'
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState({ current: false, next: false, confirm: false })

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })
  const toggleShow = k => setShow(s => ({ ...s, [k]: !s[k] }))

  const submit = async (e) => {
    e.preventDefault()
    setStatus(null)
    if (form.next !== form.confirm) { setStatus('error'); setMsg('New passwords do not match'); return }
    if (form.next.length < 6) { setStatus('error'); setMsg('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const response = await fetch('/api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'change_password', current_password: form.current, new_password: form.next })
      })
      const data = await response.json()
      if (data.success) {
        setStatus('success'); setMsg('Password updated successfully')
        setTimeout(onClose, 1600)
      } else {
        setStatus('error'); setMsg(data.message || 'Update failed')
      }
    } catch { setStatus('error'); setMsg('Network error. Try again.') }
    finally { setLoading(false) }
  }

  const fieldLabel = txt => (
    <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 7 }}>{txt}</label>
  )

  const eyeBtn = (k) => (
    <button type="button" onClick={() => toggleShow(k)} style={{
      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', fontSize: '0.8rem', padding: 0,
    }}>{show[k] ? '🙈' : '👁'}</button>
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass fade-up" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 400, padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Change Password</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 4 }}>Update your login credentials</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: 1 }}>✕</button>
        </div>

        {status && (
          <div style={{
            padding: '10px 14px', borderRadius: 8, marginBottom: 18, fontSize: '0.82rem',
            background: status === 'success' ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${status === 'success' ? 'rgba(52,211,153,0.25)' : 'rgba(239,68,68,0.25)'}`,
            color: status === 'success' ? 'var(--win-text)' : 'var(--loss-text)',
          }}>{status === 'success' ? '✓ ' : '⚠ '}{msg}</div>
        )}

        <form onSubmit={submit}>
          {[
            ['Current Password', 'current'],
            ['New Password', 'next'],
            ['Confirm New Password', 'confirm'],
          ].map(([lbl, key]) => (
            <div key={key} style={{ marginBottom: 15 }}>
              {fieldLabel(lbl)}
              <div style={{ position: 'relative' }}>
                <input className="glass-input" type={show[key] ? 'text' : 'password'}
                  name={key} value={form[key]} onChange={handle} required
                  placeholder="••••••••" style={{ paddingRight: 40 }} />
                {eyeBtn(key)}
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '11px 0', borderRadius: 10, cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
              color: 'var(--text-muted)', fontSize: '0.85rem',
            }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: '11px 0', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
              border: '1px solid rgba(var(--accent-rgb),0.3)', background: 'rgba(var(--accent-rgb),0.1)',
              color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem',
              opacity: loading ? 0.6 : 1, transition: 'all 0.2s',
            }}>{loading ? '...' : 'Update'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Main Settings ───────────────────────────────────────── */
const THEMES = [
  { value: 'dark',   label: 'Dark'   },
  { value: 'darker', label: 'Darker' },
  { value: 'oled',   label: 'OLED'   },
]

const ACCENTS = [
  { value: 'teal',   color: '#6ee7b7' },
  { value: 'blue',   color: '#93c5fd' },
  { value: 'violet', color: '#c4b5fd' },
]

export default function Settings({ username }) {
  const isMobile = useIsMobile()
  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('r21_prefs')) || {} } catch { return {} }
  })
  const [defaults] = useState({
    currency: 'USD', dateFormat: 'MM/DD', defaultTradeType: 'long',
    notifications: false, soundFx: false, compactView: false,
    showPnlOnCalendar: true, autoCalculatePnl: true,
    theme: 'dark', accentColor: 'teal',
  })

  const get = key => prefs[key] ?? defaults[key]
  const set = (key, val) => setPrefs(p => ({ ...p, [key]: val }))

  const [saved, setSaved] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // Apply theme + accent live
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', get('theme') === 'dark' ? '' : get('theme'))
    root.setAttribute('data-accent', get('accentColor') === 'teal' ? '' : get('accentColor'))
  }, [prefs])

  const handleSave = () => {
    try { localStorage.setItem('r21_prefs', JSON.stringify(prefs)) } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}

      <div className="fade-up" style={{ maxWidth: 640, margin: '0 auto', paddingBottom: 60, padding: isMobile ? '0 2px' : '0' }}>
        <div style={{ marginBottom: 30 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.6rem', margin: 0, letterSpacing: '-0.01em' }}>Settings</h2>
          <div style={{ width: 36, height: 2, background: 'var(--accent)', borderRadius: 2, marginTop: 10, opacity: 0.6 }} />
        </div>

        {/* Profile */}
        <Section title="Profile">
          <Row icon="◈" label="Username" sub="Your display name" last>
            <span style={{
              padding: '5px 14px', borderRadius: 20, fontSize: '0.82rem',
              background: 'rgba(var(--accent-rgb),0.08)', border: '1px solid rgba(var(--accent-rgb),0.2)',
              color: 'var(--accent)',
            }}>{username || 'trader'}</span>
          </Row>
        </Section>

        {/* Trading */}
        <Section title="Trading Preferences">
          <Row icon="💱" label="Currency" sub="Base currency for PnL display">
            <Pills options={['USD','EUR','GBP']} value={get('currency')} onChange={v => set('currency', v)} />
          </Row>
          <Row icon="📅" label="Date Format" sub="How dates appear in the app">
            <Pills options={[{value:'MM/DD',label:'US'},{value:'DD/MM',label:'EU'},{value:'ISO',label:'ISO'}]} value={get('dateFormat')} onChange={v => set('dateFormat', v)} />
          </Row>
          <Row icon="↕️" label="Default Trade Type" sub="Pre-selected on new trade form" last>
            <Pills options={['long','short']} value={get('defaultTradeType')} onChange={v => set('defaultTradeType', v)} />
          </Row>
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <Row icon="🌑" label="Theme" sub="Background darkness level">
            <Pills options={THEMES} value={get('theme')} onChange={v => set('theme', v)} />
          </Row>
          <Row icon="🎨" label="Accent Color" sub="Highlight color applied across the UI">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {ACCENTS.map(a => (
                <ColorSwatch key={a.value} color={a.color} active={get('accentColor') === a.value} onClick={() => set('accentColor', a.value)} />
              ))}
            </div>
          </Row>
          <Row icon="⊡" label="Compact View" sub="Denser layout with reduced spacing" last>
            <Toggle enabled={get('compactView')} onChange={v => set('compactView', v)} />
          </Row>
        </Section>

        {/* Calendar */}
        <Section title="Calendar">
          <Row icon="🗓" label="Show PnL on Days" sub="Daily totals inside each calendar cell">
            <Toggle enabled={get('showPnlOnCalendar')} onChange={v => set('showPnlOnCalendar', v)} />
          </Row>
          <Row icon="⚡" label="Auto-Calculate PnL" sub="Compute from entry and exit prices" last>
            <Toggle enabled={get('autoCalculatePnl')} onChange={v => set('autoCalculatePnl', v)} />
          </Row>
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <Row icon="🔔" label="Daily Reminders" sub="Prompt to log trades each day">
            <Toggle enabled={get('notifications')} onChange={v => set('notifications', v)} />
          </Row>
          <Row icon="🔊" label="Sound Effects" sub="Audio feedback on trade actions" last>
            <Toggle enabled={get('soundFx')} onChange={v => set('soundFx', v)} />
          </Row>
        </Section>

        {/* Account */}
        <Section title="Account">
          <Row icon="🔑" label="Change Password" sub="Update your login credentials" last>
            <button onClick={() => setShowPasswordModal(true)} style={{
              padding: '7px 16px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
              color: 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.18s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >Update →</button>
          </Row>
        </Section>

        {/* Save */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleSave} style={{
            padding: '12px 36px', borderRadius: 10, cursor: 'pointer', fontWeight: 600,
            fontSize: '0.88rem', letterSpacing: '0.04em', transition: 'all 0.25s',
            border: saved ? '1px solid rgba(var(--accent-rgb),0.5)' : '1px solid rgba(var(--accent-rgb),0.3)',
            background: saved ? 'rgba(var(--accent-rgb),0.18)' : 'rgba(var(--accent-rgb),0.09)',
            color: 'var(--accent)',
            boxShadow: saved ? '0 0 22px rgba(var(--accent-rgb),0.15)' : 'none',
          }}>
            {saved ? '✓  Saved' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  )
}
