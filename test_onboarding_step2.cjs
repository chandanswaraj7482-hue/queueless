const puppeteer = require('./frontend/node_modules/puppeteer-core');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  await page.goto('http://localhost:5173/signup', { waitUntil: 'networkidle2' });

  // Fill Step 1 required fields
  await page.type('input[placeholder="e.g. Apex Multispecialty Hospital"]', 'Apex Care Clinic');
  await page.type('input[placeholder="e.g. London / Mumbai / Dubai / New York"]', 'New Delhi');
  await page.type('input[placeholder="+1 (555) 000-0000 or 9876543210"]', '9876543210');
  await page.type('input[placeholder="director@apexhealth.com"]', 'director@caremax.com');
  await page.type('input[placeholder="••••••••••••"]', 'SecretPass123!');

  // Click proceed button to go to Step 2
  const proceedBtn = await page.$('button[type="submit"]');
  if (proceedBtn) {
    await proceedBtn.click();
  }

  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_step2_passwords.png',
    fullPage: false
  });

  console.log('Screenshot captured to verified_step2_passwords.png');
  await browser.close();
})();
