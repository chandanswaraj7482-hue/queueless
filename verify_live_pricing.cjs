const puppeteer = require('./frontend/node_modules/puppeteer-core');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });

  console.log('Visiting live production https://queueless-os.vercel.app/pricing ...');
  await page.goto('https://queueless-os.vercel.app/pricing', { waitUntil: 'networkidle2' });

  // Scroll to Modular Addons section
  await page.evaluate(() => {
    const el = document.evaluate("//h3[contains(., 'Power-Up Your Clinic')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Click next arrow to view Card 2 (WhatsApp)
  const nextBtn = await page.$('button[aria-label="Next modular addon card"]');
  if (nextBtn) {
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }

  const livePath = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_live_modular_addons_card2.png';
  await page.screenshot({ path: livePath });
  console.log('Saved live screenshot to:', livePath);

  await browser.close();
})();
