const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Checking Revenue Stat Card on Homepage...');
  await page.goto('https://queueless-os.vercel.app', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  // Set currency to INR to test the longest string: +₹1,84,000
  await page.evaluate(() => {
    localStorage.setItem('queueless_currency', 'INR');
  });
  await page.goto('https://queueless-os.vercel.app', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(el => el.innerText.includes('Stop Losing Revenue'));
    if (heading) heading.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1200));

  const overflowInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.hover-card-premium'));
    const targetCard = cards.find(c => c.innerText.includes('Monthly Recovered Fees'));
    if (!targetCard) return 'target card not found';
    const numEl = targetCard.querySelector('.tabular-nums') || targetCard.querySelector('div');
    const cardRect = targetCard.getBoundingClientRect();
    const numRect = numEl ? numEl.getBoundingClientRect() : null;
    return {
      cardWidth: cardRect.width,
      numWidth: numRect ? numRect.width : 0,
      isOverflowing: numRect ? (numRect.right > cardRect.right + 2 || numRect.left < cardRect.left - 2) : false,
      text: targetCard.innerText.slice(0, 40)
    };
  });
  console.log('Revenue card bounds check:', overflowInfo);

  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_revenue_card_no_overflow.png' });
  console.log('Saved verified_revenue_card_no_overflow.png');

  console.log('2. Checking Restored Pricing on /pricing...');
  await page.goto('https://queueless-os.vercel.app/pricing', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  const prices = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.hover-card-premium'));
    return cards.map(c => c.innerText.slice(0, 80));
  });
  console.log('Pricing cards detected:', prices);

  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_pricing_restored.png' });
  console.log('Saved verified_pricing_restored.png');

  await browser.close();
  console.log('Verification finished successfully!');
})();
