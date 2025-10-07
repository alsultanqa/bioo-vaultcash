(() => {
  const url = (typeof window.QATAR_CASH_URL === 'string' && window.QATAR_CASH_URL.trim())
    ? window.QATAR_CASH_URL.trim() : '/bioo-vaultcash/qc/';
  const target = (typeof window.QATAR_CASH_OPEN_TARGET === 'string') ? window.QATAR_CASH_OPEN_TARGET : '_blank';
  const btn = document.createElement('button');
  btn.id = 'qatarcash-btn'; btn.textContent = '🇶🇦 قطر كاش';
  btn.title = 'افتح مشروع قطر كاش';
  btn.style.cssText = [
    'padding:.6rem 1rem','border-radius:12px','border:1px solid #0ea5a6',
    'background:#14b8a6','color:#fff','font-weight:700','cursor:pointer',
    'box-shadow:0 2px 10px rgba(0,0,0,.12)','transition:filter .15s ease'
  ].join(';');
  btn.addEventListener('mouseenter', () => btn.style.filter = 'brightness(1.06)');
  btn.addEventListener('mouseleave', () => btn.style.filter = '');
  btn.addEventListener('click', () => window.open(url, target, 'noopener'));
  const inject = () => {
    const navs = document.querySelectorAll('nav, header, .navbar, .topbar, .header');
    for (const n of navs) { if (n && getComputedStyle(n).display !== 'none') { n.appendChild(btn); return; } }
    btn.style.position='fixed'; btn.style.top='16px'; btn.style.right='16px'; btn.style.zIndex='9999';
    document.body.appendChild(btn);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject); else inject();
})();