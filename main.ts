// THE WORLD LEDGER — a deterministic 23 November 2026 front-page entry.
// The Pillow-rendered PNG is fixed at build time; runtime needs no clock/network.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LIMIT = 1_048_576;
const MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const IEND = Buffer.from([0, 0, 0, 0, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);
const image = readFileSync(new URL('./entry.png', import.meta.url));

if (image.length < 24 || !image.subarray(0, 8).equals(MAGIC)) {
  throw new Error('entry.png has no valid PNG signature and IHDR');
}
if (image.length > LIMIT) throw new Error(`PNG exceeds 1 MiB: ${image.length}`);
const width = image.readUInt32BE(16);
const height = image.readUInt32BE(20);
if (width !== 1024 || height !== 1024) {
  throw new Error(`Expected exactly 1024x1024, received ${width}x${height}`);
}
// A complete PNG ends with its zero-length IEND chunk and this fixed CRC.
if (image.length < 36 || !image.subarray(image.length - 12).equals(IEND)) {
  throw new Error('entry.png is truncated or has trailing bytes after IEND');
}

const directory = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(directory, { recursive: true });
const destination = join(directory, 'entry.png');
writeFileSync(destination, image);
console.log(`wrote ${destination} — ${width}x${height}, ${image.length} bytes`);
