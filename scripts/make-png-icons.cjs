const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Lightweight pure Node.js PNG generator with no external dependencies
function createSolidPNG(width, height, r, g, b, a = 255) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type: None

    // Create a sleek rounded / bordered icon with gradient effect
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxR = width * 0.46;

      // Color computation: Indigo/Violet gradient with glowing core
      const gradRatio = (x + y) / (width + height);
      let pr = Math.floor(14 + 80 * gradRatio);
      let pg = Math.floor(22 + 50 * gradRatio);
      let pb = Math.floor(45 + 160 * gradRatio);

      // Inner hexagon / diamond highlight
      if (Math.abs(dx) + Math.abs(dy) < width * 0.28) {
        pr = 99;
        pg = 102;
        pb = 241; // Indigo 500
      } else if (Math.abs(dx) + Math.abs(dy) < width * 0.32) {
        pr = 168;
        pg = 85;
        pb = 247; // Violet 500
      }

      // Border gradient
      if (dist > maxR - 4 && dist <= maxR) {
        pr = 99;
        pg = 102;
        pb = 241;
      } else if (dist > maxR) {
        // Transparent outside circular mask
        pr = 8;
        pg = 13;
        pb = 26;
      }

      rawData[pixelOffset] = pr;
      rawData[pixelOffset + 1] = pg;
      rawData[pixelOffset + 2] = pb;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit depth
  ihdr.writeUInt8(6, 9); // RGBA color
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT Chunk
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(len + 12);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crcTable = getCrcTable();
  let crc = 0xffffffff;
  for (let i = 4; i < len + 8; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ chunk[i]) & 0xff];
  }
  crc = crc ^ 0xffffffff;
  chunk.writeInt32BE(crc, len + 8);
  return chunk;
}

let crcTable = null;
function getCrcTable() {
  if (crcTable) return crcTable;
  crcTable = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate 192x192 and 512x512
const png192 = createSolidPNG(192, 192, 99, 102, 241);
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), png192);
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192.png'), png192);

const png512 = createSolidPNG(512, 512, 99, 102, 241);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), png512);
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), png512);

console.log('Successfully generated PWA PNG icons!');
