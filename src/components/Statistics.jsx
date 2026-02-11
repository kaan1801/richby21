import {
  Radar
} from "react-chartjs-2"

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

export default function Statistics({ stats }) {

  const radarData = {
    labels: [
      "Wins",
      "Losses",
      "Win Rate",
      "Total PnL",
      "Avg Win",
      "Avg Loss"
    ],
    datasets: [
      {
        label: "Trading Performance",
        data: [
          stats.wins,
          stats.losses,
          stats.winRate,
          Math.abs(stats.totalPnL),
          Math.abs(stats.avgWin),
          Math.abs(stats.avgLoss)
        ],
        backgroundColor: "rgba(59,130,246,0.2)",
        borderColor: "rgba(59,130,246,1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(59,130,246,1)"
      }
    ]
  }

  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        angleLines: { color: "#334155" },
        grid: { color: "#334155" },
        pointLabels: { color: "#ffffff" },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: "#ffffff"
        }
      }
    }
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl text-white">

      <h2 className="text-xl font-bold mb-6">
        Statistics Overview
      </h2>

      <div className="mb-8">
        <Radar data={radarData} options={radarOptions} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">

        <div className="bg-slate-900 p-4 rounded-lg">
          <p>Total Trades</p>
          <p className="text-lg font-bold">{stats.totalTrades}</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg">
          <p>Win Rate</p>
          <p className="text-lg font-bold">{stats.winRate}%</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg">
          <p>Total PnL</p>
          <p className={`text-lg font-bold ${stats.totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
            {stats.totalPnL}
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg">
          <p>Avg Win</p>
          <p className="text-lg font-bold text-green-400">
            {stats.avgWin}
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg">
          <p>Avg Loss</p>
          <p className="text-lg font-bold text-red-400">
            {stats.avgLoss}
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg">
          <p>Wins / Losses</p>
          <p className="text-lg font-bold">
            {stats.wins} / {stats.losses}
          </p>
        </div>

      </div>
    </div>
  )
}
