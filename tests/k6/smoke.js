import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = { vus: 1, duration: '20s' };

export default function () {
  const res = http.get('http://localhost:3001/health');
  check(res, { 'health ok': r => r.status === 200 && r.body.includes('ok') });
  sleep(1);
}
