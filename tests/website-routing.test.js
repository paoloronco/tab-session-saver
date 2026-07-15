const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const websiteRoot = path.join(__dirname, '..', 'Website');

function readWebsiteFile(filename) {
  return fs.readFileSync(path.join(websiteRoot, filename), 'utf8');
}

test('website provides physical pages and redirects for direct legal slugs', () => {
  const redirects = readWebsiteFile('_redirects');
  const routeFiles = {
    '/privacy': 'privacy.html',
    '/terms': 'terms.html',
    '/oauth-disclosure': 'oauth-disclosure.html',
    '/data-deletion': 'data-deletion.html'
  };

  for (const [route, filename] of Object.entries(routeFiles)) {
    const html = readWebsiteFile(filename);
    assert.match(redirects, new RegExp(`${route} /${filename} 200`));
    assert.match(html, new RegExp(`https://tabsessionsaver\\.paoloronco\\.it${route}`));
    assert.match(html, /<article id="legal-document"/);
    assert.match(html, /<script src="site\.js" defer><\/script>/);
  }
});

test('legal renderer recognizes clean and html legal paths', () => {
  const script = readWebsiteFile('site.js');

  assert.match(script, /path === "\/terms\.html"/);
  assert.match(script, /path === "\/oauth-disclosure\.html"/);
  assert.match(script, /path === "\/data-deletion\.html"/);
});
