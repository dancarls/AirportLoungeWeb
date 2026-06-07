'use client'

import { useState, useEffect, useCallback } from 'react'

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
  const [open, setOpen] = useState<number | null>(null)

  const close = useCallback(() => setOpen(null), [])
  const prev  = useCallback(() => setOpen(i => (i != null && i > 0 ? i - 1 : i)), [])
  const next  = useCallback(() => setOpen(i => (i != null && i < images.length - 1 ? i + 1 : i)), [images.length])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      close()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, prev, next])

  if (images.length <= 1) return null

  const hasMore = images.length > 3

  return (
    <>
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
                  <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">+{images.length - 3} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            onClick={close}
            aria-label="Close gallery"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span>
          </button>

          {/* Counter */}
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-label-caps">
            {open + 1} / {images.length}
          </span>

          {/* Prev */}
          {open > 0 && (
            <button
              className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
              onClick={e => { e.stopPropagation(); prev() }}
              aria-label="Previous image"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
          )}

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="max-h-[88vh] max-w-[88vw] object-contain select-none"
            src={imgUrl(images[open].storage_path)}
            alt={images[open].alt_text ?? `${loungeName} photo ${open + 1}`}
            onClick={e => e.stopPropagation()}
            draggable={false}
          />

          {/* Next */}
          {open < images.length - 1 && (
            <button
              className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
              onClick={e => { e.stopPropagation(); next() }}
              aria-label="Next image"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={e => { e.stopPropagation(); setOpen(i) }}
                  className={`w-14 h-10 shrink-0 overflow-hidden rounded transition-all ${
                    i === open ? 'ring-2 ring-white opacity-100' : 'opacity-50 hover:opacity-80'
                  }`}
                  aria-label={`View photo ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-full object-cover"
                    src={imgUrl(img.storage_path)}
                    alt=""
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
