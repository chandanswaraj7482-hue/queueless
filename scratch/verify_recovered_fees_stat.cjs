const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  // 1. Check in USD mode (as shown in user's image)
  console.log('1. Loading http://localhost:5173/?currency=USD ...');
  await page.goto('http://localhost:5173/?currency=USD', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  await page.evaluate(() => {
    // Set currency to USD
    localStorage.setItem('queueless_currency', 'USD');
    const el = Array.from(document.querySelectorAll('*')).find(
      e => e.innerText && e.innerText.includes('Stop Losing Revenue')
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_recovered_fees_usd.png' });
  console.log('Saved verified_recovered_fees_usd.png');

  // 2. Check in INR mode
  console.log('2. Testing INR mode ...');
  await page.evaluate(() => {
    localStorage.setItem('queueless_currency', 'INR');
  });
  await page.goto('http://localhost:5173/?currency=INR', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(
      e => e.innerText && e.innerText.includes('Stop Losing Revenue')
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_recovered_fees_inr.png' });
  console.log('Saved verified_recovered_fees_inr.png');

  await browser.close();
  console.log('Verification completed!');
})().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
