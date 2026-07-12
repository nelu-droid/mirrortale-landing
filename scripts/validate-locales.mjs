import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const enabledLocales = ['en'];
const requiredKeys = [
  'document.title', 'nav.menu.open', 'nav.menu.close', 'cta.create',
  'hero.title.1', 'hero.title.3a', 'hero.title.3b', 'hero.lede', 'hero.price',
  'process.title', 'examples.title', 'pricing.title', 'form.title'
];

for (const locale of enabledLocales) {
  const localeStart = source.indexOf(`  ${locale}: {`);
  const nextLocale = source.indexOf('\n  },\n  ', localeStart + 1);
  if (localeStart < 0 || nextLocale < 0) throw new Error(`Missing ${locale} locale block.`);
  const localeBlock = source.slice(localeStart, nextLocale);
  const missing = requiredKeys.filter((key) => !localeBlock.includes(`"${key}":`));
  if (missing.length) throw new Error(`${locale} is missing: ${missing.join(', ')}`);
}

if (!source.includes('const supportedSiteLanguages = ["en"]')) {
  throw new Error('Enabled locale policy must remain English-only until translation QA is complete.');
}

console.log('Locale validation passed for:', enabledLocales.join(', '));
