import { useState } from 'react'

function Login({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'login', username: formData.username, password: formData.password })
      })
      const data = await response.json()
      if (data.success) onLogin(data.user)
      else setError(data.message || 'Login failed')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Orbs */}
      <div style={{
        position: 'fixed', width: 500, height: 500, borderRadius: '50%',
        top: '-10%', left: '-15%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', width: 400, height: 400, borderRadius: '50%',
        bottom: '-5%', right: '-10%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
        filter: 'blur(40px)', zIndex: 0,
      }} />

      <div className="glass fade-up" style={{ width: '100%', maxWidth: 400, padding: 40, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img src="/public/r21-logo.png" alt="R21" style={{ height: 48, marginBottom: 16 }} />
          <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.6rem', margin: 0, letterSpacing: '0.05em' }}>
            RichBy21
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 8, letterSpacing: '0.1em' }}>
            TRADING JOURNAL
          </p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 8, marginBottom: 20,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            color: 'var(--loss-text)', fontSize: '0.78rem',
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {[['Username', 'text', 'username'], ['Password', 'password', 'password']].map(([lbl, type, name]) => (
            <div key={name} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.68rem',
                letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7 }}>
                {lbl}
              </label>
              <input className="glass-input" type={type} name={name}
                value={formData[name]} onChange={handleChange} required
                placeholder={`Enter your ${lbl.toLowerCase()}`} />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            marginTop: 24, width: '100%', padding: '12px 0',
            borderRadius: 10, border: '1px solid rgba(110,231,183,0.3)',
            background: loading ? 'rgba(110,231,183,0.05)' : 'rgba(110,231,183,0.09)',
            color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontWeight: 500,
            fontSize: '0.82rem', letterSpacing: '0.14em', textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
            opacity: loading ? 0.6 : 1,
          }}>
            {loading ? '...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>No account? </span>
          <button onClick={onSwitchToRegister} style={{
            background: 'none', border: 'none', color: 'var(--accent)',
            fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-ui)',
          }}>
            Register →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
