import { createWriteStream, mkdirSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const crc32Table = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[i] = c
  }
  return t
})()

function crc32(buf) {
  let crc = 0xffffffff
  for (const b of buf) crc = crc32Table[(crc ^ b) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function uint32BE(n) {
  const b = Buffer.alloc(4)
  b.writeUInt32BE(n, 0)
  return b
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const len = uint32BE(data.length)
  const crcInput = Buffer.concat([typeBytes, data])
  return Buffer.concat([len, typeBytes, data, uint32BE(crc32(crcInput))])
}

function makePNG(size, drawFn) {
  // IHDR
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(size, 0)
  ihdrData.writeUInt32BE(size, 4)
  ihdrData[8] = 8   // bit depth
  ihdrData[9] = 2   // color type: RGB
  ihdrData[10] = 0  // compression
  ihdrData[11] = 0  // filter
  ihdrData[12] = 0  // interlace

  // Raw pixels (RGB, size x size)
  const pixels = Buffer.alloc(size * size * 3)
  drawFn(pixels, size)

  // Add filter byte (0 = None) before each row
  const rows = Buffer.alloc(size * (1 + size * 3))
  for (let y = 0; y < size; y++) {
    rows[y * (1 + size * 3)] = 0
    pixels.copy(rows, y * (1 + size * 3) + 1, y * size * 3, (y + 1) * size * 3)
  }

  const compressed = deflateSync(rows, { level: 9 })

  const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    PNG_SIGNATURE,
    chunk('IHDR', ihdrData),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ])
}

function drawIcon(pixels, size) {
  // Background: #1c1c1f (dark)
  const bgR = 0x1c, bgG = 0x1c, bgB = 0x1f

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 3
      pixels[i] = bgR
      pixels[i + 1] = bgG
      pixels[i + 2] = bgB
    }
  }

  // Draw white "N" letterform
  const margin = Math.round(size * 0.2)
  const letterW = size - margin * 2
  const letterH = size - margin * 2
  const stroke = Math.max(2, Math.round(size * 0.1))

  function setPixel(x, y) {
    if (x < 0 || x >= size || y < 0 || y >= size) return
    const i = (y * size + x) * 3
    pixels[i] = 0xff
    pixels[i + 1] = 0xff
    pixels[i + 2] = 0xff
  }

  // Left vertical bar
  for (let y = margin; y < margin + letterH; y++) {
    for (let s = 0; s < stroke; s++) setPixel(margin + s, y)
  }
  // Right vertical bar
  for (let y = margin; y < margin + letterH; y++) {
    for (let s = 0; s < stroke; s++) setPixel(margin + letterW - stroke + s, y)
  }
  // Diagonal stroke (top-left to bottom-right)
  for (let step = 0; step <= letterH; step++) {
    const x = margin + Math.round((step / letterH) * letterW)
    const y = margin + step
    for (let s = 0; s < stroke; s++) {
      setPixel(x + s, y)
      setPixel(x, y + s)
    }
  }
}

mkdirSync('public/icons', { recursive: true })

for (const size of [192, 512]) {
  const png = makePNG(size, drawIcon)
  const ws = createWriteStream(`public/icons/icon-${size}.png`)
  ws.write(png)
  ws.end()
  console.log(`Generated public/icons/icon-${size}.png`)
}
