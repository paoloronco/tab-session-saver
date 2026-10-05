const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const root = path.join(__dirname, '..', 'Chrome-extension');
const source = fs.readFileSync(path.join(root, 'popup.js'), 'utf8');

function appearance(saved = {}) {
  const settings = new Map(Object.entries(saved));
  const styles = new Map();
  const classes = new Set();
  const listeners = {};
  const control = value => ({value, checked:false, addEventListener(name, handler) {this[name] = handler;}});
  const themes = ['classic','ocean','forest','lavender','rose','sand'].map(control);
  const dark = control('');
  const accent = control('');
  const body = {dataset:{}, style:{setProperty(k,v) {styles.set(k,v);}, removeProperty(k) {styles.delete(k);}},
    classList:{toggle(k,on) {if(on) classes.add(k); else classes.delete(k);}}};
  const context = vm.createContext({
    URL, chrome:{}, console,
    document:{body, addEventListener() {}, querySelectorAll() {return themes;},
      getElementById(id) {return id === 'darkMode' ? dark : id === 'accentColor' ? accent : null;}},
    localStorage:{getItem(k) {return settings.get(k) ?? null;}, setItem(k,v) {settings.set(k,String(v));}, removeItem(k) {settings.delete(k);}},
    window:{addEventListener(k,fn) {listeners[k] = fn;}}
  });
  vm.runInContext(source, context);
  const start = source.indexOf("  document.querySelectorAll('input[name=\"appearanceTheme\"]').forEach(input => {", source.indexOf('  function setCloudSyncBusy('));
  vm.runInContext(`const accentSelect = document.getElementById('accentColor'); const darkToggle = document.getElementById('darkMode');\n${source.slice(start, source.indexOf('  // LANGUAGE SELECTION', start))}`, context);
  context.applyAppearance();
  return {context, body, themes, dark, accent, settings, styles, classes, listeners};
}

test('themes preserve mode, reset custom accent on selection, and persist across reopening', () => {
  const h = appearance({darkMode:'true', accentColor:'#228b22'});
  assert.equal(h.body.dataset.theme, 'classic');
  assert.equal(h.styles.get('--accent-color'), '#228b22');
  for(const theme of h.themes) {
    theme.checked = true;
    theme.change();
    assert.equal(h.body.dataset.theme, theme.value);
    assert.equal(h.settings.has('accentColor'), false);
    assert.ok(h.dark.checked && h.classes.has('dark-mode'));
    assert.equal(h.themes.filter(input => input.checked).length, 1);
    const reopened = appearance(Object.fromEntries(h.settings));
    assert.equal(reopened.body.dataset.theme, theme.value);
  }
  h.dark.change({target:{checked:false}});
  assert.ok(h.classes.has('light-mode'));
  h.themes[0].checked = true;
  h.themes[0].change();
  h.accent.change({target:{value:'#f35f5f'}});
  assert.equal(h.styles.get('--accent-color'), '#f35f5f');
  assert.equal(h.styles.get('--accent-foreground'), '#000000');
  h.accent.change({target:{value:'#000000'}});
  assert.equal(h.styles.get('--accent-foreground'), '#ffffff');
  h.accent.change({target:{value:''}});
  assert.equal(h.styles.has('--accent-color'), false);
  assert.equal(h.styles.has('--accent-foreground'), false);
});

test('unknown themes and invalid accents fall back safely; other open pages refresh preferences', () => {
  const h = appearance({appearanceTheme:'unknown', accentColor:'url(https://invalid.test)'});
  assert.equal(h.body.dataset.theme, 'classic');
  assert.equal(h.styles.has('--accent-color'), false);
  h.settings.set('appearanceTheme', 'ocean');
  h.settings.set('darkMode', 'true');
  h.listeners.storage({key:'appearanceTheme'});
  assert.equal(h.body.dataset.theme, 'ocean');
  assert.ok(h.dark.checked);
  h.settings.set('accentColor', '#ffb020');
  h.context.applyAppearance();
  assert.equal(h.styles.has('--accent-color'), false);
  for (const page of ['popup.html','settings.html']) {
    assert.match(fs.readFileSync(path.join(root,page),'utf8'), /href="themes.css"/);
  }
});

