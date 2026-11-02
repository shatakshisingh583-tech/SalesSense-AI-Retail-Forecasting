import React from 'react'
import {
  TrendingUp,
  BarChart3,
  Sparkles,
  GitCompare,
  Sliders,
  Database,
  Activity,
  Github,
  ShieldAlert
} from 'lucide-react'

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: TrendingUp },
    { id: 'eda', label: 'EDA & Outlier Lab', icon: BarChart3 },
    { id: 'forecasting', label: 'Forecasting Studio', icon: Sparkles },
    { id: 'models', label: 'Model Arena', icon: GitCompare },
    { id: 'classifier', label: 'Surge Classifier', icon: ShieldAlert },
    { id: 'whatif', label: 'What-If Simulator', icon: Sliders },
    { id: 'dataset', label: 'Dataset Explorer', icon: Database }
  ]

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and System Status */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">SalesSense<span className="text-emerald-400">.AI</span></span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">v2.0 Production</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Retail Demand & Revenue Intelligence</p>
            </div>
          </div>

          {/* GitHub link and Engine Status */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Operational • Multi-Store Engine</span>
            </div>
            <a
              href="https://github.com/shatakshisingh583-tech/SalesSense-AI-Retail-Forecasting"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all duration-200"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
