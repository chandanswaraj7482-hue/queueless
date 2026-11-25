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
    await page.setViewport({ width: 1280, height: 950 });

    console.log('Navigating to live production: https://queueless-os.vercel.app/#interactive-demo ...');
    await page.goto('https://queueless-os.vercel.app/#interactive-demo', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    // Scroll to the Video Review Showcase section
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('span')).find(s => s.textContent && s.textContent.includes('Live Clinical Workflow & Review Video'));
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
      } else {
        const h = Array.from(document.querySelectorAll('p')).find(p => p.textContent && p.textContent.includes('Every counter has an instant vector QR pass'));
        if (h) h.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    });

    await new Promise((r) => setTimeout(r, 1200));

    const artifactDir = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a';
    await page.screenshot({ path: path.join(artifactDir, 'verified_live_video_review_showcase.png') });
    console.log('Saved verified_live_video_review_showcase.png');

  } catch (err) {
    console.error('Error during live verification:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
