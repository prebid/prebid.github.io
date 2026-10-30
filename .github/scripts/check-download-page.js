// Download-page monitor (#3841, #6165): act like a user on the live download page, picking the newest Prebid.js
// release and every module, and check that the browser really downloads a working bundle.
// Usage: CHROME_BIN=/path/to/chrome node check-download-page.js [page URL]
// PUPPETEER_MODULE can point at a puppeteer-core install outside this repo.
const fs = require('fs');
const os = require('os');
const path = require('path');
const puppeteer = require(process.env.PUPPETEER_MODULE || 'puppeteer-core');

const PAGE = process.argv[2] || 'https://docs.prebid.org/download.html';
const MIN_BUNDLE_BYTES = 1024;
const TIMEOUT_MS = 10 * 60 * 1000;

function summary(text) {
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
}

async function waitForFile(dir, pattern, deadline) {
  while (Date.now() < deadline) {
    // Chrome writes "<name>.crdownload" until the file is complete.
    const done = fs.readdirSync(dir).find(name => pattern.test(name));
    if (done) return path.join(dir, done);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return null;
}

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prebid-download-'));
  const failures = [];
  const notes = [];
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_BIN, headless: true });
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => failures.push('Page error: ' + error.message.slice(0, 300)));
    page.on('dialog', async dialog => {
      const message = dialog.message();
      // "removed from your download" is expected when the docs list modules newer than the release.
      (/removed from your download/.test(message) ? notes : failures).push('Alert: ' + message.slice(0, 500));
      await dialog.accept();
    });
    const cdp = await page.createCDPSession();
    await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: dir });

    await page.goto(PAGE, { waitUntil: 'networkidle2', timeout: 120000 });
    await page.waitForFunction(
      () => [...document.querySelectorAll('#version_selector option')].some(o => /^\d+\.\d+\.\d+$/.test(o.value)),
      { timeout: 120000 });

    const selection = await page.evaluate(() => {
      const version = [...document.querySelectorAll('#version_selector option')]
        .map(o => o.value).find(v => /^\d+\.\d+\.\d+$/.test(v));
      $('.selectpicker').val(version).trigger('change');
      const boxes = [...document.querySelectorAll('input.module-check-box')];
      boxes.forEach(box => { box.checked = true; });
      return { version, modules: boxes.length };
    });
    summary(`### Download page check\n\nPage: ${PAGE}\n\nVersion: ${selection.version}, modules selected: ${selection.modules}\n`);
    if (selection.modules < 100) failures.push(`Only ${selection.modules} module checkboxes on the page`);

    const started = Date.now();
    await page.click('#download-button');
    const deadline = started + TIMEOUT_MS;
    const bundlePath = await waitForFile(dir, new RegExp(`^prebid${selection.version.replace(/\./g, '\\.')}\\.js$`), deadline);
    if (!bundlePath) {
      failures.push(`No prebid${selection.version}.js was downloaded within ${TIMEOUT_MS / 60000} minutes`);
    } else {
      const source = fs.readFileSync(bundlePath, 'utf8');
      summary(`Bundle: ${path.basename(bundlePath)}, ${(source.length / 1048576).toFixed(2)} MB in ${Math.round((Date.now() - started) / 1000)} s\n`);
      if (source.length < MIN_BUNDLE_BYTES) failures.push(`Bundle is only ${source.length} bytes`);
      if (!source.includes('pbjs')) failures.push('Bundle does not contain Prebid.js code ("pbjs")');
      const config = await waitForFile(dir, /^prebid-config\.json$/, Date.now() + 30000);
      if (config) {
        const modules = JSON.parse(fs.readFileSync(config, 'utf8')).modules || [];
        summary(`Modules in prebid-config.json: ${modules.length}\n`);
      } else {
        failures.push('prebid-config.json was not downloaded');
      }
      // Give a late error alert (e.g. for the disclosure file) a moment to appear.
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  } catch (error) {
    failures.push('Check crashed: ' + (error && error.message || error));
  } finally {
    await browser.close();
  }
  notes.forEach(note => summary('- Note: ' + note));
  failures.forEach(failure => summary('- **Failure:** ' + failure));
  if (failures.length) {
    failures.forEach(failure => console.log('::error::' + failure.replace(/\r?\n/g, ' ')));
    process.exit(1);
  }
  summary('Download page check passed.');
})();
