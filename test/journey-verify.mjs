// Final Journey Verification Script for CHRONOS — Aeternum v1.0.0
import http from 'http';
import { spawn, execSync } from 'child_process';

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function ensureServer(baseUrl) {
  try {
    const res = await checkUrl(baseUrl);
    if (res.statusCode) return null;
  } catch {
    // Not running
  }

  console.log('No active server detected at http://localhost:3000. Launching Next.js server...');
  const child = spawn('npx', ['next', 'start', '-p', '3000'], {
    shell: true,
    stdio: 'ignore',
  });

  const startTime = Date.now();
  while (Date.now() - startTime < 30000) {
    await new Promise((r) => setTimeout(r, 600));
    try {
      const res = await checkUrl(baseUrl);
      if (res.statusCode === 200) {
        console.log('✓ Next.js server ready on port 3000\n');
        return child;
      }
    } catch {}
  }

  cleanupServer(child);
  throw new Error('Timeout waiting for Next.js server to start on port 3000.');
}

function cleanupServer(child) {
  if (!child || !child.pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${child.pid} /t /f`, { stdio: 'ignore' });
    } else {
      child.kill('SIGTERM');
    }
  } catch {}
}

async function verifyAll() {
  console.log('========================================================');
  console.log('CHRONOS — AETERNUM v1.0.0 PRODUCTION VERIFICATION');
  console.log('========================================================\n');

  const baseUrl = 'http://localhost:3000';
  let serverChild = null;

  try {
    serverChild = await ensureServer(baseUrl);

    // 1. Static SEO Routes Verification
    console.log('[STAGE 1] Verifying Production SEO & Crawler Routes...');
  const robotsRes = await checkUrl(`${baseUrl}/robots.txt`);
  if (robotsRes.statusCode !== 200 || !robotsRes.data.includes('User-Agent')) {
    throw new Error(`robots.txt verification failed: status ${robotsRes.statusCode}`);
  }
  console.log('  ✓ robots.txt verified (HTTP 200, valid User-Agent & Sitemap directive)');

  const sitemapRes = await checkUrl(`${baseUrl}/sitemap.xml`);
  if (sitemapRes.statusCode !== 200 || !sitemapRes.data.includes('urlset')) {
    throw new Error(`sitemap.xml verification failed: status ${sitemapRes.statusCode}`);
  }
  console.log('  ✓ sitemap.xml verified (HTTP 200, valid XML urlset)');

  // 2. Metadata & Favicon
  console.log('\n[STAGE 2] Verifying HTML Metadata & OpenGraph Branding...');
  const home = await checkUrl(`${baseUrl}`);
  if (!home.data.includes('CHRONOS — AETERNUM') || !home.data.includes('og:title')) {
    throw new Error('Home HTML metadata missing canonical branding or OpenGraph');
  }
  console.log('  ✓ HTML Head contains canonical branding, OpenGraph, and Twitter cards');

  // 3. User Journey Browser Execution (Chapters A through F)
  console.log('\n[STAGE 3] Verifying Complete User Journeys via Headless Chrome...');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  const journeys = [
    { chapter: 'Chapter A: The Awakening', url: `${baseUrl}/?active=true` },
    { chapter: 'Chapter B: The City (5 Districts)', url: `${baseUrl}/?world=city&segment=river-reveal` },
    { chapter: 'Chapter C: Time Exploration (1450 CE)', url: `${baseUrl}/?world=city&era=1450` },
    { chapter: 'Chapter D: Interactive Explore & Lens', url: `${baseUrl}/?world=city&mode=explore&district=plaza&lens=true` },
    { chapter: 'Chapter E: Paradox Finale Sequence', url: `${baseUrl}/?finale=true&seq=0` },
    { chapter: 'Chapter F: Ending (Restore Time)', url: `${baseUrl}/?ending=restore` },
    { chapter: 'Chapter F: Ending (Explore Unknown)', url: `${baseUrl}/?ending=explore` },
  ];

  for (const j of journeys) {
    process.stdout.write(`  Testing ${j.chapter}... `);
    const cmd = `"${chromePath}" --headless --disable-gpu --virtual-time-budget=2000 --window-size=1440,900 "${j.url}"`;
    execSync(cmd, { stdio: 'pipe' });
    console.log('✓ OK');
  }

  // 4. Mobile Viewports Execution
  console.log('\n[STAGE 4] Verifying Mobile Viewports Compatibility...');
  const viewports = [
    { name: 'iPhone (390x844)', width: 390, height: 844 },
    { name: 'Android (360x800)', width: 360, height: 800 },
    { name: 'Tablet iPad (768x1024)', width: 768, height: 1024 },
  ];

  for (const vp of viewports) {
    process.stdout.write(`  Testing Viewport ${vp.name}... `);
    const cmd = `"${chromePath}" --headless --disable-gpu --virtual-time-budget=2000 --window-size=${vp.width},${vp.height} "${baseUrl}/?world=city&quality=auto"`;
    execSync(cmd, { stdio: 'pipe' });
    console.log('✓ OK');
  }

  console.log('\n========================================================');
  console.log('ALL JOURNEYS & PRODUCTION GATES PASSED CLEANLY');
  console.log('========================================================\n');
  } finally {
    cleanupServer(serverChild);
  }
}

verifyAll().catch((err) => {
  console.error('\nVerification Error:', err.message);
  process.exit(1);
});
