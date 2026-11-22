const puppeteer = require('./frontend/node_modules/puppeteer-core');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: false,
      defaultViewport: null,
      args: [
        '--window-size=1200,800',
        '--window-position=100,50',
        '--no-first-run',
        '--no-default-browser-check'
      ]
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/reception');
    console.log('Successfully opened headed Chrome!');
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
  } catch (err) {
    console.error('Error:', err);
  }
})();
