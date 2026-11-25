const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('--- 1. Testing Enterprise Quote Form on Homepage ---');
  await page.goto('https://queueless-os.vercel.app', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => {
    const h3 = Array.from(document.querySelectorAll('h3')).find(el => el.innerText.includes('Enterprise Multi-Floor Quote'));
    if (h3) h3.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_1_enterprise_quote_form_live.png' });
  console.log('Saved verified_1_enterprise_quote_form_live.png');

  console.log('--- 2. Testing /portal Page State ---');
  await page.goto('https://queueless-os.vercel.app/portal', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  const portalInfo = await page.evaluate(() => {
    const btn = document.querySelector('button[type="submit"]');
    return {
      submitBtnText: btn ? btn.innerText.trim() : 'no button',
      isDisabled: btn ? btn.disabled : null
    };
  });
  console.log('Portal state:', portalInfo);
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_2_portal_page_live.png' });
  console.log('Saved verified_2_portal_page_live.png');

  console.log('--- 3. Testing 4 Interactive Reels on Homepage ---');
  await page.goto('https://queueless-os.vercel.app/#case-studies', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    const section = document.querySelector('#case-studies') || document.querySelector('#interactive-demo');
    if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_3_reels_no_bottom_player_live.png' });
  console.log('Saved verified_3_reels_no_bottom_player_live.png');

  console.log('--- 4. Testing /features Heading ---');
  await page.goto('https://queueless-os.vercel.app/features', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  const headingInfo = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return 'no h1';
    return {
      text: h1.innerText,
      innerHTML: h1.innerHTML
    };
  });
  console.log('Features H1:', headingInfo);
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_4_features_heading_live.png' });
  console.log('Saved verified_4_features_heading_live.png');

  await browser.close();
  console.log('All 4 verifications finished successfully!');
})();
