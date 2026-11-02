import React, { useState, useEffect } from 'react'
import {
  ShieldAlert,
  Target,
  Percent,
  TrendingUp,
  Activity,
  Layers,
  HelpCircle,
  RefreshCw
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function ClassificationRisk() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/classification')
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching classification:', err)
        setLoading(false)
      })
  }, [])

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm">Evaluating Logistic Regression classification boundaries and ROC curve...</p>
      </div>
    )
  }

  const { accuracy, precision, recall, f1_score, auc_roc, confusion_matrix: cm, roc_curve, feature_odds_ratios } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
            Logistic Regression & Classification Diagnostics
          </span>
        </div>
        <h1 className="text-xl font-bold text-white mt-1">High-Demand Surge & Stockout Risk Classifier</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Binary classification utilizing Logistic Regression Log-Odds coefficients to predict high-volume demand spikes and mitigate warehouse stockouts.
        </p>
      </div>

      {/* 5 Core Classification Evaluation Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs font-medium text-slate-400">Accuracy</span>
          <p className="text-xl font-bold text-white mt-1">{(accuracy * 100).toFixed(1)}%</p>
          <p className="text-[10px] text-slate-500 mt-1">Overall correct class rate</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs font-medium text-slate-400">Precision</span>
          <p className="text-xl font-bold text-emerald-400 mt-1">{(precision * 100).toFixed(1)}%</p>
          <p className="text-[10px] text-slate-500 mt-1">TP / (TP + FP)</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs font-medium text-slate-400">Recall / Sensitivity</span>
          <p className="text-xl font-bold text-indigo-400 mt-1">{(recall * 100).toFixed(1)}%</p>
          <p className="text-[10px] text-slate-500 mt-1">TP / (TP + FN)</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs font-medium text-slate-400">F1-Score (Harmonic Mean)</span>
          <p className="text-xl font-bold text-amber-400 mt-1">{f1_score}</p>
          <p className="text-[10px] text-slate-500 mt-1">Harmonic mean of P & R</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl col-span-2 sm:col-span-1">
          <span className="text-xs font-medium text-slate-400">AUC-ROC (Discrimination Index)</span>
          <p className="text-xl font-bold text-purple-400 mt-1">{auc_roc}</p>
          <p className="text-[10px] text-slate-500 mt-1">Discriminative power index</p>
        </div>
      </div>

      {/* Confusion Matrix and ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2x2 Confusion Matrix */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white">2×2 Confusion Matrix</h3>
              <span className="text-xs text-slate-400">Total Test Samples: {cm.tn + cm.fp + cm.fn + cm.tp}</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Breakdown of ground truth vs predicted demand classifications.</p>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto my-2">
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl text-center">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase">True Negative (TN)</span>
                <p className="text-2xl font-bold text-white mt-1">{cm.tn}</p>
                <p className="text-[10px] text-slate-400 mt-1">Correct Normal Demand</p>
              </div>
              <div className="bg-rose-950/30 border border-rose-500/30 p-4 rounded-xl text-center">
                <span className="text-[11px] font-semibold text-rose-400 uppercase">False Positive (FP)</span>
                <p className="text-2xl font-bold text-white mt-1">{cm.fp}</p>
                <p className="text-[10px] text-slate-400 mt-1">Type I False Alarm</p>
              </div>
              <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-xl text-center">
                <span className="text-[11px] font-semibold text-amber-400 uppercase">False Negative (FN)</span>
                <p className="text-2xl font-bold text-white mt-1">{cm.fn}</p>
                <p className="text-[10px] text-slate-400 mt-1">Type II Missed Surge (Stockout Risk)</p>
              </div>
              <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-xl text-center">
                <span className="text-[11px] font-semibold text-indigo-400 uppercase">True Positive (TP)</span>
                <p className="text-2xl font-bold text-white mt-1">{cm.tp}</p>
                <p className="text-[10px] text-slate-400 mt-1">Correct High Surge Predicted</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 mt-4">
            <span className="font-semibold text-amber-300">Operational Risk Note:</span> Type II errors (FN) carry a direct revenue penalty by causing inventory stockouts during unexpected promotion spikes.
          </div>
        </div>

        {/* ROC-AUC Curve */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white">Receiver Operating Characteristic (ROC Curve)</h3>
            <span className="text-xs px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full font-bold">
              AUC = {auc_roc}
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">True Positive Rate (Sensitivity) vs False Positive Rate (1 - Specificity) across decision thresholds.</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roc_curve} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="fpr" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'False Positive Rate (FPR)', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="tpr" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'True Positive Rate (TPR)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Line type="monotone" dataKey="tpr" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 2 }} name="Logistic Classifier" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Logistic Regression Coefficient Estimation & Odds Ratios */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Logistic Regression Coefficient Estimation (&beta;) & Odds Ratios (e<sup>&beta;</sup>)
            </h3>
            <p className="text-xs text-slate-400">
              Inference of regression coefficients and odds ratios for binary class surge prediction.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3 font-semibold text-slate-400">Predictor Variable</th>
                <th className="py-2.5 px-3 font-semibold text-slate-300">Coefficient (&beta;)</th>
                <th className="py-2.5 px-3 font-semibold text-slate-300">Odds Ratio (e<sup>&beta;</sup>)</th>
                <th className="py-2.5 px-3 font-semibold text-slate-400">Statistical Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {feature_odds_ratios.map((item) => (
                <tr key={item.feature} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-medium text-slate-200">{item.feature}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-indigo-400">{item.coefficient > 0 ? `+${item.coefficient}` : item.coefficient}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{item.odds_ratio}x</td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {item.odds_ratio > 1.0
                      ? `Increases the odds of high demand surge by ${((item.odds_ratio - 1) * 100).toFixed(0)}%`
                      : `Decreases the odds of high demand surge by ${((1 - item.odds_ratio) * 100).toFixed(0)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
