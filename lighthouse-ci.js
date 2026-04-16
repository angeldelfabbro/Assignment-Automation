import fs from 'fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const URL = process.env.LIGHTHOUSE_URL || 'https://raider-test-site.onrender.com/';

// thresholds (0–1 scale)
const THRESHOLDS = {
  performance: 0.7,
  accessibility: 0.8,
};

let exitCode = 0;

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
});

try {
  const result = await lighthouse(URL, {
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility'],
    output: 'json',
    logLevel: 'info',
  });

  const { lhr } = result;

  // ✅ Save report safely
  try {
    fs.writeFileSync('./lighthouse-report.json', JSON.stringify(lhr, null, 2));
    console.log('Report saved to lighthouse-report.json');
  } catch (err) {
    console.error('Failed to write report:', err.message);
    exitCode = 1;
  }

  const scores = {
    performance: lhr.categories.performance.score,
    accessibility: lhr.categories.accessibility.score,
  };

  console.log('\n=== Lighthouse Scores ===');
  for (const [key, value] of Object.entries(scores)) {
    console.log(`${key}: ${Math.round(value * 100)}`);
  }

  // ❌ Check thresholds
  for (const [key, min] of Object.entries(THRESHOLDS)) {
    if (scores[key] < min) {
      console.error(`❌ ${key} below threshold: ${scores[key]} < ${min}`);
      exitCode = 1;
    }
  }

  if (exitCode === 0) {
    console.log('✅ All Lighthouse checks passed');
  }

} catch (err) {
  console.error('\nLighthouse run failed:');
  console.error(err.stack || err);
  exitCode = 1;
} finally {
  await chrome.kill();
}

// ✅ Proper CI exit (no hard crash)
process.exitCode = exitCode;