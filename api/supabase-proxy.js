// api/supabase-proxy.js
import { supabaseDirectFetch } from '../lib/supabase-fetch.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  const targetPath = path || (req.url.replace(/^\/api\/supabase-proxy/, ''));
  const targetUrl = `https://ukuaujxvdziiaxxuuidw.supabase.co${targetPath}`;

  try {
    const response = await supabaseDirectFetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined
    });

    const data = await response.json();
    return res.status(response.status || 200).json(data);
  } catch (err) {
    console.error('[Supabase Proxy Error]', err);
    return res.status(500).json({ error: err.message });
  }
}
