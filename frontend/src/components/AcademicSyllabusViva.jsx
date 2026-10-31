import React from 'react'
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  Code2,
  Cpu
} from 'lucide-react'

export default function AcademicSyllabusViva() {
  const syllabusUnits = [
    {
      unit: 'Unit 1: Introduction & Scope',
      topics: 'Predictive vs Descriptive vs Prescriptive Analytics, Role of predictive analytics in retail marketing, Ethics & inventory planning.',
      implemented: 'Prescriptive What-If pricing engine, stockout risk bounds, and executive KPIs.'
    },
    {
      unit: 'Unit 2: Data Preparation & EDA',
      topics: 'Data Cleaning, Outliers (IQR, Box Plot), EDA (Mean, Median, Mode, Variance, Std Dev, Z-Score), Visualizations (Histogram, Heatmap, Bar chart).',
      implemented: 'EDA & Outlier Lab calculates IQR [Q1 - 1.5×IQR, Q3 + 1.5×IQR], |Z| > 3.0 outlier counts, 15-bin histograms, and Pearson correlation matrix.'
    },
    {
      unit: 'Unit 3: Logistic Regression & Inference',
      topics: 'Logistic regression for binary classification, estimation of coefficients (Log-odds, Odds Ratio), discriminant analysis concepts.',
      implemented: 'High-Demand Surge Classifier using Logistic Regression. Displays exact beta coefficients, odds ratios (e^beta), confusion matrix, and ROC-AUC curve.'
    },
    {
      unit: 'Unit 4: Time Series Analysis',
      topics: 'Trends, Seasonality, Noise decomposition, ARIMA, SARIMA, Exponential Smoothing, Demand Prediction.',
      implemented: 'Additive time series decomposition (Y = T + S + R), SARIMA(1,1,1)(1,1,0)[7] model, and Holt-Winters Exponential Smoothing with 95% Confidence Intervals.'
    },
    {
      unit: 'Unit 5: Model Validation & Optimization',
      topics: 'Cross-validation, chronological train-test splits, RMSE, MAE, F1-Score, AUC-ROC, hyperparameter tuning, overfitting vs underfitting.',
      implemented: 'Strict chronological 80/20 train/test split (no data leakage), comparative leaderboard table evaluating MAE, RMSE, MAPE, R², and F1-score.'
    }
  ]

  const vivaQuestions = [
    {
      q: 'Why did you use a chronological train-test split instead of standard random train_test_split?',
      a: 'Time-series sales observations exhibit strong temporal dependencies (autocorrelation, trend, and seasonality). A random split introduces future information into the past (data leakage/lookahead bias), resulting in artificially inflated accuracy that fails in real-world forward testing. A chronological split ensures models are evaluated solely on unseen future dates.'
    },
    {
      q: 'Explain the parameters in SARIMA(p, d, q)(P, D, Q)[s] used in your project.',
      a: 'We configured SARIMA(1, 1, 1)(1, 1, 0)[7]:\n• Non-seasonal: p=1 (1 autoregressive lag), d=1 (first-order differencing to achieve mean-stationarity), q=1 (1 moving-average error lag).\n• Seasonal: P=1 (seasonal AR lag), D=1 (seasonal differencing for weekly cycles), Q=0 (seasonal MA lag), with seasonal period s=7 (7 days per weekly retail cycle).'
    },
    {
      q: 'How did you detect outliers in your retail dataset?',
      a: 'We implemented Tukey\'s Interquartile Range (IQR) technique and Standard Z-Scores. For each department, we computed Q1 (25th percentile) and Q3 (75th percentile). Any daily volume outside [Q1 - 1.5×IQR, Q3 + 1.5×IQR] or having |Z| = |(X - μ) / σ| > 3.0 is flagged as an outlier for festive promotional demand spikes.'
    },
    {
      q: 'What is the mathematical difference between MAE and RMSE in your evaluation metrics?',
      a: 'MAE = (1/n) * Σ |y_i - ŷ_i|, measuring average linear magnitude of error without penalizing extremes.\nRMSE = sqrt((1/n) * Σ (y_i - ŷ_i)²), which squares the errors prior to averaging, thus assigning higher penalty to large forecasting errors. In retail supply chain, high RMSE indicates dangerous stockout or overstock risks.'
    },
    {
      q: 'How does your Logistic Regression model predict demand surges?',
      a: 'The model estimates the probability P(Y=1) of a high-demand surge using the sigmoid function: P = 1 / (1 + e^-(β0 + β1*Price + β2*Discount + β3*Promo + ...)). The estimated coefficients (β) reflect the change in log-odds, and e^β gives the odds ratio—for instance, running a marketing promotion increases the odds of a surge by over 3.2x.'
    },
    {
      q: 'How did you prevent overfitting in your machine learning models?',
      a: 'For Random Forest, we restricted maximum tree depth (max_depth=12) and ensemble bagging across 100 trees to control model variance. For SARIMA, we applied differencing (d=1) and monitored Akaike Information Criterion (AIC) to penalize excessive parameter complexity.'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
            Manipal University Jaipur • Department of Computer Science & Engineering
          </span>
        </div>
        <h1 className="text-xl font-bold text-white mt-1">CSE3141 Predictive Analytics Mini Project Guide</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Comprehensive curriculum mapping, mathematical formulations, and viva defense reference cards for 15/15 assessment marks.
        </p>
      </div>

      {/* Syllabus Unit Mapping Cards */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span>Curriculum Mapping Matrix (Course Handout Units 1 to 5)</span>
        </h2>
        <div className="space-y-3">
          {syllabusUnits.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{item.unit}</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-medium">
                  Verified Implementation
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1"><span className="text-slate-300 font-semibold">Handout Topics:</span> {item.topics}</p>
              <div className="mt-2 text-xs text-indigo-300 bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-900/40">
                <span className="font-semibold text-indigo-200">How SalesSense AI Implements It:</span> {item.implemented}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mathematical Formulations Section */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <h2 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-emerald-400" />
          <span>Core Mathematical Formulations Used in Project</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-indigo-400 font-bold block mb-1">Additive Time Series Decomposition:</span>
            <code className="text-emerald-300 text-sm">Y(t) = Trend(t) + Seasonal(t) + Residual(t)</code>
            <p className="text-slate-400 font-sans mt-2 text-[11px]">Period s = 7 days captures recurring weekly shopping cycles.</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-indigo-400 font-bold block mb-1">Tukey's IQR Outlier Detection:</span>
            <code className="text-emerald-300 text-sm">IQR = Q3 - Q1; Fences = [Q1 - 1.5*IQR, Q3 + 1.5*IQR]</code>
            <p className="text-slate-400 font-sans mt-2 text-[11px]">Identifies non-standard holiday and promotional demand surges.</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-indigo-400 font-bold block mb-1">Logistic Regression Hypothesis (Sigmoid):</span>
            <code className="text-emerald-300 text-sm">P(Y=1|X) = 1 / (1 + exp(-(β0 + β1*X1 + ... + βk*Xk)))</code>
            <p className="text-slate-400 font-sans mt-2 text-[11px]">Models high-demand surge probability for stockout management.</p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-indigo-400 font-bold block mb-1">Root Mean Squared Error (RMSE):</span>
            <code className="text-emerald-300 text-sm">RMSE = sqrt( (1/N) * Σ (Actual_i - Predicted_i)^2 )</code>
            <p className="text-slate-400 font-sans mt-2 text-[11px]">Primary error metric penalizing large demand forecasting errors.</p>
          </div>
        </div>
      </div>

      {/* Top 6 Expected Viva Questions and Defended Answers */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>Top Expected Viva Defense Questions & Expert Answers</span>
        </h2>
        <div className="space-y-3">
          {vivaQuestions.map((v, i) => (
            <div key={i} className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="font-bold text-white text-sm block mb-1">Q{i + 1}: {v.q}</span>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line mt-2 pl-3 border-l-2 border-emerald-500/60 font-sans">
                {v.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
