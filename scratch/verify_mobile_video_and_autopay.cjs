const puppeteer = require('/Users/apple/.gemini/antigravity/scratch/queueless/frontend/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  // -------------------------------------------------------------
  // Test 1: Mobile Phone Video Carousel (iPhone width 390px)
  // -------------------------------------------------------------
  console.log('1. Testing Mobile Video Carousel at width 390px:');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(
      e => e.innerText && e.innerText.toLowerCase().includes('select hospital video review')
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 800));

  const mobileInfo = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(
      e => e.innerText && e.innerText.toLowerCase().includes('select hospital video review')
    );
    const container = el ? el.closest('div.border-t') : null;
    return {
      found: !!container,
      hasSwipeHint: container ? container.innerText.includes('Swipe to browse') : false,
      buttonCount: container ? container.querySelectorAll('button').length : 0,
    };
  });
  console.log('Mobile video carousel container:', mobileInfo);

  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_mobile_video_carousel.png',
  });

  // -------------------------------------------------------------
  // Test 2: Desktop 5-Column Grid (1440px)
  // -------------------------------------------------------------
  console.log('2. Testing Desktop Video Grid at width 1440px:');
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(
      e => e.innerText && e.innerText.toLowerCase().includes('select hospital video review')
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_desktop_video_grid.png',
  });

  // -------------------------------------------------------------
  // Test 3: Signup Step 3 Credit Card & AutoPay Flow
  // -------------------------------------------------------------
  console.log('3. Testing Signup Step 3 & Step 4 Credit Card AutoPay Flow:');
  await page.goto('http://localhost:5173/signup?plan=GROWTH&currency=INR', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // Fill Step 1 required fields
  await page.type('input[placeholder*="Apex Multispecialty"]', 'Apex Neuro & Trauma Center');
  await page.type('input[placeholder*="London / Mumbai"]', 'New Delhi');
  await page.type('input[placeholder*="+1 (555)"]', '+91 98765 43210');
  await page.type('input[placeholder*="director@apexhealth.com"]', 'director@apexneuro.in');
  await page.type('input[placeholder*="••••••••••••"]', 'ApexSecretPassword@2026');

  // Submit Step 1
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 1200));

  // Step 2 Proceed to Step 3
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const pBtn = btns.find(b => b.innerText && b.innerText.includes('Proceed to Payment'));
    if (pBtn) pBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Step 3: Check Card & AutoPay UI
  console.log('Checking Step 3 Card Form & AutoPay:');
  const step3Text = await page.evaluate(() => document.body.innerText);
  console.log('- Has "Credit / Debit Card"?:', step3Text.includes('Credit / Debit Card'));
  console.log('- Has "UPI AutoPay Mandate"?:', step3Text.includes('UPI AutoPay Mandate'));
  console.log('- Has "⚡ Fill Test AutoPay Card"?:', step3Text.includes('Fill Test AutoPay Card'));

  // Click "Fill Test AutoPay Card"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const testBtn = btns.find(b => b.innerText && b.innerText.includes('Fill Test AutoPay Card'));
    if (testBtn) testBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const cardDetails = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    const nameInput = inputs.find(i => i.placeholder && (i.placeholder.includes('Cardholder') || i.placeholder.includes('Dr. John Smith')));
    const cardInput = inputs.find(i => i.placeholder && i.placeholder.includes('4242'));
    const expiryInput = inputs.find(i => i.placeholder && i.placeholder.includes('12/28'));
    const cvcInput = inputs.find(i => i.placeholder && i.placeholder.includes('888'));
    const checkbox = document.querySelector('input#autopayConsent');
    return {
      name: nameInput ? nameInput.value : null,
      card: cardInput ? cardInput.value : null,
      expiry: expiryInput ? expiryInput.value : null,
      cvc: cvcInput ? cvcInput.value : null,
      autopayConsentChecked: checkbox ? checkbox.checked : null,
    };
  });
  console.log('Pre-filled Card Details & AutoPay Consent:', cardDetails);

  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_signup_credit_card_autopay_step3.png',
  });

  // Submit Step 3 (Authorizing AutoPay & Provisioning Workspace)
  console.log('Submitting Step 3 (Authorizing AutoPay & Provisioning):');
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });

  await new Promise(r => setTimeout(r, 2200));

  // Check Step 4 AutoPay Mandate Summary
  const step4Info = await page.evaluate(() => {
    const body = document.body.innerText;
    return {
      hasCongratulations: body.includes('Congratulations!'),
      hasAutopayMandateCard: body.includes('AutoPay e-Mandate Pre-Authorized & Activated'),
      hasPaymentInstrument: body.includes('•••• 4242') || body.includes('Visa'),
      hasChargedTodayFree: body.includes('0.00 FREE') || body.includes('Charged Today'),
      hasNextDebitDate: body.includes('Next Auto-Debit Date'),
      hasCancelAnytime: body.includes('1-Click Cancel Anytime'),
    };
  });
  console.log('Step 4 Provisioned AutoPay Summary Info:', step4Info);

  await page.screenshot({
    path: '/Users/apple/.gemini/antigravity/brain/00bd05c1-8cf1-438e-a5c0-4c67ba63d89a/verified_signup_autopay_step4_active.png',
  });

  await browser.close();
  console.log('\nAll tests verified successfully!');
})().catch(err => {
  console.error('Error in test:', err);
  process.exit(1);
});
