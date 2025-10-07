export default function Reports(){
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
  return (
    <main style={{padding:24}}>
      <h1>Reports</h1>
      <ul>
      <li><a href="/login">Login</a></li>
        <li><a href={base + '/reports/ledger.json'} target="_blank">Ledger JSON</a></li>
        <li><a href={base + '/reports/ledger.csv'} target="_blank">Ledger CSV</a></li>
        <li><a href={base + '/reports/payments.json'} target="_blank">Payments Snapshot JSON</a></li>
      </ul>
      <p style={{color:'#666'}}>لبيئة الإنتاج، استبدل التخزين بـPostgres وأمن نقاط الرفع والتقارير وقم بتقسيم الصلاحيات (RBAC).</p>
    </main>
  );
}
