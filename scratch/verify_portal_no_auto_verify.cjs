const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to http://localhost:5173/portal ...');
    await page.goto('http://localhost:5173/portal', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 1200));

    const artifactDir = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a';
    await page.screenshot({ path: path.join(artifactDir, 'verified_portal_login_tab_fixed.png'), fullPage: true });
    console.log('Saved login tab screenshot');

    // Click Track Token tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const trackBtn = btns.find(b => b.textContent && b.textContent.includes('Track Token'));
      if (trackBtn) trackBtn.click();
    });

    await new Promise((r) => setTimeout(r, 800));

    // Check button text
    const buttonText = await page.evaluate(() => {
      const submitBtn = document.querySelector('form button[type="submit"]');
      return submitBtn ? submitBtn.innerText.trim() : 'NO_BUTTON';
    });

    console.log('Track Token Submit Button text:', buttonText);

    if (buttonText.includes('Verifying Identity') || buttonText.includes('Retrieving Details')) {
      console.error('ERROR: Button still shows loading/verifying text on empty form!');
      process.exit(1);
    } else {
      console.log('SUCCESS: Button correctly shows:', buttonText);
    }

    // Screenshot 2: Track Token Tab
    await page.screenshot({ path: path.join(artifactDir, 'verified_portal_track_tab_fixed.png'), fullPage: true });
    console.log('Saved track tab screenshot');

  } catch (err) {
    console.error('Error during verification:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
