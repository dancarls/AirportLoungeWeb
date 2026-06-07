'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface GalleryImage {
  id: string
  storage_path: string
  alt_text?: string | null
}

const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
function imgUrl(path: string) {
  return `${BASE}/storage/v1/object/public/lounge-images/${path}`
}

export default function GalleryLightbox({
  images,
  loungeName,
}: {
  images: GalleryImage[]
  loungeName: string
}) {
  const [open,    setOpen]    = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const close = useCallback(() => setOpen(null), [])
  const prev  = useCallback(() => setOpen(i => (i != null && i > 0 ? i - 1 : i)), [])
  const next  = useCallback(() => setOpen(i => (i != null && i < images.length - 1 ? i + 1 : i)), [images.length])

  useEffect(() => {
    if (open === null) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     close()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close, prev, next])

  if (images.length <= 1) return null

  const hasMore = images.length > 3

  const modal = open !== null ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center"
      onClick={close}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/25 rounded-full w-11 h-11 flex items-center justify-center transition-colors"
        onClick={close}
        aria-label="Close gallery"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span>
      </button>

      {/* Counter */}
      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-xs font-label-caps tracking-widest">
        {open + 1} / {images.length}
      </span>

      {/* Prev */}
      {open > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/25 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
          onClick={e => { e.stopPropagation(); prev() }}
          aria-label="Previous image"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>chevron_left</span>
        </button>
      )}

      {/* Main image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="max-h-[80vh] max-w-[88vw] object-contain select-none drop-shadow-2xl"
        src={imgUrl(images[open].storage_path)}
        alt={images[open].alt_text ?? `${loungeName} photo ${open + 1}`}
        onClick={e => e.stopPropagation()}
        draggable={false}
      />

      {/* Caption */}
      {images[open].alt_text && (
        <p className="absolute bottom-[90px] left-1/2 -translate-x-1/2 text-white/70 text-sm text-center px-4 whitespace-nowrap">
          {images[open].alt_text}
        </p>
      )}

      {/* Next */}
      {open < images.length - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/25 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
          onClick={e => { e.stopPropagation(); next() }}
          aria-label="Next image"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>chevron_right</span>
        </button>
      )}

      {/* Thumbnail strip */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-1 px-2"
        onClick={e => e.stopPropagation()}
      >
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setOpen(i)}
            className={`shrink-0 w-14 h-10 overflow-hidden rounded transition-all duration-200 ${
              i === open ? 'ring-2 ring-white opacity-100 scale-110' : 'opacity-40 hover:opacity-70'
            }`}
            aria-label={`View photo ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-full h-full object-cover" src={imgUrl(img.storage_path)} alt="" />
          </button>
        ))}
      </div>
    </div>
  ) : null

  return (
    <>
      {/* Grid preview */}
      <div>
        <h3 className="font-headline-md text-headline-md mb-8">Gallery</h3>
        <div className="grid grid-cols-12 gap-4 h-[420px]">
          <div
            className="col-span-8 h-full overflow-hidden rounded cursor-zoom-in"
            onClick={() => setOpen(0)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              src={imgUrl(images[0].storage_path)}
              alt={images[0].alt_text ?? loungeName}
            />
          </div>
          <div className="col-span-4 flex flex-col gap-4">
            {images.slice(1, 3).map((img, i) => (
              <div
                key={img.id}
                className="h-1/2 overflow-hidden rounded cursor-zoom-in relative"
                onClick={() => setOpen(i + 1)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  src={imgUrl(img.storage_path)}
                  alt={img.alt_text ?? `${loungeName} ${i + 2}`}
                />
                {i === 1 && hasMore && (
                  <div className="absolute inset-0 bg-primary/70 flex items-center justify-center pointer-events-none">
                    <span className="text-white font-bold text-xl">+{images.length - 3} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-secondary mt-3">Click any image to open full gallery</p>
      </div>

      {/* Modal — rendered via portal to escape any overflow:hidden ancestors */}
      {mounted && modal && createPortal(modal, document.body)}
    </>
  )
}
