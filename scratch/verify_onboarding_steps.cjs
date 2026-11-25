const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 950 });

  console.log('1. Loading /signup...');
  await page.goto('http://localhost:5173/signup', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // Fill Step 1 fields including city and phone
  await page.type('input[placeholder="e.g. Apex Multispecialty Hospital"]', 'CareMax Clinic');
  await page.type('input[placeholder="e.g. London / Mumbai / Dubai / New York"]', 'New Delhi');
  await page.type('input[placeholder="+1 (555) 000-0000 or 9876543210"]', '9876543210');
  await page.type('input[placeholder="director@apexhealth.com"]', 'director@caremax.com');
  await page.type('input[placeholder="••••••••••••"]', 'SecretPass123!');

  // Click Continue to Staff PINs
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue to Staff PINs'));
    if (btn) btn.click();
  });
  console.log('Clicked Continue to Staff PINs & Security!');
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot Step 2
  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_step2_pins_and_portals.png',
    fullPage: false
  });
  console.log('Step 2 captured!');

  // Click Proceed to Plan Selection
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Proceed to Plan Selection'));
    if (btn) btn.click();
  });
  console.log('Clicked Proceed to Plan Selection!');
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot Step 3
  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_step3_plan_selection.png',
    fullPage: false
  });
  console.log('Step 3 captured!');

  await browser.close();
  console.log('Onboarding multi-step verification complete!');
})();
