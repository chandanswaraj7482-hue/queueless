const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to http://localhost:5173/features ...');
    await page.goto('http://localhost:5173/features', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1200));

    // Get the h1 client rect and lines
    const h1Info = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      if (!h1) return null;
      const spans = Array.from(h1.querySelectorAll('span.block'));
      return {
        text: h1.innerText,
        spanCount: spans.length,
        span1: spans[0] ? spans[0].innerText : null,
        span2: spans[1] ? spans[1].innerText : null,
        h1Height: h1.offsetHeight,
      };
    });

    console.log('H1 Info on Desktop:', h1Info);

    const artifactDir = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a';
    await page.screenshot({ path: path.join(artifactDir, 'verified_features_heading_2lines.png') });
    console.log('Saved verified_features_heading_2lines.png');

  } catch (err) {
    console.error('Error during verification:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
