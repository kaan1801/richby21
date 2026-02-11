import { useEffect, useState } from "react"

export default function TradeCalendar({
  trades,
  loading,
  onDeleteTrade,
  onDeleteAll
}) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [groupedTrades, setGroupedTrades] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    const grouped = {}

    trades.forEach(trade => {
      const date = trade.date.split(" ")[0]

      if (!grouped[date]) {
        grouped[date] = []
      }

      grouped[date].push(trade)
    })

    setGroupedTrades(grouped)
  }, [trades])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const changeMonth = direction => {
    setCurrentDate(new Date(year, month + direction, 1))
    setSelectedDate(null)
  }

  const formatDate = (day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const calculateDailyPnL = (date) => {
    if (!groupedTrades[date]) return 0
    return groupedTrades[date].reduce(
      (sum, trade) => sum + parseFloat(trade.pnl),
      0
    )
  }

  if (loading) {
    return <div className="text-white">Loading trades...</div>
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl text-white">

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className="px-3 py-1 bg-slate-700 rounded"
        >
          ◀
        </button>

        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>

        <button
          onClick={() => changeMonth(1)}
          className="px-3 py-1 bg-slate-700 rounded"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => (
          <div key={day} className="font-semibold">
            {day}
          </div>
        ))}

        {Array(firstDay).fill(null).map((_, i) => (
          <div key={"empty"+i}></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const dateStr = formatDate(day)
          const dayTrades = groupedTrades[dateStr]
          const dailyPnL = calculateDailyPnL(dateStr)

          let color = "bg-slate-700"
          if (dayTrades) {
            color = dailyPnL >= 0 ? "bg-green-600" : "bg-red-600"
          }

          return (
            <div
              key={day}
              onClick={() => setSelectedDate(dateStr)}
              className={`${color} p-3 rounded-lg cursor-pointer`}
            >
              <div>{day}</div>
              {dayTrades && (
                <div className="text-xs mt-1">
                  {dailyPnL.toFixed(2)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedDate && (
        <div className="mt-6 bg-slate-900 p-4 rounded-lg">

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">
              Trades on {selectedDate}
            </h3>

            <button
              onClick={onDeleteAll}
              className="bg-red-600 px-3 py-1 rounded text-sm"
            >
              Delete All
            </button>
          </div>

          {groupedTrades[selectedDate]?.length > 0 ? (
            groupedTrades[selectedDate].map(trade => (
              <div
                key={trade.id}
                className="border-b border-slate-700 pb-3 mb-3"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">
                      {trade.symbol}
                    </div>
                    <div className="text-sm text-gray-400">
                      {trade.trade_type}
                    </div>
                  </div>

                  <div
                    className={
                      parseFloat(trade.pnl) >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {parseFloat(trade.pnl).toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTrade(trade.id)}
                  className="mt-2 text-xs bg-red-700 px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">
              No trades this day
            </p>
          )}

        </div>
      )}
    </div>
  )
}
