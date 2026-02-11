import { useState } from 'react'

function TradeList({ trades, loading, onDeleteTrade, onDeleteAll }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleDeleteAll = () => {
    setShowConfirmDialog(true)
  }

  const confirmDeleteAll = () => {
    onDeleteAll()
    setShowConfirmDialog(false)
  }

  const cancelDeleteAll = () => {
    setShowConfirmDialog(false)
  }

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-lg p-6">
        <p className="text-slate-400 text-center">Loading trades...</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Trade History</h2>
        {trades.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            Delete All Trades
          </button>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4">Delete All Trades?</h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete all {trades.length} trades? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={confirmDeleteAll}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Yes, Delete All
              </button>
              <button
                onClick={cancelDeleteAll}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {trades.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No trades yet. Add your first trade above!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-300 font-semibold py-3 px-4">Date</th>
                <th className="text-left text-slate-300 font-semibold py-3 px-4">Symbol</th>
                <th className="text-left text-slate-300 font-semibold py-3 px-4">Type</th>
                <th className="text-right text-slate-300 font-semibold py-3 px-4">Entry</th>
                <th className="text-right text-slate-300 font-semibold py-3 px-4">Exit</th>
                <th className="text-right text-slate-300 font-semibold py-3 px-4">Qty</th>
                <th className="text-right text-slate-300 font-semibold py-3 px-4">P&L</th>
                <th className="text-center text-slate-300 font-semibold py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-slate-700 hover:bg-slate-700 transition">
                  <td className="py-3 px-4 text-slate-300">{trade.date}</td>
                  <td className="py-3 px-4 text-white font-semibold">{trade.symbol}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${trade.trade_type === 'long' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}>
                      {trade.trade_type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">${parseFloat(trade.entry_price).toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-slate-300">${parseFloat(trade.exit_price).toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{trade.quantity}</td>
                  <td className={`py-3 px-4 text-right font-bold ${parseFloat(trade.pnl) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                    ${parseFloat(trade.pnl).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onDeleteTrade(trade.id)}
                      className="relative overflow-hidden px-3 py-1 text-sm rounded text-white bg-blue-600/10 hover:bg-blue-600/20 transition group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-blue-600/30 to-blue-400/30 opacity-30 blur-sm scale-110 transition-transform duration-1000 group-hover:scale-125"></span>
                      <span className="relative">Delete</span>
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TradeList
