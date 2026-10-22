'use client'

import { useState } from 'react'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'

/**
 * Interactive two-tab audience selector from the Stitch mockup — switches
 * between the "Canadians Travelling" and "Visitors to Canada" views.
 * Mandatory sub-caption kept verbatim beneath each quote button.
 */
export default function AudienceSelector() {
  const [tab, setTab] = useState<'canadians' | 'visitors'>('canadians')

  const tabBase =
    'py-2 px-4 rounded-md font-semibold text-sm transition-all flex items-center justify-center gap-2'
  const tabActive = `${tabBase} text-white bg-[#131b2e] shadow`
  const tabInactive = `${tabBase} text-[#45464d] hover:text-[#0b1c30]`

  return (
    <div className="w-full bg-[#e5eeff] rounded-xl p-4 shadow-sm">
      {/* Toggle buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-[#d3e4fe] p-1 rounded-lg max-w-xl mx-auto mb-6">
        <button
          type="button"
          onClick={() => setTab('canadians')}
          className={tab === 'canadians' ? tabActive : tabInactive}
          aria-pressed={tab === 'canadians'}
        >
          <span>🇨🇦 Canadians Travelling</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('visitors')}
          className={tab === 'visitors' ? tabActive : tabInactive}
          aria-pressed={tab === 'visitors'}
        >
          <span>🌎 Visitors to Canada</span>
        </button>
      </div>

      {/* Canadians Travelling panel */}
      {tab === 'canadians' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-2">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#d3e4fe] text-xs font-semibold uppercase tracking-wider text-[#0b1c30]">
              <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">warning</span>
              <span>The Provincial Health Insurance Gap</span>
            </div>
            <h3 className="text-2xl md:text-[26px] font-bold tracking-tight text-[#0b1c30]">
              Why Canadian Airport Lounge Visitors Need Private Emergency Coverage
            </h3>
            <p className="text-[15px] leading-relaxed text-[#45464d]">
              Many executive travellers mistakenly assume that their provincial healthcare follows them globally or pays for high private medical rates in the United States and abroad. In reality, provincial plans pay less than 10% of out-of-country emergency medical bills, leaving you vulnerable to thousands of dollars in emergency hospital fees, ambulance charges, and physician costs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded bg-white shadow-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[#904d00] text-[20px] mt-0.5">flight_takeoff</span>
                <div>
                  <strong className="text-[15px] font-semibold text-[#0b1c30] block">Cross-Border Protection</strong>
                  <span className="text-[13px] text-[#45464d]">Up to $10,000,000 CAD emergency medical coverage for hospital visits (subject to policy terms).</span>
                </div>
              </div>
              <div className="p-2 rounded bg-white shadow-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[#904d00] text-[20px] mt-0.5">local_hospital</span>
                <div>
                  <strong className="text-[15px] font-semibold text-[#0b1c30] block">Interprovincial Safety</strong>
                  <span className="text-[13px] text-[#45464d]">Ground/air ambulance and prescription refills not covered across provinces.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-white shadow-md flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-bold text-[#904d00] uppercase tracking-wider">Fast Facts</span>
              <h4 className="text-xl font-semibold text-[#0b1c30] mt-1 mb-2">Average US Hospital Day</h4>
              <div className="text-[38px] font-extrabold leading-tight tracking-tight text-[#ba1a1a]">$15,000+ CAD</div>
              <p className="text-[13px] text-[#45464d] mt-1">
                Typical intensive care stays in Florida, California, or New York routinely exceed six figures without comprehensive insurer backing (per industry reports).
              </p>
            </div>
            <a
              href={affiliate('tugo-travel-insurance')}
              target="_blank"
              rel={AFFILIATE_REL}
              className="mt-4 w-full py-2 bg-[#131b2e] text-white text-center font-semibold text-sm rounded hover:bg-[#213145] transition-colors"
            >
              Calculate Canadian Quote →
            </a>
          </div>
        </div>
      )}

      {/* Visitors to Canada panel */}
      {tab === 'visitors' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-2">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#d3e4fe] text-xs font-semibold uppercase tracking-wider text-[#0b1c30]">
              <span className="material-symbols-outlined text-[16px] text-[#904d00]">public</span>
              <span>Welcome International Guests</span>
            </div>
            <h3 className="text-2xl md:text-[26px] font-bold tracking-tight text-[#0b1c30]">
              Visiting Family or Arriving on a Super Visa / Work Permit?
            </h3>
            <p className="text-[15px] leading-relaxed text-[#45464d]">
              Canada does not provide free medical care for international visitors, arriving parents, or individuals awaiting provincial healthcare eligibility. Canadian hospital emergency fees for non-residents can easily exceed $3,000 per single day without TuGo® protection.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded bg-white shadow-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[#904d00] text-[20px] mt-0.5">family_restroom</span>
                <div>
                  <strong className="text-[15px] font-semibold text-[#0b1c30] block">Super Visa Compliant</strong>
                  <span className="text-[13px] text-[#45464d]">Meets official Government of Canada Super Visa medical requirements.</span>
                </div>
              </div>
              <div className="p-2 rounded bg-white shadow-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[#904d00] text-[20px] mt-0.5">work</span>
                <div>
                  <strong className="text-[15px] font-semibold text-[#0b1c30] block">IEC &amp; Work Permits</strong>
                  <span className="text-[13px] text-[#45464d]">Mandatory proof of emergency medical cover for international youth.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-white shadow-md flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-bold text-[#904d00] uppercase tracking-wider">Super Visa Standard</span>
              <h4 className="text-xl font-semibold text-[#0b1c30] mt-1 mb-2">TuGo Coverage Options</h4>
              <div className="text-[38px] font-extrabold leading-tight tracking-tight text-[#131b2e]">$100k – $300k+</div>
              <p className="text-[13px] text-[#45464d] mt-1">
                Flexible deductible options, coverage for stable pre-existing conditions, and full refund policies if visas are denied (subject to policy terms).
              </p>
            </div>
            <a
              href={affiliate('tugo-travel-insurance')}
              target="_blank"
              rel={AFFILIATE_REL}
              className="mt-4 w-full py-2 bg-[#131b2e] text-white text-center font-semibold text-sm rounded hover:bg-[#213145] transition-colors"
            >
              Calculate Visitor Quote →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
