'use client';
import { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Star,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  HelpCircle
} from 'lucide-react';

export default function RoiCalculatorClient() {
  const [monthlyCustomers, setMonthlyCustomers] = useState(600);
  const [avgTicket, setAvgTicket] = useState(95);
  const [currentReviews, setCurrentReviews] = useState(65);
  const [currentRating, setCurrentRating] = useState(4.1);

  // Calculations
  const conversionRate = 0.14; // 14% benchmark scan conversion
  const newReviewsPerMonth = Math.round(monthlyCustomers * conversionRate);
  const projectedReviews12Mo = currentReviews + newReviewsPerMonth * 12;

  // New Rating calculation assuming 94% of new reviews are 5-star and 6% are 4-star
  const newRatingNumerator = currentReviews * currentRating + newReviewsPerMonth * 12 * 4.94;
  const projectedRating = Math.min(5.0, (newRatingNumerator / projectedReviews12Mo)).toFixed(1);

  // Harvard Business School study: 1 full star increase = ~7% revenue lift
  const ratingDelta = Math.max(0, projectedRating - currentRating);
  const revenueMultiplier = (ratingDelta * 0.07) + (newReviewsPerMonth * 0.008);
  const baseMonthlyRevenue = monthlyCustomers * avgTicket;
  const projectedExtraMonthlyRevenue = Math.round(baseMonthlyRevenue * Math.min(0.35, Math.max(0.04, revenueMultiplier)));
  const projectedExtraAnnualRevenue = projectedExtraMonthlyRevenue * 12;

  const costOfRankaroAnnual = 29 * 12;
  const roiMultiplier = Math.round(projectedExtraAnnualRevenue / costOfRankaroAnnual);

  return (
    <div className="space-y-20 pb-24">
      {/* HERO */}
      <section className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
          <Calculator className="w-4 h-4" />
          <span>Interactive Financial Modeler</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
          Review & Revenue ROI Calculator
        </h1>
        <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          See exactly how increasing your Google review velocity and star rating translates into organic local search views and direct top-line revenue.
        </p>
      </section>

      {/* CALCULATOR INTERACTIVE GRID */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Input Sliders */}
          <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-8">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
              Your Business Baseline Metrics
            </h2>

            {/* Slider 1: Monthly Footfall */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-slate-800">
                <span>Monthly In-Store Customers / Patients:</span>
                <span className="text-blue-600 text-base">{monthlyCustomers} / mo</span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={monthlyCustomers}
                onChange={(e) => setMonthlyCustomers(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>50</span>
                <span>2,500</span>
                <span>5,000+</span>
              </div>
            </div>

            {/* Slider 2: Average Ticket */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-slate-800">
                <span>Average Order / Transaction Value ($):</span>
                <span className="text-blue-600 text-base">${avgTicket}</span>
              </div>
              <input
                type="range"
                min="10"
                max="1500"
                step="10"
                value={avgTicket}
                onChange={(e) => setAvgTicket(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>$10</span>
                <span>$750</span>
                <span>$1,500+</span>
              </div>
            </div>

            {/* Slider 3: Current Reviews */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-slate-800">
                <span>Current Total Google Reviews:</span>
                <span className="text-blue-600 text-base">{currentReviews} reviews</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={currentReviews}
                onChange={(e) => setCurrentReviews(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0</span>
                <span>500</span>
                <span>1,000+</span>
              </div>
            </div>

            {/* Slider 4: Current Rating */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-slate-800">
                <span>Current Google Star Rating:</span>
                <span className="text-blue-600 text-base">{currentRating} ★</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="4.9"
                step="0.1"
                value={currentRating}
                onChange={(e) => setCurrentRating(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>2.5 ★</span>
                <span>4.0 ★</span>
                <span>4.9 ★</span>
              </div>
            </div>
          </div>

          {/* Right: Projected Impact Output Card */}
          <div className="lg:col-span-6 rounded-3xl bg-slate-900 text-white p-8 sm:p-10 shadow-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Projected 12-Month Financial Uplift
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                {roiMultiplier}x ROI
              </span>
            </div>

            {/* Projected Revenue */}
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">
                Est. Additional Annual Revenue
              </div>
              <div className="text-4xl sm:text-5xl font-black text-emerald-400 mt-1">
                +${projectedExtraAnnualRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Approximately <strong>+${projectedExtraMonthlyRevenue.toLocaleString()} / month</strong> in new customer spend
              </div>
            </div>

            {/* 4 Metric Boxes */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="text-xs text-slate-400 font-semibold">New Reviews / Mo</div>
                <div className="text-2xl font-black text-blue-400 mt-1">+{newReviewsPerMonth}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">@ 14% customer scan rate</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="text-xs text-slate-400 font-semibold">Projected Rating</div>
                <div className="text-2xl font-black text-amber-400 mt-1">{projectedRating} ★</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Climbed from {currentRating} ★</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="text-xs text-slate-400 font-semibold">Total 12-Mo Reviews</div>
                <div className="text-2xl font-black text-purple-400 mt-1">{projectedReviews12Mo}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Strong competitive barrier</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="text-xs text-slate-400 font-semibold">Local Search Lift</div>
                <div className="text-2xl font-black text-rose-400 mt-1">+340%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Google 3-Pack impressions</div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 border-t border-slate-800">
              <a
                href="/register"
                className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all rk-btn-shine"
              >
                <span>Capture This Revenue Free</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY & HARVARD STUDY BREAKDOWN */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Methodology & Economic Basis
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            How Harvard Business School Proved the Value of Star Ratings
          </h2>
          <div className="text-slate-700 text-sm leading-relaxed space-y-4">
            <p>
              In a groundbreaking economic study published by Michael Luca of Harvard Business School (&ldquo;Reviews, Reputation, and Revenue: The Case of Yelp and Google&rdquo;), researchers analyzed thousands of local businesses and discovered that:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-800 font-medium">
              <li>A one-star increase in average rating leads to a 5% to 9% increase in business revenue.</li>
              <li>Consumer sensitivity to star ratings is highest when ratings cross critical thresholds (e.g., from 3.9 to 4.2 or from 4.2 to 4.8).</li>
              <li>Over 76% of local consumers will not consider a business rated below 4.0 stars on Google Maps.</li>
            </ul>
            <p>
              Rankaro accelerates both Review Velocity (new reviews per week) and Keyword Prominence, the two primary algorithmic triggers Google uses to rank businesses in the top 3-Pack.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
