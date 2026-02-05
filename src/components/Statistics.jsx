function Statistics({ stats }) {
  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Statistics</h2>
      
      <div className="space-y-4">
        <div className="bg-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Total Trades</p>
          <p className="text-3xl font-bold text-white">{stats.totalTrades}</p>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Win Rate</p>
          <p className="text-3xl font-bold text-white">{stats.winRate}%</p>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-green-400">Wins: {stats.wins}</span>
            <span className="text-red-400">Losses: {stats.losses}</span>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Total P&L</p>
          <p className={`text-3xl font-bold ${parseFloat(stats.totalPnL) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${stats.totalPnL}
          </p>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Average Win</p>
          <p className="text-2xl font-bold text-green-400">${stats.avgWin}</p>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Average Loss</p>
          <p className="text-2xl font-bold text-red-400">${stats.avgLoss}</p>
        </div>
      </div>
    </div>
  )
}

export default Statistics
