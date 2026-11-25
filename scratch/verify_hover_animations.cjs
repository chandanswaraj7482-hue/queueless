const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Check Hero section typography & layout
  console.log('1. Checking Hero Section typography & buttons:');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_hero_text_refined.png' });

  // 2. Check Comparison section & hover over Zero-Wait OS card
  console.log('2. Checking Comparison section with hover:');
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(
      e => e.innerText && e.innerText.includes('The Legacy Counter Queue Bottleneck')
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Hover over the right card (Autonomous Zero-Wait Healthcare OS)
  const rightCard = await page.evaluateHandle(() => {
    const title = Array.from(document.querySelectorAll('h3')).find(
      h => h.innerText && h.innerText.includes('Autonomous Zero-Wait Healthcare OS')
    );
    return title ? title.closest('div.rounded-\\[32px\\]') : null;
  });

  if (rightCard) {
    await rightCard.hover();
    await new Promise(r => setTimeout(r, 400));
  }

  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_comparison_hover_right.png' });

  // Hover over the left card (Legacy Counter Queue Bottleneck)
  const leftCard = await page.evaluateHandle(() => {
    const title = Array.from(document.querySelectorAll('h3')).find(
      h => h.innerText && h.innerText.includes('The Legacy Counter Queue Bottleneck')
    );
    return title ? title.closest('div.rounded-\\[32px\\]') : null;
  });

  if (leftCard) {
    await leftCard.hover();
    await new Promise(r => setTimeout(r, 400));
  }

  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_comparison_hover_left.png' });

  await browser.close();
  console.log('Comparison hover tests completed!');
})().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
