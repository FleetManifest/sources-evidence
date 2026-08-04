// Deliberately vulnerable. See README — do not fix.
//
// String-concatenated SQL, which is what CodeQL's `js/sql-injection` rule is for.
// The identifiers are invented; nothing here connects to a real database.

const express = require('express');

const app = express();

function buildLedgerQuery(accountId) {
  // The defect: user-controlled value interpolated straight into SQL.
  return `select * from ledger_entries where account_id = '${accountId}'`;
}

app.get('/ledger', (req, res) => {
  const query = buildLedgerQuery(req.query.accountId);
  res.send(query);
});

module.exports = { buildLedgerQuery };
