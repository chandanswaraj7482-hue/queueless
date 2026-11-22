const puppeteer = require('../frontend/node_modules/puppeteer-core');
const fs = require('fs');

async function test() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  console.log('Navigating to live production site...');
  await page.goto('https://queueless-os.vercel.app', { waitUntil: 'networkidle2' });

  // 1. Check viewport dimensions and scroll height
  const metrics = await page.evaluate(() => {
    return {
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      title: document.title
    };
  });
  console.log('Page Metrics:', metrics);

  // 2. Find and click "Write an Endorsement" button in reviews carousel
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText.includes('Write an Endorsement') || b.innerText.includes('Write a review') || b.innerText.includes('Share your clinical experience'));
    if (btn) {
      btn.scrollIntoView({ behavior: 'instant', block: 'center' });
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked review button:', clicked);

  await new Promise(r => setTimeout(r, 1000));

  // 3. Inspect modal bounding box if opened
  const modalInfo = await page.evaluate(() => {
    const modal = document.querySelector('.fixed.inset-0.z-\\[99999\\]');
    if (!modal) return { found: false };
    const innerCard = modal.children[0];
    const rect = innerCard ? innerCard.getBoundingClientRect() : null;
    return {
      found: true,
      cardRect: rect ? { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: rect.width, height: rect.height } : null,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      isFullyVisible: rect ? (rect.top >= 0 && rect.bottom <= window.innerHeight) : false
    };
  });
  console.log('Modal Info:', modalInfo);

  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/modal_centered_verified.png' });

  // Now test closing modal and testing Track OPD Token modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.fixed.inset-0.z-\\[99999\\] button[title="Close modal"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Click Patient Vault or track token
  console.log('Testing Patient Vault / Track OPD Token...');
  const vaultUrl = await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('Patient Vault'));
    return link ? link.href : null;
  });
  console.log('Patient Vault Link:', vaultUrl);

  await browser.close();
}

test().catch(e => {
  console.error(e);
  process.exit(1);
});
