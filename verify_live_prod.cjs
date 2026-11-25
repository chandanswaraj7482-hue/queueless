const puppeteer = require('./frontend/node_modules/puppeteer-core');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('Visiting live production https://queueless-os.vercel.app/portal ...');
  await page.goto('https://queueless-os.vercel.app/portal', { waitUntil: 'networkidle2' });

  // Clear session so we inspect fresh clean state
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const screenshotPath = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_live_portal_real_auth.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Saved live production screenshot to:', screenshotPath);

  await browser.close();
})();
