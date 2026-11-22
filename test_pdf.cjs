const puppeteer = require('./frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent('<h1>Test PDF</h1>');
  await page.pdf({ path: '/Users/apple/Desktop/test_output.pdf', format: 'A4' });
  await browser.close();
  console.log('PDF generated successfully!');
})();
