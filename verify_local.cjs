const puppeteer = require('./frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Opening http://localhost:5173/');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  
  // Click write a review
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
  console.log('Opened review modal?', opened);
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/modal_pinned_perfect.png' });
  console.log('Saved screenshot to modal_pinned_perfect.png');

  console.log('2. Opening http://localhost:5173/about');
  await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/about_instant_perfect.png' });
  console.log('Saved screenshot to about_instant_perfect.png');

  console.log('3. Opening http://localhost:5173/blog');
  await page.goto('http://localhost:5173/blog', { waitUntil: 'networkidle2' });
  const articleLinks = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href^="/blog/"]'));
    return Array.from(new Set(anchors.map(a => a.getAttribute('href'))));
  });
  console.log('Rendered unique articles on /blog:', articleLinks.length);
  console.log('Sample articles:', articleLinks.slice(0, 5));

  await browser.close();
})();
