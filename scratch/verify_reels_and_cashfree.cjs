const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');
const path = require('path');
const { spawn } = require('child_process');

async function main() {
  // Start vite preview server on 4173
  const preview = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    cwd: '/Users/apple/.gemini/antigravity/scratch/queueless/frontend',
    stdio: 'ignore'
  });

  await new Promise((r) => setTimeout(r, 2000));

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 950 });

    // 1. Verify 4 Clinical Reels (In-Card Reels, No bottom duplicate)
    console.log('Navigating to animated reels...');
    await page.goto('http://localhost:4173/#case-studies', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1500));

    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('span')).find(s => s.textContent && s.textContent.includes('Interactive Clinical Reels'));
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_4_reels_in_card_clean.png'
    });
    console.log('Saved verified_4_reels_in_card_clean.png');

    // Click sound on Reel 1 (Dr. Rohan Sharma)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const soundBtn = btns.find(b => b.textContent && b.textContent.includes('Sound'));
      if (soundBtn) soundBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_reel1_active_voiceover.png'
    });
    console.log('Saved verified_reel1_active_voiceover.png');

    // 2. Verify Dedicated Cashfree UPI AutoPay Tab on Signup
    console.log('Navigating to signup/onboarding...');
    await page.goto('http://localhost:4173/signup?plan=PROFESSIONAL&currency=INR&cycle=MONTHLY&mode=cashfree', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1000));

    // Fill Step 1
    await page.type('input[placeholder*="Apex"]', 'CareMax Superspecialty');
    await page.type('input[placeholder*="London"]', 'Delhi');
    await page.type('input[placeholder*="98765"]', '9876543210');
    await page.type('input[placeholder*="director@"]', 'director@caremax.in');
    await page.type('input[type="password"]', 'SecurePass123!');

    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Step 2 submit
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Step 3: Click "Proceed to Payment"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const proceedBtn = btns.find(b => b.textContent && b.textContent.includes('Proceed to Payment'));
      if (proceedBtn) proceedBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    // Type UPI VPA directly
    await page.type('input[placeholder*="9876543210@"]', 'director@okhdfcbank');
    await new Promise((r) => setTimeout(r, 500));

    // Click Authorize via Cashfree UPI AutoPay button to open Cashfree Dashboard Modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const authBtn = btns.find(b => b.textContent && b.textContent.includes('Authorize via Cashfree UPI AutoPay'));
      if (authBtn) authBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));

    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_cashfree_dashboard_modal.png'
    });
    console.log('Saved verified_cashfree_dashboard_modal.png');

    // 3. Verify Enterprise Multi-Floor Quote Form country code sync
    console.log('Navigating to homepage for Enterprise form verification...');
    await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1000));

    await page.evaluate(() => {
      const h3s = Array.from(document.querySelectorAll('h3'));
      const enterprise = h3s.find(h => h.textContent && h.textContent.includes('Enterprise Multi-Floor'));
      if (enterprise) enterprise.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_enterprise_quote_form_clean.png'
    });
    console.log('Saved verified_enterprise_quote_form_clean.png');

  } catch (err) {
    console.error('Puppeteer verification failed:', err);
  } finally {
    await browser.close();
    preview.kill();
  }
}

main();
