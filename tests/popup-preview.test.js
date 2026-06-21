const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadPopupBindings() {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'Chrome-extension', 'popup.js'),
    'utf8'
  );
  const context = vm.createContext({
    URL,
    alert() {},
    chrome: {},
    console,
    document: {
      addEventListener() {},
      getElementById() { return null; },
      querySelectorAll() { return []; }
    },
    localStorage: {
      getItem() { return null; },
      setItem() {}
    },
    window: {}
  });

  vm.runInContext(
    `${source}\n;globalThis.__popupTest = { bindSessionPreviewToggle };`,
    context
  );
  return context.__popupTest;
}

function createEventTarget() {
  const listeners = new Map();
  return {
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    dispatch(type, event = {}) {
      listeners.get(type)?.(event);
    }
  };
}

test('session card and menu preview action share preview toggling', () => {
  const { bindSessionPreviewToggle } = loadPopupBindings();
  const entry = createEventTarget();
  const label = createEventTarget();
  const previewButton = createEventTarget();
  const calls = [];

  bindSessionPreviewToggle(entry, label, previewButton, () => calls.push('toggle'));

  entry.dispatch('click', { target: label });
  previewButton.dispatch('click', { stopPropagation() { calls.push('stop'); } });

  assert.deepEqual(calls, ['toggle', 'stop', 'toggle']);
});

test('session card toggles preview with Enter or Space only', () => {
  const { bindSessionPreviewToggle } = loadPopupBindings();
  const entry = createEventTarget();
  const label = createEventTarget();
  const previewButton = createEventTarget();
  const calls = [];
  const keyboardEvent = (key) => ({
    key,
    preventDefault() { calls.push(`prevent:${key}`); }
  });

  bindSessionPreviewToggle(entry, label, previewButton, () => calls.push('toggle'));

  label.dispatch('keydown', keyboardEvent('Enter'));
  label.dispatch('keydown', keyboardEvent(' '));
  label.dispatch('keydown', keyboardEvent('Escape'));

  assert.deepEqual(calls, [
    'prevent:Enter',
    'toggle',
    'prevent: ',
    'toggle'
  ]);
});

test('restore, menu, and expanded preview clicks do not toggle the card', () => {
  const { bindSessionPreviewToggle } = loadPopupBindings();
  const entry = createEventTarget();
  const label = createEventTarget();
  const previewButton = createEventTarget();
  let toggles = 0;

  bindSessionPreviewToggle(entry, label, previewButton, () => { toggles += 1; });

  for (const selector of ['.session-actions', '.preview-container']) {
    entry.dispatch('click', {
      target: {
        closest(candidate) {
          return candidate.includes(selector) ? {} : null;
        }
      }
    });
  }

  assert.equal(toggles, 0);
});
