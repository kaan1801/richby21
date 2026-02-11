import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import TradeForm from './components/TradeForm'
import TradeList from './components/TradeList'
import Statistics from './components/Statistics'

function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(true)
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTrades: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalPnL: 0,
    avgWin: 0,
    avgLoss: 0
  })

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Fetch trades when user is authenticated
  useEffect(() => {
    if (user) {
      fetchTrades()
    }
  }, [user])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'check' })
      })
      const data = await response.json()
      
      if (data.authenticated) {
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  const fetchTrades = async () => {
    try {
      const response = await fetch('/api/trades.php', {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setTrades(data.trades)
        calculateStats(data.trades)
      }
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
      ? winningTrades.reduce((sum, t) => sum + parseFloat(t.pnl), 0) / winningTrades.length 
      : 0
    
    const avgLoss = losingTrades.length > 0 
      ? losingTrades.reduce((sum, t) => sum + parseFloat(t.pnl), 0) / losingTrades.length 
      : 0

    setStats({
      totalTrades,
      wins,
      losses,
      winRate,
      totalPnL: totalPnL.toFixed(2),
      avgWin: avgWin.toFixed(2),
      avgLoss: avgLoss.toFixed(2)
    })
  }

  const handleAddTrade = async (trade) => {
    try {
      const response = await fetch('/api/trades.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(trade)
      })
      const data = await response.json()
      if (data.success) {
        fetchTrades()
      }
    } catch (error) {
      console.error('Error adding trade:', error)
    }
  }

  const handleDeleteTrade = async (id) => {
    try {
      const response = await fetch('/api/trades.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id })
      })
      const data = await response.json()
      if (data.success) {
        fetchTrades()
      }
    } catch (error) {
      console.error('Error deleting trade:', error)
    }
  }

  const handleDeleteAll = async () => {
    try {
      const response = await fetch('/api/trades.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'delete_all' })
      })
      const data = await response.json()
      if (data.success) {
        fetchTrades()
      }
    } catch (error) {
      console.error('Error deleting all trades:', error)
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleRegister = (userData) => {
    setUser(userData)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'logout' })
      })
      setUser(null)
      setTrades([])
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // Show login/register if not authenticated
  if (!user) {
    return showLogin 
      ? <Login onLogin={handleLogin} onSwitchToRegister={() => setShowLogin(false)} />
      : <Register onRegister={handleRegister} onSwitchToLogin={() => setShowLogin(true)} />
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Trade Tracker</h1>
            <p className="text-slate-300">Welcome back, {user.username}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TradeForm onAddTrade={handleAddTrade} />
          </div>
          <div>
            <Statistics stats={stats} />
          </div>
        </div>

        <div>
          <TradeList 
            trades={trades} 
            loading={loading}
            onDeleteTrade={handleDeleteTrade}
            onDeleteAll={handleDeleteAll}
          />
        </div>
      </div>
    </div>
  )
}

export default App
