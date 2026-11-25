const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Mobile Carousel Test (iPhone 14 Pro: 390x844)
  console.log('1. Testing mobile video carousel at 390x844...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(
      e => e.innerText && e.innerText.includes('Select Hospital Video Review')
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_mobile_video_carousel.png' });
  console.log('Saved verified_mobile_video_carousel.png');

  // 2. Policy Modal Test
  console.log('2. Testing Hospital Queue Policy Modal at 1280x900...');
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:5173/check-in/city-health', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const modalOpened = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const policyBtn = btns.find(b => b.innerText && (b.innerText.includes('Hospital Queue Policy') || b.innerText.includes('Policy')));
    if (policyBtn) {
      policyBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked policy button:', modalOpened);
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_long_hospital_policy_modal.png' });
  console.log('Saved verified_long_hospital_policy_modal.png');

  // 3. Desktop Hero Refined Text
  console.log('3. Testing Desktop Hero typography...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_hero_text_refined.png' });
  console.log('Saved verified_hero_text_refined.png');

  await browser.close();
  console.log('All verification screenshots captured successfully!');
})().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
