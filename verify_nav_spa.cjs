const puppeteer = require('./frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  console.log('Clicking About nav link...');
  await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.innerText.trim() === 'About');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/about_instant_perfect.png' });
  console.log('Captured About page screenshot!');

  console.log('Clicking Blog nav link...');
  await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.innerText.trim() === 'Blog');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/blog_20_articles_perfect.png' });
  console.log('Captured Blog page screenshot!');

  const articlesCount = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href^="/blog/"]'));
    return new Set(links.map(l => l.getAttribute('href'))).size;
  });
  console.log('Total unique articles rendered:', articlesCount);

  await browser.close();
})();
