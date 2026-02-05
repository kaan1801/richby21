import { useState } from 'react'

function TradeForm({ onAddTrade }) {
  const [formData, setFormData] = useState({
    symbol: '',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    tradeType: 'long',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const entry = parseFloat(formData.entryPrice)
    const exit = parseFloat(formData.exitPrice)
    const qty = parseFloat(formData.quantity)
    
    let pnl = 0
    if (formData.tradeType === 'long') {
      pnl = (exit - entry) * qty
    } else {
      pnl = (entry - exit) * qty
    }

    const trade = {
      ...formData,
      pnl: pnl.toFixed(2)
    }

    onAddTrade(trade)
    
    // Reset form
    setFormData({
      symbol: '',
      entryPrice: '',
      exitPrice: '',
      quantity: '',
      tradeType: 'long',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Add New Trade</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium">Symbol</label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              required
              placeholder="e.g., AAPL, EURUSD"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium">Trade Type</label>
            <select
              name="tradeType"
              value={formData.tradeType}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium">Entry Price</label>
            <input
              type="number"
              step="0.01"
              name="entryPrice"
              value={formData.entryPrice}
              onChange={handleChange}
              required
              placeholder="0.00"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium">Exit Price</label>
            <input
              type="number"
              step="0.01"
              name="exitPrice"
              value={formData.exitPrice}
              onChange={handleChange}
              required
              placeholder="0.00"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium">Quantity</label>
            <input
              type="number"
              step="0.01"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              placeholder="0"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-300 mb-2 text-sm font-medium">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Trade notes, strategy, etc."
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          Add Trade
        </button>
      </form>
    </div>
  )
}

export default TradeForm
