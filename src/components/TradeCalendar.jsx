import { useEffect, useState } from 'react'

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function TradeCalendar({ trades, loading, onDeleteTrade, onDeleteAll }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [groupedTrades, setGroupedTrades] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    const grouped = {}
    trades.forEach(trade => {
      const date = trade.date.split(' ')[0]
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(trade)
    })
    setGroupedTrades(grouped)
  }, [trades])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const changeMonth = d => { setCurrentDate(new Date(year, month + d, 1)); setSelectedDate(null) }

  const formatDate = day =>
    `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`

  const getDailyPnL = date => {
    if (!groupedTrades[date]) return 0
    return groupedTrades[date].reduce((sum, t) => sum + parseFloat(t.pnl), 0)
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long' })

  if (loading) {
    return (
      <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', padding: 32 }}>
        <span className="pulse-dot">●</span> Loading trades...
      </div>
    )
  }

  const selectedTrades = selectedDate ? groupedTrades[selectedDate] : null

  return (
    <div>
      {/* Calendar card */}
      <div className="glass" style={{ padding: 28, marginBottom: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <button onClick={() => changeMonth(-1)} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, color: 'var(--text-muted)', padding: '6px 12px',
            cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >‹</button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.05em' }}>
              {monthName}
            </div>
            <div style={{ color: 'var(--text-subtle)', fontSize: '0.72rem', letterSpacing: '0.15em' }}>{year}</div>
          </div>

          <button onClick={() => changeMonth(1)} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, color: 'var(--text-muted)', padding: '6px 12px',
            cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >›</button>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 8, textAlign: 'center' }}>
          {DAYS.map(d => (
            <div key={d} style={{ color: 'var(--text-subtle)', fontSize: '0.68rem', letterSpacing: '0.1em', padding: '4px 0' }}>
              {d.toUpperCase()}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {Array(firstDay).fill(null).map((_, i) => (
            <div key={'e'+i} style={{ minHeight: 52 }} />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dateStr = formatDate(day)
            const hasTrades = !!groupedTrades[dateStr]
            const pnl = getDailyPnL(dateStr)
            const isWin = hasTrades && pnl >= 0
            const isLoss = hasTrades && pnl < 0
            const isSelected = selectedDate === dateStr

            return (
              <div
                key={day}
                onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
                className={`cal-day ${hasTrades ? (isWin ? 'cal-win' : 'cal-loss') : 'cal-empty'} ${isSelected ? 'cal-selected' : ''}`}
                style={{ position: 'relative' }}
              >
                <span style={{ fontWeight: hasTrades ? 600 : 400, fontSize: '0.82rem' }}>{day}</span>
                {hasTrades && (
                  <span style={{ fontSize: '0.62rem', marginTop: 2, opacity: 0.85 }}>
                    {pnl > 0 ? '+' : ''}{pnl.toFixed(0)}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginTop: 20, justifyContent: 'flex-end' }}>
          {[['var(--win)', 'var(--win-border)', 'var(--win-text)', 'Profit'],
            ['var(--loss)', 'var(--loss-border)', 'var(--loss-text)', 'Loss']].map(([bg, border, text, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: bg, border: `1px solid ${border}` }} />
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.68rem', letterSpacing: '0.08em' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected date panel */}
      {selectedDate && (
        <div className="glass fade-up" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '1rem' }}>{selectedDate}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 2 }}>
                {selectedTrades?.length ?? 0} trade{selectedTrades?.length !== 1 ? 's' : ''}
              </div>
            </div>
            <button onClick={onDeleteAll} style={{
              padding: '6px 14px', borderRadius: 8,
              border: '1px solid rgba(239,68,68,0.25)',
              background: 'rgba(239,68,68,0.08)',
              color: 'rgba(252,165,165,0.8)', fontSize: '0.72rem',
              fontFamily: 'var(--font-ui)', cursor: 'pointer', letterSpacing: '0.06em',
            }}>
              Delete All
            </button>
          </div>

          {selectedTrades?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedTrades.map(trade => {
                const isWin = parseFloat(trade.pnl) >= 0
                return (
                  <div key={trade.id} className="glass-deep" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.95rem' }}>{trade.symbol}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 3, letterSpacing: '0.06em' }}>
                        {trade.trade_type?.toUpperCase()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{
                        color: isWin ? 'var(--win-text)' : 'var(--loss-text)',
                        fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '0.9rem',
                      }}>
                        {isWin ? '+' : ''}{parseFloat(trade.pnl).toFixed(2)}
                      </span>
                      <button onClick={() => onDeleteTrade(trade.id)} style={{
                        padding: '4px 10px', borderRadius: 6,
                        border: '1px solid rgba(239,68,68,0.2)',
                        background: 'transparent',
                        color: 'rgba(252,165,165,0.5)', fontSize: '0.68rem',
                        fontFamily: 'var(--font-ui)', cursor: 'pointer',
                      }}>✕</button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>No trades on this day</p>
          )}
        </div>
      )}
    </div>
  )
}
