import { useEffect, useState } from 'react'
import useIsMobile from '../hooks/useIsMobile'

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const DAYS_SHORT = ['S','M','T','W','T','F','S']

export default function TradeCalendar({ trades, loading, onDeleteTrade, onDeleteAll }) {
  const isMobile = useIsMobile()
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
  const formatDate = day => `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  const getDailyPnL = date => {
    if (!groupedTrades[date]) return 0
    return groupedTrades[date].reduce((sum, t) => sum + parseFloat(t.pnl), 0)
  }

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: 32 }}>
      <span className="pulse-dot">●</span> Loading trades...
    </div>
  }

  const selectedTrades = selectedDate ? groupedTrades[selectedDate] : null
  const dayLabels = isMobile ? DAYS_SHORT : DAYS

  return (
    <div>
      <div className="glass" style={{ padding: isMobile ? 16 : 28, marginBottom: 16 }}>

        {/* Month nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <button onClick={() => changeMonth(-1)} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, color: 'var(--text-muted)', padding: '6px 14px',
            cursor: 'pointer', fontSize: '1rem', transition: 'all 0.15s',
          }}>‹</button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: isMobile ? '1rem' : '1.1rem' }}>
              {currentDate.toLocaleString('default', { month: 'long' })}
            </div>
            <div style={{ color: 'var(--text-subtle)', fontSize: '0.72rem', letterSpacing: '0.12em' }}>{year}</div>
          </div>

          <button onClick={() => changeMonth(1)} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, color: 'var(--text-muted)', padding: '6px 14px',
            cursor: 'pointer', fontSize: '1rem', transition: 'all 0.15s',
          }}>›</button>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: isMobile ? 3 : 6, marginBottom: 6 }}>
          {dayLabels.map((d, i) => (
            <div key={i} style={{
              color: 'var(--text-subtle)', fontSize: isMobile ? '0.62rem' : '0.68rem',
              letterSpacing: '0.06em', textAlign: 'center', padding: '3px 0', textTransform: 'uppercase'
            }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: isMobile ? 3 : 6 }}>
          {Array(firstDay).fill(null).map((_, i) => (
            <div key={'e'+i} style={{ minHeight: isMobile ? 38 : 52 }} />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dateStr = formatDate(day)
            const hasTrades = !!groupedTrades[dateStr]
            const pnl = getDailyPnL(dateStr)
            const isWin = hasTrades && pnl >= 0
            const isSelected = selectedDate === dateStr

            return (
              <div
                key={day}
                onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
                className={`cal-day ${hasTrades ? (isWin ? 'cal-win' : 'cal-loss') : 'cal-empty'} ${isSelected ? 'cal-selected' : ''}`}
                style={{ minHeight: isMobile ? 38 : 52, padding: isMobile ? '4px 2px' : '8px 4px' }}
              >
                <span style={{ fontWeight: hasTrades ? 600 : 400, fontSize: isMobile ? '0.75rem' : '0.82rem' }}>{day}</span>
                {hasTrades && !isMobile && (
                  <span style={{ fontSize: '0.62rem', marginTop: 2, opacity: 0.85 }}>
                    {pnl > 0 ? '+' : ''}{pnl.toFixed(0)}
                  </span>
                )}
                {hasTrades && isMobile && (
                  <span style={{ fontSize: '0.5rem', marginTop: 2, opacity: 0.8 }}>
                    {pnl > 0 ? '▲' : '▼'}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 18, justifyContent: 'flex-end' }}>
          {[['var(--win)','var(--win-border)','Profit'],['var(--loss)','var(--loss-border)','Loss']].map(([bg, border, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 9, height: 9, borderRadius: 3, background: bg, border: `1px solid ${border}` }} />
              <span style={{ color: 'var(--text-subtle)', fontSize: '0.68rem' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected date detail */}
      {selectedDate && (
        <div className="glass fade-up" style={{ padding: isMobile ? 16 : 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 10, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedDate}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 2 }}>
                {selectedTrades?.length ?? 0} trade{selectedTrades?.length !== 1 ? 's' : ''}
              </div>
            </div>
            <button onClick={onDeleteAll} style={{
              padding: '6px 14px', borderRadius: 8,
              border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)',
              color: 'rgba(252,165,165,0.8)', fontSize: '0.75rem', cursor: 'pointer',
            }}>Delete All</button>
          </div>

          {selectedTrades?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedTrades.map(trade => {
                const isWin = parseFloat(trade.pnl) >= 0
                return (
                  <div key={trade.id} className="glass-deep" style={{
                    padding: isMobile ? '12px 14px' : '14px 18px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{trade.symbol}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 2, letterSpacing: '0.04em' }}>
                        {trade.trade_type?.toUpperCase()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        color: isWin ? 'var(--win-text)' : 'var(--loss-text)',
                        fontWeight: 600, fontSize: '0.92rem',
                      }}>
                        {isWin ? '+' : ''}{parseFloat(trade.pnl).toFixed(2)}
                      </span>
                      <button onClick={() => onDeleteTrade(trade.id)} style={{
                        padding: '4px 10px', borderRadius: 6,
                        border: '1px solid rgba(239,68,68,0.2)', background: 'transparent',
                        color: 'rgba(252,165,165,0.5)', fontSize: '0.72rem', cursor: 'pointer',
                      }}>✕</button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.82rem' }}>No trades on this day</p>
          )}
        </div>
      )}
    </div>
  )
}
