import { useState } from 'react'
import useIsMobile from '../hooks/useIsMobile'

function TradeForm({ onAddTrade }) {
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState({
    symbol: '', entryPrice: '', exitPrice: '', quantity: '',
    tradeType: 'long', date: new Date().toISOString().split('T')[0], notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const entry = parseFloat(formData.entryPrice)
    const exit = parseFloat(formData.exitPrice)
    const qty = parseFloat(formData.quantity)
    const pnl = formData.tradeType === 'long' ? (exit - entry) * qty : (entry - exit) * qty
    onAddTrade({ ...formData, pnl: pnl.toFixed(2) })
    setFormData({
      symbol: '', entryPrice: '', exitPrice: '', quantity: '',
      tradeType: 'long', date: new Date().toISOString().split('T')[0], notes: ''
    })
  }

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const label = txt => (
    <label style={{
      display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem',
      letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 7
    }}>{txt}</label>
  )

  return (
    <div className="glass" style={{ padding: isMobile ? 20 : 28 }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>New Trade</h2>
        <div style={{ width: 32, height: 2, background: 'var(--accent)', borderRadius: 2, marginTop: 8, opacity: 0.6 }} />
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '14px' : '16px 20px'
        }}>
          <div>
            {label('Symbol')}
            <input className="glass-input" type="text" name="symbol" value={formData.symbol}
              onChange={handleChange} required placeholder="AAPL, EURUSD…" />
          </div>

          <div>
            {label('Trade Type')}
            <select className="glass-input" name="tradeType" value={formData.tradeType} onChange={handleChange}>
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>

          <div>
            {label('Entry Price')}
            <input className="glass-input" type="number" step="0.01" name="entryPrice"
              value={formData.entryPrice} onChange={handleChange} required placeholder="0.00" />
          </div>

          <div>
            {label('Exit Price')}
            <input className="glass-input" type="number" step="0.01" name="exitPrice"
              value={formData.exitPrice} onChange={handleChange} required placeholder="0.00" />
          </div>

          <div>
            {label('Quantity')}
            <input className="glass-input" type="number" step="0.01" name="quantity"
              value={formData.quantity} onChange={handleChange} required placeholder="0" />
          </div>

          <div>
            {label('Date')}
            <input className="glass-input" type="date" name="date"
              value={formData.date} onChange={handleChange} required />
          </div>

          <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
            {label('Notes')}
            <textarea className="glass-input" name="notes" value={formData.notes}
              onChange={handleChange} rows={3} placeholder="Strategy, observations…"
              style={{ resize: 'vertical', minHeight: 72 }} />
          </div>
        </div>

        <button type="submit" style={{
          marginTop: 20, width: '100%', padding: '12px 0',
          borderRadius: 10, border: '1px solid rgba(var(--accent-rgb),0.3)',
          background: 'rgba(var(--accent-rgb),0.09)',
          color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontWeight: 600,
          fontSize: '0.88rem', letterSpacing: '0.06em',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(var(--accent-rgb),0.15)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(var(--accent-rgb),0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(var(--accent-rgb),0.09)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          + Add Trade
        </button>
      </form>
    </div>
  )
}

export default TradeForm
