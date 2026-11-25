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

  // Clear localStorage so we test clean user visiting for the first time
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Check 1: Hero Heading (Zero-Wait intact, light theme default)
  const heroPath = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_hero_no_isolated_wait.png';
  await page.screenshot({ path: heroPath });
  console.log('Saved hero screenshot to:', heroPath);

  // Check 2: Footer unified single-line payment & security badge
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 600));

  const footerPath = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_footer_unified_payment.png';
  await page.screenshot({ path: footerPath });
  console.log('Saved footer screenshot to:', footerPath);

  // Check 3: Patient Portal (/portal) - verify default light mode and country flag
  await page.goto('http://localhost:5173/portal', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('button');
    for (const b of tabs) {
      if (b.innerText.trim().includes('Track Token') && !b.closest('nav') && !b.closest('header')) {
        b.click();
        break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 800));

  const portalPath = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_portal_light_theme_with_flag.png';
  await page.screenshot({ path: portalPath });
  console.log('Saved portal screenshot to:', portalPath);

  await browser.close();
  console.log('All verifications complete!');
})();
