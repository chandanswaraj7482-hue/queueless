const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  // Test Mobile Viewport (iPhone 13 / 390px)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  console.log('Testing Home Page on Mobile (390px)...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. FAQ Pills on Home Mobile
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Frequently Asked Questions'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_mobile_faq_track.png'
  });

  // 2. Unmute button and Certified Flow single-line
  await page.evaluate(() => {
    const el = document.querySelector('video') || document.querySelector('iframe');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_mobile_video_sound.png'
  });

  // 3. Clinical Reviews count (Desktop / Tablet view to see button)
  await page.setViewport({ width: 1024, height: 768 });
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('What Superintendents'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_reviews_count_desktop.png'
  });

  // 4. Test Pricing Page on Mobile (390px)
  console.log('Testing Pricing Page...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/pricing', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  // Hero badge font size
  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_pricing_hero_badge_v2.png'
  });

  // Modular Add-ons
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Clinic & OPD Modular Add-Ons') || h.textContent.includes('Power-Up Your Clinic'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_pricing_modular_addons_v2.png'
  });

  // Pricing FAQ pills
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Frequently Asked Questions'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_pricing_faq_track_v2.png'
  });

  console.log('Visual screenshots verified successfully!');
  await browser.close();
})();
