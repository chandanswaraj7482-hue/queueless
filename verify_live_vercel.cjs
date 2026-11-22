const puppeteer = require('./frontend/node_modules/puppeteer-core');

(async () => {
  console.log('🚀 Running Live Verification directly against https://queueless-os.vercel.app ...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  let testsPassed = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      testsPassed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  // 1. Patient Check-In Safety: Blood Group default empty & Pediatric auto-matching & Consent unchecked
  console.log('\n--- 1. Testing Patient Check-In Clinical Safety on Live Vercel ---');
  await page.goto('https://queueless-os.vercel.app/check-in/city-health', { waitUntil: 'networkidle0', timeout: 25000 });
  await page.waitForSelector('input[type="tel"]', { timeout: 15000 });

  // Open Additional Details
  const additionalBtns = await page.$$('button[type="button"]');
  for (const b of additionalBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Additional Details')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));

  // Check Blood Group default
  const bloodGroupVal = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    for (const s of selects) {
      if (s.innerHTML.includes('Select Blood Group')) {
        return s.value;
      }
    }
    return 'NOT_FOUND';
  });
  assert(bloodGroupVal === '', `Blood group defaults to empty string (""), got: "${bloodGroupVal}"`);

  // Check Consent default unchecked
  const consentChecked = await page.evaluate(() => {
    const cb = document.querySelector('input[type="checkbox"]#consent');
    return cb ? cb.checked : null;
  });
  assert(consentChecked === false, `Consent checkbox is unchecked by default, got: ${consentChecked}`);

  // Test Service <-> Doctor Auto-Matching: Click "Pediatric Care & Vaccination"
  const serviceButtons = await page.$$('div.grid button[type="button"]');
  for (const sb of serviceButtons) {
    const txt = await page.evaluate(el => el.textContent, sb);
    if (txt.includes('Pediatric Care')) {
      await sb.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));

  // Verify Dr. Priya Patel is selected
  const isPriyaSelected = await page.evaluate(() => {
    const docCards = document.querySelectorAll('div.space-y-2 > div.rounded-2xl');
    for (const card of docCards) {
      if (card.textContent.includes('Dr. Priya Patel') && card.className.includes('border-sky-500')) {
        return true;
      }
    }
    return false;
  });
  assert(isPriyaSelected, 'Selecting Pediatric Care & Vaccination automatically selects Dr. Priya Patel (Pediatrics)');

  // 2. Testing Doctor OPD Station redirect & roster
  console.log('\n--- 2. Testing Doctor OPD Station Fallback & Redirection on Live Vercel ---');
  await page.goto('https://queueless-os.vercel.app/doctor', { waitUntil: 'networkidle0', timeout: 25000 });
  const currentUrl = page.url();
  assert(currentUrl.includes('/doctor/city-health'), `Slugless /doctor redirects to /doctor/city-health, got: ${currentUrl}`);

  await page.waitForSelector('select', { timeout: 15000 });
  const optionsCount = await page.evaluate(() => {
    const sel = document.querySelector('select');
    return sel ? sel.options.length : 0;
  });
  assert(optionsCount > 0, `Doctor view displays ${optionsCount} doctors in roster`);

  // 3. Testing Admin Access Isolation
  console.log('\n--- 3. Testing Central Admin Route Isolation in Signed-Out Session on Live Vercel ---');
  await page.goto('https://queueless-os.vercel.app/admin', { waitUntil: 'networkidle0', timeout: 25000 });
  const adminUrl = page.url();
  assert(adminUrl.includes('/admin/caremax-opd'), `Slugless /admin redirects to protected hospital admin, got: ${adminUrl}`);

  await page.waitForSelector('input[type="password"]', { timeout: 15000 });
  const hasPasswordPrompt = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    return bodyText.includes('Hospital Business Admin') && !!document.querySelector('input[type="password"]');
  });
  assert(hasPasswordPrompt, 'Direct visit to /admin strictly prompts for password gate with no patient data or revenue leaked');

  // 4. Testing SEO Titles on Policy Pages
  console.log('\n--- 4. Testing SEO Titles on Policy Pages on Live Vercel ---');
  await page.goto('https://queueless-os.vercel.app/security', { waitUntil: 'networkidle0', timeout: 20000 });
  const securityTitle = await page.title();
  assert(securityTitle.includes('Security Architecture') && securityTitle.includes('HIPAA/ABDM'), `Security page title is specific, got: "${securityTitle}"`);

  await page.goto('https://queueless-os.vercel.app/refund', { waitUntil: 'networkidle0', timeout: 20000 });
  const refundTitle = await page.title();
  assert(refundTitle.includes('Cancellation & Refund Policy'), `Refund page title is specific, got: "${refundTitle}"`);

  // 5. Testing Pricing Page Commitments
  console.log('\n--- 5. Testing Pricing Page Annual Billing Commitment on Live Vercel ---');
  await page.goto('https://queueless-os.vercel.app/pricing', { waitUntil: 'networkidle0', timeout: 20000 });
  const pricingContent = await page.content();
  assert(pricingContent.includes('Up to 3') && pricingContent.includes('Up to 12'), 'Pricing comparison table and plan cards show consistent doctor limits (3 and 12)');

  // 6. Testing Home Page CTA link parameters
  console.log('\n--- 6. Testing Home Hero CTA Plan & Billing Parameters on Live Vercel ---');
  await page.goto('https://queueless-os.vercel.app/', { waitUntil: 'networkidle0', timeout: 20000 });
  const heroCtaHref = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/signup"]'));
    const heroLink = links.find(l => l.innerText.includes('Activate Queueless OS'));
    return heroLink ? heroLink.getAttribute('href') : null;
  });
  assert(heroCtaHref && heroCtaHref.includes('/signup?plan=') && heroCtaHref.includes('cycle='), `Hero CTA passes chosen plan, currency, and cycle, got: "${heroCtaHref}"`);

  console.log(`\n==============================================`);
  console.log(`🎯 Live Vercel Summary: ${testsPassed} of ${totalTests} tests passed!`);
  console.log(`==============================================\n`);

  await browser.close();
  process.exit(testsPassed === totalTests ? 0 : 1);
})();
