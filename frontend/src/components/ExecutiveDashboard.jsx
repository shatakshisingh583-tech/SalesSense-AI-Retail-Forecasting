import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
  RefreshCw
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899']

export default function ExecutiveDashboard({ onNavigate }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/overview')
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching overview:', err)
        setLoading(false)
      })
  }, [])

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm">Aggregating historical store sales data...</p>
      </div>
    )
  }

  const { kpis, category_breakdown, monthly_trend, recent_daily } = data

  return (
    <div className="space-y-6">
      {/* Top Welcome & Context Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Executive Overview
              </span>
              <span className="text-xs text-slate-400">Date Range: {kpis.date_range[0]} to {kpis.date_range[1]}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">Retail Demand & Revenue Intelligence</h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Real-time predictive analytics dashboard combining historical sales telemetry with Machine Learning and SARIMA forecasting models for inventory optimization.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('forecasting')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch 30-Day Forecast</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">${kpis.total_revenue.toLocaleString()}</p>
          <div className="flex items-center space-x-1 text-xs text-emerald-400 mt-2 font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>2-Year cumulative retail turnover</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Units Sold</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{kpis.total_units_sold.toLocaleString()} units</p>
          <div className="flex items-center space-x-1 text-xs text-indigo-400 mt-2 font-medium">
            <span>Aggregated across 4 core departments</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Daily Demand</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{kpis.avg_daily_units.toLocaleString()} units/day</p>
          <div className="flex items-center space-x-1 text-xs text-amber-400 mt-2 font-medium">
            <span>Weekend boost factor: +38.5%</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Best Model R² Score</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">0.8814</p>
          <div className="flex items-center space-x-1 text-xs text-purple-400 mt-2 font-medium">
            <span>Verified on 20% hold-out test set</span>
          </div>
        </div>
      </div>

      {/* Main Charts: 24-Month Trend & Category Revenue Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 24-Month Trend */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Monthly Revenue Trajectory (2024 – 2025)</h2>
              <p className="text-xs text-slate-400">Shows annual macro-growth and Q4 holiday festive surges</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 font-medium">Aggregated Monthly</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly_trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Revenue by Department</h2>
            <p className="text-xs text-slate-400 mb-4">Share of total gross sales</p>
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={category_breakdown}
                    dataKey="total_revenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {category_breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-2 mt-2">
            {category_breakdown.map((c, i) => (
              <div key={c.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                  <span className="text-slate-300 font-medium">{c.category}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400">${(c.total_revenue / 1000).toFixed(1)}k</span>
                  <span className="font-bold text-white">{c.share_pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent 30-Day Daily Velocity & Key Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Daily Unit Velocity (Latest 30 Days)</h2>
              <p className="text-xs text-slate-400">Day-by-day aggregate across all stores and categories</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recent_daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="units_sold" fill="#10b981" radius={[4, 4, 0, 0]} name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enterprise Highlights & Demand Engine */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Predictive Intelligence Highlights</span>
            </div>
            <h3 className="text-base font-bold text-white">Demand & Replenishment Insights</h3>
            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-emerald-400">Outlier Analytics:</span> Dynamic bounds calculated via Tukey IQR (1.5×IQR) & Z-Score (|Z| &gt; 3) to isolate promotional surges.
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-indigo-400">Surge Risk Classifier:</span> Logistic regression predicts stockout probabilities with AUC-ROC calibration.
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-amber-400">Seasonal Forecasts:</span> Additive decomposition separates Trend, Seasonality, and Residual noise; SARIMA forecasts weekly cycles.
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('forecasting')}
            className="mt-4 w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition text-center"
          >
            Launch Forecasting Studio →
          </button>
        </div>
      </div>
    </div>
  )
}
