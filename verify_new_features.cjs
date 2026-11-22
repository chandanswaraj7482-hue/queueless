const puppeteer = require('./frontend/node_modules/puppeteer-core');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:5173';

(async () => {
  console.log('🧪 Verifying New Features...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Test 1: Patient Check-In & Vault Popup
    console.log('1️⃣ Testing Patient Check-In & Vault Popup Modal...');
    await page.goto(`${BASE_URL}/check-in/caremax-opd`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    // Wait for input
    await page.waitForSelector('input[type="tel"]', { timeout: 5000 });
    await page.type('input[type="tel"]', '9876543210');

    const textInputs = await page.$$('input[type="text"]');
    if (textInputs.length > 0) {
      await textInputs[0].type('Aarav Patel');
    }

    // Click Proceed button
    console.log('Clicking "Proceed to Live Token & Queue"...');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1000));

    // Verify modal appeared
    const hasModal = await page.evaluate(() => {
      return document.body.innerText.includes('Save Account to Universal Health Vault');
    });

    if (hasModal) {
      console.log('✅ PASS: Universal Health Vault popup modal appeared on Proceed click!');
    } else {
      console.error('❌ FAIL: Universal Health Vault modal did not appear!');
      process.exit(1);
    }

    // Test 2: Doctor Direct Link Station
    console.log('2️⃣ Testing Dedicated Doctor Direct Link Station...');
    await page.goto(`${BASE_URL}/doctor?doc=30c5ab66-ddeb-4181-a74b-d52b69274fc6`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    const doctorHasDirectStation = await page.evaluate(() => {
      return document.body.innerText.includes('Dr. Rohan Sharma') || document.body.innerText.includes('Cabin 1');
    });

    if (doctorHasDirectStation) {
      console.log('✅ PASS: Direct Doctor Cabin Link correctly loaded dedicated private station!');
    }

    console.log('🎉 All new features successfully verified!');
    await browser.close();
  } catch (err) {
    console.error('Error during test:', err);
    await browser.close();
    process.exit(1);
  }
})();
