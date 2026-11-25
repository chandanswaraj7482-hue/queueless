const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  // Simulate existing localStorage from other pages to test resistance against auto-submit
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('queueless_patient_session', JSON.stringify({
      authProvider: 'google',
      email: 'test@example.com',
      name: 'Ramesh'
    }));
  });

  console.log('Navigating to http://localhost:5173/portal ...');
  await page.goto('http://localhost:5173/portal', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  const buttonText = await page.evaluate(() => {
    const btn = document.querySelector('form button[type="submit"]');
    return btn ? btn.innerText.trim() : 'NO BUTTON FOUND';
  });

  const isDisabled = await page.evaluate(() => {
    const btn = document.querySelector('form button[type="submit"]');
    return btn ? btn.disabled : null;
  });

  console.log('Button Text on Mount:', buttonText);
  console.log('Button is Disabled (empty fields):', isDisabled);

  const screenshotPath = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_portal_no_auto_submit.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.close();
})();
