// One-shot crop for the universal lounge map pin. Detects the visible badge
// by alpha + colour (the source has a white background, not transparency),
// crops to that bbox, pads to a square, and writes a 512-side PNG.
//
// Output: public/icons/lounges/lounge-pin.png  (used for every lounge marker)
import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const SRC   = join(__dir, '..', '..', 'Downloads', 'airportlounges map icon.png')
const OUT   = join(__dir, '..', 'public', 'icons', 'lounges', 'lounge-pin.png')

const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info

// "Background" = near-white OR fully transparent. Everything else is the pin.
const isBackground = (r, g, b, a) => {
  if (a < 16) return true
  return r > 240 && g > 240 && b > 240
}

let minX = width, minY = height, maxX = -1, maxY = -1
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const a = channels === 4 ? data[i + 3] : 255
    if (!isBackground(r, g, b, a)) {
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }
}

const bbox = {
  left:   minX,
  top:    minY,
  width:  maxX - minX + 1,
  height: maxY - minY + 1,
}

// Pad to square so the rendered img with object-fit:contain fills the marker.
const side = Math.max(bbox.width, bbox.height)
const padX = Math.floor((side - bbox.width) / 2)
const padY = Math.floor((side - bbox.height) / 2)

// 3-pass: extract → pad → resize, with a colour-key step that converts the
// white source background to alpha so the pin sits transparent on the map.
const cropped = await sharp(SRC)
  .extract(bbox)
  .png()
  .toBuffer()

// Convert near-white to transparent. sharp doesn't have a colour-key op, so
// we do it by hand on the raw buffer.
const rawCrop = await sharp(cropped).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const buf = rawCrop.data
const w = rawCrop.info.width
const h = rawCrop.info.height
for (let i = 0; i < buf.length; i += 4) {
  const r = buf[i], g = buf[i + 1], b = buf[i + 2]
  if (r > 240 && g > 240 && b > 240) buf[i + 3] = 0
}
const keyed = await sharp(buf, { raw: { width: w, height: h, channels: 4 } })
  .png()
  .toBuffer()

const padded = await sharp(keyed)
  .extend({
    top: padY, bottom: side - bbox.height - padY,
    left: padX, right: side - bbox.width - padX,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer()

const pmeta = await sharp(padded).metadata()
if (pmeta.width !== pmeta.height) throw new Error(`Pad mismatch: ${pmeta.width}×${pmeta.height}`)

const TARGET = 512
await sharp(padded)
  .resize(TARGET, TARGET)
  .png({ compressionLevel: 9 })
  .toFile(OUT)

const out = await sharp(OUT).metadata()
console.log(`✓ ${OUT}`)
console.log(`  source: ${width}×${height}  bbox: ${bbox.width}×${bbox.height}  → padded ${pmeta.width}² → out ${out.width}×${out.height}`)
