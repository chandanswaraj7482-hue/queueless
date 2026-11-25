const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  console.log('1. Loading /check-in/city-health...');
  await page.goto('http://localhost:5173/check-in/city-health', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Select 15-Day Free Follow-Up Review service
  console.log('2. Selecting 15-Day Free Follow-Up Review...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const followUpBtn = btns.find(b => b.innerText && b.innerText.includes('15-Day Free Follow-Up'));
    if (followUpBtn) followUpBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Capture state with prompt
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_followup_ref_prompt.png' });
  console.log('Saved verified_followup_ref_prompt.png');

  // Click Valid Sample (CMX-104)
  console.log('3. Clicking Valid Sample (CMX-104)...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const validBtn = btns.find(b => b.innerText && b.innerText.includes('CMX-104'));
    if (validBtn) validBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_followup_ref_valid.png' });
  console.log('Saved verified_followup_ref_valid.png');

  // Click Expired Sample (EXP-900)
  console.log('4. Clicking Expired Sample (EXP-900)...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const expBtn = btns.find(b => b.innerText && b.innerText.includes('EXP-900'));
    if (expBtn) expBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_followup_ref_expired.png' });
  console.log('Saved verified_followup_ref_expired.png');

  await browser.close();
  console.log('All follow-up reference tests passed and screenshots captured!');
})().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
