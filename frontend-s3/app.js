const $ = (s) => document.querySelector(s);
const apiBaseInput = $('#apiBase');

apiBaseInput.value = localStorage.getItem('API_BASE') || '';
$('#saveBase').onclick = () => {
  localStorage.setItem('API_BASE', apiBaseInput.value.trim());
  alert('تم الحفظ.');
};

function api(path, opts={}) {
  const base = localStorage.getItem('API_BASE') || apiBaseInput.value.trim();
  if (!base) { alert('رجاءً ضع رابط الواجهة الخلفية (EB)'); throw new Error('No API_BASE'); }
  return fetch(base.replace(/\/$/, '') + path, { headers: {'Content-Type':'application/json'}, ...opts })
    .then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t) }));
}

$('#userForm').onsubmit = async (e) => {
  e.preventDefault();
  const email = $('#email').value.trim();
  const name = $('#name').value.trim();
  const res = await api('/users', { method: 'POST', body: JSON.stringify({ email, name }) });
  alert('تمت إضافة المستخدم: ' + res.email);
  loadUsers();
};

async function loadUsers() {
  const list = $('#users'); list.innerHTML = '...';
  const users = await api('/users');
  list.innerHTML = users.map(u => `<li><b>${u.email}</b> — ${u.name || ''} <br/> <small>${u.id}</small></li>`).join('');
}
$('#loadUsers').onclick = loadUsers;

$('#txForm').onsubmit = async (e) => {
  e.preventDefault();
  const userId = $('#userId').value.trim();
  const amount = parseFloat($('#amount').value);
  const currency = $('#currency').value.trim() || 'QAR';
  const memo = $('#memo').value.trim();
  const res = await api('/txs', { method: 'POST', body: JSON.stringify({ userId, amount, currency, memo }) });
  alert('تم إنشاء المعاملة: ' + res.id);
  loadTxs();
};

async function loadTxs() {
  const list = $('#txs'); list.innerHTML = '...';
  const txs = await api('/txs');
  list.innerHTML = txs.map(t => `<li><b>${t.amount} ${t.currency}</b> — ${t.memo || ''} <br/> <small>${t.id} | ${t.userId}</small></li>`).join('');
}
$('#loadTxs').onclick = loadTxs;
