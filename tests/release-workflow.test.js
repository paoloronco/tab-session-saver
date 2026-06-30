const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.join(__dirname, '..');

function readRepoFile(filename) {
  return fs.readFileSync(path.join(repoRoot, filename), 'utf8');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('active version references match the manifest version', () => {
  const manifest = JSON.parse(readRepoFile('Chrome-extension/manifest.json'));
  const version = manifest.version;
  const escapedVersion = escapeRegExp(version);

  assert.match(version, /^\d+\.\d+\.\d+$/);
  assert.match(readRepoFile('README.md'), new RegExp(`version-${escapedVersion}`));
  assert.match(readRepoFile('Chrome-extension/popup.html'), new RegExp(`Version:</span> ${escapedVersion}`));
  assert.match(readRepoFile('Chrome-extension/welcome.html'), new RegExp(`Version ${escapedVersion}`));
});

test('release workflow tags the manifest version and uploads the extension zip', () => {
  const workflow = readRepoFile('.github/workflows/release.yml');

  assert.match(workflow, /branches:\s*\[\s*"main"\s*\]/);
  assert.match(workflow, /contents:\s*write/);
  assert.match(workflow, /require\('\.\/Chrome-extension\/manifest\.json'\)\.version/);
  assert.match(workflow, /tag=v\$VERSION/);
  assert.match(workflow, /tab-session-saver-chrome-extension\.zip/);
  assert.match(workflow, /gh release create "\$TAG"/);
});
