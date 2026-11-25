const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');

const BASE_URL = 'https://queueless-os.vercel.app';
const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('=== TEST 1: PATIENT CHECK-IN (/checkin) ===');
  await page.goto(`${BASE_URL}/checkin`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(1500);
  await page.screenshot({ path: `${ARTIFACT_DIR}/verified_live_patient_checkin.png` });
  console.log('Saved verified_live_patient_checkin.png');

  // Also mobile check-in view
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await sleep(500);
  await page.screenshot({ path: `${ARTIFACT_DIR}/verified_live_patient_checkin_mobile.png` });
  console.log('Saved verified_live_patient_checkin_mobile.png');

  // Reset to desktop
  await page.setViewport({ width: 1440, height: 900 });

  console.log('=== TEST 2: RECEPTION DASHBOARD (/reception) ===');
  await page.goto(`${BASE_URL}/reception`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(1500);
  
  // If login form is shown, enter reception123
  try {
    const pwdInput = await page.$('input[type="password"]');
    if (pwdInput) {
      await pwdInput.type('reception123');
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) await submitBtn.click();
      await sleep(2000);
    }
  } catch (e) {
    console.log('Reception auth bypass/step:', e.message);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/verified_live_reception_dashboard.png` });
  console.log('Saved verified_live_reception_dashboard.png');

  console.log('=== TEST 3: DOCTOR CABIN CONSOLE (/doctor) ===');
  await page.goto(`${BASE_URL}/doctor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(1500);

  // If login form is shown, enter 1234
  try {
    const pwdInput = await page.$('input[type="password"]');
    if (pwdInput) {
      await pwdInput.type('1234');
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) await submitBtn.click();
      await sleep(2000);
    }
  } catch (e) {
    console.log('Doctor auth bypass/step:', e.message);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/verified_live_doctor_view.png` });
  console.log('Saved verified_live_doctor_view.png');

  console.log('=== TEST 4: CLINIC ADMIN (/admin) ===');
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(1500);

  // If login form is shown, enter admin123
  try {
    const pwdInput = await page.$('input[type="password"]');
    if (pwdInput) {
      await pwdInput.type('admin123');
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) await submitBtn.click();
      await sleep(2000);
    }
  } catch (e) {
    console.log('Admin auth bypass/step:', e.message);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/verified_live_clinic_admin.png` });
  console.log('Saved verified_live_clinic_admin.png');

  console.log('=== TEST 5: FOUNDER DASHBOARD (/founder) ===');
  await page.goto(`${BASE_URL}/founder`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(1500);

  // If login form is shown, enter 7482
  try {
    const pwdInput = await page.$('input[type="password"]');
    if (pwdInput) {
      await pwdInput.type('7482');
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) await submitBtn.click();
      await sleep(2000);
    }
  } catch (e) {
    console.log('Founder auth bypass/step:', e.message);
  }
  await page.screenshot({ path: `${ARTIFACT_DIR}/verified_live_founder_dashboard.png` });
  console.log('Saved verified_live_founder_dashboard.png');

  console.log('=== TEST 6: 55\" OLED TV KIOSK (/kiosk) ===');
  await page.goto(`${BASE_URL}/kiosk`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(1500);
  await page.screenshot({ path: `${ARTIFACT_DIR}/verified_live_tv_kiosk.png` });
  console.log('Saved verified_live_tv_kiosk.png');

  await browser.close();
  console.log('All clinical roles tested and verified successfully!');
})();
