import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import TradeForm from './components/TradeForm'
import TradeCalendar from './components/TradeCalendar'
import Statistics from './components/Statistics'
import ConsoleText from './components/ConsoleText'
import Navbar from './components/Navbar'
import Settings from './components/Settings'

function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTrades: 0, wins: 0, losses: 0,
    winRate: 0, totalPnL: 0, avgWin: 0, avgLoss: 0
  })

  useEffect(() => { checkAuth() }, [])
  useEffect(() => { if (user) fetchTrades() }, [user])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'check' })
      })
      const data = await response.json()
      if (data.authenticated) setUser(data.user)
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  const fetchTrades = async () => {
    try {
      const response = await fetch('/api/trades.php', { credentials: 'include' })
      const data = await response.json()
      if (data.success) { setTrades(data.trades); calculateStats(data.trades) }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching trades:', error)
      setLoading(false)
    }
  }

  const calculateStats = (tradesData) => {
    const totalTrades = tradesData.length
    const wins = tradesData.filter(t => t.pnl > 0).length
    const losses = tradesData.filter(t => t.pnl < 0).length
    const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(2) : 0
    const totalPnL = tradesData.reduce((sum, t) => sum + parseFloat(t.pnl), 0)
    const winningTrades = tradesData.filter(t => t.pnl > 0)
    const losingTrades = tradesData.filter(t => t.pnl < 0)
    const avgWin = winningTrades.length > 0
      ? winningTrades.reduce((sum, t) => sum + parseFloat(t.pnl), 0) / winningTrades.length : 0
    const avgLoss = losingTrades.length > 0
      ? losingTrades.reduce((sum, t) => sum + parseFloat(t.pnl), 0) / losingTrades.length : 0
    setStats({ totalTrades, wins, losses, winRate,
      totalPnL: totalPnL.toFixed(2), avgWin: avgWin.toFixed(2), avgLoss: avgLoss.toFixed(2) })
  }

  const handleAddTrade = async (trade) => {
    try {
      const response = await fetch('/api/trades.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(trade)
      })
      const data = await response.json()
      if (data.success) fetchTrades()
    } catch (error) { console.error('Error adding trade:', error) }
  }

  const handleDeleteTrade = async (id) => {
    try {
      const response = await fetch('/api/trades.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      })
      const data = await response.json()
      if (data.success) fetchTrades()
    } catch (error) { console.error('Error deleting trade:', error) }
  }

  const handleDeleteAll = async () => {
    try {
      const response = await fetch('/api/trades.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'delete_all' })
      })
      const data = await response.json()
      if (data.success) fetchTrades()
    } catch (error) { console.error('Error deleting all trades:', error) }
  }

  const handleLogin = (userData) => setUser(userData)
  const handleRegister = (userData) => setUser(userData)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'logout' })
      })
      setUser(null)
      setTrades([])
    } catch (error) { console.error('Error logging out:', error) }
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', letterSpacing: '0.15em', fontSize: '0.8rem' }}>
          <span className="pulse-dot">●</span> LOADING
        </div>
      </div>
    )
  }

  if (!user) {
    return showLogin
      ? <Login onLogin={handleLogin} onSwitchToRegister={() => setShowLogin(false)} />
      : <Register onRegister={handleRegister} onSwitchToLogin={() => setShowLogin(true)} />
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient orbs */}
      <div className="orb" style={{
        position: 'fixed', width: 600, height: 600, borderRadius: '50%',
        top: '-15%', left: '-10%', zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)',
        filter: 'blur(40px)'
      }} />
      <div className="orb orb-2" style={{
        position: 'fixed', width: 500, height: 500, borderRadius: '50%',
        top: '20%', right: '-8%', zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)'
      }} />
      <div className="orb orb-3" style={{
        position: 'fixed', width: 400, height: 400, borderRadius: '50%',
        bottom: '-5%', left: '30%', zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
        filter: 'blur(40px)'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          username={user.username}
          onLogout={handleLogout}
        />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
          {activeTab === 'dashboard' && (
            <>
              <div className="fade-up" style={{ marginBottom: 28 }}>
                <ConsoleText text={`> ${user.username} — lock in or be locked in the system`} />
              </div>
              <div className="fade-up fade-up-1" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                  <TradeForm onAddTrade={handleAddTrade} />
                  <Statistics stats={stats} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <div className="fade-up">
              <TradeCalendar
                trades={trades}
                loading={loading}
                onDeleteTrade={handleDeleteTrade}
                onDeleteAll={handleDeleteAll}
              />
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="fade-up" style={{ maxWidth: 560, margin: '0 auto' }}>
              <Statistics stats={stats} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="fade-up">
              <Settings username={user.username} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
