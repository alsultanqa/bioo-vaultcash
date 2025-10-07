// Minimal double-entry ledger with JSON persistence (for MVP demo)
// Accounts (example): cash_acquirer, merchant_payable, fees_expense, acquirer_fees_payable
import fs from 'fs';
import path from 'path';

type Posting = { account: string; amount: number; side: 'debit' | 'credit' };
type Entry = {
  id: number; ts: string; ref: string; type: string;
  meta?: Record<string, any>;
  postings: Posting[];
};

const file = path.resolve(process.cwd(), 'data/ledger.json');

function load(): { entries: Entry[]; sequence: number }{
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw);
}
function save(db: { entries: Entry[]; sequence: number }){
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
}

export function post(type: string, ref: string, postings: Posting[], meta?: Record<string, any>): Entry{
  const db = load();
  const next = db.sequence++;
  const entry: Entry = { id: next, ts: new Date().toISOString(), ref, type, postings, meta };
  db.entries.push(entry);
  save(db);
  return entry;
}

export function listEntries(limit = 200): Entry[]{
  const db = load();
  return db.entries.slice(-limit).reverse();
}

export function trialBalance(){
  const db = load();
  const bal: Record<string, number> = {};
  for (const e of db.entries){
    for (const p of e.postings){
      const sign = p.side === 'debit' ? 1 : -1;
      bal[p.account] = (bal[p.account] || 0) + sign * p.amount;
    }
  }
  return bal;
}
