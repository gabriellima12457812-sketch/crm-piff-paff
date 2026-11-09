import { runSql } from './supabase-sql.js';

export async function supabaseDirectFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const searchParams = urlObj.searchParams;

  // Handles /rest/v1/leads
  if (pathname.includes('/rest/v1/leads')) {
    if (method === 'GET') {
      let whereClauses = [];
      const orParam = searchParams.get('or');
      if (orParam) {
        const inner = orParam.replace(/^\(|\)$/g, '');
        const parts = inner.split(',').map(part => {
          const [col, op, ...valParts] = part.split('.');
          const val = valParts.join('.');
          if (op === 'eq') return `"${col}" = '${val.replace(/'/g, "''")}'`;
          if (op === 'ilike') return `"${col}" ILIKE '${val.replace(/'/g, "''").replace(/\*/g, '%')}'`;
          return null;
        }).filter(Boolean);
        if (parts.length > 0) whereClauses.push(`(${parts.join(' OR ')})`);
      }

      for (const [key, value] of searchParams.entries()) {
        if (key === 'or' || key === 'select' || key === 'order' || key === 'limit' || key === 'offset') continue;
        if (value.startsWith('eq.')) {
          const val = value.substring(3);
          whereClauses.push(`"${key}" = '${val.replace(/'/g, "''")}'`);
        } else if (value.startsWith('ilike.')) {
          const val = value.substring(6).replace(/\*/g, '%');
          whereClauses.push(`"${key}" ILIKE '${val.replace(/'/g, "''")}'`);
        }
      }

      const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
      const orderParam = searchParams.get('order');
      let orderSql = 'ORDER BY updated_at DESC';
      if (orderParam) {
        const [col, dir] = orderParam.split('.');
        orderSql = `ORDER BY "${col}" ${dir ? dir.toUpperCase() : 'ASC'}`;
      }
      const limitParam = searchParams.get('limit') || '1000';
      const offsetParam = searchParams.get('offset') || '0';

      const selectParam = searchParams.get('select') || '*';
      const selectSql = selectParam === '*' ? '*' : selectParam.split(',').map(c => `"${c.trim()}"`).join(', ');

      const sql = `SELECT ${selectSql} FROM leads ${whereSql} ${orderSql} LIMIT ${limitParam} OFFSET ${offsetParam};`;
      const data = await runSql(sql);

      return {
        ok: true,
        status: 200,
        json: async () => data,
        text: async () => JSON.stringify(data)
      };
    }

    if (method === 'POST') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      const rows = Array.isArray(body) ? body : [body];
      const inserted = [];

      for (const item of rows) {
        const keys = Object.keys(item).filter(k => item[k] !== undefined);
        const cols = keys.map(k => `"${k}"`).join(', ');
        const vals = keys.map(k => {
          const v = item[k];
          if (v === null) return 'NULL';
          if (typeof v === 'number') return v;
          if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
          return `'${String(v).replace(/'/g, "''")}'`;
        }).join(', ');

        const updateSet = keys.filter(k => k !== 'id').map(k => {
          const v = item[k];
          if (v === null) return `"${k}" = NULL`;
          if (typeof v === 'number') return `"${k}" = ${v}`;
          if (typeof v === 'boolean') return `"${k}" = ${v ? 'TRUE' : 'FALSE'}`;
          return `"${k}" = '${String(v).replace(/'/g, "''")}'`;
        }).join(', ');

        const sql = `
          INSERT INTO leads (${cols})
          VALUES (${vals})
          ON CONFLICT (id) DO UPDATE SET ${updateSet}
          RETURNING *;
        `;
        const res = await runSql(sql);
        if (res && res[0]) inserted.push(res[0]);
      }

      return {
        ok: true,
        status: 201,
        json: async () => (Array.isArray(body) ? inserted : inserted[0]),
        text: async () => JSON.stringify(Array.isArray(body) ? inserted : inserted[0])
      };
    }

    if (method === 'PATCH') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      let whereClauses = [];
      for (const [key, value] of searchParams.entries()) {
        if (value.startsWith('eq.')) {
          const val = value.substring(3);
          whereClauses.push(`"${key}" = '${val.replace(/'/g, "''")}'`);
        }
      }
      if (whereClauses.length === 0 && body.id) {
        whereClauses.push(`"id" = '${String(body.id).replace(/'/g, "''")}'`);
      }

      const keys = Object.keys(body).filter(k => k !== 'id' && body[k] !== undefined);
      const updateSet = keys.map(k => {
        const v = body[k];
        if (v === null) return `"${k}" = NULL`;
        if (typeof v === 'number') return `"${k}" = ${v}`;
        if (typeof v === 'boolean') return `"${k}" = ${v ? 'TRUE' : 'FALSE'}`;
        return `"${k}" = '${String(v).replace(/'/g, "''")}'`;
      }).join(', ');

      const sql = `
        UPDATE leads 
        SET ${updateSet} 
        WHERE ${whereClauses.join(' AND ')} 
        RETURNING *;
      `;
      const res = await runSql(sql);

      return {
        ok: true,
        status: 200,
        json: async () => res,
        text: async () => JSON.stringify(res)
      };
    }
  }

  // Fallback to standard fetch
  return fetch(url, options);
}
