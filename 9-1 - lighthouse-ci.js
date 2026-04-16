import fs from 'fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const URL =
  process.env.LIGHTHOUSE_URL ?? 'https://raider-test-site.onrender.com/';

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

  const lhr = result.lhr;

  // Save report safely
  try {
    fs.writeFileSync(
      './lighthouse-report.json',
      JSON.stringify(lhr, null, 2)
    );
    console.log('Report saved to lighthouse-report.json');
  } catch (err) {
    console.error('Failed to write report:', err);
    exitCode = 1;
  }

  const scores = {
    performance: lhr.categories.performance.score ?? 0,
    accessibility: lhr.categories.accessibility.score ?? 0,
  };

  console.log('\n=== Lighthouse Scores ===');
  Object.keys(scores).forEach((key) => {
    console.log(`${key}: ${Math.round(scores[key] * 100)}`);
  });

  Object.keys(THRESHOLDS).forEach((key) => {
    if (scores[key] < THRESHOLDS[key]) {
      console.error(
        `❌ ${key} below threshold: ${scores[key]} < ${THRESHOLDS[key]}`
      );
      exitCode = 1;
    }
  });

  if (exitCode === 0) {
    console.log('✅ All Lighthouse checks passed');
  }
} catch (err) {
  const error = err;
  console.error('\nLighthouse run failed:');
  console.error(error.stack || error.message || error);
  exitCode = 1;
} finally {
  await chrome.kill();
}

process.exitCode = exitCode;
