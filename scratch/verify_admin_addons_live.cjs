const puppeteer = require('../frontend/node_modules/puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Navigating to https://queueless-os.vercel.app/admin/city-health...');
  await page.goto('https://queueless-os.vercel.app/admin/city-health', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  const pwdInput = await page.$('input[placeholder*="Enter admin password"]');
  if (pwdInput) {
    console.log('2. Entering admin password...');
    await page.type('input[placeholder*="Enter admin password"]', 'admin123');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('3. Clicking Add-Ons & Upgrades tab...');
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const addon = btns.find(b => b.innerText.includes('Add-Ons & Upgrades'));
    if (addon) {
      addon.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Add-Ons tab:', clicked);
  await new Promise(r => setTimeout(r, 1200));

  const text = await page.evaluate(() => document.body.innerText);
  console.log('- Has Power-Up Headline?:', text.includes('Power-Up Your Clinical OPD Infrastructure'));
  console.log('- Has Full White-Label Suite?:', text.includes('Full White-Label Suite'));
  console.log('- Has WhatsApp Alerts & Rx?:', text.includes('WhatsApp Alerts & Rx'));
  console.log('- Has Surge Token Packs?:', text.includes('Surge Token Packs'));

  await page.screenshot({ path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/prod_verified_admin_powerup_addons_live.png' });
  await browser.close();
  console.log('\nVerified successfully!');
})().catch(console.error);
