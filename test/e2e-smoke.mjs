// E2E Smoke test script for CHRONOS — Aeternum
import http from 'http';

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function runSmokeTests() {
  console.log('--- CHRONOS E2E SMOKE TESTS ---');
  const baseUrl = 'http://localhost:3000';

  try {
    // 1. Root page test
    console.log('[1/7] Verifying root page response...');
    const page = await checkUrl(baseUrl);
    if (page.statusCode !== 200) {
      throw new Error(`Expected HTTP 200, got ${page.statusCode}`);
    }
    console.log('  ✓ Root page responded with HTTP 200');

    // 2. Title & Branding verification
    console.log('[2/7] Verifying core typography & assets in response...');
    if (!page.data.includes('CHRONOS')) {
      throw new Error('Title "CHRONOS" missing from HTML payload');
    }
    if (!page.data.includes('Aeternum') && !page.data.includes('AETERNUM')) {
      throw new Error('Subtitle "AETERNUM" missing from HTML payload');
    }
    console.log('  ✓ Branding and metadata verified in HTML');

    // 3. Asset availability
    console.log('[3/7] Verifying visual assets (emblem and atmosphere overlay)...');
    const emblem = await checkUrl(`${baseUrl}/chronos/chronos-core-emblem.svg`);
    if (emblem.statusCode !== 200) {
      throw new Error(`Emblem SVG returned ${emblem.statusCode}`);
    }

    const overlay = await checkUrl(`${baseUrl}/chronos/atmosphere-overlay.svg`);
    if (overlay.statusCode !== 200) {
      throw new Error(`Atmosphere SVG returned ${overlay.statusCode}`);
    }
    console.log('  ✓ SVG assets served cleanly');

    // 4. Test Chamber Query Routing
    console.log('[4/7] Verifying shot query route handling...');
    const shotTest = await checkUrl(`${baseUrl}?shot=shot-03`);
    if (shotTest.statusCode !== 200) {
      throw new Error(`Query routing failed with ${shotTest.statusCode}`);
    }
    console.log('  ✓ Query routing supported without SSR crashes');

    // 5. Test Phase 03 City Route & Visual Assets
    console.log('[5/7] Verifying Phase 03 city route handling & asset board...');
    const cityTest = await checkUrl(`${baseUrl}?world=city&view=city-panorama`);
    if (cityTest.statusCode !== 200) {
      throw new Error(`City routing failed with ${cityTest.statusCode}`);
    }
    const artBoard = await checkUrl(`${baseUrl}/chronos/phase03/00-full-art-direction-board.png`);
    if (artBoard.statusCode !== 200) {
      throw new Error(`Phase 03 art board asset returned ${artBoard.statusCode}`);
    }
    console.log('  ✓ City world mode & Phase 03 visual assets verified');

    // 6. Test Phase 04 Segment Routing & Photographic References
    console.log('[6/7] Verifying Phase 04 journey segment routing & photo references...');
    const journeyTest = await checkUrl(`${baseUrl}?world=city&segment=river-reveal`);
    if (journeyTest.statusCode !== 200) {
      throw new Error(`Journey segment routing failed with ${journeyTest.statusCode}`);
    }
    const photoRef = await checkUrl(`${baseUrl}/chronos/phase04/references/01-grand-arrival-prague-square.jpg`);
    if (photoRef.statusCode !== 200) {
      throw new Error(`Phase 04 photo reference returned ${photoRef.statusCode}`);
    }
    console.log('  ✓ Phase 04 flight journey routing & photo references verified');

    // 7. Test Phase 05 Temporal Engine & Era Routing
    console.log('[7/8] Verifying Phase 05 Temporal Engine assets & era route handling...');
    const eraTest = await checkUrl(`${baseUrl}?world=city&era=1450`);
    if (eraTest.statusCode !== 200) {
      throw new Error(`Era 1450 routing failed with ${eraTest.statusCode}`);
    }
    const temporalArt = await checkUrl(`${baseUrl}/chronos/phase05/00-temporal-engine-art-direction.jpg`);
    if (temporalArt.statusCode !== 200) {
      throw new Error(`Phase 05 art direction asset returned ${temporalArt.statusCode}`);
    }
    const manifest05 = await checkUrl(`${baseUrl}/chronos/phase05/manifest.json`);
    if (manifest05.statusCode !== 200) {
      throw new Error(`Phase 05 manifest.json returned ${manifest05.statusCode}`);
    }
    console.log('  ✓ Phase 05 Temporal Engine routing & era assets verified');

    // 8. Test Phase 06 Time Morph Assets & Route Handling
    console.log('[8/8] Verifying Phase 06 Time Morph visual assets & manifest...');
    const morphArt = await checkUrl(`${baseUrl}/chronos/phase06/00-phase06-time-morph-board.jpg`);
    if (morphArt.statusCode !== 200) {
      throw new Error(`Phase 06 art direction asset returned ${morphArt.statusCode}`);
    }
    const manifest06 = await checkUrl(`${baseUrl}/chronos/phase06/manifest.json`);
    if (manifest06.statusCode !== 200) {
      throw new Error(`Phase 06 manifest.json returned ${manifest06.statusCode}`);
    }
    console.log('  ✓ Phase 06 Time Morph art assets & manifest verified');

    console.log('\nALL 8 E2E SMOKE TESTS PASSED CLEANLY.\n');
    process.exit(0);
  } catch (err) {
    console.error('Smoke Test Failed:', err.message);
    process.exit(1);
  }
}

runSmokeTests();
