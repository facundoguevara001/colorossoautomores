import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { FloatType } from 'three';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

// Deterministic sky projection from the cinematic source; no generated imagery.
const source = readFileSync(new URL('../assets/render-source/colorosso-morning.hdr', import.meta.url));
const hdr = new HDRLoader().setDataType(FloatType).parse(source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength));
const width = 1600, height = 900;
const pixels = Buffer.alloc((width * 3 + 1) * height);
// Frame the low cloud bank, not the blue zenith. Keep every ray above the horizon.
const pitch = 19 * Math.PI / 180, yaw = -.4, fov = Math.tan(32 * Math.PI / 360);
const input = [[.59719,.35458,.04823],[.076,.90834,.01566],[.0284,.13383,.83777]];
const output = [[1.60475,-.53108,-.07367],[-.10208,1.10813,-.00605],[-.00327,-.07276,1.07602]];
const multiply = (matrix, rgb) => matrix.map(row => row.reduce((sum, v, i) => sum + v * rgb[i], 0));
function displayColor(rgb) {
  let c = multiply(input, rgb.map(v => v * .85 * 1.05 / .6));
  c = c.map(v => (v * (v + .0245786) - .000090537) / (v * (.983729 * v + .432951) + .238081));
  return multiply(output, c).map(v => {
    v = Math.max(0, Math.min(1, v));
    return Math.round(255 * (v <= .0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - .055));
  });
}
function sample(u, v) {
  const x = ((u % 1 + 1) % 1) * hdr.width - .5;
  const y = Math.max(0, Math.min(hdr.height - 1, v * hdr.height - .5));
  const x0 = Math.floor(x), y0 = Math.floor(y), tx = x - x0, ty = y - y0;
  const at = (xx, yy, channel) => hdr.data[(Math.min(hdr.height - 1, yy) * hdr.width + (xx + hdr.width) % hdr.width) * 4 + channel];
  return [0,1,2].map(c => (at(x0,y0,c)*(1-tx)+at(x0+1,y0,c)*tx)*(1-ty)+(at(x0,y0+1,c)*(1-tx)+at(x0+1,y0+1,c)*tx)*ty);
}
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const sx = (2 * (x + .5) / width - 1) * fov * width / height;
    const sy = (1 - 2 * (y + .5) / height) * fov;
    const dy = Math.sin(pitch) + sy * Math.cos(pitch);
    const dz = Math.cos(pitch) - sy * Math.sin(pitch);
    const length = Math.hypot(sx, dy, dz);
    const u = .5 + (Math.atan2(sx, dz) + yaw) / (2 * Math.PI);
    const v = Math.acos(dy / length) / Math.PI;
    const color = displayColor(sample(u, v));
    const offset = y * (width * 3 + 1) + 1 + x * 3;
    pixels.set(color, offset);
  }
}
function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name = Buffer.from(type), length = Buffer.alloc(4), crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length); crc.writeUInt32BE(crc32(Buffer.concat([name,data])));
  return Buffer.concat([length,name,data,crc]);
}
const header = Buffer.alloc(13);
header.writeUInt32BE(width); header.writeUInt32BE(height,4); header[8]=8; header[9]=2;
const png = Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(pixels,{level:9})),chunk('IEND',Buffer.alloc(0))]);
writeFileSync(new URL('../public/images/colorosso-morning-sky.png',import.meta.url),png);
console.log(`Sky exported from ${hdr.width}x${hdr.height} HDR: ${width}x${height} PNG (${png.length} bytes).`);
