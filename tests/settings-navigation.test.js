const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

test('settings navigation handles direct links, history, fallback and translated headings', () => {
  const events = {};
  const language = { value: 'it', addEventListener(name, handler) { events[name] = handler; } };
  const breadcrumb = { dataset: {} };
  const panels = ['appearance', 'general', 'restore', 'automation', 'data', 'cloud', 'newsletter', 'resources'].map(id => {
    const heading = { dataset: { translate: `${id}_title` }, textContent: id, focus() { this.focused = true; } };
    return { id, heading, querySelector() { return heading; } };
  });
  const links = panels.map(({ id }) => ({
    href: `#${id}`, getAttribute() { return this.href; },
    setAttribute(key, value) { this[key] = value; }, removeAttribute(key) { delete this[key]; }, scrollIntoView() {},
    addEventListener(name, handler) { this[name] = handler; }
  }));
  const context = vm.createContext({
    translations: Object.fromEntries(['en', 'it', 'es', 'fr', 'de'].map(lang => [lang, {}])),
    document: {
      documentElement: {}, addEventListener(name, handler) { events[name] = handler; },
      querySelectorAll(selector) { return selector === '.settings-panel' ? panels : links; },
      querySelector() { return links.find(link => link['aria-current']); },
      getElementById(id) { return id === 'language' ? language : breadcrumb; }
    },
    window: { location: { hash: '#cloud' }, addEventListener(name, handler) { events[name] = handler; }, scrollTo() {} }
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../Chrome-extension/settings.js'), 'utf8'), context);
  events.DOMContentLoaded();
  for (const hash of ['#cloud', '#restore', '#data', '#general', '#automation', '#newsletter', '#resources', '#appearance', '#missing', '#browser-support-group', '']) {
    context.window.location.hash = hash;
    events.hashchange();
    const expected = hash === '#browser-support-group' ? 'resources' : panels.some(panel => `#${panel.id}` === hash) ? hash.slice(1) : 'appearance';
    assert.deepEqual(panels.filter(panel => !panel.hidden).map(panel => panel.id), [expected]);
    assert.deepEqual(links.filter(link => link['aria-current']).map(link => link.href), [`#${expected}`]);
    assert.equal(breadcrumb.textContent, expected);
    assert.ok(panels.find(panel => panel.id === expected).heading.focused);
  }
  panels[0].heading.textContent = 'Aspetto';
  language.value = 'it';
  events.change();
  context.window.location.hash = '#appearance';
  let prevented = false;
  links[0].click({ preventDefault() { prevented = true; } });
  assert.ok(prevented);
  assert.equal(breadcrumb.textContent, 'Aspetto');
  assert.equal(context.document.documentElement.lang, 'it');
  assert.equal(context.document.title, 'Aspetto · Tabs Session Saver');
  for (const copy of Object.values(context.translations)) assert.deepEqual(Object.keys(copy), Object.keys(context.translations.en));
});
