const puppeteer = require('./frontend/node_modules/puppeteer-core');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'https://queueless-os.vercel.app';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Testing /about speed & content...');
  const t0 = Date.now();
  await page.goto(`${BASE_URL}/about`, { waitUntil: 'domcontentloaded' });
  const loadTime = Date.now() - t0;
  console.log(`Loaded /about in ${loadTime}ms`);
  const bodyText = await page.evaluate(() => document.body.innerText);
  const hasStuckSpinner = bodyText.includes('LOADING QUEUELESS CLINICAL OS');
  console.log(`Stuck spinner present on /about? ${hasStuckSpinner}`);
  console.log(`/about title & content: ${await page.title()}`);

  console.log('\n2. Testing /blog total articles...');
  await page.goto(`${BASE_URL}/blog`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  const uniqueArticles = await page.$$eval('a[href^="/blog/"]', links => Array.from(new Set(links.map(l => l.getAttribute('href')))));
  console.log(`Rendered ${uniqueArticles.length} unique articles on /blog!`);
  console.log('Articles list:', uniqueArticles);

  console.log('\n3. Testing Review Modal layout...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  
  const opened = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const reviewBtn = btns.find(b => b.innerText.toLowerCase().includes('write a review'));
    if (reviewBtn) {
      reviewBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
      reviewBtn.click();
      return true;
    }
    return false;
  });
  console.log(`Clicked Write a review button: ${opened}`);
  await new Promise(r => setTimeout(r, 800));

  const modalInfo = await page.evaluate(() => {
    const headerTitle = document.querySelector('h4');
    const nameInput = document.querySelector('input[placeholder*="Rajesh Sharma"]');
    const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Publish Endorsement'));
    return {
      title: headerTitle ? headerTitle.innerText : null,
      nameInputExists: !!nameInput,
      submitBtnExists: !!submitBtn
    };
  });
  console.log('Modal elements check:', modalInfo);

  const screenshotPath = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/live_perfect_verification.png';
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to ${screenshotPath}`);

  await browser.close();
})();
