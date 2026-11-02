import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  Filter,
  AlertCircle,
  Activity,
  Layers,
  HelpCircle,
  RefreshCw
} from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

export default function EdaLab() {
  const [category, setCategory] = useState('Grocery')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/eda?category=${encodeURIComponent(category)}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching EDA:', err)
        setLoading(false)
      })
  }, [category])

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm">Computing statistical distributions and outlier fences...</p>
      </div>
    )
  }

  const { statistics, boxplot, histogram, seasonal_decomposition, correlation_matrix, available_categories } = data

  const statItems = [
    { label: 'Mean (μ)', val: statistics.mean, desc: 'Average daily units' },
    { label: 'Median (Q2)', val: statistics.median, desc: '50th percentile demand' },
    { label: 'Mode', val: statistics.mode, desc: 'Most frequent daily sales' },
    { label: 'Variance (σ²)', val: statistics.variance.toLocaleString(), desc: 'Dispersion from the mean' },
    { label: 'Std Dev (σ)', val: statistics.std_dev, desc: 'Standard deviation' },
    { label: 'Skewness', val: statistics.skewness, desc: statistics.skewness > 0 ? 'Right-skewed distribution' : 'Left-skewed' },
    { label: 'Kurtosis', val: statistics.kurtosis, desc: 'Tail heaviness & outlier peakedness' },
  ]

  const corrCols = Object.keys(correlation_matrix)

  return (
    <div className="space-y-6">
      {/* Header and Category Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
              Statistical Profiling & Outlier Analytics
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Exploratory Data Analysis & Outlier Detection</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical characterization using Mean, Median, Mode, Variance, IQR Box Plot rules, and Additive Time-Series Decomposition.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {available_categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 7 Descriptive Statistics Cards */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Core Descriptive Statistics (Mean, Median, Mode, Variance, Std Dev, Z-Score)</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {statItems.map((item) => (
            <div key={item.label} className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl hover:border-slate-700 transition">
              <span className="text-[11px] font-medium text-slate-400">{item.label}</span>
              <p className="text-lg font-bold text-white mt-0.5">{item.val}</p>
              <p className="text-[10px] text-slate-400 truncate mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Outlier Analytics (IQR & Z-score) + Boxplot Five-Number Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outlier Summary Card */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Outlier Detection Analysis</span>
              </h3>
              <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full font-medium">
                IQR & Z-Score
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Outliers identified using Tukey's Interquartile Range (<code className="text-indigo-300">Q1 - 1.5×IQR</code> to <code className="text-indigo-300">Q3 + 1.5×IQR</code>) and standard score threshold (<code className="text-indigo-300">|Z| &gt; 3.0</code>).
            </p>

            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">IQR Fence Outliers</span>
                <span className="text-sm font-bold text-amber-400">{boxplot.outlier_count_iqr} days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Z-Score Outliers (|Z| &gt; 3)</span>
                <span className="text-sm font-bold text-indigo-400">{boxplot.outlier_count_zscore} days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Valid Inlier Range</span>
                <span className="text-xs font-mono text-emerald-400">[{Math.round(boxplot.lower_fence)} – {Math.round(boxplot.upper_fence)} units]</span>
              </div>
            </div>
          </div>

          {/* Boxplot five-number summary values */}
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-5 text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Min</span>
              <span className="font-bold text-white">{boxplot.min}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Q1 (25%)</span>
              <span className="font-bold text-white">{boxplot.q25}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Median</span>
              <span className="font-bold text-emerald-400">{boxplot.median}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Q3 (75%)</span>
              <span className="font-bold text-white">{boxplot.q75}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Max</span>
              <span className="font-bold text-white">{boxplot.max}</span>
            </div>
          </div>
        </div>

        {/* Histogram of Frequency Distribution */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Demand Frequency Distribution (Histogram)</h3>
              <p className="text-xs text-slate-400">Displays distribution normality and positive skewness across daily sales volume</p>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogram} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Day Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Seasonal Decomposition: Trend, Seasonality, Noise Residuals */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-medium">
                Time Series Component Decomposition
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">Time Series Additive Decomposition [Y(t) = Trend(t) + Seasonal(t) + Residual(t)]</h3>
            <p className="text-xs text-slate-400">
              Deconstructed 60-day window showing underlying long-term trend, 7-day cyclical seasonality, and stochastic noise residual.
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={seasonal_decomposition} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="observed" stroke="#94a3b8" strokeWidth={1.5} dot={false} name="Observed Sales" />
              <Line type="monotone" dataKey="trend" stroke="#10b981" strokeWidth={2.5} dot={false} name="Trend (Tt)" />
              <Line type="monotone" dataKey="seasonal" stroke="#6366f1" strokeWidth={1.5} dot={false} name="Seasonality (St)" />
              <Line type="monotone" dataKey="resid" stroke="#f59e0b" strokeWidth={1} dot={false} name="Residual / Noise (Rt)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Correlation Matrix Heatmap */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Pearson Feature Correlation Matrix</h3>
            <p className="text-xs text-slate-400">Evaluates linear collinearity between price, marketing spend, promotions, holidays, and units sold</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="py-2.5 px-3 font-semibold text-slate-400">Feature</th>
                {corrCols.map((col) => (
                  <th key={col} className="py-2.5 px-3 font-semibold text-slate-300 text-center">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {corrCols.map((rowCol) => (
                <tr key={rowCol} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-medium text-slate-300">{rowCol}</td>
                  {corrCols.map((col) => {
                    const val = correlation_matrix[rowCol][col]
                    // Color based on correlation intensity
                    let bgColor = 'bg-slate-900 text-slate-300'
                    if (val >= 0.7) bgColor = 'bg-emerald-500/30 text-emerald-300 font-bold'
                    else if (val >= 0.3) bgColor = 'bg-emerald-500/10 text-emerald-400'
                    else if (val <= -0.5) bgColor = 'bg-rose-500/30 text-rose-300 font-bold'
                    else if (val <= -0.2) bgColor = 'bg-rose-500/10 text-rose-400'
                    return (
                      <td key={col} className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-1 rounded text-[11px] ${bgColor}`}>
                          {val > 0 && val !== 1 ? `+${val}` : val}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
