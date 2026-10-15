const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const start = source.indexOf('const products = ') + 'const products = '.length;
const products = JSON.parse(source.slice(start, source.indexOf('\n];', start) + 2));
const nameFunctions = source.slice(source.indexOf('function hasArabicText('), source.indexOf('function localizedProductName('));
const overrides = {};
const resolveName = vm.runInNewContext(nameFunctions + '\nproductNameObject;', { productNameOverrides: overrides });

test('every catalogue product has explicit names instead of numbered category labels', () => {
  assert.ok(products.length > 0);
  for (const product of products) {
    assert.match(product.name.ar, /[\u0600-\u06ff]/, product.id);
    for (const lang of ['en', 'de', 'fr']) {
      assert.equal(typeof product.name[lang], 'string', `${product.id}: ${lang}`);
      assert.ok(product.name[lang].trim(), `${product.id}: ${lang}`);
      assert.doesNotMatch(product.name[lang], /[\u0600-\u06ff]/, `${product.id}: ${lang}`);
      assert.doesNotMatch(product.name[lang], /\s\d{3}$/, `${product.id}: ${lang}`);
      assert.equal(resolveName(product)[lang], product.name[lang]);
    }
  }
});

test('key nuts and other products retain their individual identities', () => {
  const expected = {
    'nuts-001': ['لوز ني', 'Raw almonds', 'Mandeln roh', 'Amandes crues'],
    'nuts-002': ['كاجو ني', 'Raw cashews', 'Cashewkerne roh', 'Noix de cajou crues'],
    'nuts-003': ['جوز', 'Walnuts', 'Walnüsse', 'Noix'],
    'nuts-004': ['مكسرات مشكلة مالح', 'Salted mixed nuts', 'Gesalzene Nussmischung', 'Mélange de fruits à coque salés'],
    'nuts-010': ['بزر أبيض قرع', 'White pumpkin seeds', 'Weiße Kürbiskerne', 'Graines de courge blanches'],
    'nuts-011': ['بزر أبيض كوسا', 'White courgette seeds', 'Weiße Zucchinisamen', 'Graines de courgette blanches'],
    'food-002': ['رز محمود طويل', 'Mahmood long-grain rice', 'Mahmood Langkornreis', 'Riz long Mahmood'],
  };
  for (const [id, names] of Object.entries(expected)) {
    const product = products.find(item => item.id === id);
    assert.deepEqual(['ar', 'en', 'de', 'fr'].map(lang => resolveName(product)[lang]), names);
  }
});

test('new untranslated products keep their actual name and admin translations take priority', () => {
  const product = { id: 'nuts-custom-999', name: { ar: 'لوز جديد' } };
  assert.equal(resolveName(product).en, 'لوز جديد');
  assert.doesNotMatch(resolveName(product).en, /999/);
  overrides[product.id] = { en: 'New almonds', ar: 'لوز جديد' };
  assert.equal(resolveName(product).en, 'New almonds');
  assert.equal(resolveName(product).ar, 'لوز جديد');
});
