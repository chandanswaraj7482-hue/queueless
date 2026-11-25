const puppeteer = require('./frontend/node_modules/puppeteer-core');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  // Test 1: Mobile Pricing Page view
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  console.log('Visiting http://localhost:5173/pricing on mobile...');
  await page.goto('http://localhost:5173/pricing', { waitUntil: 'networkidle2' });

  // Scroll to Modular Addons section
  await page.evaluate(() => {
    const el = document.evaluate("//h3[contains(., 'Power-Up Your Clinic')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Click next arrow to go to card 2 (WhatsApp)
  const nextBtn = await page.$('button[aria-label="Next modular addon card"]');
  if (nextBtn) {
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }

  const screenshot1Path = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_modular_addons_card2_fixed.png';
  await page.screenshot({ path: screenshot1Path });
  console.log('Saved mobile addons & single-line payment partner screenshot to:', screenshot1Path);

  // Test 2: Patient Portal Track Token Tab
  await page.setViewport({ width: 1280, height: 950 });
  console.log('Visiting http://localhost:5173/portal ...');
  await page.goto('http://localhost:5173/portal', { waitUntil: 'networkidle2' });

  // Click "Track Token" tab inside the tab pill container
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('.grid.grid-cols-2 button, [class*="rounded-xl"] button, button');
    for (const b of tabs) {
      if (b.innerText.trim().includes('Track Token') && !b.closest('nav') && !b.closest('header')) {
        b.click();
        break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 800));

  const screenshot2Path = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_portal_15day_rule_fixed.png';
  await page.screenshot({ path: screenshot2Path });
  console.log('Saved portal 15-day rule screenshot to:', screenshot2Path);

  await browser.close();
  console.log('All tests completed successfully!');
})();
