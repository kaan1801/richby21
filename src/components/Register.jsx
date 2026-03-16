import { useState } from 'react'

function Register({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const response = await fetch('/api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'register', username: formData.username, email: formData.email, password: formData.password })
      })
      const data = await response.json()
      if (data.success) onRegister(data.user)
      else setError(data.message || 'Registration failed')
    } catch { setError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const fields = [
    ['Username', 'text', 'username', 'Choose a username', { minLength: 3 }],
    ['Email', 'email', 'email', 'your@email.com', {}],
    ['Password', 'password', 'password', 'Min. 6 characters', { minLength: 6 }],
    ['Confirm Password', 'password', 'confirmPassword', 'Repeat your password', {}],
  ]

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient orbs */}
      <div style={{
        position: 'fixed', width: 500, height: 500, borderRadius: '50%',
        top: '-10%', right: '-12%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(110,231,183,0.07) 0%, transparent 70%)',
        filter: 'blur(40px)', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', width: 400, height: 400, borderRadius: '50%',
        bottom: '-5%', left: '-10%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)', zIndex: 0,
      }} />

      <div className="glass fade-up" style={{ width: '100%', maxWidth: 420, padding: '40px 40px 36px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/public/r21-logo.png" alt="R21" style={{ height: 44, marginBottom: 14 }} />
          <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.5rem', margin: 0, letterSpacing: '0.05em' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Join RichBy21
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
          {fields.map(([lbl, type, name, placeholder, extra]) => (
            <div key={name} style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', color: 'var(--text-muted)', fontSize: '0.68rem',
                letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7
              }}>{lbl}</label>
              <input
                className="glass-input" type={type} name={name}
                value={formData[name]} onChange={handleChange}
                required placeholder={placeholder} {...extra}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            marginTop: 22, width: '100%', padding: '12px 0', borderRadius: 10,
            border: '1px solid rgba(110,231,183,0.3)',
            background: loading ? 'rgba(110,231,183,0.05)' : 'rgba(110,231,183,0.09)',
            color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontWeight: 500,
            fontSize: '0.82rem', letterSpacing: '0.14em', textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
            opacity: loading ? 0.6 : 1,
          }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'rgba(110,231,183,0.15)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(110,231,183,0.1)' }}}
            onMouseLeave={e => { e.currentTarget.style.background = loading ? 'rgba(110,231,183,0.05)' : 'rgba(110,231,183,0.09)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            {loading ? '...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: 22, textAlign: 'center' }}>
          <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>Already have an account? </span>
          <button onClick={onSwitchToLogin} style={{
            background: 'none', border: 'none', color: 'var(--accent)',
            fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-ui)',
          }}>Login →</button>
        </div>
      </div>
    </div>
  )
}

export default Register
