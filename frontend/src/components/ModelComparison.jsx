import React, { useState, useEffect } from 'react'
import {
  GitCompare,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  RefreshCw
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

export default function ModelComparison() {
  const [category, setCategory] = useState('Grocery')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/models/leaderboard?category=${category}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching leaderboard:', err)
        setLoading(false)
      })
  }, [category])

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm">Evaluating test metrics across Linear Regression, RF, and SARIMA...</p>
      </div>
    )
  }

  const { leaderboard, rf_feature_importances, actual_vs_predicted, train_test_split } = data

  return (
    <div className="space-y-6">
      {/* Header and Train-Test Split Details */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Syllabus Unit 5: Model Validation & Performance Metrics
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">Predictive Model Comparison & Benchmarking Arena</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative evaluation of regression and seasonal time-series architectures on unobserved chronological test samples.
            </p>
          </div>

          {/* Validation Split Badge */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-slate-400">Validation Protocol:</span>
              <span className="font-semibold text-emerald-400">{train_test_split.method}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-slate-400">Train / Test Split:</span>
              <span className="font-mono text-slate-200">{train_test_split.train_size} / {train_test_split.test_size} records</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Leaderboard Table (RMSE, MAE, MAPE, R²) */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Model Evaluation Leaderboard (CSE3141 Core Metrics)</h2>
          </div>
          <span className="text-xs text-slate-400">Sorted by RMSE (Lower is Better)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold text-slate-400">Rank & Model</th>
                <th className="py-3 px-4 font-semibold text-slate-400">Algorithm Family</th>
                <th className="py-3 px-4 font-semibold text-slate-300">RMSE (Root Mean Sq)</th>
                <th className="py-3 px-4 font-semibold text-slate-300">MAE (Mean Abs Error)</th>
                <th className="py-3 px-4 font-semibold text-slate-300">MAPE (%)</th>
                <th className="py-3 px-4 font-semibold text-slate-300">R² Coefficient</th>
                <th className="py-3 px-4 font-semibold text-slate-400">Operational Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leaderboard.map((item, index) => {
                const isWinner = index === 0
                return (
                  <tr key={item.model} className={isWinner ? 'bg-indigo-950/20 hover:bg-indigo-950/40' : 'hover:bg-slate-800/30'}>
                    <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isWinner ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>
                        {index + 1}
                      </span>
                      <span>{item.model}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{item.type}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-400 text-sm">{item.rmse}</td>
                    <td className="py-3 px-4 font-mono text-slate-200">{item.mae}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{item.mape}%</td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">{item.r2}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${isWinner ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actual vs Predicted on Test Period (30 Days) */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Actual vs Predicted Demand on Hold-Out Test Split</h3>
            <p className="text-xs text-slate-400">30-day chronological test slice verifying model tracking capability against actual retail sales</p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['Grocery', 'Electronics', 'Apparel', 'Home & Kitchen'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  category === cat ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={actual_vs_predicted} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Actual Ground Truth" />
              <Line type="monotone" dataKey="sarima" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" dot={false} name="SARIMA Prediction" />
              <Line type="monotone" dataKey="holt_winters" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Holt-Winters Exp" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Importances (Random Forest) + Overfitting Diagnostic Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RF Feature Importance */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Random Forest Gini Feature Importance</h3>
              <p className="text-xs text-slate-400">Relative contribution of lagged features and calendar variables</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rf_feature_importances.slice(0, 7)}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="importance" fill="#818cf8" radius={[0, 4, 4, 0]} name="Importance Weight" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Syllabus Overfitting vs Underfitting Defense Guide */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Syllabus Unit 5 Defense Topic</span>
            </div>
            <h3 className="text-base font-bold text-white">Techniques Handling Overfitting & Underfitting</h3>
            <div className="mt-3 space-y-2.5 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-emerald-400">Chronological Hold-Out:</span> Avoids temporal data leakage by evaluating solely on the final 20% future dates rather than randomly shuffled indices.
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-indigo-400">Tree Pruning in Random Forest:</span> Constraining <code className="text-slate-200">max_depth=12</code> and ensemble bagging (<code className="text-slate-200">n_estimators=100</code>) prevents single-tree variance explosion.
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-amber-400">Regularization in SARIMA:</span> Differencing order <code className="text-slate-200">d=1</code> induces stationary mean while AIC criteria guards against parameter over-specification.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
