import React, { useState, useEffect } from 'react'
import {
  Sliders,
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw
} from 'lucide-react'

export default function WhatIfSimulator() {
  const [category, setCategory] = useState('Grocery')
  const [unitPrice, setUnitPrice] = useState(15)
  const [discountPct, setDiscountPct] = useState(0.10)
  const [isPromotion, setIsPromotion] = useState(1)
  const [isHoliday, setIsHoliday] = useState(0)
  const [marketingSpend, setMarketingSpend] = useState(1200)
  const [dayOfWeek, setDayOfWeek] = useState(5) // Saturday

  const [simResult, setSimResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // Update default price when category changes
  const handleCategoryChange = (cat) => {
    setCategory(cat)
    if (cat === 'Grocery') setUnitPrice(15)
    else if (cat === 'Electronics') setUnitPrice(220)
    else if (cat === 'Apparel') setUnitPrice(45)
    else if (cat === 'Home & Kitchen') setUnitPrice(65)
  }

  const runSimulation = () => {
    setLoading(true)
    fetch('/api/whatif', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        unit_price: unitPrice,
        discount_pct: discountPct,
        is_promotion: isPromotion,
        is_holiday: isHoliday,
        marketing_spend: marketingSpend,
        day_of_week: dayOfWeek
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setSimResult(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Simulation error:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    runSimulation()
  }, [category, unitPrice, discountPct, isPromotion, isHoliday, marketingSpend, dayOfWeek])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
            Prescriptive & What-If Analytics
          </span>
        </div>
        <h1 className="text-xl font-bold text-white mt-1">Interactive Price Elasticity & Promotion Simulator</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Simulate changes to price discounts, promotional campaigns, and calendar events to forecast instantaneous demand shifts and revenue impacts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Simulation Inputs</h2>

          {/* Department Choice */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Target Department</label>
            <div className="grid grid-cols-2 gap-2">
              {['Grocery', 'Electronics', 'Apparel', 'Home & Kitchen'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition ${
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

          {/* Unit Price Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-400">Base Unit Price</span>
              <span className="font-mono text-emerald-400 font-bold">${unitPrice}</span>
            </div>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Discount Percentage */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-400">Discount Offered</span>
              <span className="font-mono text-indigo-400 font-bold">{(discountPct * 100).toFixed(0)}% OFF</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.50"
              step="0.05"
              value={discountPct}
              onChange={(e) => setDiscountPct(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Marketing Spend */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-400">Marketing & Ad Campaign</span>
              <span className="font-mono text-purple-400 font-bold">${marketingSpend}</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={marketingSpend}
              onChange={(e) => setMarketingSpend(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          {/* Day of Week */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Simulated Day of Week</label>
            <div className="grid grid-cols-7 gap-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setDayOfWeek(idx)}
                  className={`py-2 rounded-lg text-xs font-bold border transition ${
                    dayOfWeek === idx
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setIsPromotion(isPromotion === 1 ? 0 : 1)}
              className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                isPromotion === 1
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              Promotion Event: {isPromotion === 1 ? 'ACTIVE' : 'OFF'}
            </button>
            <button
              onClick={() => setIsHoliday(isHoliday === 1 ? 0 : 1)}
              className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                isHoliday === 1
                  ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              Public Holiday: {isHoliday === 1 ? 'YES' : 'NO'}
            </button>
          </div>
        </div>

        {/* Live Simulation Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {loading || !simResult ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-slate-400 text-sm">Evaluating Random Forest inference...</p>
            </div>
          ) : (
            <>
              {/* Output Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Simulated Demand Volume</span>
                  <p className="text-3xl font-extrabold text-white mt-1">
                    {simResult.simulation_output.predicted_units} <span className="text-sm font-normal text-slate-400">units</span>
                  </p>
                  <div className="mt-2 text-xs">
                    <span className="text-slate-400">Baseline (No Discount): </span>
                    <span className="text-slate-300 font-mono">{simResult.simulation_output.baseline_units} units</span>
                  </div>
                  <div className={`mt-2 inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                    simResult.simulation_output.units_lift_pct >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    <span>Demand Shift: {simResult.simulation_output.units_lift_pct > 0 ? `+${simResult.simulation_output.units_lift_pct}` : simResult.simulation_output.units_lift_pct}%</span>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Simulated Gross Revenue</span>
                  <p className="text-3xl font-extrabold text-emerald-400 mt-1">
                    ${simResult.simulation_output.predicted_revenue.toLocaleString()}
                  </p>
                  <div className="mt-2 text-xs">
                    <span className="text-slate-400">Baseline Revenue: </span>
                    <span className="text-slate-300 font-mono">${simResult.simulation_output.baseline_revenue.toLocaleString()}</span>
                  </div>
                  <div className={`mt-2 inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                    simResult.simulation_output.revenue_lift_pct >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    <span>Revenue Shift: {simResult.simulation_output.revenue_lift_pct > 0 ? `+${simResult.simulation_output.revenue_lift_pct}` : simResult.simulation_output.revenue_lift_pct}%</span>
                  </div>
                </div>
              </div>

              {/* Stockout Risk Indicator Card */}
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={`w-5 h-5 ${
                      simResult.simulation_output.stockout_risk === 'High' ? 'text-rose-400' : (simResult.simulation_output.stockout_risk === 'Moderate' ? 'text-amber-400' : 'text-emerald-400')
                    }`} />
                    <h3 className="text-base font-bold text-white">Stockout & Surge Probability</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    simResult.simulation_output.stockout_risk === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : (simResult.simulation_output.stockout_risk === 'Moderate' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40')
                  }`}>
                    {simResult.simulation_output.stockout_risk} Risk
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Estimated Spike Probability</span>
                      <span className="font-mono font-bold text-white">{(simResult.simulation_output.demand_surge_probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-300 ${
                          simResult.simulation_output.stockout_risk === 'High' ? 'bg-rose-500' : (simResult.simulation_output.stockout_risk === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500')
                        }`}
                        style={{ width: `${simResult.simulation_output.demand_surge_probability * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2">
                    {simResult.simulation_output.stockout_risk === 'High'
                      ? '⚠️ Warning: Heavy promotional discount combined with marketing ad push creates a high probability of depleting inventory. Recommend increasing warehouse safety stock by at least 30%.'
                      : '✅ Inventory safe: Expected daily demand remains comfortably within normal warehouse buffer boundaries.'}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
