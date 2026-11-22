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

  // Force Light mode
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.style.colorScheme = 'light';
  });
  await new Promise(r => setTimeout(r, 500));

  // Screenshot sections of home page in light mode
  // 1. Hero
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/light_home_hero.png' });

  // 2. Scroll to middle
  await page.evaluate(() => window.scrollTo(0, 1500));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/light_home_mid.png' });

  // 3. Scroll to comparison / features
  await page.evaluate(() => window.scrollTo(0, 3200));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/light_home_features.png' });

  // 4. Scroll to reviews carousel & simulator
  await page.evaluate(() => window.scrollTo(0, 5000));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/light_home_reviews.png' });

  // 5. Scroll to executive walkthrough / sitelinks
  await page.evaluate(() => window.scrollTo(0, 6800));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/light_home_walkthrough.png' });

  // 6. Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/light_home_footer.png' });

  console.log('Screenshots captured in light mode!');
  await browser.close();
})();
