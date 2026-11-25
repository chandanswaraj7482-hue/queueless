const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1100 });

  await page.goto('http://localhost:5173/signup', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  // Type Step 1 fields
  await page.type('input[placeholder*="Apex"]', 'Apex Specialty Hospital');
  await page.type('input[placeholder*="London"]', 'Mumbai');
  await page.type('input[placeholder*="98765"]', '9876543210');
  await page.type('input[placeholder*="director@"]', 'director@apexspecialty.com');
  await page.type('input[placeholder*="••••••••••••"]', 'DirectorPass123');

  // Step 1: Click Proceed to Plan Selection
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const p1 = btns.find(b => b.innerText.includes('Proceed to Plan Selection'));
    if (p1) p1.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Step 2: Click Proceed to Payment
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const p2 = btns.find(b => b.innerText.includes('Proceed to Payment'));
    if (p2) p2.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const screenshotPath = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_step3_payment_real_only.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Saved Step 3 payment screenshot to:', screenshotPath);

  await browser.close();
})();
