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
      createElement,
      createElementNS(namespace, tagName) { return createElement(tagName); },
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
    `${source}\n;globalThis.__popupTest = { bindSessionPreviewToggle, renderPreview };`,
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

function createElement(tagName) {
  const children = [];
  const attributes = new Map();
  const classNames = new Set();
  const element = {
    tagName: tagName.toUpperCase(),
    children,
    dataset: {},
    style: {},
    textContent: '',
    parentNode: null,
    eventListeners: new Map(),
    appendChild(child) {
      child.parentNode = element;
      children.push(child);
      return child;
    },
    insertBefore(child, referenceChild) {
      child.parentNode = element;
      const index = children.indexOf(referenceChild);
      if (index === -1) {
        children.push(child);
      } else {
        children.splice(index, 0, child);
      }
      return child;
    },
    replaceChildren(...newChildren) {
      children.splice(0, children.length);
      newChildren.forEach((child) => element.appendChild(child));
    },
    setAttribute(name, value) {
      attributes.set(name, String(value));
    },
    getAttribute(name) {
      return attributes.get(name);
    },
    addEventListener(type, listener) {
      element.eventListeners.set(type, listener);
    },
    querySelector(selector) {
      return findElement(element, selector);
    },
    get className() {
      return Array.from(classNames).join(' ');
    },
    set className(value) {
      classNames.clear();
      String(value).split(/\s+/).filter(Boolean).forEach((name) => classNames.add(name));
    },
    classList: {
      add(name) { classNames.add(name); },
      remove(name) { classNames.delete(name); },
      contains(name) { return classNames.has(name); },
      toggle(name, force) {
        const shouldAdd = typeof force === 'boolean' ? force : !classNames.has(name);
        if (shouldAdd) classNames.add(name);
        else classNames.delete(name);
        return shouldAdd;
      }
    }
  };
  return element;
}

function findElement(root, selector) {
  const matcher = selector.startsWith('.')
    ? (element) => element.classList?.contains(selector.slice(1))
    : (element) => element.tagName?.toLowerCase() === selector.toLowerCase();
  const stack = [...root.children];
  while (stack.length) {
    const current = stack.shift();
    if (matcher(current)) return current;
    stack.unshift(...current.children);
  }
  return null;
}

function findAllElements(root, predicate) {
  const matches = [];
  const stack = [...root.children];
  while (stack.length) {
    const current = stack.shift();
    if (predicate(current)) matches.push(current);
    stack.unshift(...current.children);
  }
  return matches;
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

test('preview header omits redundant full-session restore and aligns count summary', () => {
  const { renderPreview } = loadPopupBindings();
  const previewContainer = createElement('div');
  const label = createElement('span');
  const sessionPayload = {
    timestamp: '2026-06-30T10:00:00.000Z',
    windows: [
      {
        tabs: [
          { title: 'One', url: 'https://one.test', groupId: -1 },
          { title: 'Two', url: 'https://two.test', groupId: -1 }
        ],
        groups: []
      }
    ]
  };

  renderPreview(sessionPayload, previewContainer, 0, label);

  const previewHeader = previewContainer.querySelector('.preview-header');
  const titleWrap = previewContainer.querySelector('.preview-header-title');
  const summary = previewContainer.querySelector('.preview-count-summary');
  const fullSessionRestoreButtons = findAllElements(
    previewContainer,
    (element) => element.classList?.contains('preview-session-restore-btn')
  );

  assert.equal(fullSessionRestoreButtons.length, 0);
  assert.equal(previewHeader.children.length, 1);
  assert.ok(titleWrap.children.includes(summary));
  assert.equal(summary.textContent, '2 tabs \u2022 1 window');
});

test('multi-window preview exposes a confirmed remove-window control', () => {
  const { renderPreview } = loadPopupBindings();
  const previewContainer = createElement('div');
  const label = createElement('span');
  const sessionPayload = {
    timestamp: '2026-06-30T10:00:00.000Z',
    windows: [
      {
        tabs: [{ title: 'One', url: 'https://one.test', groupId: -1 }],
        groups: []
      },
      {
        tabs: [{ title: 'Two', url: 'https://two.test', groupId: -1 }],
        groups: []
      }
    ]
  };

  renderPreview(sessionPayload, previewContainer, 0, label);

  const removeWindowButtons = findAllElements(
    previewContainer,
    (element) => element.classList?.contains('preview-window-remove-btn')
  );

  assert.equal(removeWindowButtons.length, 2);
  assert.equal(removeWindowButtons[0].getAttribute('aria-label'), 'Delete window');
});
