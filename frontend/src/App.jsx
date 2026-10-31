import React, { useState } from 'react'
import Navbar from './components/Navbar'
import ExecutiveDashboard from './components/ExecutiveDashboard'
import EdaLab from './components/EdaLab'
import ForecastingStudio from './components/ForecastingStudio'
import ModelComparison from './components/ModelComparison'
import ClassificationRisk from './components/ClassificationRisk'
import WhatIfSimulator from './components/WhatIfSimulator'
import DatasetExplorer from './components/DatasetExplorer'
import AcademicSyllabusViva from './components/AcademicSyllabusViva'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <ExecutiveDashboard onNavigate={setActiveTab} />}
        {activeTab === 'eda' && <EdaLab />}
        {activeTab === 'forecasting' && <ForecastingStudio />}
        {activeTab === 'models' && <ModelComparison />}
        {activeTab === 'classifier' && <ClassificationRisk />}
        {activeTab === 'whatif' && <WhatIfSimulator />}
        {activeTab === 'dataset' && <DatasetExplorer />}
        {activeTab === 'syllabus' && <AcademicSyllabusViva />}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white">SalesSense AI</span> • Retail Demand Forecasting & Predictive Analytics Platform
            <p className="text-slate-500 mt-0.5">Department of Computer Science & Engineering • Manipal University Jaipur (MUJ)</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-500">Course Code: CSE3141</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span className="text-emerald-400 font-medium">B.Tech CSE V Semester</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <a
              href="https://github.com/shatakshisingh583-tech/SalesSense-AI-Retail-Forecasting"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
