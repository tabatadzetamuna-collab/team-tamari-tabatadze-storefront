import { shouldPolyfill as needsPluralRules } from '@formatjs/intl-pluralrules/should-polyfill.js'
import { shouldPolyfill as needsNumberFormat } from '@formatjs/intl-numberformat/should-polyfill.js'
import { shouldPolyfill as needsDateTimeFormat } from '@formatjs/intl-datetimeformat/should-polyfill.js'

export async function loadIntlPolyfills() {
  if (needsPluralRules('ka')) {
    await import('@formatjs/intl-pluralrules/polyfill-force.js')
    await import('@formatjs/intl-pluralrules/locale-data/ka.js')
    await import('@formatjs/intl-pluralrules/locale-data/en.js')
  }

  if (needsNumberFormat('ka')) {
    await import('@formatjs/intl-numberformat/polyfill-force.js')
    await import('@formatjs/intl-numberformat/locale-data/ka.js')
    await import('@formatjs/intl-numberformat/locale-data/en.js')
  }

  if (needsDateTimeFormat('ka')) {
    await import('@formatjs/intl-datetimeformat/polyfill-force.js')
    await import('@formatjs/intl-datetimeformat/add-golden-tz.js')
    await import('@formatjs/intl-datetimeformat/locale-data/ka.js')
    await import('@formatjs/intl-datetimeformat/locale-data/en.js')
  }
}