const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  console.log('Navigating to check-in page...');
  await page.goto('http://localhost:5173/check-in/city-health', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Accept policy modal if visible
  try {
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('I Understand & Accept Policy')) {
        await btn.click();
        await new Promise(r => setTimeout(r, 500));
        break;
      }
    }
  } catch (e) {}

  // Scroll down to patient registration fields
  await page.evaluate(() => {
    window.scrollTo({ top: 450, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Capture Check-In screenshot
  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_checkin_country_selector.png',
    fullPage: false
  });
  console.log('Captured check-in screenshot');

  // Click on the country selector button to show dropdown
  const countryBtn = await page.$('button[title*="Selected country"]');
  if (countryBtn) {
    await countryBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_checkin_dropdown_open.png',
      fullPage: false
    });
    console.log('Captured dropdown open screenshot');
  }

  // Check Patient Portal
  console.log('Navigating to Patient Portal...');
  await page.goto('http://localhost:5173/portal', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_portal_country_selector.png',
    fullPage: false
  });
  console.log('Captured portal screenshot');

  // Check Onboarding
  console.log('Navigating to Onboarding...');
  await page.goto('http://localhost:5173/onboarding', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    window.scrollTo({ top: 400, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_onboarding_country_selector.png',
    fullPage: false
  });
  console.log('Captured onboarding screenshot');

  await browser.close();
  console.log('Verification completed successfully!');
})();
