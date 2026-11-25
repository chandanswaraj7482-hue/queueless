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

  // Step 1
  await page.type('input[placeholder="e.g. Apex Multispecialty Hospital"]', 'City Care Hospital');
  await page.type('input[placeholder="e.g. London / Mumbai / Dubai / New York"]', 'Mumbai');
  await page.type('input[placeholder="+1 (555) 000-0000 or 9876543210"]', '9876543210');
  await page.type('input[placeholder="director@apexhealth.com"]', 'director@citycare.com');
  await page.type('input[placeholder="••••••••••••"]', 'Pass123456!');

  // Proceed to Step 2
  let proceedBtn = await page.$('button[type="submit"]');
  if (proceedBtn) await proceedBtn.click();
  await new Promise(r => setTimeout(r, 800));

  // Proceed to Step 3
  proceedBtn = await page.$('button[type="submit"]');
  if (proceedBtn) await proceedBtn.click();
  await new Promise(r => setTimeout(r, 800));

  // Proceed to Step 4: Click button with text "Proceed to Payment"
  const btns = await page.$$('button');
  for (const b of btns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes('Proceed to Payment')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));

  // In Step 4: Click "UPI AutoPay (Cashfree)" tab
  const step4Tabs = await page.$$('button');
  for (const b of step4Tabs) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && (txt.includes('UPI AutoPay') || txt.includes('Cashfree'))) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));

  // Click "Google Pay" button
  const upiBtns = await page.$$('button');
  for (const b of upiBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes('Google Pay')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_step4_cashfree_autopay.png',
    fullPage: false
  });

  console.log('Step 4 Cashfree AutoPay captured!');
  await browser.close();
})();
