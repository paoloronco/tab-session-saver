const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'Chrome-extension', 'popup.js'), 'utf8');

function place(buttonRect, width, height, viewport = [420,600]) {
  const context = vm.createContext({URL, chrome:{}, console,
    document:{addEventListener() {}}, localStorage:{getItem() {return null;}},
    window:{innerWidth:viewport[0],innerHeight:viewport[1]}});
  vm.runInContext(source, context);
  const menu = {style:{}, getBoundingClientRect() {
    const limit = this.style.maxHeight;
    return {width,height:limit ? Math.min(height,parseFloat(limit)) : height};
  }};
  context.positionSessionMenu(menu, {getBoundingClientRect() {return buttonRect;}});
  return menu;
}

test('session menus use actual dimensions and align with the clicked button above or below', () => {
  for(const [width,height] of [[150,160],[240,250]]) {
    const below = place({right:380,top:100,bottom:125},width,height);
    assert.equal(below.style.left, `${380-width}px`);
    assert.equal(below.style.top, '131px');
    const above = place({right:380,top:550,bottom:575},width,height);
    assert.equal(above.style.left, `${380-width}px`);
    assert.equal(above.style.top, `${550-height-6}px`);
  }
});

test('menus clamp horizontal edges and scroll within available space in short popups', () => {
  assert.equal(place({right:30,top:50,bottom:75},240,180).style.left,'8px');
  assert.equal(place({right:430,top:50,bottom:75},240,180).style.left,'172px');
  const menu=place({right:300,top:200,bottom:225},250,400,[340,480]);
  assert.equal(menu.style.top,'231px');
  assert.equal(menu.style.maxHeight,'241px');
  assert.ok(parseFloat(menu.style.top)+menu.getBoundingClientRect().height<=472);
});
