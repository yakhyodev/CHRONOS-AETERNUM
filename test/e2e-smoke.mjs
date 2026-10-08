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
    console.log('[8/9] Verifying Phase 06 Time Morph visual assets & manifest...');
    const morphArt = await checkUrl(`${baseUrl}/chronos/phase06/00-phase06-time-morph-board.jpg`);
    if (morphArt.statusCode !== 200) {
      throw new Error(`Phase 06 art direction asset returned ${morphArt.statusCode}`);
    }
    const manifest06 = await checkUrl(`${baseUrl}/chronos/phase06/manifest.json`);
    if (manifest06.statusCode !== 200) {
      throw new Error(`Phase 06 manifest.json returned ${manifest06.statusCode}`);
    }
    console.log('  ✓ Phase 06 Time Morph art assets & manifest verified');

    // 9. Test Phase 07 Explore Mode & Temporal Echoes Assets
    console.log('[9/9] Verifying Phase 07 Explore Mode routing & anomaly assets...');
    const exploreTest = await checkUrl(`${baseUrl}?world=city&mode=explore&district=plaza`);
    if (exploreTest.statusCode !== 200) {
      throw new Error(`Explore mode routing failed with ${exploreTest.statusCode}`);
    }
    const anomalyArt = await checkUrl(`${baseUrl}/chronos/phase07/00-narrative-and-anomalies-board.jpg`);
    if (anomalyArt.statusCode !== 200) {
      throw new Error(`Phase 07 narrative anomalies asset returned ${anomalyArt.statusCode}`);
    }
    const manifest07 = await checkUrl(`${baseUrl}/chronos/phase07/manifest.json`);
    if (manifest07.statusCode !== 200) {
      throw new Error(`Phase 07 manifest.json returned ${manifest07.statusCode}`);
    }
    // 10. Test Phase 08 Observer 07 Story Assets & Manifest
    console.log('[10/11] Verifying Phase 08 story assets & manifest...');
    const storyArt = await checkUrl(`${baseUrl}/chronos/phase08/00-phase08-story-art-direction.jpg`);
    if (storyArt.statusCode !== 200) {
      throw new Error(`Phase 08 art direction asset returned ${storyArt.statusCode}`);
    }
    const manifest08 = await checkUrl(`${baseUrl}/chronos/phase08/manifest.json`);
    if (manifest08.statusCode !== 200) {
      throw new Error(`Phase 08 manifest.json returned ${manifest08.statusCode}`);
    }
    console.log('  ✓ Phase 08 Observer 07 narrative assets verified');

    // 11. Test Phase 09 Paradox Finale Assets & Query Routing
    console.log('[11/11] Verifying Phase 09 Paradox finale assets, endings & manifest...');
    const paradoxArt = await checkUrl(`${baseUrl}/chronos/phase09/00-paradox-art-direction.jpg`);
    if (paradoxArt.statusCode !== 200) {
      throw new Error(`Phase 09 paradox art direction asset returned ${paradoxArt.statusCode}`);
    }
    const manifest09 = await checkUrl(`${baseUrl}/chronos/phase09/manifest.json`);
    if (manifest09.statusCode !== 200) {
      throw new Error(`Phase 09 manifest.json returned ${manifest09.statusCode}`);
    }
    const finaleRoute = await checkUrl(`${baseUrl}?finale=true&seq=0`);
    if (finaleRoute.statusCode !== 200) {
      throw new Error(`Finale query routing failed with ${finaleRoute.statusCode}`);
    }
    const endingRoute = await checkUrl(`${baseUrl}?ending=restore`);
    if (endingRoute.statusCode !== 200) {
      throw new Error(`Ending query routing failed with ${endingRoute.statusCode}`);
    }
    // 12. Test Phase 10 Audio, UI Polish Assets & Manifest
    console.log('[12/12] Verifying Phase 10 cinematic audio files, UI references & manifest...');
    const manifest10 = await checkUrl(`${baseUrl}/chronos/phase10/manifest.json`);
    if (manifest10.statusCode !== 200) {
      throw new Error(`Phase 10 manifest.json returned ${manifest10.statusCode}`);
    }
    const audioChamber = await checkUrl(`${baseUrl}/chronos/phase10/audio/01-chamber-drone.wav`);
    if (audioChamber.statusCode !== 200) {
      throw new Error(`Phase 10 01-chamber-drone.wav returned ${audioChamber.statusCode}`);
    }
    const audioCity = await checkUrl(`${baseUrl}/chronos/phase10/audio/02-aeternum-city-ambience.wav`);
    if (audioCity.statusCode !== 200) {
      throw new Error(`Phase 10 02-aeternum-city-ambience.wav returned ${audioCity.statusCode}`);
    }
    const audioWhoosh = await checkUrl(`${baseUrl}/chronos/phase10/audio/03-temporal-whoosh.wav`);
    if (audioWhoosh.statusCode !== 200) {
      throw new Error(`Phase 10 03-temporal-whoosh.wav returned ${audioWhoosh.statusCode}`);
    }
    const audioEcho = await checkUrl(`${baseUrl}/chronos/phase10/audio/04-echo-chime.wav`);
    if (audioEcho.statusCode !== 200) {
      throw new Error(`Phase 10 04-echo-chime.wav returned ${audioEcho.statusCode}`);
    }
    const audioSwell = await checkUrl(`${baseUrl}/chronos/phase10/audio/05-finale-swell.wav`);
    if (audioSwell.statusCode !== 200) {
      throw new Error(`Phase 10 05-finale-swell.wav returned ${audioSwell.statusCode}`);
    }
    const audioHover = await checkUrl(`${baseUrl}/chronos/phase10/audio/06-ui-hover.wav`);
    if (audioHover.statusCode !== 200) {
      throw new Error(`Phase 10 06-ui-hover.wav returned ${audioHover.statusCode}`);
    }
    const audioConfirm = await checkUrl(`${baseUrl}/chronos/phase10/audio/07-button-confirm.wav`);
    if (audioConfirm.statusCode !== 200) {
      throw new Error(`Phase 10 07-button-confirm.wav returned ${audioConfirm.statusCode}`);
    }
    const audioLoading = await checkUrl(`${baseUrl}/chronos/phase10/audio/08-loading-hum.wav`);
    if (audioLoading.statusCode !== 200) {
      throw new Error(`Phase 10 08-loading-hum.wav returned ${audioLoading.statusCode}`);
    }
    const polishArt = await checkUrl(`${baseUrl}/chronos/phase10/images/00-phase10-audio-ui-board.jpg`);
    if (polishArt.statusCode !== 200) {
      throw new Error(`Phase 10 polish reference image returned ${polishArt.statusCode}`);
    }
    console.log('  ✓ Phase 10 Cinematic Audio cues & UI polish references verified');

    console.log('\nALL 12 E2E SMOKE TESTS PASSED CLEANLY.\n');
    process.exit(0);
  } catch (err) {
    console.error('Smoke Test Failed:', err.message);
    process.exit(1);
  }
}

runSmokeTests();
