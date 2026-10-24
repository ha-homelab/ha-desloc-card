// Synthetic Home Assistant fixtures only: no live device or network credentials.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { once } = require('node:events');
const { createHash } = require('node:crypto');

async function main() {
  const playwright = require(process.env.CI_PLAYWRIGHT_MODULE);
  const engine = process.env.CI_BROWSER_ENGINE;
  const channel = process.env.CI_BROWSER_CHANNEL;
  const output = process.env.CI_BROWSER_DIAGNOSTICS;
  const runtime = JSON.parse(fs.readFileSync(path.join(output, 'runtime.json'), 'utf8'));
  const sourcePath = process.env.DESLOC_CARD_ASSET || path.join(__dirname, '../ha-desloc-card.js');
  const source = fs.readFileSync(sourcePath);
  const sourceSha256 = createHash('sha256').update(source).digest('hex');
  const fixture = `<!doctype html><meta charset="utf-8"><title>Synthetic lock fixture</title>
    <style>:root{--primary-color:#1769aa;--text-primary-color:#fff;--primary-text-color:#17212b;
    --secondary-text-color:#596775;--divider-color:#d0d7de;--ha-card-background:#fff;
    --card-background-color:#fff;--secondary-background-color:#e8edf2;--warning-color:#a96800}
    body{margin:16px;font-family:Arial,sans-serif;background:#f1f4f8;color:var(--primary-text-color)}</style>
    <script type="module">
      import {LOCALES, MESSAGES} from '/ha-desloc-card.js';
      customElements.define('ha-card', class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({mode:'open'}).innerHTML = '<style>:host{display:block;border:1px solid var(--divider-color);border-radius:16px;box-shadow:0 2px 8px #17212b0d}</style><slot></slot>';
        }
      });
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
    const action = card.locator('button.primary.action');
    async function scenario(name, action) {
      await action();
      assert.deepEqual(errors, [], 'No browser page exceptions');
      assert.deepEqual(blockedRequests, [], 'No unexpected external requests');
      scenarios.push(name);
    }
    async function unlockDialog(accept, key) {
      const dialog = page.waitForEvent('dialog');
      if (key) await action.focus();
      const activated = key ? page.keyboard.press(key) : action.click();
      const confirmation = await dialog;
      assert.match(confirmation.message(), /Synthetic door/);
      await (accept ? confirmation.accept() : confirmation.dismiss());
      await activated;
    }
    await page.goto(origin);
    await page.waitForFunction(() => window.ready);
    await scenario('render one unlock action for the reported locked state', async () => {
      assert.equal(await card.locator('.state').textContent(), 'Locked');
      assert.match(await card.locator('.battery').textContent(), /55%/);
      assert.equal(await card.locator('.actions button').count(), 1);
      assert.equal(await action.textContent(), 'Unlock');
      assert.equal(await action.isEnabled(), true);
      const presentation = await action.evaluate(button => ({
        foreground: getComputedStyle(button).color, background: getComputedStyle(button).backgroundColor,
        surfaceDisplay: getComputedStyle(button.closest('ha-card')).display,
      }));
      assert.equal(presentation.foreground, 'rgb(255, 255, 255)');
      assert.equal(presentation.background, 'rgb(23, 105, 170)');
      assert.equal(presentation.surfaceDisplay, 'block');
    });
    await scenario('cancel physical unlock confirmation without sending a command', async () => {
      await unlockDialog(false);
      assert.deepEqual(await page.evaluate(() => calls), []);
    });
    await scenario('confirm unlock once and keep the original pending direction until completion', async () => {
      await unlockDialog(true);
      assert.deepEqual(await page.evaluate(() => calls), [['lock', 'unlock', { entity_id: 'lock.fixture' }]]);
      assert.equal(await action.isDisabled(), true);
      assert.equal(await action.textContent(), 'Unlocking…');
      await page.evaluate(() => { updateState('unlocked'); card.shadowRoot.querySelector('.action').click(); });
      assert.equal(await action.isDisabled(), true);
      assert.equal(await action.textContent(), 'Unlocking…');
      assert.equal(await page.evaluate(() => calls.length), 1);
      await page.evaluate(() => resolveCommand());
      await page.waitForFunction(() => !card.shadowRoot.querySelector('.action').disabled);
      assert.equal(await action.textContent(), 'Lock');
    });
    await scenario('send an explicit lock command from the reported unlocked state', async () => {
      await page.evaluate(() => { window.mode = 'success'; });
      await action.click();
      assert.deepEqual(await page.evaluate(() => calls[1]), ['lock', 'lock', { entity_id: 'lock.fixture' }]);
      assert.equal(await card.locator('.state').textContent(), 'Unlocked', 'successful service call does not invent a bolt state');
      assert.equal(await action.textContent(), 'Lock');
    });
    await scenario('show only the recovery lock action for uncertain reported states', async () => {
      for (const state of ['unknown', 'jammed', '__proto__']) {
        await page.evaluate(state => updateState(state), state);
        assert.equal(await action.textContent(), 'Lock', state);
        assert.equal(await action.isEnabled(), true, state);
      }
      assert.equal(await page.evaluate(() => calls.length), 2);
    });
    await scenario('disable the action for unavailable, missing and transitional states', async () => {
      for (const [state, label] of [['unavailable', 'Unavailable'], ['locking', 'Locking…'], ['unlocking', 'Unlocking…']]) {
        await page.evaluate(state => updateState(state), state);
        assert.equal(await action.textContent(), label);
        assert.equal(await action.isDisabled(), true);
        await page.evaluate(() => card.shadowRoot.querySelector('.action').click());
      }
      await page.evaluate(() => { delete hass.states['lock.fixture']; card.hass = hass; });
      assert.equal(await action.textContent(), 'Unavailable');
      assert.equal(await action.isDisabled(), true);
      assert.equal(await page.evaluate(() => calls.length), 2);
      await page.evaluate(() => { hass.states['lock.fixture'] = { state: 'locked', attributes: { friendly_name: 'Synthetic door' } }; card.hass = hass; });
    });
    await scenario('show a safe error and permit a manual retry without automatic retry', async () => {
      await page.evaluate(() => { window.mode = 'failure'; });
      await unlockDialog(true);
      await page.waitForFunction(() => card.shadowRoot.querySelector('.error').textContent.length > 0);
      assert.match(await card.locator('.error').textContent(), /Check the physical lock/);
      assert.equal(await page.evaluate(() => card.shadowRoot.textContent.includes('SENSITIVE_FIXTURE_DETAIL')), false);
      assert.equal(await action.isEnabled(), true);
      assert.equal(await action.textContent(), 'Unlock');
      assert.equal(await page.evaluate(() => calls.length), 3);
      await page.evaluate(() => { window.mode = 'success'; });
      await unlockDialog(true);
      await page.waitForFunction(() => !card.shadowRoot.querySelector('.error').textContent);
      assert.equal(await page.evaluate(() => calls.length), 4);
    });
    await scenario('cancel unlock from a real Enter keyboard activation', async () => {
      await unlockDialog(false, 'Enter');
      assert.equal(await page.evaluate(() => calls.length), 4);
    });
    await scenario('confirm unlock from a real Space keyboard activation', async () => {
      await unlockDialog(true, 'Space');
      assert.equal(await page.evaluate(() => calls.length), 5);
      assert.deepEqual(await page.evaluate(() => calls[4]), ['lock', 'unlock', { entity_id: 'lock.fixture' }]);
    });
    await scenario('activate lock with Enter and Space without an unlock confirmation', async () => {
      await page.evaluate(() => updateState('unlocked'));
      for (const key of ['Enter', 'Space']) {
        // A completed command temporarily disables the button; some browsers blur it.
        // Each independent keyboard activation starts with the action focused.
        await action.focus();
        await page.keyboard.press(key);
      }
      assert.deepEqual(await page.evaluate(() => calls.slice(5)), [
        ['lock', 'lock', { entity_id: 'lock.fixture' }],
        ['lock', 'lock', { entity_id: 'lock.fixture' }],
      ]);
    });
    await scenario('preserve the action element and keyboard focus across state and locale renders', async () => {
      await action.focus();
      const stable = await page.evaluate(() => {
        const button = card.shadowRoot.querySelector('.action');
        updateState('locked');
        hass.language = 'ar'; card.hass = hass;
        const result = { same: button === card.shadowRoot.querySelector('.action'), focused: card.shadowRoot.activeElement === button, label: button.textContent };
        hass.language = 'en'; card.hass = hass;
        return result;
      });
      assert.equal(stable.same, true);
      assert.equal(stable.focused, true);
      assert.equal(stable.label, await page.evaluate(() => messages.ar['action.unlock']));
      assert.equal(await page.evaluate(() => calls.length), 7);
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
    await scenario('render both action directions and disabled labels in all 24 locales on mobile', async () => {
      const locales = await page.evaluate(() => window.locales);
      assert.equal(locales.length, 24);
      for (const locale of locales) {
        const labels = await page.evaluate(code => {
          card.setConfig({ entity: 'lock.fixture', name: 'Synthetic door', language: code });
          return messages[code];
        }, locale.code);
        assert.equal(await card.getAttribute('dir'), locale.dir);
        for (const [state, key, disabled] of [
          ['locked', 'action.unlock', false], ['unlocked', 'action.lock', false],
          ['unknown', 'action.lock', false], ['locking', 'state.locking', true],
          ['unlocking', 'state.unlocking', true], ['unavailable', 'state.unavailable', true],
        ]) {
          await page.evaluate(state => updateState(state), state);
          assert.equal(await action.textContent(), labels[key], `${locale.code}: ${state}`);
          assert.equal(await action.isDisabled(), disabled, `${locale.code}: ${state}`);
          assert.equal(await card.locator('.state').textContent(), labels[`state.${state}`]);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale.code}: ${state}`);
          assert.equal(await action.evaluate(button => button.scrollWidth <= button.clientWidth), true, `${locale.code}: button text fits`);
        }
      }
      assert.equal(await page.evaluate(() => calls.length), 7, 'locale and state renders never send commands');
      await page.evaluate(() => { updateState('locked'); card.setConfig({ entity: 'lock.fixture', name: 'Synthetic door', language: 'en' }); });
    });
    await scenario('activate the information action with the keyboard', async () => {
      await card.locator('.info').focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => moreInfo.length), 2);
    });
    for (const gesture of ['pointer', 'Space']) {
      await scenario(`discard stale ${gesture} gestures without reversing the intended action`, async () => {
        for (const [from, to] of [['locked', 'unlocked'], ['unlocked', 'locked']]) {
          await page.evaluate(state => updateState(state), from);
          const before = await page.evaluate(() => calls.length);
          const unexpectedDialogs = [];
          const dismissals = [];
          const rejectUnexpectedDialog = dialog => {
            unexpectedDialogs.push(dialog.message());
            dismissals.push(dialog.dismiss());
          };
          page.on('dialog', rejectUnexpectedDialog);
          try {
            if (gesture === 'pointer') {
              const box = await action.boundingBox();
              assert.ok(box, 'action has a visible hit target');
              await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
              await page.mouse.down();
              await page.evaluate(state => updateState(state), to);
              await page.mouse.up();
            } else {
              await action.focus();
              await page.keyboard.down('Space');
              await page.evaluate(state => updateState(state), to);
              await page.keyboard.up('Space');
            }
            await Promise.all(dismissals);
            assert.deepEqual(unexpectedDialogs, [], `${from} to ${to}: stale gesture must not prompt`);
            assert.equal(await page.evaluate(() => calls.length), before, `${from} to ${to}: stale gesture must not send`);
          } finally {
            page.off('dialog', rejectUnexpectedDialog);
          }
          if (to === 'locked') await unlockDialog(true);
          else await action.click();
          assert.equal(await page.evaluate(() => calls.length), before + 1, 'the next deliberate click still works');
          assert.deepEqual(await page.evaluate(() => calls.at(-1)), ['lock', to === 'locked' ? 'unlock' : 'lock', { entity_id: 'lock.fixture' }]);
        }
      });
    }
    await page.evaluate(() => { updateState('locked'); card.setConfig({ entity: 'lock.fixture', name: 'Synthetic door', battery_entity: 'sensor.battery', language: 'en' }); });
    await page.screenshot({ path: path.join(output, 'card.png'), fullPage: true, animations: 'disabled' });
    const regularHeight = (await card.boundingBox()).height;
    for (const variant of [
      { type: 'desloc-lock-card', config: { compact: true }, screenshot: 'compact-mode.png' },
      { type: 'desloc-compact-lock-card', config: {}, screenshot: 'compact-card.png' },
    ]) {
      await scenario(`${variant.type} compact layout retains controls and fits narrow RTL screens`, async () => {
        await page.evaluate(({ type, config }) => {
          window.card.remove();
          window.card = document.createElement(type);
          card.setConfig({ type: `custom:${type}`, entity: 'lock.fixture', name: 'Synthetic door',
            battery_entity: 'sensor.battery', signal_entity: 'sensor.signal', ...config });
          hass.states['sensor.signal'] = { state: '-65' };
          hass.language = 'en'; card.hass = hass; document.body.append(card);
        }, variant);
        const compact = page.locator(variant.type);
        const compactAction = compact.locator('.action');
        const callsBefore = await page.evaluate(() => calls.length);
        assert.equal(await compact.locator('ha-card').evaluate(surface => getComputedStyle(surface).display), 'grid', 'compact surface uses its grid layout');
        assert.ok((await compact.boundingBox()).height < regularHeight * 0.75, 'compact card is visibly shorter');
        assert.match(await compact.locator('.battery').textContent(), /55%/);
        assert.match(await compact.locator('.signal').textContent(), /-65 dBm/);
        assert.equal(await compact.locator('.actions button').count(), 1);
        for (const width of [320, 390]) {
          await page.setViewportSize({ width, height: 844 });
          for (const language of ['en', 'de', 'ru', 'ar']) {
            await page.evaluate(language => { hass.language = language; card.hass = hass; }, language);
            for (const state of ['locked', 'unlocked', 'unavailable']) {
              await page.evaluate(state => updateState(state), state);
              assert.equal(await compactAction.isDisabled(), state === 'unavailable');
              assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true,
                `${variant.type}: ${width}px/${language}/${state} has no horizontal page overflow`);
              const bounds = await compactAction.boundingBox();
              assert.ok(bounds.width >= 44 && bounds.height >= 44, 'action remains a touch target');
              assert.equal(await compactAction.evaluate(button => button.scrollWidth <= button.clientWidth), true,
                `${variant.type}: ${language} action label fits`);
            }
          }
        }
        await page.setViewportSize({ width: 900, height: 900 });
        for (const width of [190, 210, 240]) {
          await page.evaluate(width => { card.style.width = `${width}px`; }, width);
          for (const language of ['en', 'ar']) {
            await page.evaluate(language => { hass.language = language; card.hass = hass; }, language);
            for (const stressed of [false, true]) {
              await page.evaluate(({ stressed, config, type }) => {
                card.setConfig({ type: `custom:${type}`, entity: 'lock.fixture',
                  name: stressed ? 'A very long descriptive name for the synthetic side entrance lock' : 'Synthetic door',
                  battery_entity: 'sensor.battery', signal_entity: 'sensor.signal', ...config });
                card._error = stressed ? 'error.command' : '';
                updateState(stressed ? 'unavailable' : 'locked');
              }, { stressed, ...variant });
              const geometry = await compact.evaluate(element => {
                const root = element.shadowRoot;
                const surface = root.querySelector('ha-card');
                const bounds = surface.getBoundingClientRect();
                return {
                  height: bounds.height, reportedSize: element.getCardSize(), gridRows: element.getGridOptions().rows,
                  inside: ['.info', 'h2', '.state', '.telemetry', '.action', ...(root.querySelector('.error').textContent ? ['.error'] : [])].every(selector => {
                    const node = root.querySelector(selector);
                    const box = node.getBoundingClientRect();
                    return box.left >= bounds.left && box.right <= bounds.right && box.top >= bounds.top && box.bottom <= bounds.bottom;
                  }),
                  noOverflow: surface.scrollWidth <= surface.clientWidth,
                  touchSize: root.querySelector('.action').getBoundingClientRect().height,
                };
              });
              assert.equal(geometry.gridRows, 'auto', 'Sections rows follow the content instead of clipping a fixed slot');
              assert.ok(geometry.reportedSize * 50 >= geometry.height, 'Masonry size estimate accommodates wrapped text and errors');
              assert.equal(geometry.inside, true, `${variant.type}: ${width}px/${language} content fits the card`);
              assert.equal(geometry.noOverflow, true, `${variant.type}: ${width}px/${language} card has no hidden horizontal overflow`);
              assert.ok(geometry.touchSize >= 44, `${variant.type}: narrow card retains a 44px action`);
              assert.ok(geometry.height < (stressed ? 450 : 220), `${variant.type}: ${width}px/${language} does not collapse text into a tall narrow column`);
            }
          }
        }
        await page.screenshot({ path: path.join(output, `${variant.type}-narrow-error.png`), fullPage: true, animations: 'disabled' });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.evaluate(({ type, config }) => {
          card.style.width = ''; card._error = '';
          card.setConfig({ type: `custom:${type}`, entity: 'lock.fixture', name: 'Synthetic door',
            battery_entity: 'sensor.battery', signal_entity: 'sensor.signal', ...config });
          updateState('locked'); hass.language = 'en'; card.hass = hass;
        }, variant);
        await compactAction.focus();
        const dialogPromise = page.waitForEvent('dialog');
        const activation = page.keyboard.press('Enter');
        const dialog = await dialogPromise;
        assert.match(dialog.message(), /Synthetic door/);
        await dialog.dismiss();
        await activation;
        assert.equal(await page.evaluate(() => calls.length), callsBefore, 'compact render and dismissed keyboard unlock send nothing');
        await page.screenshot({ path: path.join(output, variant.screenshot), fullPage: true, animations: 'disabled' });
        if (variant.type === 'desloc-compact-lock-card') {
          await page.setViewportSize({ width: 320, height: 844 });
          await page.evaluate(() => { hass.language = 'ar'; card.hass = hass; });
          await page.screenshot({ path: path.join(output, 'compact-rtl.png'), fullPage: true, animations: 'disabled' });
        }
      });
    }
    await scenario('detached estimates balance a synthetic two-column Masonry fixture before rendering', async () => {
      await page.setViewportSize({ width: 760, height: 1000 });
      const masonry = await page.evaluate(() => {
        const container = document.createElement('section');
        container.style.cssText = 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px';
        const columns = [document.createElement('div'), document.createElement('div')];
        for (const column of columns) {
          column.style.cssText = 'display:flex;flex-direction:column;gap:16px;min-width:0';
          container.append(column);
        }
        const weights = [0, 0];
        const estimates = [];
        const placements = [];
        const cards = [];
        for (const [index, name] of [
          'Very detailed synthetic entrance name that wraps over multiple lines '.repeat(7),
          'Front door', 'Back door',
        ].entries()) {
          const card = document.createElement('desloc-compact-lock-card');
          card.setConfig({ entity: 'lock.fixture', name, language: 'en', battery_entity: 'sensor.battery' });
          card.hass = hass;
          // This fixture deliberately asks for estimates before DOM attachment,
          // as Masonry layout does; it does not claim to embed the HA frontend.
          estimates.push(card.getCardSize());
          const column = weights[0] <= weights[1] ? 0 : 1;
          placements.push(column);
          weights[column] += estimates[index];
          columns[column].append(card);
          cards.push(card);
        }
        document.body.replaceChildren(container);
        return {
          estimates, placements,
          rendered: cards.map(card => ({
            height: card.getBoundingClientRect().height, size: card.getCardSize(),
          })),
        };
      });
      assert.ok(masonry.estimates[0] > masonry.estimates[1] + masonry.estimates[2], 'long detached card has a larger weight than two short cards');
      assert.deepEqual(masonry.placements, [0, 1, 1], 'short cards fill the other column instead of stacking beneath the tall card');
      for (const { height, size } of masonry.rendered) {
        assert.ok(size * 50 >= height, 'attached size follows measured content');
      }
      await page.screenshot({ path: path.join(output, 'compact-masonry.png'), fullPage: true, animations: 'disabled' });
    });
    fs.writeFileSync(process.env.CI_BROWSER_EVIDENCE, JSON.stringify({
      ...runtime, engine: browser.browserType().name(), browserVersion: browser.version(),
      sourceSha256, testsPassed: scenarios.length, testsFailed: 0, scenarios,
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
