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
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await new Promise(r => setTimeout(r, 600));

  // Find reviews section
  await page.evaluate(() => {
    const el = document.querySelector('section[id*="review"]') || Array.from(document.querySelectorAll('h2, h3')).find(h => h.innerText.includes('Endorsed') || h.innerText.includes('Review') || h.innerText.includes('Leader'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/light_reviews_section.png' });

  // Scroll a bit down
  await page.evaluate(() => window.scrollBy(0, 700));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/light_reviews_section_2.png' });

  // Now find the Executive Walkthrough section
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2, h3, h4')).find(h => h.innerText.includes('Executive Walkthrough') || h.innerText.includes('Schedule'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/light_walkthrough_section.png' });

  console.log('Done capturing reviews and walkthrough');
  await browser.close();
})();
