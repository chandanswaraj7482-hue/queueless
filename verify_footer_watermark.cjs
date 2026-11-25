const puppeteer = require('./frontend/node_modules/puppeteer-core');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_footer_watermark_restored.png',
    fullPage: false
  });

  console.log('Footer screenshot captured to verified_footer_watermark_restored.png');
  await browser.close();
})();
