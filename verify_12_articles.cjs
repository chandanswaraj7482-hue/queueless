const puppeteer = require('./frontend/node_modules/puppeteer-core');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:5173';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle2' });
  const articleCount = await page.$$eval('a[href^="/blog/"]', links => new Set(links.map(l => l.getAttribute('href'))).size);
  console.log(`Rendered ${articleCount} unique clinical research articles on /blog!`);
  await browser.close();
})();
