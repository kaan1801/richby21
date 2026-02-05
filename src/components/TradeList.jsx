function TradeList({ trades, loading, onDeleteTrade }) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-lg p-6">
        <p className="text-slate-400 text-center">Loading trades...</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Trade History</h2>
      
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
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      trade.trade_type === 'long' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {trade.trade_type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">${parseFloat(trade.entry_price).toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-slate-300">${parseFloat(trade.exit_price).toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{trade.quantity}</td>
                  <td className={`py-3 px-4 text-right font-bold ${
                    parseFloat(trade.pnl) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ${parseFloat(trade.pnl).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onDeleteTrade(trade.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                    >
                      Delete
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
