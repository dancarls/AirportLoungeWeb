// Crop the AC Signature + AC Café brand pins so the visible badge fills the
// entire image (no surrounding padding) and re-export as 512px square PNGs
// with the area outside the badge fully transparent.
//
// Strategy per icon:
//   1. Scan all pixels and find a tight bounding box of "non-background" pixels
//      (anything that isn't near-white-or-transparent for the signature, or
//      isn't transparent for the cafe).
//   2. Crop to that bbox + a small padding.
//   3. Composite onto a square transparent canvas so the rendered <img> in
//      object-fit:contain mode fills our marker div edge-to-edge.
import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const ICON_DIR = join(__dir, '..', 'public', 'icons', 'lounges')

const SIGNATURE_SRC = join(__dir, '..', '..', 'Downloads', 'aircanadasignatureloungeicon.png')
const CAFE_SRC      = join(__dir, '..', '..', 'Downloads', 'aircanadacafeicon.png')

/** Find bounding box of pixels where keepFn(r,g,b,a) returns true. */
async function findBBox(src, keepFn) {
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  let minX = width, minY = height, maxX = -1, maxY = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = channels === 4 ? data[i + 3] : 255
      if (keepFn(r, g, b, a)) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) throw new Error('No matching pixels found — bbox detect failed')
  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    imgWidth: width,
    imgHeight: height,
  }
}

async function processSignature() {
  // Signature icon: solid cream background (~ #F5EFE6). Keep anything that's
  // not near-cream AND has any alpha. We also reject very-low-saturation
  // bright pixels which is the cream tone.
  const bbox = await findBBox(SIGNATURE_SRC, (r, g, b, a) => {
    if (a < 16) return false
    // cream is around (235-255, 230-250, 220-245). Reject those.
    const isCream = r > 220 && g > 215 && b > 200 && Math.abs(r - g) < 20 && r >= b
    return !isCream
  })
  await renderCropped(SIGNATURE_SRC, bbox, join(ICON_DIR, 'ac-signature.png'))
}

async function processCafe() {
  // Cafe icon: transparent background with black ring + red interior. Keep any
  // pixel with meaningful alpha.
  const bbox = await findBBox(CAFE_SRC, (_r, _g, _b, a) => a > 32)
  await renderCropped(CAFE_SRC, bbox, join(ICON_DIR, 'ac-cafe.png'))
}

async function renderCropped(src, bbox, outPath) {
  // 3-pass to guarantee a perfect square: extract → pad-to-square → resize.
  const side = Math.max(bbox.width, bbox.height)
  const padX = Math.floor((side - bbox.width) / 2)
  const padY = Math.floor((side - bbox.height) / 2)

  // Pass 1: extract just the bbox.
  const cropped = await sharp(src)
    .extract({ left: bbox.left, top: bbox.top, width: bbox.width, height: bbox.height })
    .png()
    .toBuffer()

  // Pass 2: pad to square on a fresh sharp instance.
  const padded = await sharp(cropped)
    .extend({
      top:    padY,
      bottom: side - bbox.height - padY,
      left:   padX,
      right:  side - bbox.width  - padX,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  // Verify padded is square.
  const pmeta = await sharp(padded).metadata()
  if (pmeta.width !== pmeta.height) {
    throw new Error(`Pad step failed: ${pmeta.width}×${pmeta.height} (expected ${side}×${side})`)
  }

  // Pass 3: resize to target square.
  const TARGET = 512
  await sharp(padded)
    .resize(TARGET, TARGET)
    .png({ compressionLevel: 9 })
    .toFile(outPath)

  const stat = await sharp(outPath).metadata()
  console.log(`✓ ${outPath}  (orig bbox ${bbox.width}×${bbox.height} → padded ${pmeta.width}×${pmeta.height} → ${stat.width}×${stat.height})`)
}

await processSignature()
await processCafe()
console.log('\nDone. Brand pins now fill their bounding box edge-to-edge.')
