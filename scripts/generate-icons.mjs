import zlib from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public');
mkdirSync(outDir, { recursive: true });

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    for (let x = 0; x < width * 4; x++) {
      raw[y * (width * 4 + 1) + 1 + x] = rgba[y * width * 4 + x];
    }
  }
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const lerp = (a, b, t) => Math.round(a + (b - a) * t);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function roundedRectCover(x, y, size, radius, padding, gradientFrom, gradientTo) {
  const px = (x + 0.5 + padding) / size;
  const py = (y + 0.5 + padding) / size;
  const g = clamp((x + y) / (size * 2), 0, 1);
  const r = lerp(gradientFrom[0], gradientTo[0], g);
  const gg = lerp(gradientFrom[1], gradientTo[1], g);
  const b = lerp(gradientFrom[2], gradientTo[2], g);
  return [r, gg, b, 255];
}

function buildIcon(size, round) {
  const scale = size / 512;
  const radius = round ? 96 * scale : 0;
  const padding = round ? 0 : 0;
  const rgba = Buffer.alloc(size * size * 4);
  const from = [52, 211, 153];
  const to = [5, 150, 105];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let inside = true;
      if (round) {
        const dx = Math.max(radius - x, radius - (size - 1 - x), 0);
        const dy = Math.max(radius - y, radius - (size - 1 - y), 0);
        inside = dx * dx + dy * dy <= radius * radius;
      }
      const [r, g, b, a] = inside
        ? roundedRectCover(x, y, size, radius, padding, from, to)
        : [0, 0, 0, 0];
      const i = (y * size + x) * 4;
      rgba[i] = r;
      rgba[i + 1] = g;
      rgba[i + 2] = b;
      rgba[i + 3] = a;
    }
  }

  const fill = (x0, y0, x1, y1, color) => {
    const [cr, cg, cb] = color;
    for (let y = Math.round(y0); y <= Math.round(y1); y++) {
      for (let x = Math.round(x0); x <= Math.round(x1); x++) {
        if (x < 0 || y < 0 || x >= size || y >= size) continue;
        const i = (y * size + x) * 4;
        rgba[i] = cr;
        rgba[i + 1] = cg;
        rgba[i + 2] = cb;
        rgba[i + 3] = 255;
      }
    }
  };

  const white = [250, 250, 250];
  const sw = 64 * scale;
  fill(size * 0.30, size * 0.28, size * 0.30 + sw, size * 0.74, white);
  fill(size * 0.30, size * 0.28, size * 0.70, size * 0.28 + sw, white);
  fill(size * 0.30, size * 0.47, size * 0.62, size * 0.47 + sw, white);

  return encodePng(size, size, rgba);
}

writeFileSync(join(outDir, 'pwa-192x192.png'), buildIcon(192, true));
writeFileSync(join(outDir, 'pwa-512x512.png'), buildIcon(512, true));
writeFileSync(join(outDir, 'pwa-512x512-maskable.png'), buildIcon(512, false));

console.log('Iconos PWA generados en /public');