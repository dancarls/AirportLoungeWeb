import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import SearchModule from '@/components/SearchModule'
import type { Lounge, Airport } from '@/lib/types'

export const revalidate = 300

function getImg(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/lounge-images/${path}`
}

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: airports },
    { data: topLounges },
    { data: featuredLounge },
    { count: loungeCount },
    { count: airportCount },
  ] = await Promise.all([
    supabase.from('airports').select('id, name, iata_code, city').eq('is_active', true).order('name'),
    supabase.from('lounges')
      .select('*, airport:airports(name, iata_code, city), images:lounge_images(*)')
      .eq('is_active', true)
      .not('rating', 'is', null)
      .order('rating', { ascending: false })
      .limit(3),
    supabase.from('lounges')
      .select('*, airport:airports(name, iata_code, city, latitude, longitude), images:lounge_images(*), amenities(*)')
      .eq('is_active', true)
      .order('rating', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle(),
    supabase.from('lounges').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('airports').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ])

  const fl = featuredLounge as (Lounge & { airport?: Airport }) | null
  const flIata = fl?.airport?.iata_code
  const flPrimaryImg = fl?.images?.find((i: { is_primary: boolean }) => i.is_primary) ?? fl?.images?.[0]

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Luxury Airport Lounge Interior"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVrwLDxqI3q-M7t6rF9dhA8qA-BlNVv9eMJjUBC3tlf0ok9sd3LaXAPrzsc2SvwihbulaNYyqIA1AwinBDNpTRk64Du7WHZdbwqfUOpdky7AIlMYoYAQPhS9SFNGLl-byQUkxyJ7iATGMNzntgL8pg7lJCUTUkCrKVZsqS6Vt-52dUOdKtbdwPnxrgqGfGZGah_FEr3rolgRuOYA3xee0s0Snu_V__KNbvW8b2Cpdjej40BG53igtu4ntxi65MkfKYbpc9E8aNM_nD"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-aviation-navy/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-container-max mx-auto px-gutter w-full">
          <div className="max-w-2xl text-white">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight">
              Find the right lounge before you reach the gate.
            </h1>
            <p className="font-body-lg text-body-lg text-bone-white/90 mb-10 max-w-lg">
              Search by airport, terminal, access card, or amenity. Verified data for a seamless transit experience.
            </p>

            {/* Search */}
            <Suspense fallback={<div className="h-20 bg-bone-white/10 animate-pulse" />}>
              <SearchModule airports={(airports as Airport[]) ?? []} />
            </Suspense>

            {/* Quick Links */}
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <span className="font-label-caps text-label-caps text-bone-white/60">Quick Search:</span>
              <Link href="/lounges?amenity=shower" className="text-bone-white border-b border-bone-white/30 hover:border-primary-fixed transition-all text-sm py-1">
                Lounges with showers
              </Link>
              <Link href="/lounges?access=Priority+Pass" className="text-bone-white border-b border-bone-white/30 hover:border-primary-fixed transition-all text-sm py-1">
                Priority Pass
              </Link>
              <Link href="/lounges?sort=rating" className="text-bone-white border-b border-bone-white/30 hover:border-primary-fixed transition-all text-sm py-1">
                Best in Canada
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-aviation-navy/80 backdrop-blur-md py-6">
          <div className="max-w-container-max mx-auto px-gutter grid grid-cols-3 gap-8">
            <div className="flex items-center gap-4 border-r border-bone-white/10">
              <span className="font-headline-md text-bone-white">{loungeCount ?? 0}+</span>
              <span className="font-label-caps text-[10px] text-bone-white/60 uppercase tracking-widest">Lounges Listed</span>
            </div>
            <div className="flex items-center gap-4 border-r border-bone-white/10">
              <span className="font-headline-md text-bone-white">{airportCount ?? 0}+</span>
              <span className="font-label-caps text-[10px] text-bone-white/60 uppercase tracking-widest">Airports Covered</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-headline-md text-bone-white">Daily</span>
              <span className="font-label-caps text-[10px] text-bone-white/60 uppercase tracking-widest">Data Updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED LOUNGE SPOTLIGHT ──────────────────────────── */}
      {fl && (
        <section className="py-section-gap bg-bone-white">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              {/* Image */}
              <div className="w-full lg:w-3/5 relative group">
                <div className="aspect-[16/9] overflow-hidden">
                  {flPrimaryImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImg(flPrimaryImg.storage_path)}
                      alt={fl.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-6xl">local_bar</span>
                    </div>
                  )}
                </div>
                <div className="absolute top-6 right-6 bg-bone-white/90 backdrop-blur px-4 py-2 editorial-shadow">
                  <span className="font-label-caps text-label-caps text-primary">Verified Data</span>
                </div>
              </div>

              {/* Details */}
              <div className="w-full lg:w-2/5">
                {fl.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-sand-dark text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-bold text-primary">{fl.rating.toFixed(1)}</span>
                    <span className="text-sand-dark text-sm">({fl.review_count.toLocaleString()} Reviews)</span>
                  </div>
                )}
                <h2 className="font-headline-lg text-headline-lg text-primary mb-6">{fl.name}</h2>
                {fl.airport && (
                  <p className="font-label-caps text-label-caps text-sand-dark uppercase mb-2">
                    {fl.airport.iata_code} {fl.terminal ? `Terminal ${fl.terminal}` : ''} {fl.location_detail ? `• ${fl.location_detail}` : ''}
                  </p>
                )}
                {fl.description && (
                  <p className="text-secondary leading-relaxed mb-10 font-body-lg line-clamp-4">
                    {fl.description}
                  </p>
                )}
                <div className="grid grid-cols-3 gap-4">
                  {flIata && (
                    <Link
                      href={`/airports/${flIata}/lounges/${fl.slug}`}
                      className="fine-border py-4 px-2 hover:bg-champagne-glint transition-all flex flex-col items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-primary">rate_review</span>
                      <span className="font-label-caps text-[10px] uppercase">Review</span>
                    </Link>
                  )}
                  <Link
                    href={`/airports/${flIata ?? ''}`}
                    className="fine-border py-4 px-2 hover:bg-champagne-glint transition-all flex flex-col items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-primary">map</span>
                    <span className="font-label-caps text-[10px] uppercase">Map</span>
                  </Link>
                  {flIata && (
                    <Link
                      href={`/airports/${flIata}/lounges/${fl.slug}`}
                      className="fine-border py-4 px-2 hover:bg-champagne-glint transition-all flex flex-col items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-primary">floor_lamp</span>
                      <span className="font-label-caps text-[10px] uppercase">Details</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── MAP DISCOVERY ──────────────────────────────────────── */}
      <section className="py-section-gap bg-secondary-fixed">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Terminal Navigation</h2>
              <p className="text-secondary">Precision maps of terminal layouts and lounge locations.</p>
            </div>
            <div className="flex gap-2">
              <Link href="/airports/YYZ" className="bg-primary text-white px-6 py-3 text-sm font-medium">YYZ Pearson</Link>
              <Link href="/airports/YVR" className="bg-white/50 text-primary px-6 py-3 text-sm font-medium hover:bg-white transition-all">YVR Vancouver</Link>
            </div>
          </div>
          <Link href="/airports/YYZ" className="relative bg-white aspect-[21/9] block editorial-shadow overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsUQPE62JEQ3D3Ex8UH4OlUeO8t89NrJixOZWymGb11WbLKrjITTElKtDrjJGXvjyEE1pj8XAPDphNzoDJDOjCD-Jf8g1dczO257Fmsgas6ZdEP9nnMvrdXB8bySGbPRduPvh4PY7ykVLZ0MkLhQOROra6vHGv4nnfp68UnfhK8qOuza-Mgj8dEyzMBRlZunD_-6hklCG2DiZz20gLUUsJFAQCoQUhVmMD0I6vK8dNb6f1EkuFGLWIVbeEeSsaYPa0lRTBcjFaGrf_"
              alt="Toronto Pearson International Terminal Map"
            />
            <div className="absolute inset-0 bg-primary/5 flex items-center justify-center pointer-events-none">
              <div className="p-8 bg-bone-white/90 backdrop-blur-lg border border-primary/20 max-w-sm text-center">
                <span className="material-symbols-outlined text-primary text-4xl mb-4">touch_app</span>
                <h3 className="font-headline-md text-primary mb-2">Interactive Preview</h3>
                <p className="text-sm text-secondary">Click to explore gates, quiet zones, and priority amenities across Pearson International.</p>
              </div>
            </div>
            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-primary rounded-full animate-pulse border-2 border-white" />
            <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-primary rounded-full animate-pulse border-2 border-white" />
          </Link>
        </div>
      </section>

      {/* ── POPULAR LOUNGES GRID ───────────────────────────────── */}
      <section className="py-section-gap bg-bone-white">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Globally Renowned</h2>
            <p className="text-secondary max-w-xl mx-auto">
              Discover the world's most sought-after airport sanctuaries, verified by our editorial team.
            </p>
          </div>

          {topLounges && topLounges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {(topLounges as (Lounge & { airport?: Airport })[]).map(lounge => {
                const img = lounge.images?.find((i: { is_primary: boolean }) => i.is_primary) ?? lounge.images?.[0]
                const iata = lounge.airport?.iata_code
                return (
                  <Link
                    key={lounge.id}
                    href={iata ? `/airports/${iata}/lounges/${lounge.slug}` : `/lounges/${lounge.slug}`}
                    className="bg-white fine-border group cursor-pointer overflow-hidden block"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getImg(img.storage_path)}
                          alt={lounge.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-secondary text-5xl">local_bar</span>
                        </div>
                      )}
                      {iata && (
                        <div className="absolute top-4 left-4 bg-primary text-white text-[10px] px-2 py-1 uppercase tracking-tighter">
                          {iata} {lounge.terminal ? `• T${lounge.terminal}` : ''}
                        </div>
                      )}
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-headline-md text-primary">{lounge.name}</h3>
                        {lounge.rating && (
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="font-bold">{lounge.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      {lounge.access_types && Array.isArray(lounge.access_types) && lounge.access_types.slice(0, 2).map((at: { name: string }, i: number) => (
                        <span key={i} className="inline-block bg-champagne-glint text-sand-dark text-[10px] px-2 py-1 font-semibold uppercase mr-2 mb-4">
                          {at.name}
                        </span>
                      ))}
                      <div className="w-full py-3 border-b border-primary/10 group-hover:border-primary transition-all text-primary font-label-caps text-[10px] uppercase flex justify-between">
                        View Details <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            /* Fallback cards when no lounge data yet */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { name: 'Air Canada Maple Leaf Lounge', airport: 'YYZ', terminal: 'T1', rating: '4.8', tags: ['Business Class', 'Air Canada Altitude'], href: '/airports/YYZ', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtO22ExhjNghpFztoO3sP7dhkL9RmAYYCKZZO6vsXBlO13JtnaUPQMgO5Q6ooU9QyVsvHyaTaifKN_I9zG2MWkPbB4xAN4aBSDYWyFCIIKTY90N4yjFx2cYS2fsk1BaJa-YufPuoFh6lErDGvo91aDQnNXIYWexA0nzYzUtEcmXmoPEiU0MTN-jpkPcnTRn2QuhmokaUQhcyjp3G1ANGfuiPbpDOnWaLFMfEO_QYqE-vz7Wqe0HeyPnjxQ3_SHLg4pIOOGzxNXn51O' },
                { name: 'Plaza Premium First Lounge', airport: 'YVR', terminal: 'Intl', rating: '4.7', tags: ['Priority Pass', 'DragonPass'], href: '/airports/YVR', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9m6f_mOaxYRfeHpcrj1iCfkNykD54AODxJcRgbd7MJzO5BpxlV6KOflL583VaJkdwc1rxNXxz2vJMMsH4cv7IZRbhK0P3WjX78WH5zu_Iybd3rX92jVmqdIN-WgsRgD1xuM6L6kyYf1nb9o0TrJQNQDS6xlfwkjVUq-Ie7Qfn8L1-wR_3qisMCGpieEH3IA_Ry5lPDAqYbye2ESlKRJcOxf5mS0T2xIvYeCVEkRu8SJM__jsRRvGPacnsdCCbhp-li8UZxOCM8jEQ' },
                { name: 'Air Canada Signature Suite', airport: 'YYZ', terminal: 'T1', rating: '4.9', tags: ['Super Elite 100K', 'Invitation Only'], href: '/airports/YYZ', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVhhz58CUA54OconUPBzNnuEXlVw1HyiFdYPmiXJeND-guKgs0-b3_OnboFf1KR2oI4Bo4q7TMzDabMVJlGbQy6JUbTFfoyuexjiPOzbTkk3WqiAajL7xEgyQd83esElACwj6YLMsD83ZyYgs6Cv5mRh-2mN51sT8tq41kcS2exYd5HcqX80jTFiAbbpPxC_n7X3uNgm_xKDc4LY2d_5pcXinfNo9Zpu4M7Pf2WFI7JSVqLfdkjVk8W9pXu04bSxciH6mhZjiqbIVo' },
              ].map(c => (
                <Link key={c.name} href={c.href} className="bg-white fine-border group cursor-pointer overflow-hidden block">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" src={c.img} alt={c.name} />
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] px-2 py-1 uppercase tracking-tighter">{c.airport} • {c.terminal}</div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-headline-md text-primary">{c.name}</h3>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-bold">{c.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {c.tags.map(t => <span key={t} className="bg-champagne-glint text-sand-dark text-[10px] px-2 py-1 font-semibold uppercase">{t}</span>)}
                    </div>
                    <div className="w-full py-3 border-b border-primary/10 group-hover:border-primary transition-all text-primary font-label-caps text-[10px] uppercase flex justify-between">
                      View Details <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── REAL-TIME INTELLIGENCE ─────────────────────────────── */}
      <section className="py-section-gap bg-aviation-navy text-white overflow-hidden">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="font-headline-lg text-headline-lg mb-6">Real-time Intelligence</h2>
              <p className="text-bone-white/70 mb-8 font-body-lg">
                Our data scouts and community members update lounge access rules and amenities daily to ensure you never face a closed door.
              </p>
              <Link href="/lounges" className="font-label-caps text-label-caps border-b border-primary-fixed text-primary-fixed pb-2 tracking-widest inline-block hover:opacity-80 transition-all">
                VIEW ALL LOUNGES
              </Link>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {[
                { icon: 'update',       colour: 'primary-fixed',   title: 'Air Canada Maple Leaf Lounge, YYZ',     desc: 'Guest fee updated. Priority Pass access confirmed.',  time: 'Verified' },
                { icon: 'new_releases', colour: 'secondary-fixed', title: 'Plaza Premium First, YVR Intl',         desc: 'Full amenity floorplan and review published.',         time: 'Updated' },
                { icon: 'wifi',         colour: 'primary-fixed',   title: 'Air Canada Signature Suite, YYZ T1',   desc: 'Super Elite 100K access rules confirmed.',            time: 'Verified' },
              ].map(item => (
                <div key={item.title} className="bg-white/5 p-6 border-l-2 border-primary-fixed flex items-center justify-between hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-full bg-primary-fixed/20 flex items-center justify-center text-primary-fixed`}>
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-sm text-bone-white/50">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-label-caps text-primary-fixed uppercase shrink-0 ml-4">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LOUNGE LIBRARY ─────────────────────────────────────── */}
      <section className="py-section-gap bg-bone-white">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-[1px] flex-1 bg-sand-dark/20" />
            <h2 className="font-headline-lg text-headline-lg text-primary px-8">The Lounge Library</h2>
            <div className="h-[1px] flex-1 bg-sand-dark/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4GKgsqfalzGYSrwo2qoZ5a7TH86XC9a0fEYs7ROAuLwHttLFnFCN9cvMjQQNqHeODB7lG1O_OnLilCJ47_g6E35I0uvirD68A_6Ftu20dlUvIuSZnMAt_uaqwo90S2nYpyCM2BMSPGNoZuSrLc_Fwcbo8QHE1CDsHKeuqXN4GeCd_VSCfmWiiQE6Ue3dTFFcEEjcqogmClb-zLu_dG3mGuBZ6wxXU-GuSu_f22UjBlnTAOlXf8vRe0z4nu-trqO4YT-_o9nxrYq9F',
                title: 'The 2024 Guide to Priority Pass',
                desc: 'Everything you need to know about navigating the world\'s largest independent lounge network this year.',
                href: '/lounges?access=Priority+Pass',
              },
              {
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8pZAtF9WmklahMG9rb0bQHtM7EhGT-B2Z_ZbflBo2waoPYa7mHfxtTa8QZkFnZZgfNzUDyIkiYYH0bhbv7-PsWRRmDDQ7JH_5OCXuiuDy3O6WJcYl4cVcKqBdJG76_A45VXlzYfdZ8w6x725w_9iN2eP5pyRfBuSvkrg4LeUAfzsfQMIT3QkDW2imuCWq23dkP9D4bmZoKs0px7-Z-NCDlUtLmbu8cHTx5EGP2t5Ys0xNk2aNPQgothiJFgk5thErq-uHO_JTiXd1',
                title: 'Productivity at 35,000 Feet',
                desc: 'The best lounges for deep work sessions, featuring verified Wi-Fi speeds and quiet zone ratings.',
                href: '/lounges?amenity=wifi',
              },
              {
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUnXuGcseHQMu4gTYFEYSYxCp89qJww9bZuU8Fif0ZyHEroGdU1RCdaiAKAXpS6Qk0IHuNnqmLQyCgP2GcC64P8I0B0rBIjcEWG6pgRN5lB7lqbazDROXqfAtO4OlCO-akgUjNjNF5TwDko_1y7ftYVenZrVmkS5XdDQShdMdIwXg5j2WiIAH2OuoEg4P_pHuF0fEP8JSqw1hhL21Pm30wIfKTz5RmWhhOsu2MiHMgzh8_tWxbXtVcWKAz6aVUpnRXEbmbZDHX2hKi',
                title: 'Access Solutions for Teams',
                desc: 'How corporate travel managers are optimizing transit downtime for global sales and engineering teams.',
                href: '/lounges',
              },
            ].map(article => (
              <article key={article.title} className="group">
                <div className="aspect-[3/4] overflow-hidden mb-6 editorial-shadow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    src={article.img}
                    alt={article.title}
                  />
                </div>
                <h3 className="font-headline-md text-primary mb-3">{article.title}</h3>
                <p className="text-secondary text-sm mb-4 leading-relaxed line-clamp-3">{article.desc}</p>
                <Link href={article.href} className="text-primary font-bold text-[10px] uppercase tracking-widest border-b border-primary/20 hover:border-primary transition-all pb-1 inline-block">
                  Read Editorial
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPERATOR CTA ───────────────────────────────────────── */}
      <section className="py-20 bg-champagne-glint">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="bg-primary p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <span className="font-label-caps text-label-caps text-primary-fixed uppercase tracking-[0.3em] mb-6 block">Operator Portal</span>
              <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-8">Manage your lounge listing.</h2>
              <p className="text-bone-white/70 max-w-2xl mx-auto mb-10 text-lg">
                Partner with AirportLounges.ca to reach premium travellers monthly. Ensure your amenities and access rules are up-to-date.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/auth/signup" className="bg-primary-fixed text-on-primary-fixed px-10 py-4 font-bold text-[12px] uppercase tracking-widest hover:bg-white transition-all">
                  Claim Listing Now
                </Link>
                <Link href="/auth/signup" className="border border-white/30 text-white px-10 py-4 font-bold text-[12px] uppercase tracking-widest hover:bg-white/10 transition-all">
                  Partner With Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
