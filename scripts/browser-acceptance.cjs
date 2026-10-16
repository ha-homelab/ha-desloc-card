// Synthetic Home Assistant fixtures only: no live device or network credentials.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { once } = require('node:events');

async function main() {
  const playwright = require(process.env.CI_PLAYWRIGHT_MODULE);
  const engine = process.env.CI_BROWSER_ENGINE;
  const channel = process.env.CI_BROWSER_CHANNEL;
  const output = process.env.CI_BROWSER_DIAGNOSTICS;
  const runtime = JSON.parse(fs.readFileSync(path.join(output, 'runtime.json'), 'utf8'));
  const source = fs.readFileSync(path.join(__dirname, '../ha-desloc-card.js'));
  const fixture = `<!doctype html><meta charset="utf-8"><title>Synthetic lock fixture</title>
    <style>body{margin:16px;font-family:Arial,sans-serif}ha-card{display:block;border:1px solid #999;
    --primary-color:#1769aa;--primary-text-color:#111;--secondary-text-color:#555;--divider-color:#aaa}</style>
    <script type="module">
      import {LOCALES, MESSAGES} from '/ha-desloc-card.js';
      window.locales=LOCALES; window.messages=MESSAGES; window.calls=[];
      window.moreInfo=[]; window.addEventListener('hass-more-info', e=>window.moreInfo.push(e.detail.entityId));
      window.mode='pending';
      window.hass={language:'en',states:{'lock.fixture':{state:'locked',attributes:{friendly_name:'Synthetic door'}},'sensor.battery':{state:'55'}},
        callService: async (...args)=>{window.calls.push(args);if(window.mode==='failure')throw Error('SENSITIVE_FIXTURE_DETAIL');
          if(window.mode==='pending')await new Promise(resolve=>window.resolveCommand=resolve);}};
      window.card=document.createElement('desloc-lock-card');
      card.setConfig({entity:'lock.fixture',battery_entity:'sensor.battery'}); card.hass=hass; document.body.append(card);
      window.updateState=state=>{hass.states['lock.fixture'].state=state;card.hass=hass;};
      window.ready=true;
    </script>`;
  const server = http.createServer((request, response) => {
    if (request.url === '/ha-desloc-card.js') {
      response.writeHead(200, { 'Content-Type': 'text/javascript' }); response.end(source);
    } else if (request.url === '/') {
      response.writeHead(200, { 'Content-Type': 'text/html' }); response.end(fixture);
    } else { response.writeHead(404); response.end(); }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  let page;
  let context;
  const errors = [];
  const blockedRequests = [];
  const scenarios = [];
  try {
    browser = await playwright[engine].launch({ headless: true, ...(channel ? { channel } : {}) });
    context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin === origin) return route.continue();
      blockedRequests.push(url.origin);
      return route.abort('blockedbyclient');
    });
    const card = page.locator('desloc-lock-card');
    const unlock = card.locator('.unlock');
    const lock = card.locator('.lock');
    async function scenario(name, action) {
      await action();
      assert.deepEqual(errors, [], 'No browser page exceptions');
      assert.deepEqual(blockedRequests, [], 'No unexpected external requests');
      scenarios.push(name);
    }
    async function unlockDialog(accept) {
      const dialog = page.waitForEvent('dialog');
      const clicked = unlock.click();
      const confirmation = await dialog;
      assert.match(confirmation.message(), /Synthetic door/);
      await (accept ? confirmation.accept() : confirmation.dismiss());
      await clicked;
    }
    await page.goto(origin);
    await page.waitForFunction(() => window.ready);
    await scenario('render reported lock state and battery in the shadow DOM', async () => {
      assert.equal(await card.locator('.state').textContent(), 'Locked');
      assert.match(await card.locator('.battery').textContent(), /55%/);
      assert.equal(await unlock.isEnabled(), true);
      assert.equal(await lock.isDisabled(), true);
    });
    await scenario('cancel physical unlock confirmation without sending a command', async () => {
      await unlockDialog(false);
      assert.deepEqual(await page.evaluate(() => calls), []);
    });
    await scenario('confirm unlock once and keep both buttons gated until completion', async () => {
      await unlockDialog(true);
      assert.deepEqual(await page.evaluate(() => calls), [['lock', 'unlock', { entity_id: 'lock.fixture' }]]);
      assert.equal(await unlock.isDisabled(), true);
      assert.equal(await lock.isDisabled(), true);
      await page.evaluate(() => { updateState('unlocked'); card.shadowRoot.querySelector('.unlock').click(); });
      assert.equal(await lock.isDisabled(), true);
      assert.equal(await page.evaluate(() => calls.length), 1);
      await page.evaluate(() => resolveCommand());
      await page.waitForFunction(() => !card.shadowRoot.querySelector('.lock').disabled);
    });
    await scenario('send an explicit lock command from the reported unlocked state', async () => {
      await page.evaluate(() => { window.mode = 'success'; });
      await lock.click();
      assert.deepEqual(await page.evaluate(() => calls[1]), ['lock', 'lock', { entity_id: 'lock.fixture' }]);
    });
    await scenario('prevent unlock for uncertain and unavailable reported states', async () => {
      for (const state of ['unknown', 'unavailable', 'locking', 'unlocking', 'jammed', '__proto__']) {
        await page.evaluate(state => updateState(state), state);
        assert.equal(await unlock.isDisabled(), true, state);
      }
      assert.equal(await page.evaluate(() => calls.length), 2);
    });
    await scenario('show a safe error and permit a manual retry without automatic retry', async () => {
      await page.evaluate(() => { updateState('locked'); window.mode = 'failure'; });
      await unlockDialog(true);
      await page.waitForFunction(() => card.shadowRoot.querySelector('.error').textContent.length > 0);
      assert.match(await card.locator('.error').textContent(), /Check the physical lock/);
      assert.equal(await page.evaluate(() => card.shadowRoot.textContent.includes('SENSITIVE_FIXTURE_DETAIL')), false);
      assert.equal(await unlock.isEnabled(), true);
      assert.equal(await page.evaluate(() => calls.length), 3);
      await page.evaluate(() => { window.mode = 'success'; });
      await unlockDialog(true);
      await page.waitForFunction(() => !card.shadowRoot.querySelector('.error').textContent);
      assert.equal(await page.evaluate(() => calls.length), 4);
    });
    await scenario('bubble the information action through the shadow root', async () => {
      await card.locator('.info').click();
      assert.deepEqual(await page.evaluate(() => moreInfo), ['lock.fixture']);
    });
    await scenario('render an untrusted display name as text without HTML execution', async () => {
      const name = '<img src=x onerror="window.injected=true">';
      await page.evaluate(name => card.setConfig({ entity: 'lock.fixture', name }), name);
      assert.equal(await card.locator('h2').textContent(), name);
      assert.equal(await card.locator('img').count(), 0);
      assert.equal(await page.evaluate(() => window.injected), undefined);
    });
    await scenario('render all 24 locales and preserve RTL layout in a narrow viewport', async () => {
      const locales = await page.evaluate(() => window.locales);
      assert.equal(locales.length, 24);
      for (const locale of locales) {
        const labels = await page.evaluate(code => {
          card.setConfig({ entity: 'lock.fixture', name: 'Synthetic door', language: code });
          return messages[code];
        }, locale.code);
        assert.equal(await card.getAttribute('dir'), locale.dir);
        assert.equal(await unlock.textContent(), labels['action.unlock']);
        assert.equal(await card.locator('.state').textContent(), labels['state.locked']);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, locale.code);
      }
    });
    await scenario('activate the information action with the keyboard', async () => {
      await card.locator('.info').focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => moreInfo.length), 2);
    });
    await page.screenshot({ path: path.join(output, 'card.png'), fullPage: true });
    fs.writeFileSync(process.env.CI_BROWSER_EVIDENCE, JSON.stringify({
      ...runtime, engine: browser.browserType().name(), browserVersion: browser.version(),
      testsPassed: scenarios.length, testsFailed: 0, scenarios,
    }, null, 2));
    console.log(`PASS: ${scenarios.length} application scenarios on ${engine} ${browser.version()}`);
  } catch (error) {
    if (page) await page.screenshot({ path: path.join(output, 'failure.png'), fullPage: true }).catch(() => {});
    fs.writeFileSync(path.join(output, 'failure.json'), JSON.stringify({ error: error.message, errors, blockedRequests, scenarios }, null, 2));
    throw error;
  } finally {
    if (context) await context.tracing.stop({ path: path.join(output, 'trace.zip') }).catch(() => {});
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
