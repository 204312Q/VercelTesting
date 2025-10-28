// src/lib/money.js

// Safe convert to cents (int). Accepts number/string.
export const toCents = (n) =>
  Math.round((Number(n ?? 0) + Number.EPSILON) * 100);

export const centsToMajorStr = (cents) => (cents / 100).toFixed(2);

// "S$36.10" (localized display)
export const formatSGDFromCents = (cents, locale = 'en-SG') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: 'SGD' })
    .format(cents / 100);

// Structured money object for internal use / optional return
export const moneyOut = (cents) => ({
  amount: centsToMajorStr(cents),   // "36.10"
  cents,                            // 3610 (keep if you want to expose)
  display: formatSGDFromCents(cents) // "S$36.10"
});

export function centsKeysToDollars(obj, opts = {}) {
  const {
    currency = 'SGD',
    locale = 'en-SG',
    showSymbol = false,  // true -> "S$36.10", false -> "36.10"
    keepCents = false,   // true -> keep original *Cents key alongside
  } = opts;

  const fmt = (cents) => {
    const n = Number(cents);
    if (!Number.isFinite(n)) return cents;
    return showSymbol
      ? new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n / 100)
      : (n / 100).toFixed(2);
  };

  const walk = (val) => {
    if (Array.isArray(val)) return val.map(walk);
    if (val && typeof val === 'object') {
      const out = {};
      for (const [k, v] of Object.entries(val)) {
        const m = k.match(/^(.*)Cents$/);
        if (m) {
          const newKey = m[1];       // drop "Cents"
          out[newKey] = fmt(v);      // "36.10" or "S$36.10"
          if (keepCents) out[k] = v; // optionally keep original
        } else {
          out[k] = walk(v);
        }
      }
      return out;
    }
    return val;
  };

  return walk(obj);
}
