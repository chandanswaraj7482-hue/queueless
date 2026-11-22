const puppeteer = require('./frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Opening /about with domcontentloaded...');
  await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/about_instant_perfect.png' });
  console.log('Saved screenshot to about_instant_perfect.png');

  console.log('Opening /blog with domcontentloaded...');
  await page.goto('http://localhost:5173/blog', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/blog_20_articles_perfect.png' });
  console.log('Saved screenshot to blog_20_articles_perfect.png');

  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href^="/blog/"]'));
    return Array.from(new Set(anchors.map(a => a.getAttribute('href'))));
  });
  console.log('Unique blog articles found:', links.length);
  console.log('Sample:', links.slice(0, 5));

  await browser.close();
})();
