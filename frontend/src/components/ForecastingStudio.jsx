import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Calendar,
  Layers,
  TrendingUp,
  DollarSign,
  Package,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

export default function ForecastingStudio() {
  const [category, setCategory] = useState('Grocery')
  const [horizon, setHorizon] = useState(14)
  const [model, setModel] = useState('SARIMA')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleFetchForecast = () => {
    setLoading(true)
    fetch('/api/forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, horizon, model })
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Forecast error:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    handleFetchForecast()
  }, [category, horizon, model])

  // Combine historical context with forecast timeline
  let chartTimeline = []
  if (data && data.historical_context && data.forecast) {
    chartTimeline = [
      ...data.historical_context.map((h) => ({
        date: h.date,
        day_label: h.date.slice(5),
        actual_sales: h.units_sold,
        predicted_units: null,
        lower_ci: null,
        upper_ci: null
      })),
      ...data.forecast.map((f) => ({
        date: f.date,
        day_label: `${f.date.slice(5)} (${f.day_name})`,
        actual_sales: null,
        predicted_units: f.predicted_units,
        lower_ci: f.lower_ci,
        upper_ci: f.upper_ci
      }))
    ]
  }

  return (
    <div className="space-y-6">
      {/* Studio Header & Interactive Controls */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
            Syllabus Unit 4: Time Series Forecasting (ARIMA / SARIMA / Exp Smoothing)
          </span>
        </div>
        <h1 className="text-xl font-bold text-white mt-1">Multi-Horizon Demand Forecasting Studio</h1>
        <p className="text-xs text-slate-400 mt-0.5 mb-5">
          Generate future demand schedules with 95% Confidence Intervals using statistical and machine-learning time series engines.
        </p>

        {/* 3 Parameter Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Product Department
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Grocery', 'Electronics', 'Apparel', 'Home & Kitchen'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-left ${
                    category === cat
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Forecasting Algorithm
            </label>
            <div className="space-y-2">
              {[
                { id: 'SARIMA', name: 'SARIMA (1,1,1)(1,1,0)[7]', badge: 'Seasonal' },
                { id: 'Holt-Winters', name: 'Holt-Winters Exponential', badge: 'Statistical' },
                { id: 'Random Forest', name: 'Random Forest Regressor', badge: 'ML Lags' },
                { id: 'Ensemble', name: 'Ensemble Blend', badge: 'Weighted' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    model === m.id
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{m.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-800/80 rounded text-slate-300">{m.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Horizon Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Forecast Horizon
            </label>
            <div className="space-y-2">
              {[
                { days: 7, title: '7 Days Ahead', desc: 'Short-term tactical inventory replenishment' },
                { days: 14, title: '14 Days Ahead', desc: 'Bi-weekly supplier purchase order cycle' },
                { days: 30, title: '30 Days Ahead', desc: 'Monthly sales planning & warehouse capacity' }
              ].map((h) => (
                <button
                  key={h.days}
                  onClick={() => setHorizon(h.days)}
                  className={`w-full text-left px-3 py-2 rounded-xl border transition ${
                    horizon === h.days
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold">{h.title}</div>
                  <div className="text-[10px] opacity-80">{h.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading || !data ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] space-y-4">
          <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-slate-400 text-sm">Computing forward walk forecast with confidence intervals...</p>
        </div>
      ) : (
        <>
          {/* Forecast Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projected Total Demand</span>
              <p className="text-2xl font-bold text-white mt-1">{data.summary.total_projected_units.toLocaleString()} units</p>
              <p className="text-xs text-emerald-400 mt-1">Expected cumulative {horizon}-day volume</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projected Gross Revenue</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">${data.summary.total_projected_revenue.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-1">Based on category average selling price</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Demand Velocity</span>
              <p className="text-2xl font-bold text-indigo-400 mt-1">{data.summary.avg_daily_projected} units/day</p>
              <p className="text-xs text-slate-400 mt-1">Mean predicted replenishment rate</p>
            </div>
          </div>

          {/* Interactive Chart with Confidence Bands */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="text-base font-bold text-white">
                  Telemetry Horizon: Historical Sales → Forward Forecast Curve
                </h3>
                <p className="text-xs text-slate-400">
                  Gray curve represents historical test observations; Cyan curve shows {model} predictions with 95% Confidence Bounds.
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="inline-block w-3 h-3 rounded-full bg-slate-500"></span>
                <span className="text-slate-300">Actuals</span>
                <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 ml-2"></span>
                <span className="text-slate-300">Predicted</span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartTimeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day_label" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area type="monotone" dataKey="upper_ci" fill="#065f46" stroke="none" fillOpacity={0.2} name="95% CI Upper" />
                  <Area type="monotone" dataKey="lower_ci" fill="#0f172a" stroke="none" fillOpacity={0.5} name="95% CI Lower" />
                  <Line type="monotone" dataKey="actual_sales" stroke="#94a3b8" strokeWidth={2} dot={{ r: 2 }} name="Historical Actual Units" />
                  <Line type="monotone" dataKey="predicted_units" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} name={`${model} Forecast`} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Forecast Breakdown Table */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-3">Day-by-Day Forecast Schedule & Suggested Inventory Buffer</h3>
            <div className="overflow-x-auto max-h-72">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-slate-950 sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold text-slate-400">Date</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400">Day</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-300">Predicted Units</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-400">95% CI Range</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-300">Est. Revenue</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-300">Inventory Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.forecast.map((row, idx) => {
                    const isHigh = row.day_name === 'Sat' || row.day_name === 'Sun'
                    return (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-2 px-3 font-mono text-slate-300">{row.date}</td>
                        <td className="py-2 px-3 text-slate-300">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${isHigh ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-slate-400'}`}>
                            {row.day_name}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-bold text-emerald-400 text-sm">{row.predicted_units}</td>
                        <td className="py-2 px-3 text-slate-400 font-mono">[{row.lower_ci} – {row.upper_ci}]</td>
                        <td className="py-2 px-3 text-slate-200 font-medium">${row.projected_revenue.toLocaleString()}</td>
                        <td className="py-2 px-3">
                          {isHigh ? (
                            <span className="flex items-center space-x-1 text-amber-400 font-semibold">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Stock buffer +25% (Weekend Spike)</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-1 text-slate-400">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Standard replenishment</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
