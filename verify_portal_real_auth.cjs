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

  console.log('Navigating to http://localhost:5173/portal ...');
  await page.goto('http://localhost:5173/portal', { waitUntil: 'networkidle2' });

  // Clear local storage just to be sure we are testing clean visit
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle2' });

  await new Promise(r => setTimeout(r, 1000));

  // Take screenshot of default clean Login state
  const screenshotPath = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_portal_real_auth.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot 1 to:', screenshotPath);

  // Type mobile and an incorrect password
  const mobileInput = await page.$('input[placeholder*="98765"]');
  if (mobileInput) {
    await mobileInput.type('9876543210');
  }

  const passwordInput = await page.$('input[placeholder*="password"]');
  if (passwordInput) {
    await passwordInput.type('wrong_password_99');
  }

  // Submit button should now be enabled
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
    await new Promise(r => setTimeout(r, 1200));
  }

  const errorText = await page.evaluate(() => {
    const err = document.querySelector('.text-red-700, .text-rose-500, .bg-red-50');
    return err ? err.innerText : 'No error found';
  });
  console.log('API / UI rejection message on invalid credentials:', errorText);

  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_portal_auth_error.png' });

  await browser.close();
  console.log('Verification script complete!');
})();
