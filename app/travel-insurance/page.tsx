import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { affiliate, AFFILIATE_REL } from '@/lib/affiliates'
import AudienceSelector from './AudienceSelector'

/**
 * TuGo travel-insurance affiliate landing page, ported from the Stitch
 * mockup (stitch_airportlounges_tugo_affiliate_page.zip). Every section is
 * preserved from the design per Dan's "Match Design Mockups Faithfully"
 * convention; four verbatim-copy items were softened for legal risk:
 *   - "Official TuGo® Affiliate Partner"  →  "TuGo® Affiliate Partner"
 *   - "AirportLounges.ca Exclusive"       →  removed (we're not exclusive)
 *   - COVID-19 vaccine-specific wording   →  "subject to policy terms"
 *   - "$15,000+ CAD" hospital-day stat    →  qualified with "per industry reports"
 *   - Specific coverage amounts           →  "subject to policy terms" caveat
 *
 * All CTAs route through `affiliate('tugo-travel-insurance')` → the
 * NEXT_PUBLIC_AFF_TUGO env var's Impact.com-tracked deeplink. The required
 * mandatory sub-caption appears below every CTA verbatim.
 *
 * The TuGo customer service phone number 1-855-505-0869 was copied from
 * the Stitch design; Dan should verify it's current before heavy promotion.
 */

const BASE = 'https://www.airportlounges.ca'
const CANONICAL = `${BASE}/travel-insurance`
const HERO_IMAGE = '/blog/yyz-toronto-lounge-hero.png'
const TUGO_PHONE_HREF = 'tel:18555050869'
const TUGO_PHONE_DISPLAY = '1-855-505-0869'

// Mandatory verbatim sub-caption required after every "Get a Quote" CTA on
// an affiliate marketing page. Kept as a shared constant to guarantee the
// exact text appears everywhere a CTA renders.
const MANDATORY_CTA_CAPTION =
  "* By clicking this button, you'll be redirected to TuGo's secure website, where you can get a quote and purchase travel insurance."

export const metadata: Metadata = {
  title:
    'Travel Insurance for Canadian Airport Lounge Travellers | TuGo® Affiliate Partner',
  description:
    "AirportLounges.ca has partnered with TuGo®, one of Canada's leading travel insurance providers for 50+ years, to connect Canadian lounge travellers and visitors to Canada with comprehensive emergency medical, trip cancellation, and visitor coverage. Verified October 2026.",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: 'TuGo® Travel Insurance — AirportLounges.ca Affiliate Partner',
    description:
      "Comprehensive travel insurance for Canadian airport lounge travellers and visitors to Canada. Partnered with TuGo®, one of Canada's leading travel insurance providers for 50+ years.",
    url: CANONICAL,
    images: [{ url: HERO_IMAGE, width: 1200, height: 630, alt: 'Comprehensive travel insurance for Canadian travellers' }],
  },
}

export const revalidate = 86400 // Daily revalidate; content rarely changes

/**
 * Reusable Get-a-Quote button + mandatory sub-caption. Routes through the
 * central affiliate() dispatcher so the Impact.com-tracked URL is applied
 * once the NEXT_PUBLIC_AFF_TUGO env var is set.
 */
function GetAQuoteButton({ label = 'Get a Quote' }: { label?: string }) {
  return (
    <>
      <a
        href={affiliate('tugo-travel-insurance')}
        target="_blank"
        rel={AFFILIATE_REL}
        className="w-full py-3 px-4 bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold text-sm rounded flex items-center justify-center gap-2 transition-colors shadow"
      >
        <span>{label}</span>
        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
      </a>
      <p className="text-[12px] leading-[18px] text-[#76777d] text-center mt-2">
        {MANDATORY_CTA_CAPTION}
      </p>
    </>
  )
}

