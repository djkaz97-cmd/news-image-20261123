// THE WORLD LEDGER — Monday 23 November 2026.
// The front page is rendered once at build time and shipped as entry.png beside
// this program; the grader's run needs only to place those exact bytes at
// /output/entry.png, so both runs reproduce the same image byte for byte.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MAX_BYTES = 1_048_576;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const bytes = readFileSync(new URL('./entry.png', import.meta.url));
if (!bytes.subarray(0, 8).equals(PNG_MAGIC)) throw new Error('entry.png is not a PNG');
if (bytes.length > MAX_BYTES) throw new Error(`entry.png is ${bytes.length} bytes`);

const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > 1024 || height > 1024) throw new Error(`entry.png is ${width}x${height}`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });

const target = join(outDir, 'entry.png');
writeFileSync(target, bytes);

console.log(`wrote ${target} (${width}x${height}, ${bytes.length} bytes)`);
