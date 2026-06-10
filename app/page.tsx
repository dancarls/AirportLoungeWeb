import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import SearchModule from '@/components/SearchModule'
import FeaturedLoungeSection from '@/components/FeaturedLoungeSection'
import AirportMapsSection from '@/components/AirportMapsSection'
import TerminalMapVisual from '@/components/TerminalMapVisual'
import { getWeather } from '@/lib/weather'
import { getAllPosts } from '@/lib/blog'
import type { Lounge, Airport } from '@/lib/types'

export const revalidate = 300

function getImg(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/lounge-images/${path}`
}

// Flagship airport IDs — featured content always comes from these
const FLAGSHIP_AIRPORT_IDS = [
  '3f2645da-2c60-4e3e-ad78-3bd268bee576', // YVR
  '840161ae-1301-45f8-ad92-10d7834bef72', // YYZ
  '43c106e5-997d-4a95-9957-2d00dd02f89e', // YYC
  'ccd3abf2-f1c1-41a7-8fc4-eb0a22e7b50c', // YUL
]

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: airports },
    { data: topLounges },
    { data: featuredLounge },
    { data: mapAirports },
    { count: loungeCount },
    { count: airportCount },
  ] = await Promise.all([
    supabase.from('airports').select('id, name, iata_code, city').eq('is_active', true).order('name'),
    supabase.from('lounges')
      .select('*, airport:airports(name, iata_code, city), images:lounge_images(*)')
      .eq('is_active', true)
      .in('airport_id', FLAGSHIP_AIRPORT_IDS)
      .not('rating', 'is', null)
      .order('rating', { ascending: false })
      .limit(4),
    supabase.from('lounges')
      .select('*, airport:airports(*), images:lounge_images(*), amenities(*)')
      .eq('is_active', true)
      .in('airport_id', FLAGSHIP_AIRPORT_IDS)
      .not('rating', 'is', null)
      .order('rating', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle(),
    supabase.from('airports')
      .select('iata_code, name, city, latitude, longitude, terminal_map_url, lounges(id, name, slug, terminal)')
      .eq('is_active', true)
      .not('latitude', 'is', null)
      .order('name'),
    supabase.from('lounges').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('airports').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ])

  const fl = featuredLounge as (Lounge & { airport?: Airport }) | null
  const flPrimaryImg = fl?.images?.find((i: { is_primary: boolean }) => i.is_primary) ?? fl?.images?.[0]
  const flImgUrl = flPrimaryImg ? getImg(flPrimaryImg.storage_path) : null

  // Fetch weather for each map airport in parallel
  const weatherResults = mapAirports
    ? await Promise.all(
        mapAirports
          .filter(a => a.latitude && a.longitude)
          .map(a => getWeather(a.latitude!, a.longitude!).then(w => ({ iata: a.iata_code, weather: w })))
      )
    : []

  const weatherData = weatherResults
    .filter(r => r.weather)
    .map(r => ({
      iata:        r.iata,
      temperature: r.weather!.temperature,
      icon:        r.weather!.icon,
      label:       r.weather!.label,
    }))

  // Top lounges excluding the featured lounge (for Globally Renowned — must show different content)
  const renownedLounges = (topLounges as (Lounge & { airport?: Airport })[])
    ?.filter(l => l.id !== fl?.id)
    .slice(0, 3) ?? []

  // Build real-time intelligence — top rated lounges (featured lounge also excluded for variety)
  const recentItems = (topLounges as (Lounge & { airport?: Airport })[])
    ?.filter(l => l.id !== fl?.id)
    .slice(0, 3)
    .map(l => ({
      lounge: l,
      iata: l.airport?.iata_code,
      slug: l.slug,
    })) ?? []

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Luxury Airport Lounge Interior"
            className="w-full h-full object-cover"
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/lounge-images/airports/yyz/hero.jpg`}
          />
          <div className="absolute inset-0 bg-aviation-navy/60" />
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
            <Suspense fallback={<div className="h-20 bg-bone-white/10 animate-pulse" />}>
              <SearchModule airports={(airports as Airport[]) ?? []} />
            </Suspense>
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <span className="font-label-caps text-label-caps text-bone-white/60">Quick Search:</span>
              <Link href="/lounges?amenity=shower"           className="text-bone-white border-b border-bone-white/30 hover:border-primary-fixed transition-all text-sm py-1">Lounges with showers</Link>
              <Link href="/lounges?access=Priority+Pass"     className="text-bone-white border-b border-bone-white/30 hover:border-primary-fixed transition-all text-sm py-1">Priority Pass</Link>
              <Link href="/lounges?sort=rating"              className="text-bone-white border-b border-bone-white/30 hover:border-primary-fixed transition-all text-sm py-1">Best in Canada</Link>
            </div>
          </div>
        </div>

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

      {/* ── FEATURED LOUNGE (with working buttons + modals) ─────── */}
      {fl && (
        <FeaturedLoungeSection lounge={fl} primaryImageUrl={flImgUrl} />
      )}

      {/* ── POPULAR LOUNGES GRID ────────────────────────────────── */}
      <section className="py-section-gap bg-bone-white">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Globally Renowned</h2>
            <p className="text-secondary max-w-xl mx-auto">Discover the most sought-after airport sanctuaries, verified by our editorial team.</p>
          </div>

          {renownedLounges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {renownedLounges.map(lounge => {
                const img  = lounge.images?.find((i: { is_primary: boolean }) => i.is_primary) ?? lounge.images?.[0]
                const iata = lounge.airport?.iata_code
                return (
                  <Link key={lounge.id}
                    href={iata ? `/airports/${iata}/lounges/${lounge.slug}` : '/lounges'}
                    className="bg-white fine-border group cursor-pointer overflow-hidden block">
                    <div className="aspect-[4/3] overflow-hidden relative bg-secondary-container">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getImg(img.storage_path)} alt={lounge.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-secondary" style={{ fontSize: '48px' }}>local_bar</span>
                        </div>
                      )}
                      {iata && <div className="absolute top-4 left-4 bg-primary text-white text-[10px] px-2 py-1 uppercase tracking-tighter">{iata}{lounge.terminal ? ` • T - ${lounge.terminal}` : ''}</div>}
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-headline-md text-primary">{lounge.name}</h3>
                        {lounge.rating && (
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="font-bold">{lounge.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      {Array.isArray(lounge.access_types) && (lounge.access_types as { name: string }[]).slice(0,2).map((at, i) => (
                        <span key={i} className="inline-block bg-champagne-glint text-sand-dark text-[10px] px-2 py-1 font-semibold uppercase mr-2 mb-4">{at.name}</span>
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
            /* Fallback showcase */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { name:'Air Canada Maple Leaf Lounge', airport:'YYZ', terminal:'T1', rating:'4.8', tags:['Business Class','Air Canada Altitude'], href:'/airports/YYZ/lounges/ac-maple-leaf-lounge-international-yyz', img:'https://lh3.googleusercontent.com/aida-public/AB6AXuAtO22ExhjNghpFztoO3sP7dhkL9RmAYYCKZZO6vsXBlO13JtnaUPQMgO5Q6ooU9QyVsvHyaTaifKN_I9zG2MWkPbB4xAN4aBSDYWyFCIIKTY90N4yjFx2cYS2fsk1BaJa-YufPuoFh6lErDGvo91aDQnNXIYWexA0nzYzUtEcmXmoPEiU0MTN-jpkPcnTRn2QuhmokaUQhcyjp3G1ANGfuiPbpDOnWaLFMfEO_QYqE-vz7Wqe0HeyPnjxQ3_SHLg4pIOOGzxNXn51O' },
                { name:'Plaza Premium First Lounge',    airport:'YVR', terminal:'Intl',rating:'4.7', tags:['Priority Pass','DragonPass'],          href:'/airports/YVR/lounges/plaza-premium-first-yvr', img:'https://lh3.googleusercontent.com/aida-public/AB6AXuC9m6f_mOaxYRfeHpcrj1iCfkNykD54AODxJcRgbd7MJzO5BpxlV6KOflL583VaJkdwc1rxNXxz2vJMMsH4cv7IZRbhK0P3WjX78WH5zu_Iybd3rX92jVmqdIN-WgsRgD1xuM6L6kyYf1nb9o0TrJQNQDS6xlfwkjVUq-Ie7Qfn8L1-wR_3qisMCGpieEH3IA_Ry5lPDAqYbye2ESlKRJcOxf5mS0T2xIvYeCVEkRu8SJM__jsRRvGPacnsdCCbhp-li8UZxOCM8jEQ' },
                { name:'Air Canada Signature Suite',    airport:'YYZ', terminal:'T1', rating:'4.9', tags:['Super Elite 100K','Invitation Only'],   href:'/airports/YYZ/lounges/ac-signature-suite-yyz', img:'https://lh3.googleusercontent.com/aida-public/AB6AXuCVhhz58CUA54OconUPBzNnuEXlVw1HyiFdYPmiXJeND-guKgs0-b3_OnboFf1KR2oI4Bo4q7TMzDabMVJlGbQy6JUbTFfoyuexjiPOzbTkk3WqiAajL7xEgyQd83esElACwj6YLMsD83ZyYgs6Cv5mRh-2mN51sT8tq41kcS2exYd5HcqX80jTFiAbbpPxC_n7X3uNgm_xKDc4LY2d_5pcXinfNo9Zpu4M7Pf2WFI7JSVqLfdkjVk8W9pXu04bSxciH6mhZjiqbIVo' },
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
                      <div className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings:"'FILL' 1" }}>star</span><span className="font-bold">{c.rating}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">{c.tags.map(t => <span key={t} className="bg-champagne-glint text-sand-dark text-[10px] px-2 py-1 font-semibold uppercase">{t}</span>)}</div>
                    <div className="w-full py-3 border-b border-primary/10 group-hover:border-primary transition-all text-primary font-label-caps text-[10px] uppercase flex justify-between">
                      View Details <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/lounges" className="inline-flex items-center gap-2 bg-primary text-white px-10 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 transition-all">
              View All Lounges <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── REAL-TIME INTELLIGENCE ───────────────────────────────── */}
      <section className="py-section-gap bg-aviation-navy text-white overflow-hidden">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="font-headline-lg text-headline-lg mb-6">Real-time Intelligence</h2>
              <p className="text-bone-white/70 mb-8 font-body-lg">
                Community members and our editorial team verify lounge access rules, amenities, and operating hours daily — so you never face a closed door.
              </p>
              <Link href="/lounges" className="font-label-caps text-label-caps border-b border-primary-fixed text-primary-fixed pb-2 tracking-widest inline-block hover:opacity-80 transition-all">
                VIEW ALL LOUNGES
              </Link>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {recentItems.length > 0 ? recentItems.map(({ lounge, iata, slug }) => (
                <Link
                  key={lounge.id}
                  href={iata ? `/airports/${iata}/lounges/${slug}` : '/lounges'}
                  className="bg-white/5 p-6 border-l-2 border-primary-fixed flex items-center justify-between hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-primary-fixed/20 flex items-center justify-center text-primary-fixed shrink-0">
                      <span className="material-symbols-outlined">verified</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-primary-fixed transition-colors">{lounge.name}</h4>
                      <p className="text-sm text-bone-white/50">
                        {iata && `${iata} · `}
                        {lounge.rating ? `${lounge.rating.toFixed(1)}★ · ` : ''}
                        {lounge.review_count > 0 ? `${lounge.review_count} review${lounge.review_count !== 1 ? 's' : ''}` : 'Be the first to review'}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary-fixed shrink-0 ml-4">arrow_forward</span>
                </Link>
              )) : (
                /* Hardcoded fallback linked to real pages */
                [
                  { icon:'update',       title:'Air Canada Maple Leaf Lounge, YYZ',  desc:'Access rules verified. Priority Pass confirmed.',      time:'Verified', href:'/airports/YYZ/lounges/ac-maple-leaf-lounge-international-yyz' },
                  { icon:'new_releases', title:'Plaza Premium First, YVR Intl',       desc:'Full amenity floorplan and review published.',           time:'Updated',  href:'/airports/YVR/lounges/plaza-premium-first-yvr' },
                  { icon:'wifi',         title:'Air Canada Signature Suite, YYZ T1',  desc:'Super Elite 100K access rules confirmed.',              time:'Verified', href:'/airports/YYZ/lounges/ac-signature-suite-yyz' },
                ].map(item => (
                  <Link key={item.title} href={item.href}
                    className="bg-white/5 p-6 border-l-2 border-primary-fixed flex items-center justify-between hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-full bg-primary-fixed/20 flex items-center justify-center text-primary-fixed shrink-0">
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg group-hover:text-primary-fixed transition-colors">{item.title}</h4>
                        <p className="text-sm text-bone-white/50">{item.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-label-caps text-primary-fixed uppercase shrink-0 ml-4">{item.time}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── TERMINAL NAVIGATION ──────────────────────────────────── */}
      {mapAirports && mapAirports.length > 0 && (
        <TerminalMapVisual
          airports={mapAirports as Parameters<typeof TerminalMapVisual>[0]['airports']}
        />
      )}

      {/* ── LOUNGE LIBRARY (Editorial / Guides) ─────────────────── */}
      <section className="py-section-gap bg-bone-white">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] flex-1 bg-sand-dark/20" />
            <h2 className="font-headline-lg text-headline-lg text-primary px-8">The Lounge Library</h2>
            <div className="h-[1px] flex-1 bg-sand-dark/20" />
          </div>
          <p className="text-center text-secondary text-sm mb-12 max-w-xl mx-auto">
            Curated guides for navigating airport lounges — from access cards and memberships to the best spots for work, rest, and a decent meal.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {getAllPosts().slice(0, 3).map(post => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block aspect-[3/4] overflow-hidden mb-6 editorial-shadow relative">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="font-headline-md text-primary mb-3 hover:underline">{post.title}</h3>
                </Link>
                <p className="text-secondary text-sm mb-4 leading-relaxed line-clamp-3">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="text-primary font-bold text-[10px] uppercase tracking-widest border-b border-primary/20 hover:border-primary transition-all pb-1 inline-block">
                  Read Guide
                </Link>
              </article>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/blog" className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 font-label-caps text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
              View All Guides <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── OPERATOR CTA ────────────────────────────────────────── */}
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
                <Link href="/auth/signup" className="bg-primary-fixed text-on-primary-fixed px-10 py-4 font-bold text-[12px] uppercase tracking-widest hover:bg-white transition-all">Claim Listing Now</Link>
                <Link href="/auth/signup" className="border border-white/30 text-white px-10 py-4 font-bold text-[12px] uppercase tracking-widest hover:bg-white/10 transition-all">Partner With Us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