export default function TravelInsurancePage() {
  return (
    <div className="w-full bg-[#f8f9ff] text-[#0b1c30]">

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative w-full overflow-hidden bg-[#131b2e] text-white">
        {/* Ambient blurred glow accents matching the Stitch design */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#fe932c]/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#d3e4fe]/10 blur-[100px] pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-4 lg:px-8 py-12 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">

            {/* LEFT COLUMN — copy & trust signals */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md shadow-sm">
                <span className="text-base leading-none">🇨🇦</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#ffdcc3]">TuGo® Affiliate Partner</span>
                <span className="material-symbols-outlined text-[#ffdcc3] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>

              <h1 className="text-[36px] lg:text-[56px] font-extrabold tracking-[-0.02em] lg:tracking-[-0.03em] leading-[1.1]">
                Comprehensive Travel Insurance for Seamless Journeys
              </h1>

              <p className="text-[18px] leading-7 text-[#eff4ff] max-w-2xl">
                <strong>AirportLounges.ca</strong> has partnered with <strong>TuGo®</strong>, one of Canada's leading travel insurance providers for over 50 years, to offer our community of lounge members and global travellers reliable, trusted travel protection wherever life takes you.
              </p>

              <p className="text-[15px] leading-6 text-[#d3e4fe] max-w-xl">
                Whether you are unwinding before an international departure or visiting family across Canada, your lounge journey deserves total peace of mind. Flight delays, sudden medical emergencies abroad, and trip cancellations should never derail your experience.
              </p>

              {/* CTA + mandatory sub-caption */}
              <div className="pt-2 flex flex-col gap-1 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <a
                    href={affiliate('tugo-travel-insurance')}
                    target="_blank"
                    rel={AFFILIATE_REL}
                    className="px-10 py-4 bg-[#fe932c] hover:bg-[#904d00] text-white font-semibold text-sm rounded-lg shadow-xl shadow-[#fe932c]/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 text-center"
                  >
                    <span>Get a Quote</span>
                    <span className="material-symbols-outlined text-[18px]">launch</span>
                  </a>
                  <a
                    href="#plans"
                    className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Explore Coverages</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                  </a>
                </div>
                <p className="text-[12px] leading-[18px] text-[#c6c6cd] max-w-lg mt-1">
                  {MANDATORY_CTA_CAPTION}
                </p>
              </div>

              {/* Micro-stats strip */}
              <div className="grid grid-cols-3 gap-4 pt-4 w-full max-w-xl">
                <div className="flex flex-col">
                  <span className="text-[26px] font-bold tracking-[-0.015em] text-[#ffdcc3]">50+ Yrs</span>
                  <span className="text-[13px] text-[#d3e4fe]">Canadian Heritage</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[26px] font-bold tracking-[-0.015em] text-[#ffdcc3]">24/7</span>
                  <span className="text-[13px] text-[#d3e4fe]">Global Assistance</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[26px] font-bold tracking-[-0.015em] text-[#ffdcc3]">100%</span>
                  <span className="text-[13px] text-[#d3e4fe]">Regulated Partner</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — lounge image + glassmorphic overlay */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-[#131b2e]/40">
                <Image
                  src={HERO_IMAGE}
                  alt="Modern executive airport lounge overlooking tarmac at twilight"
                  width={800}
                  height={460}
                  className="w-full h-[460px] object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-white/20 backdrop-blur-xl text-white space-y-1 shadow-lg">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#ffdcc3] text-[20px]">shield</span>
                    <span className="text-sm font-semibold text-white">TuGo® Comprehensive Assurance</span>
                  </div>
                  <ul className="text-[13px] text-[#eff4ff] space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#ffdcc3] text-[16px]">check_circle</span>
                      <span>Direct Medical Billing where available worldwide</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#ffdcc3] text-[16px]">check_circle</span>
                      <span>Immediate travel lounge triage &amp; hospital referrals</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ COMPLIANCE BANNER — mandatory ═══════════ */}
      <section className="w-full bg-[#dce9ff] py-2 px-4 lg:px-8 shadow-sm">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#ffdcc3] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#2f1500] text-[20px]">info</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0b1c30]">
                The following information has been provided by TuGo
              </p>
              <p className="text-[13px] text-[#45464d] max-w-3xl">
                AirportLounges.ca is an authorized marketing affiliate and is not licensed to provide insurance advice or legally sell policies. You can explore policy details and obtain a personalized quote directly through TuGo's secure platform.
              </p>
            </div>
          </div>
          <a
            href={affiliate('tugo-travel-insurance')}
            target="_blank"
            rel={AFFILIATE_REL}
            className="shrink-0 px-4 py-1 bg-[#e5eeff] text-[#0b1c30] hover:bg-[#cbdbf5] rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <span>Verify on TuGo</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>
      </section>

      {/* ═══════════ AUDIENCE SELECTOR TABS ═══════════ */}
      <section className="w-full max-w-[1240px] mx-auto px-4 lg:px-8 pt-10 pb-6">
        <div className="text-center max-w-2xl mx-auto mb-6 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#904d00]">Tailored Travel Protection</span>
          <h2 className="text-[28px] lg:text-[38px] font-bold tracking-[-0.02em] text-[#0b1c30]">
            Choose Your Travel Profile
          </h2>
          <p className="text-[15px] text-[#45464d]">
            Provincial health cards (OHIP, MSP, AHCIP, RAMQ) do not guarantee full coverage beyond your home province or outside Canada. Select your profile to understand your gap risks.
          </p>
        </div>
        <AudienceSelector />
      </section>

      {/* ═══════════ 4-CARD PRODUCT GRID ═══════════ */}
      <section id="plans" className="w-full max-w-[1240px] mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#904d00]">TuGo® Policy Suites</span>
            <h2 className="text-[28px] lg:text-[38px] font-bold tracking-[-0.02em] text-[#0b1c30]">
              Explore Key Travel Insurance Plans
            </h2>
          </div>
          <p className="text-[15px] text-[#45464d] max-w-md">
            Designed for maximum flexibility. Select any plan below to be connected directly to TuGo's official secure quote calculator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* CARD 1 — Emergency Medical */}
          <div className="bg-white rounded-xl p-6 shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#131b2e]" />
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#0b1c30]">
                <span className="material-symbols-outlined text-[26px]">medical_services</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#0b1c30]">Emergency Medical Insurance</h3>
                <span className="text-[11px] font-bold text-[#904d00] uppercase tracking-wider">Essential Protection</span>
              </div>
              <p className="text-[13px] text-[#45464d]">
                Essential protection covering hospital stays, doctor visits, diagnostic tests, and emergency medical transport. COVID-19 coverage subject to policy terms.
              </p>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2 text-[13px] text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[16px] text-[#904d00]">check</span>
                  <span>Up to $10M CAD Maximum (subject to policy terms)</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[16px] text-[#904d00]">check</span>
                  <span>24/7 Global Doctor Triage</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[16px] text-[#904d00]">check</span>
                  <span>Ambulance &amp; Paramedic Fees</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-2">
              <GetAQuoteButton />
            </div>
          </div>

          {/* CARD 2 — All Inclusive Holiday (Most Popular) */}
          <div className="bg-white rounded-xl p-6 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#904d00]" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-[#ffdcc3] flex items-center justify-center text-[#2f1500]">
                  <span className="material-symbols-outlined text-[26px]">all_inclusive</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#ffdcc3] text-[#2f1500] text-[11px] font-bold uppercase tracking-wide">Most Popular</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#0b1c30]">All Inclusive Holiday Package</h3>
                <span className="text-[11px] font-bold text-[#904d00] uppercase tracking-wider">Total Travel Shield</span>
              </div>
              <p className="text-[13px] text-[#45464d]">
                The complete package combining Emergency Medical, Trip Cancellation &amp; Interruption, Baggage Loss &amp; Delay, and Accidental Death &amp; Dismemberment benefits.
              </p>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2 text-[13px] text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[16px] text-[#904d00]">check</span>
                  <span>All-In-One Single Purchase</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[16px] text-[#904d00]">check</span>
                  <span>Lost &amp; Delayed Baggage Reimbursement</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[16px] text-[#904d00]">check</span>
                  <span>Prepaid Lounge &amp; Ticket Cover</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-2">
              <GetAQuoteButton />
            </div>
          </div>

          {/* CARD 3 — Visitors to Canada */}
          <div className="bg-white rounded-xl p-6 shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#131b2e]" />
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#0b1c30]">
                <span className="material-symbols-outlined text-[26px]">flight_land</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#0b1c30]">Visitors to Canada Insurance</h3>
                <span className="text-[11px] font-bold text-[#904d00] uppercase tracking-wider">Tourists &amp; Family</span>
              </div>
              <p className="text-[13px] text-[#45464d]">
                Ideal for visiting family, international tourists, working holiday visa holders (IEC), or new immigrants awaiting Canadian provincial healthcare coverage.
              </p>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2 text-[13px] text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[16px] text-[#904d00]">check</span>
                  <span>Super Visa Eligible ($100k+)</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[16px] text-[#904d00]">check</span>
                  <span>Side-trips to USA included</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[16px] text-[#904d00]">check</span>
                  <span>Pre-existing condition options</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-2">
              <GetAQuoteButton />
            </div>
          </div>

          {/* CARD 4 — Trip Cancellation & Interruption */}
          <div className="bg-white rounded-xl p-6 shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#131b2e]" />
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#0b1c30]">
                <span className="material-symbols-outlined text-[26px]">event_busy</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#0b1c30]">Trip Cancellation &amp; Interruption</h3>
                <span className="text-[11px] font-bold text-[#904d00] uppercase tracking-wider">Investment Recovery</span>
              </div>
              <p className="text-[13px] text-[#45464d]">
                Safeguard non-refundable flight tickets, prepaid lounge bookings, cruises, and vacation reservations when unexpected illness or events force you to cancel or cut short your trip.
              </p>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2 text-[13px] text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[16px] text-[#904d00]">check</span>
                  <span>Cancel For Covered Reasons</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[16px] text-[#904d00]">check</span>
                  <span>Catch-Up Flight Reimbursement</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[16px] text-[#904d00]">check</span>
                  <span>Meals &amp; Hotel Delay Allowance</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-2">
              <GetAQuoteButton />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CUSTOMER SERVICE CONTACT ═══════════ */}
      <section className="w-full max-w-[1240px] mx-auto px-4 lg:px-8 py-6">
        <div className="bg-[#131b2e] text-white rounded-xl p-6 lg:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-[#ffdcc3]">
              <span className="material-symbols-outlined text-[20px]">headset_mic</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">Licensed Canadian Assistance</span>
            </div>
            <h3 className="text-2xl md:text-[26px] font-bold tracking-[-0.015em]">
              Questions about coverage, eligibility, or policy wording? Contact TuGo's licensed Canadian Customer Service team directly at {TUGO_PHONE_DISPLAY}.
            </h3>
            <p className="text-[15px] text-[#dce9ff]">
              Trained insurance representatives are ready to assist with pre-existing stability inquiries, family endorsements, and plan recommendations before your flight departs.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-[13px] text-[#eff4ff]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#ffdcc3] text-[16px]">schedule</span>
                Mon–Fri 8:00 am – 8:00 pm EST / Sat 9:00 am – 5:00 pm EST
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#ffdcc3] text-[16px]">translate</span>
                English, French, Spanish, Cantonese, Mandarin
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto shrink-0">
            <a
              href={TUGO_PHONE_HREF}
              className="px-10 py-4 bg-[#fe932c] hover:bg-[#904d00] text-white font-bold text-xl rounded-lg flex items-center justify-center gap-1 transition-colors shadow-lg"
            >
              <span className="material-symbols-outlined text-[24px]">call</span>
              <span>{TUGO_PHONE_DISPLAY}</span>
            </a>
            <a
              href="https://www.tugo.com/en/claims/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded text-center transition-colors"
            >
              Access TuGo Claims Support Portal
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="w-full max-w-[1240px] mx-auto px-4 lg:px-8 py-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#904d00]">Frequently Asked Questions</span>
          <h2 className="text-[28px] lg:text-[38px] font-bold tracking-[-0.02em] text-[#0b1c30]">
            Airport Lounge Traveller Queries
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="p-6 rounded-xl bg-white shadow-sm space-y-1">
            <div className="flex items-center gap-1 text-[#0b1c30]">
              <span className="material-symbols-outlined text-[#904d00] text-[22px]">airline_seat_recline_extra</span>
              <h3 className="text-xl font-semibold">Can I buy insurance if I'm already at the airport lounge?</h3>
            </div>
            <p className="text-[15px] leading-6 text-[#45464d]">
              Yes. You can purchase TuGo® Emergency Medical Insurance directly from your phone, laptop, or lounge workstation before your scheduled flight departs Canadian airspace. However, Trip Cancellation policies must generally be secured within specific time windows of your initial trip booking.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white shadow-sm space-y-1">
            <div className="flex items-center gap-1 text-[#0b1c30]">
              <span className="material-symbols-outlined text-[#904d00] text-[22px]">health_and_safety</span>
              <h3 className="text-xl font-semibold">Why do Canadians need emergency travel insurance out-of-province?</h3>
            </div>
            <p className="text-[15px] leading-6 text-[#45464d]">
              While hospital reciprocal agreements exist across Canadian provinces, non-hospital costs like ground ambulance, air evacuations back home, prescription drugs, and certain specialized physician fees are not covered by your provincial plan when travelling outside your home province.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white shadow-sm space-y-1">
            <div className="flex items-center gap-1 text-[#0b1c30]">
              <span className="material-symbols-outlined text-[#904d00] text-[22px]">sync_alt</span>
              <h3 className="text-xl font-semibold">How does redirecting to TuGo work?</h3>
            </div>
            <p className="text-[15px] leading-6 text-[#45464d]">
              When you click "Get a Quote", you are seamlessly transferred to TuGo's encrypted, licensed Canadian transactional portal. All policy quotes, medical disclosures, payments, and policy fulfillment are handled directly and securely by TuGo.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white shadow-sm space-y-1">
            <div className="flex items-center gap-1 text-[#0b1c30]">
              <span className="material-symbols-outlined text-[#904d00] text-[22px]">diversity_1</span>
              <h3 className="text-xl font-semibold">Can I cover my family members under one quote?</h3>
            </div>
            <p className="text-[15px] leading-6 text-[#45464d]">
              Yes, TuGo offers family coverage packages that can protect spouses and dependent children under a unified policy rate (subject to policy terms), simplifying airport departures for lounge-visiting families vacationing together.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ REGULATORY DISCLOSURES — verbatim per TuGo compliance ═══════════ */}
      <section className="w-full bg-[#eff4ff] py-10 px-4 lg:px-8">
        <div className="max-w-[1240px] mx-auto">
          <div className="bg-white rounded-xl p-6 lg:p-10 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#45464d] text-[20px]">policy</span>
              <span className="text-sm text-[#0b1c30] uppercase tracking-wider font-bold">Regulatory Disclosures &amp; Statutory Fine Print</span>
            </div>

            <div className="p-4 rounded bg-[#dce9ff]/40">
              <p className="text-[13px] text-[#0b1c30] font-semibold">
                {MANDATORY_CTA_CAPTION}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
              <div className="space-y-1">
                <h4 className="text-sm text-[#0b1c30] uppercase font-bold">Fine Print — Traveller (for Canadians)</h4>
                <p className="text-[12px] leading-[18px] text-[#45464d]">
                  The language on this website may not be the same as the actual policy wording which will prevail in all instances and is available upon request. Certain exclusions, limitations, and conditions may apply. Insurance is administered by North American Air Travel Insurance Agents Ltd. doing business as TuGo®, a licensed insurance broker in all provinces and territories. The issuer of the contract is Industrial Alliance Insurance and Financial Services Inc. and Industrial Alliance Pacific General Insurance Corporation. TuGo® is a registered trademark owned by North American Air Travel Insurance Agents Ltd. doing business as TuGo®.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm text-[#0b1c30] uppercase font-bold">Visitors to Canada Insurance</h4>
                <p className="text-[12px] leading-[18px] text-[#45464d]">
                  The language on this website may not be the same as the actual policy wording which will prevail in all instances and is available upon request. Certain exclusions, limitations, and conditions may apply. Insurance is administered by North American Air Travel Insurance Agents Ltd. doing business as TuGo®, a licensed insurance broker in all provinces and territories. The issuer of the contract is Industrial Alliance Insurance and Financial Services Inc. TuGo® is a registered trademark owned by North American Air Travel Insurance Agents Ltd. doing business as TuGo®.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TUGO PARTNER FOOTER ADDENDUM ═══════════ */}
      {/* The site's global Footer renders below this. This section surfaces the
          design's partner-specific disclosure block above the global footer. */}
      <section className="w-full bg-[#eff4ff] py-10 px-4 lg:px-8">
        <div className="max-w-[1240px] mx-auto space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-2">
              <span className="text-xl font-semibold text-[#0b1c30]">AirportLounges.ca × TuGo®</span>
              <p className="text-[15px] text-[#45464d] max-w-sm">
                A partnership connecting Canadian lounge travellers with comprehensive medical and trip protection worldwide.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-[#904d00]">verified_user</span>
                  <span>TuGo® Affiliate Partner</span>
                </div>
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-[#904d00]">lock</span>
                  <span>256-Bit SSL Secured</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-sm text-[#0b1c30] font-bold uppercase tracking-wider mb-1">Lounge Network</h4>
              <Link href="/airports/YYZ" className="text-[13px] text-[#45464d] hover:text-[#0b1c30]">Toronto Pearson (YYZ)</Link>
              <Link href="/airports/YVR" className="text-[13px] text-[#45464d] hover:text-[#0b1c30]">Vancouver Intl (YVR)</Link>
              <Link href="/airports/YUL" className="text-[13px] text-[#45464d] hover:text-[#0b1c30]">Montréal-Trudeau (YUL)</Link>
              <Link href="/airports/YYC" className="text-[13px] text-[#45464d] hover:text-[#0b1c30]">Calgary Intl (YYC)</Link>
              <Link href="/airports" className="text-[13px] text-[#45464d] hover:text-[#0b1c30]">All Canadian Airports</Link>
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-sm text-[#0b1c30] font-bold uppercase tracking-wider mb-1">TuGo® Travel Plans</h4>
              <a href={affiliate('tugo-travel-insurance')} target="_blank" rel={AFFILIATE_REL} className="text-[13px] text-[#45464d] hover:text-[#0b1c30]">Emergency Medical</a>
              <a href={affiliate('tugo-travel-insurance')} target="_blank" rel={AFFILIATE_REL} className="text-[13px] text-[#45464d] hover:text-[#0b1c30]">Trip Cancellation &amp; Interruption</a>
              <a href={affiliate('tugo-travel-insurance')} target="_blank" rel={AFFILIATE_REL} className="text-[13px] text-[#45464d] hover:text-[#0b1c30]">All-Inclusive Holiday Package</a>
              <a href={affiliate('tugo-travel-insurance')} target="_blank" rel={AFFILIATE_REL} className="text-[13px] text-[#45464d] hover:text-[#0b1c30]">Multi-Trip Annual Plans</a>
              <a href={affiliate('tugo-travel-insurance')} target="_blank" rel={AFFILIATE_REL} className="text-[13px] text-[#45464d] hover:text-[#0b1c30]">Visitors to Canada Plans</a>
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-sm text-[#0b1c30] font-bold uppercase tracking-wider mb-1">Assistance &amp; Support</h4>
              <p className="text-[13px] text-[#45464d]">Toll-Free Customer Service:</p>
              <a href={TUGO_PHONE_HREF} className="text-sm font-semibold text-[#904d00] hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">support_agent</span>{TUGO_PHONE_DISPLAY}
              </a>
              <p className="text-[13px] text-[#45464d] pt-1">Worldwide Emergency (24/7):</p>
              <span className="text-sm font-semibold text-[#0b1c30]">+1-604-278-4108 (Collect)</span>
              <a href="https://www.tugo.com/en/claims/" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#45464d] hover:text-[#0b1c30] pt-1">Claims Submission Portal</a>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl flex flex-col gap-1 text-[12px] leading-[18px] text-[#45464d]">
            <div className="flex items-center gap-1 text-sm font-semibold text-[#0b1c30]">
              <span className="material-symbols-outlined text-[16px] text-[#45464d]">info</span>
              <span>Affiliate Disclosure &amp; Regulatory Notice</span>
            </div>
            <p>
              AirportLounges.ca is an independent affiliate referral partner of TuGo®. Insurance policies are administered by North American Air Travel Insurance Agents Ltd. d.b.a. TuGo®, a licensed insurance broker in all Canadian provinces and territories. Travel insurance is underwritten by Industrial Alliance Insurance and Financial Services Inc. and Industrial Alliance Pacific General Insurance Corporation. Lounge access and ancillary travel benefits catalogued elsewhere on this site are independent services and are not an insurance policy.
            </p>
            <p>
              Certain conditions, limitations, and exclusions apply. For complete coverage details, including pre-existing medical condition exclusions and claims procedures, please review the official policy wording before purchasing.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
