/* Offline, resumable export. Starts its own local Vite server if needed. */
const { chromium } = require('../.tools/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync, spawn } = require('node:child_process');

const fps = 60, seconds = 24, count = fps * seconds;
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'public/cinematic/rendered');
const work = path.join(root, '.tools/cinematic-render');
const ffmpeg = process.env.FFMPEG_PATH || path.join(root, '.tools/ffmpeg.exe');
const variants = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'mobile', width: 648, height: 1152 },
];
fs.mkdirSync(work, { recursive: true });
fs.mkdirSync(output, { recursive: true });
const hash = crypto.createHash('sha256');
for (const name of ['src/components/landing3d/DealershipScene.jsx', 'src/components/landing3d/CinematicEffects.jsx', 'src/renderCinematic.jsx', 'assets/render-source/colorosso-facade-v4.glb', 'assets/render-source/colorosso-morning.hdr', 'assets/render-source/terrazzo.jpg']) hash.update(fs.readFileSync(path.join(root, name)));
const signature = hash.digest('hex');
function encode(args) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { cwd: root, stdio: 'inherit' });
  if (result.error || result.status !== 0) throw result.error || new Error(`FFmpeg exit ${result.status}`);
}
let ownedServer;
async function ensureServer() {
  const available = async () => {
    try { return (await fetch('http://127.0.0.1:5190/cinematic-render.html', { signal: AbortSignal.timeout(2000) })).ok; }
    catch { return false; }
  };
  if (await available()) return;
  ownedServer = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), '--configLoader', 'native', '--host', '127.0.0.1', '--port', '5190', '--strictPort'], { cwd: root, windowsHide: true, stdio: 'ignore' });
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await available()) return;
    if (ownedServer.exitCode !== null) throw new Error('Local render server stopped');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error('Local render server did not start');
}
(async () => {
  let browser;
  try {
  await ensureServer();
  browser = await chromium.launch({ headless: true,
    executablePath: process.env.CHROMIUM_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    args: ['--use-angle=d3d11', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
    for (const variant of variants) {
      if (process.argv.includes('--mobile-only') && variant.name !== 'mobile') continue;
      const folder = path.join(work, `${variant.name}-${signature.slice(0, 12)}`);
      fs.mkdirSync(folder, { recursive: true });
      const page = await browser.newPage({ viewport: { width: variant.width, height: variant.height }, deviceScaleFactor: 1 });
      page.on('pageerror', e => console.error('Render page:', e.message));
      await page.goto('http://127.0.0.1:5190/cinematic-render.html', { waitUntil: 'networkidle', timeout: 180000 });
      await page.waitForFunction(() => window.cinematicCapture?.ready && window.cinematicCapture?.draw, null, { timeout: 180000 });
      // Settle the static reflection probes, contact shadows and shader pipeline.
      for (let n = 0; n < 8; n++) await page.evaluate(() => window.cinematicCapture.draw(0));
      for (let i = 0; i < count; i++) {
        const dest = path.join(folder, `${String(i).padStart(5, '0')}.png`);
        if (!fs.existsSync(dest)) {
          const data = await page.evaluate(async p => {
            if (window.cinematicCapture.error) throw new Error(window.cinematicCapture.error);
            let timer;
            try {
              return await Promise.race([
                window.cinematicCapture.draw(p),
                new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Frame render timed out; rerun to resume')), 120000); }),
              ]);
            } finally { clearTimeout(timer); }
          }, i / (count - 1));
          fs.writeFileSync(`${dest}.tmp`, Buffer.from(data.split(',')[1], 'base64'));
          fs.renameSync(`${dest}.tmp`, dest);
        }
        if (i % 30 === 0 || i === count - 1) {
          const status = { variant: variant.name, frame: i + 1, total: count, signature, time: new Date().toISOString() };
          fs.writeFileSync(path.join(work, 'progress.json'), JSON.stringify(status, null, 2));
          console.log(`${variant.name}: ${i + 1}/${count}`);
        }
      }
      await page.close();
      console.log(`Encoding ${variant.name}`);
      const temp = path.join(output, `${variant.name}.partial.mp4`);
      encode(['-framerate', String(fps), '-i', path.join(folder, '%05d.png'), '-frames:v', String(count), '-c:v', 'libx264', '-preset', 'slow', '-threads', '4', '-crf', '23', '-maxrate', variant.name === 'desktop' ? '6M' : '3M', '-bufsize', variant.name === 'desktop' ? '12M' : '6M', '-pix_fmt', 'yuv420p', '-g', '12', '-keyint_min', '12', '-sc_threshold', '0', '-bf', '0', '-movflags', '+faststart', '-an', temp]);
      fs.renameSync(temp, path.join(output, `${variant.name}.mp4`));
      encode(['-i', path.join(folder, '00000.png'), '-frames:v', '1', '-q:v', '2', path.join(output, `${variant.name}-poster.jpg`)]);
    }
    for (const variant of variants) {
      if (!fs.existsSync(path.join(output, `${variant.name}.mp4`)) || !fs.existsSync(path.join(output, `${variant.name}-poster.jpg`))) throw new Error(`Missing output for ${variant.name}`);
    }
    fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify({ signature, fps, seconds, frames: count, variants, renderedAt: new Date().toISOString() }, null, 2));
    console.log('RENDER COMPLETE');
  } finally { if (browser) await browser.close(); if (ownedServer) ownedServer.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
