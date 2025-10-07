import axios from 'axios';
import { cfg } from './config';

export const http = axios.create({ baseURL: cfg.baseUrl, timeout: 30000 });
http.interceptors.request.use((c) => {
  c.headers = c.headers || {};
  c.headers['Authorization'] = `Bearer ${cfg.apiKey}`;
  c.headers['Content-Type'] = 'application/json';
  return c;
});
