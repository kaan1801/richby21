import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const StatRow = ({ label, value, color }) => (
  <div className="glass-deep" style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
      {label}
    </span>
    <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '1rem', color: color || 'var(--text-primary)' }}>
      {value}
    </span>
  </div>
)

export default function Statistics({ stats }) {
  const radarData = {
    labels: ['Wins', 'Losses', 'Win %', 'PnL', 'Avg W', 'Avg L'],
    datasets: [{
      label: 'Performance',
      data: [stats.wins, stats.losses, stats.winRate, Math.abs(stats.totalPnL), Math.abs(stats.avgWin), Math.abs(stats.avgLoss)],
      backgroundColor: 'rgba(110,231,183,0.07)',
      borderColor: 'rgba(110,231,183,0.5)',
      borderWidth: 1.5,
      pointBackgroundColor: 'rgba(110,231,183,0.8)',
      pointRadius: 3,
    }]
  }

  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,0.06)' },
        grid: { color: 'rgba(255,255,255,0.06)' },
        pointLabels: { color: 'rgba(255,255,255,0.4)', font: { family: 'var(--font-ui)', size: 10 } },
        ticks: { display: false },
      }
    },
    plugins: { legend: { display: false } }
  }

  const pnlPositive = parseFloat(stats.totalPnL) >= 0

  return (
    <div className="glass" style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>
          Performance
        </h2>
        <div style={{ width: 32, height: 2, background: 'var(--accent)', borderRadius: 2, marginTop: 8, opacity: 0.6 }} />
      </div>

      <div style={{ marginBottom: 20, padding: '4px 0' }}>
        <Radar data={radarData} options={radarOptions} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <StatRow label="Total Trades" value={stats.totalTrades} />
        <StatRow label="Win Rate" value={`${stats.winRate}%`} color="var(--win-text)" />
        <StatRow label="Total PnL" value={stats.totalPnL}
          color={pnlPositive ? 'var(--win-text)' : 'var(--loss-text)'} />
        <StatRow label="Avg Win" value={stats.avgWin} color="var(--win-text)" />
        <StatRow label="Avg Loss" value={stats.avgLoss} color="var(--loss-text)" />
        <StatRow label="W / L" value={`${stats.wins} / ${stats.losses}`} />
      </div>
    </div>
  )
}
