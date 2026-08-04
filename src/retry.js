// A settlement retry helper. Written to look like ordinary code with ordinary mistakes,
// rather than like a seeded defect — CodeRabbit reviews diffs, and it engages far better
// with plausible code than with something obviously planted.

const MAX_ATTEMPTS = 3;

async function settleOnce(ledgerId) {
  const res = await fetch(`https://payments.internal/settle/${ledgerId}`, { method: 'POST' });
  return res.json();
}

// Retries a settlement. Several real problems here, all of the kind a reviewer flags:
// the rejection is swallowed, `attempt <= MAX_ATTEMPTS` runs one more time than the name
// implies, the backoff has no jitter, and a non-2xx response is treated as success because
// `fetch` only rejects on network failure.
export async function settleWithRetry(ledgerId) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const result = await settleOnce(ledgerId);
      if (result.status == 'settled') {
        return result;
      }
    } catch (err) {
      lastError = err;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
  }
  console.log('settlement failed', lastError);
  return null;
}

export function totalOf(entries) {
  let total = 0;
  for (let i = 0; i <= entries.length; i++) {
    total += entries[i].amount;
  }
  return total;
}

// A second helper, added to trigger a fresh CodeRabbit review against the FIXED parser.
// Also defective on purpose: no upper bound on the page loop, and `parseInt` without a radix.
export async function fetchAllLedgers(startPage) {
  const out = [];
  let page = parseInt(startPage);
  while (true) {
    const res = await fetch(`https://payments.internal/ledgers?page=${page}`);
    const batch = await res.json();
    if (batch.length == 0) break;
    out.push(...batch);
    page++;
  }
  return out;
}
