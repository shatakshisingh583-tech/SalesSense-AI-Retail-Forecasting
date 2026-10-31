import React, { useState, useEffect } from 'react'
import {
  Database,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Table,
  RefreshCw
} from 'lucide-react'

export default function DatasetExplorer() {
  const [data, setData] = useState(null)
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/dataset?page=${page}&page_size=12&category=${category}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Dataset fetch error:', err)
        setLoading(false)
      })
  }, [page, category])

  const handleDownloadCsv = () => {
    window.open('/backend/data/retail_sales_data.csv', '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
              Syllabus Unit 2: Data Preprocessing & Integrity
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Retail Store Dataset Explorer</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit raw feature records, inspect data types, missing value imputation, and target variable distributions.
          </p>
        </div>

        {/* Filter and Download */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['All', 'Grocery', 'Electronics', 'Apparel', 'Home & Kitchen'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat)
                  setPage(1)
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  category === cat ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Metadata & Missing Values Audit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs font-medium text-slate-400">Total Observations</span>
          <p className="text-xl font-bold text-white mt-1">2,924 Rows</p>
          <p className="text-[10px] text-slate-500 mt-1">731 days × 4 categories</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs font-medium text-slate-400">Total Schema Features</span>
          <p className="text-xl font-bold text-indigo-400 mt-1">15 Columns</p>
          <p className="text-[10px] text-slate-500 mt-1">Numeric, Categorical, Targets</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs font-medium text-slate-400">Missing Values Audit</span>
          <p className="text-xl font-bold text-emerald-400 mt-1">0.0% Missing</p>
          <p className="text-[10px] text-slate-500 mt-1">Zero missing data / clean integrity</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs font-medium text-slate-400">Target Variables</span>
          <p className="text-xl font-bold text-amber-400 mt-1">units_sold & surge</p>
          <p className="text-[10px] text-slate-500 mt-1">Continuous & Binary classification</p>
        </div>
      </div>

      {/* Dataset Table View */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        {loading || !data ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-slate-400 text-sm">Streaming dataset records...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-slate-950 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3 font-semibold text-slate-400">Date</th>
                    <th className="py-3 px-3 font-semibold text-slate-400">Category</th>
                    <th className="py-3 px-3 font-semibold text-slate-300">Units Sold (Y)</th>
                    <th className="py-3 px-3 font-semibold text-slate-300">Price ($)</th>
                    <th className="py-3 px-3 font-semibold text-slate-300">Discount</th>
                    <th className="py-3 px-3 font-semibold text-slate-300">Revenue ($)</th>
                    <th className="py-3 px-3 font-semibold text-slate-400">Promo</th>
                    <th className="py-3 px-3 font-semibold text-slate-400">Holiday</th>
                    <th className="py-3 px-3 font-semibold text-slate-400">Day</th>
                    <th className="py-3 px-3 font-semibold text-slate-300">Surge Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {data.records.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 text-slate-300">{r.date}</td>
                      <td className="py-2.5 px-3 font-sans font-semibold text-white">{r.category}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">{r.units_sold}</td>
                      <td className="py-2.5 px-3 text-slate-300">${r.unit_price}</td>
                      <td className="py-2.5 px-3 text-indigo-300">{(r.discount_pct * 100).toFixed(0)}%</td>
                      <td className="py-2.5 px-3 text-slate-200">${Number(r.revenue).toLocaleString()}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans ${r.is_promotion ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-slate-500'}`}>
                          {r.is_promotion ? 'YES' : 'NO'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans ${r.is_holiday ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-500'}`}>
                          {r.is_holiday ? 'HOLIDAY' : 'REG'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-400">{r.day_name}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans ${r.high_demand_surge ? 'bg-rose-500/20 text-rose-300 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                          {r.high_demand_surge ? 'SURGE (1)' : 'NORMAL (0)'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                Showing Page <span className="font-bold text-white">{data.page}</span> of <span className="font-bold text-white">{data.total_pages}</span> ({data.total} records total)
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => setPage(Math.min(data.total_pages, page + 1))}
                  disabled={page === data.total_pages}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
