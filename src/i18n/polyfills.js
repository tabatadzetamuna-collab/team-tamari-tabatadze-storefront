import { shouldPolyfill as needsPluralRules } from '@formatjs/intl-pluralrules/should-polyfill.js'
import { shouldPolyfill as needsNumberFormat } from '@formatjs/intl-numberformat/should-polyfill.js'

async function loadPluralRules() {
  await import('@formatjs/intl-pluralrules/polyfill-force.js')
  await Promise.all([
    import('@formatjs/intl-pluralrules/locale-data/ka.js'),
    import('@formatjs/intl-pluralrules/locale-data/en.js'),
  ])
}

async function loadNumberFormat() {
  await import('@formatjs/intl-numberformat/polyfill-force.js')
  await Promise.all([
    import('@formatjs/intl-numberformat/locale-data/ka.js'),
    import('@formatjs/intl-numberformat/locale-data/en.js'),
  ])
}

export async function loadIntlPolyfills() {
  const tasks = []
  if (needsPluralRules('ka')) tasks.push(loadPluralRules())
  if (needsNumberFormat('ka')) tasks.push(loadNumberFormat())
  await Promise.all(tasks)
}