const puppeteer = require('./frontend/node_modules/puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Testing Review Heading contrast in light mode...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await new Promise(r => setTimeout(r, 600));

  // Scroll to reviews section
  await page.evaluate(() => {
    const el = document.querySelector('section#case-studies') || document.querySelector('section#pricing');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_light_reviews_heading.png' });
  console.log('Saved verified_light_reviews_heading.png');

  console.log('\n2. Testing Footer Queueless Watermark Hover Animation...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 500));

  // Hover over watermark
  const watermark = await page.$('footer h2');
  if (watermark) {
    await watermark.hover();
    await new Promise(r => setTimeout(r, 400));
  }
  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_footer_hover_animation.png' });
  console.log('Saved verified_footer_hover_animation.png');

  console.log('\n3. Checking Master PDF File...');
  const pdfPath = '/Users/apple/Desktop/Queueless_Clinic_OS_Complete_Operating_Manual.pdf';
  if (fs.existsSync(pdfPath)) {
    const stat = fs.statSync(pdfPath);
    console.log(`PDF successfully exists on Desktop: ${stat.size} bytes!`);
  } else {
    console.error('PDF not found on Desktop');
  }

  await browser.close();
})();
