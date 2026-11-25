const puppeteer = require('./frontend/node_modules/puppeteer-core');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Visiting live production https://queueless-os.vercel.app/ ...');
  await page.goto('https://queueless-os.vercel.app/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const heroLive = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_live_hero_light_fixed.png';
  await page.screenshot({ path: heroLive });
  console.log('Saved live hero screenshot to:', heroLive);

  // Visit live portal
  console.log('Visiting live production https://queueless-os.vercel.app/portal ...');
  await page.goto('https://queueless-os.vercel.app/portal', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('button');
    for (const b of tabs) {
      if (b.innerText.trim().includes('Track Token') && !b.closest('nav') && !b.closest('header')) {
        b.click();
        break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  const portalLive = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_live_portal_light_fixed.png';
  await page.screenshot({ path: portalLive });
  console.log('Saved live portal screenshot to:', portalLive);

  await browser.close();
})();
