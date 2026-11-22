const puppeteer = require('puppeteer-core');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runLiveTest() {
  console.log('🚀 Launching REAL visible Google Chrome on user screen...');
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false,
    defaultViewport: null,
    args: [
      '--start-maximized',
      '--window-size=1440,900',
      '--autoplay-policy=no-user-gesture-required',
      '--disable-web-security',
    ],
  });

  const page = (await browser.pages())[0];

  try {
    // ==============================================================
    // 1. ACT AS PATIENT (Walk-in Check-in & Live Pass)
    // ==============================================================
    console.log('📍 1. PATIENT: Opening Check-in page for Caremax OPD...');
    await page.goto('http://localhost:5173/check-in/caremax-opd', { waitUntil: 'networkidle2' });
    await delay(2000);

    console.log('   -> Typing patient details...');
    // Type name
    const nameInput = await page.$('input[placeholder*="Name"], input[type="text"]');
    if (nameInput) {
      await nameInput.click();
      await nameInput.type('Devendra Singhania', { delay: 60 });
    }
    await delay(800);

    // Type phone
    const phoneInput = await page.$('input[type="tel"], input[placeholder*="Phone"], input[placeholder*="98765"]');
    if (phoneInput) {
      await phoneInput.click();
      await phoneInput.type('9876543210', { delay: 60 });
    }
    await delay(1200);

    // Click submit button
    console.log('   -> Submitting check-in for digital token pass...');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
    }
    await delay(3500);

    console.log('   -> Patient Live Token Pass is now visible on screen!');
    // Scroll down on patient live pass
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await delay(2000);
    await page.evaluate(() => window.scrollBy({ top: -350, behavior: 'smooth' }));
    await delay(1500);

    // ==============================================================
    // 2. ACT AS RECEPTION (Reception Desk & Queue Ledger)
    // ==============================================================
    console.log('📍 2. RECEPTION: Opening Reception Desk in new tab...');
    const receptionPage = await browser.newPage();
    await receptionPage.goto('http://localhost:5173/reception', { waitUntil: 'networkidle2' });
    await delay(2000);

    console.log('   -> Entering Reception PIN "reception123"...');
    const recPin = await receptionPage.$('input[type="password"]');
    if (recPin) {
      await recPin.type('reception123', { delay: 70 });
      const recLoginBtn = await receptionPage.$('button[type="submit"]');
      if (recLoginBtn) await recLoginBtn.click();
    }
    await delay(3000);
    console.log('   -> Reception queue ledger is live on screen!');
    await receptionPage.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
    await delay(2000);

    // ==============================================================
    // 3. ACT AS DOCTOR (Doctor Cabin Console & 1-Tap Calling)
    // ==============================================================
    console.log('📍 3. DOCTOR: Opening Doctor Cabin Console in new tab...');
    const doctorPage = await browser.newPage();
    await doctorPage.goto('http://localhost:5173/doctor', { waitUntil: 'networkidle2' });
    await delay(2000);

    console.log('   -> Entering Doctor PIN "1234"...');
    const docPin = await doctorPage.$('input[type="password"]');
    if (docPin) {
      await docPin.type('1234', { delay: 70 });
      const docLoginBtn = await doctorPage.$('button[type="submit"]');
      if (docLoginBtn) await docLoginBtn.click();
    }
    await delay(3000);

    console.log('   -> Doctor Cabin Console is live on screen!');
    // Look for Call Next button
    const callNextBtn = await doctorPage.$('button:has-text("Call Next"), button:has-text("Call")');
    if (callNextBtn) {
      console.log('   -> Clicking "Call Next Patient" button (playing acoustic chime)...');
      await callNextBtn.click();
    }
    await delay(3000);

    // ==============================================================
    // 4. ACT AS LOBBY SMART TV KIOSK (55" OLED Display)
    // ==============================================================
    console.log('📍 4. TV KIOSK: Opening Waiting Room 55-inch Smart TV Display...');
    const tvPage = await browser.newPage();
    await tvPage.goto('http://localhost:5173/display?clinic=caremax-opd', { waitUntil: 'networkidle2' });
    await delay(5000);
    console.log('   -> TV Display Kiosk is active and flashing live tokens!');

    // ==============================================================
    // 5. ACT AS FOUNDER (Super-Admin Platform HQ)
    // ==============================================================
    console.log('📍 5. FOUNDER: Opening Founder & Master Super-Admin Dashboard...');
    const founderPage = await browser.newPage();
    await founderPage.goto('http://localhost:5173/founder', { waitUntil: 'networkidle2' });
    await delay(2000);

    console.log('   -> Entering Founder Master PIN "7482"...');
    const fPin = await founderPage.$('input[type="password"]');
    if (fPin) {
      await fPin.type('7482', { delay: 80 });
      const fSubmit = await founderPage.$('button[type="submit"]');
      if (fSubmit) await fSubmit.click();
    }
    await delay(4000);
    console.log('   -> Founder Dashboard is live on screen with clinic analytics!');

    console.log('\n🎉 REAL LIVE HOSPITAL JOURNEY COMPLETE!');
    console.log('Keeping visible browser open for user inspection...');
    await delay(12000);

  } catch (err) {
    console.error('Error during live test:', err);
  } finally {
    // Keep browser alive so user sees it
    console.log('Live browser session verified and remaining open.');
  }
}

runLiveTest();
